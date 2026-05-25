import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, setAuthCookie, clearAuthCookie, requireAuth, type AuthRequest } from "../lib/auth";
import { LoginBody } from "@workspace/api-zod";

const router = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (!user) {
    res.status(401).json({ error: "USER_NOT_FOUND" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "WRONG_PASSWORD" });
    return;
  }

  if (user.expiredAt && user.expiredAt < new Date()) {
    res.status(401).json({ error: "EXPIRED" });
    return;
  }

  const token = signToken(user.id);
  setAuthCookie(res, token);

  await db.insert(sessionsTable).values({ userId: user.id, token }).onConflictDoNothing();

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      expiredAt: user.expiredAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      telegramId: user.telegramId ?? null,
      createdBy: user.createdBy ?? null,
    },
  });
});

router.post("/auth/logout", requireAuth, async (req, res): Promise<void> => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const user = (req as AuthRequest).user;
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    expiredAt: user.expiredAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    telegramId: user.telegramId ?? null,
    createdBy: user.createdBy ?? null,
  });
});

export default router;
