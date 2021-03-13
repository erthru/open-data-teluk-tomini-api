import { Router } from "express";
import * as categoryRepository from "./repositories/category-repository";
import * as datasetRepository from "./repositories/dataset-repository";
import * as visualizationRepository from "./repositories/visualization-repository";
import * as seederRepository from "./repositories/seeder-repository";
import * as organizationRepository from "./repositories/organization-repository";
import * as infographicRepository from "./repositories/infographic-repository";
import * as authRepository from "./repositories/auth-repository";
import checkAuth from "./middlewares/check-auth";
import { AuthLevel } from "./schemas/auth";

const router = Router();

router.get("/categories", categoryRepository.getAll);

router.get("/datasets", datasetRepository.getAll);
router.get("/datasets/category-id/:categoryId", datasetRepository.getAllByCategoryId);
router.get("/datasets/organization-id/:organizationId", datasetRepository.getAllByOrganizationId);
router.get("/datasets/search/query", datasetRepository.search);
router.get("/dataset/slug/:slug", datasetRepository.getBySlug);
router.put("/dataset/:id/increment-downloaded", datasetRepository.updateIncrementDownloaded);

router.get("/visualizations", visualizationRepository.getAll);
router.get("/visualizations/search/query", visualizationRepository.search);
router.get("/visualization/slug/:slug", visualizationRepository.getBySlug);

router.get("/organizations/include-datasets-total", organizationRepository.getAllWithDatasetsTotal);
router.get("/organization/slug/:slug", organizationRepository.getBySlug);

router.get("/infographics", infographicRepository.getAll);
router.get("/infographics/search/query", infographicRepository.search);

router.get("/auth/refresh", checkAuth([AuthLevel.ADMIN, AuthLevel.ORGANIZATION, AuthLevel.WRITER]).verifyForRefresh, authRepository.refresh);
router.post("/auth/login", authRepository.login);

router.post("/seeder", seederRepository.add);

export default router;
