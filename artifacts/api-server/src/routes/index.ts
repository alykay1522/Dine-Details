import { Router, type IRouter } from "express";
import healthRouter from "./health";
import specialsRouter from "./specials";
import galleryRouter from "./gallery";

const router: IRouter = Router();

router.use(healthRouter);
router.use(specialsRouter);
router.use(galleryRouter);

export default router;
