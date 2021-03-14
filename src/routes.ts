import { Router } from "express";
import * as categoryRepository from "./repositories/category-repository";
import * as datasetRepository from "./repositories/dataset-repository";
import * as visualizationRepository from "./repositories/visualization-repository";
import * as seederRepository from "./repositories/seeder-repository";
import * as organizationRepository from "./repositories/organization-repository";
import * as infographicRepository from "./repositories/infographic-repository";
import * as authRepository from "./repositories/auth-repository";
import checkAuth from "./middlewares/check-auth";
import uploader, { UploadType } from "./middlewares/uploader";
import { OrganizationDocument } from "./schemas/organization";
import * as writerRepository from "./repositories/writer-repository";
import { CategoryDocument } from "./schemas/category";
import * as tagRepository from "./repositories/tag-repository";
import { DatasetDocument } from "./schemas/dataset";
import { VisualizationDocument } from "./schemas/visualization";
import { InfographicDocument } from "./schemas/infographic";

const router = Router();

router.get("/categories", categoryRepository.getAll);
router.post("/category", checkAuth.verify, uploader(UploadType.categoryIcon).single(CategoryDocument.icon), categoryRepository.add);
router.put("/category/:id", checkAuth.verify, uploader(UploadType.categoryIcon).single(CategoryDocument.icon), categoryRepository.update);
router.delete("/category/:id", checkAuth.verify, categoryRepository.remove);

router.get("/datasets", datasetRepository.getAll);
router.get("/datasets/category-id/:categoryId", datasetRepository.getAllByCategoryId);
router.get("/datasets/organization-id/:organizationId", datasetRepository.getAllByOrganizationId);
router.get("/datasets/search/query", datasetRepository.search);
router.get("/dataset/slug/:slug", datasetRepository.getBySlug);
router.post("/dataset", checkAuth.verify, uploader(UploadType.datasetAttachment).single(DatasetDocument.attachment), datasetRepository.add);
router.put("/dataset/:id", checkAuth.verify, uploader(UploadType.datasetAttachment).single(DatasetDocument.attachment), datasetRepository.update);
router.put("/dataset/:id/increment-downloaded", datasetRepository.updateIncrementDownloaded);
router.delete("/dataset/:id", checkAuth.verify, datasetRepository.remove);

router.get("/visualizations", visualizationRepository.getAll);
router.get("/visualizations/search/query", visualizationRepository.search);
router.get("/visualization/slug/:slug", visualizationRepository.getBySlug);
router.post(
    "/visualization",
    checkAuth.verify,
    uploader(UploadType.visualizationThumbnail).single(VisualizationDocument.thumbnail),
    visualizationRepository.add
);
router.put(
    "/visualization/:id",
    checkAuth.verify,
    uploader(UploadType.visualizationThumbnail).single(VisualizationDocument.thumbnail),
    visualizationRepository.update
);
router.delete("/visualization/:id", checkAuth.verify, visualizationRepository.remove);

router.get("/organizations", organizationRepository.getAll);
router.get("/organizations/include-datasets-total", organizationRepository.getAllWithDatasetsTotal);
router.get("/organization/slug/:slug", organizationRepository.getBySlug);
router.post("/organization", checkAuth.verify, uploader(UploadType.organizationPhoto).single(OrganizationDocument.photo), organizationRepository.add);
router.put(
    "/organization/:id",
    checkAuth.verify,
    uploader(UploadType.organizationPhoto).single(OrganizationDocument.photo),
    organizationRepository.update
);
router.delete("/organization/:id", checkAuth.verify, organizationRepository.remove);

router.get("/infographics", infographicRepository.getAll);
router.get("/infographics/search/query", infographicRepository.search);
router.post("/infographic", checkAuth.verify, uploader(UploadType.infographicBanner).single(InfographicDocument.banner), infographicRepository.add);
router.put(
    "/infographic/:id",
    checkAuth.verify,
    uploader(UploadType.infographicBanner).single(InfographicDocument.banner),
    infographicRepository.update
);
router.delete("/infographic/:id", checkAuth.verify, infographicRepository.remove);

router.get("/auth/refresh", checkAuth.verifyForRefresh, authRepository.refresh);
router.get("/auth/me", checkAuth.verify, authRepository.get);
router.post("/auth/login", authRepository.login);
router.put("/auth/me", checkAuth.verify, uploader(UploadType.organizationPhoto).single(OrganizationDocument.photo), authRepository.update);

router.get("/writers", checkAuth.verify, writerRepository.getAll);
router.post("/writer", checkAuth.verify, writerRepository.add);
router.put("/writer/:id", checkAuth.verify, writerRepository.update);
router.delete("/writer/:id", checkAuth.verify, writerRepository.remove);

router.post("/tag", checkAuth.verify, tagRepository.add);

router.post("/seeder", seederRepository.add);

export default router;
