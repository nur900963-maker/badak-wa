import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole, type AuthRequest } from "../lib/auth";
import { CreateUserBody, GetUserParams, DeleteUserParams, ExtendUserParams, ExtendUserBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_DURATIONS = [7, 15, 30, 60, 90, null];
const RESELLER_DURATIONS = [7, 15, 30];

function generatePassword(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function formatUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    username: u.username,
    role: u.role,
    expiredAt: u.expiredAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
    telegramId: u.telegramId ?? null,
    createdBy: u.createdBy ?? null,
  };
}

router.get("/users", requireAuth, requireRole("admin", "reseller"), async (req, res): Promise<void> => {
  const caller = (req as AuthRequest).user;
  let users;
  if (caller.role === "admin") {
    users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  } else {
    users = await db.select().from(usersTable).where(eq(usersTable.createdBy, caller.id)).orderBy(usersTable.createdAt);
  }
  res.json(users.map(formatUser));
});

router.post("/users", requireAuth, requireRole("admin", "reseller"), async (req, res): Promise<void> => {
  const caller = (req as AuthRequest).user;
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, role, durationDays } = parsed.data;

  if (caller.role === "reseller") {
    if (role !== "member") {
      res.status(403).json({ error: "Reseller can only create member accounts" });
      return;
    }
    if (durationDays === null || !RESELLER_DURATIONS.includes(durationDays)) {
      res.status(400).json({ error: "Reseller can only set duration: 7, 15, or 30 days" });
      return;
    }
  }

  if (caller.role === "admin") {
    if (!ADMIN_DURATIONS.includes(durationDays as number | null)) {
      res.status(400).json({ error: "Admin can only set duration: 7, 15, 30, 60, 90 days or lifetime" });
      return;
    }
  }

  const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.username, username));
  if (existing.length > 0) {
    res.status(400).json({ error: "Username already exists" });
    return;
  }

  const plainPassword = generatePassword();
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  let expiredAt: Date | null = null;
  if (durationDays !== null) {
    expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + durationDays);
  }

  const [created] = await db
    .insert(usersTable)
    .values({ username, passwordHash, role, expiredAt, createdBy: caller.id })
    .returning();

  res.status(201).json({ ...formatUser(created), password: plainPassword });
});

router.get("/users/:id", requireAuth, requireRole("admin", "reseller"), async (req, res): Promise<void> => {
  const params = GetUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(formatUser(user));
});

router.delete("/users/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const params = DeleteUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const caller = (req as AuthRequest).user;
  if (params.data.id === caller.id) {
    res.status(400).json({ error: "Cannot delete your own account" });
    return;
  }
  await db.delete(usersTable).where(eq(usersTable.id, params.data.id));
  res.sendStatus(204);
});

router.patch("/users/:id/extend", requireAuth, requireRole("admin", "reseller"), async (req, res): Promise<void> => {
  const params = ExtendUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = ExtendUserBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const base = user.expiredAt && user.expiredAt > new Date() ? user.expiredAt : new Date();
  const newExpiry = new Date(base);
  newExpiry.setDate(newExpiry.getDate() + body.data.durationDays);

  const [updated] = await db
    .update(usersTable)
    .set({ expiredAt: newExpiry })
    .where(eq(usersTable.id, params.data.id))
    .returning();

  res.json(formatUser(updated));
});

export default router;
