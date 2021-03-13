import { Router } from "express";
import * as categoryRepository from "./repositories/category-repository";
import * as datasetRepository from "./repositories/dataset-repository";
import * as visualizationRepository from "./repositories/visualization-repository";
import * as seederRepository from "./repositories/seeder-repository";

const router = Router();

router.get("/categories", categoryRepository.getAll);

router.get("/datasets", datasetRepository.getAll);
router.get("/datasets/category-id/:categoryId", datasetRepository.getAllByCategoryId);

router.get("/visualizations", visualizationRepository.getAll);

router.post("/seeder", seederRepository.add);

export default router;
