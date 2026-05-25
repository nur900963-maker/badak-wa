import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import statsRouter from "./stats";
import waRouter from "./wa";
import newsRouter from "./news";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(statsRouter);
router.use(waRouter);
router.use(newsRouter);

export default router;
