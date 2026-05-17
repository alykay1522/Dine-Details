import { Router, type IRouter } from "express";
import healthRouter from "./health";
import specialsRouter from "./specials";
import galleryRouter from "./gallery";
import storageRouter from "./storage";
import settingsRouter from "./settings";
import menuRouter from "./menu";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(specialsRouter);
router.use(galleryRouter);
router.use(storageRouter);
router.use(settingsRouter);
router.use(menuRouter);
router.use(uploadRouter);

export default router;
