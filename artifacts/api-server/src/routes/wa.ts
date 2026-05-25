import { Router } from "express";
import { db, waRequestsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth";
import { CreateWaRequestBody, GetWaRequestParams } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

const WA_DURATION_MS = 25 * 60 * 1000;

const STEPS: Array<{ status: "queued" | "connecting" | "sending" | "processing" | "done"; label: string; pct: number }> = [
  { status: "queued", label: "Request masuk ke antrian...", pct: 0 },
  { status: "connecting", label: "Menghubungkan ke server target...", pct: 25 },
  { status: "sending", label: "Mengirim payload ke target...", pct: 50 },
  { status: "processing", label: "Memproses respons server...", pct: 75 },
  { status: "done", label: "Selesai!", pct: 100 },
];

async function tickWaRequests(): Promise<void> {
  const active = await db
    .select()
    .from(waRequestsTable)
    .where(
      eq(waRequestsTable.status, "queued"),
    );

  const processing = await db
    .select()
    .from(waRequestsTable)
    .where(eq(waRequestsTable.status, "connecting"));

  const sending = await db
    .select()
    .from(waRequestsTable)
    .where(eq(waRequestsTable.status, "sending"));

  const proc = await db
    .select()
    .from(waRequestsTable)
    .where(eq(waRequestsTable.status, "processing"));

  const allActive = [...active, ...processing, ...sending, ...proc];

  for (const req of allActive) {
    const elapsedMs = Date.now() - req.createdAt.getTime();
    const ratio = Math.min(elapsedMs / WA_DURATION_MS, 1);
    const pct = Math.floor(ratio * 100);

    let step = STEPS[0];
    for (const s of STEPS) {
      if (pct >= s.pct) step = s;
    }

    const isDone = ratio >= 1;
    await db
      .update(waRequestsTable)
      .set({
        status: isDone ? "done" : step.status,
        progressPct: isDone ? 100 : pct,
        currentStep: isDone ? "Selesai!" : step.label,
        doneAt: isDone ? new Date() : null,
      })
      .where(eq(waRequestsTable.id, req.id));
  }
}

setInterval(() => {
  tickWaRequests().catch((err) => logger.error({ err }, "WA tick error"));
}, 60_000);

router.get("/wa/requests", requireAuth, async (req, res): Promise<void> => {
  const user = (req as AuthRequest).user;
  const requests = await db
    .select()
    .from(waRequestsTable)
    .where(eq(waRequestsTable.userId, user.id))
    .orderBy(waRequestsTable.createdAt);

  res.json(
    requests.map((r) => ({
      id: r.id,
      userId: r.userId,
      targetNumber: r.targetNumber,
      method: r.method,
      status: r.status,
      progressPct: r.progressPct,
      currentStep: r.currentStep ?? null,
      estimatedDoneAt: r.estimatedDoneAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      doneAt: r.doneAt?.toISOString() ?? null,
    })),
  );
});

router.post("/wa/requests", requireAuth, async (req, res): Promise<void> => {
  const user = (req as AuthRequest).user;
  const parsed = CreateWaRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const estimatedDoneAt = new Date(Date.now() + WA_DURATION_MS);

  const [created] = await db
    .insert(waRequestsTable)
    .values({
      userId: user.id,
      targetNumber: parsed.data.targetNumber,
      method: parsed.data.method,
      status: "queued",
      progressPct: 0,
      currentStep: "Request masuk ke antrian...",
      estimatedDoneAt,
    })
    .returning();

  res.status(201).json({
    id: created.id,
    userId: created.userId,
    targetNumber: created.targetNumber,
    method: created.method,
    status: created.status,
    progressPct: created.progressPct,
    currentStep: created.currentStep ?? null,
    estimatedDoneAt: created.estimatedDoneAt?.toISOString() ?? null,
    createdAt: created.createdAt.toISOString(),
    doneAt: null,
  });
});

router.get("/wa/requests/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as AuthRequest).user;
  const params = GetWaRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [request] = await db
    .select()
    .from(waRequestsTable)
    .where(and(eq(waRequestsTable.id, params.data.id), eq(waRequestsTable.userId, user.id)));

  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  res.json({
    id: request.id,
    userId: request.userId,
    targetNumber: request.targetNumber,
    method: request.method,
    status: request.status,
    progressPct: request.progressPct,
    currentStep: request.currentStep ?? null,
    estimatedDoneAt: request.estimatedDoneAt?.toISOString() ?? null,
    createdAt: request.createdAt.toISOString(),
    doneAt: request.doneAt?.toISOString() ?? null,
  });
});

export default router;
