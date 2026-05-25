import { Router } from "express";
import { db, usersTable, waRequestsTable, sessionsTable } from "@workspace/db";
import { eq, count, gt } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/stats", requireAuth, async (_req, res): Promise<void> => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const [memberCount] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.role, "member"));

  const [resellerCount] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.role, "reseller"));

  const [onlineCount] = await db
    .select({ count: count() })
    .from(sessionsTable)
    .where(gt(sessionsTable.lastSeenAt, fiveMinutesAgo));

  const [activeReqCount] = await db
    .select({ count: count() })
    .from(waRequestsTable)
    .where(eq(waRequestsTable.status, "queued"));

  res.json({
    onlineUsers: Number(onlineCount?.count ?? 0),
    totalMembers: Number(memberCount?.count ?? 0),
    totalResellers: Number(resellerCount?.count ?? 0),
    activeRequests: Number(activeReqCount?.count ?? 0),
  });
});

export default router;
