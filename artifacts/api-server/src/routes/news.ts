import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { CreateNewsBody } from "@workspace/api-zod";

const router = Router();

router.get("/news", requireAuth, async (_req, res): Promise<void> => {
  const news = await db.select().from(newsTable).orderBy(newsTable.createdAt);
  res.json(
    news.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      createdAt: n.createdAt.toISOString(),
    })),
  );
});

router.post("/news", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const parsed = CreateNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db.insert(newsTable).values(parsed.data).returning();
  res.status(201).json({
    id: created.id,
    title: created.title,
    content: created.content,
    createdAt: created.createdAt.toISOString(),
  });
});

export default router;
