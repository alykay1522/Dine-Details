import { Router, type IRouter } from "express";
import healthRouter from "./health";
import specialsRouter from "./specials";
import galleryRouter from "./gallery";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(specialsRouter);
router.use(galleryRouter);
router.use(storageRouter);

export default router;
