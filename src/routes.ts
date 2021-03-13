import { Router } from "express";
import * as categoryRepository from "./repositories/category-repository";
import * as datasetRepository from "./repositories/dataset-repository";
import * as visualizationRepository from "./repositories/visualization-repository";
import * as seederRepository from "./repositories/seeder-repository";
import * as organizationRepository from "./repositories/organization-repository";

const router = Router();

router.get("/categories", categoryRepository.getAll);

router.get("/datasets", datasetRepository.getAll);
router.get("/datasets/category-id/:categoryId", datasetRepository.getAllByCategoryId);
router.get("/datasets/organization-id/:organizationId", datasetRepository.getAllByOrganizationId);
router.get("/dataset/slug/:slug", datasetRepository.getBySlug);
router.put("/dataset/:id/increment-downloaded", datasetRepository.updateIncrementDownloaded);

router.get("/visualizations", visualizationRepository.getAll);
router.get("/visualization/slug/:slug", visualizationRepository.getBySlug);

router.get("/organizations/include-datasets-total", organizationRepository.getAllWithDatasetsTotal);
router.get("/organization/slug/:slug", organizationRepository.getBySlug);

router.post("/seeder", seederRepository.add);

export default router;
