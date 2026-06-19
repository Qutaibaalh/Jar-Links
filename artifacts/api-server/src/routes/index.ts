import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(statsRouter);

export default router;
