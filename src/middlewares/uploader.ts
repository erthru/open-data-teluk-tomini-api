import multer, { diskStorage } from "multer";

export enum UploadType {
    organizationPhoto = "organizationPhoto",
    categoryIcon = "categoryIcon",
    datasetAttachment = "datasetAttachment",
    visualizationThumbnail = "visualizationThumbnail",
    infographicBanner = "infographicBanner",
}

export default (uploadType: UploadType) => {
    const fileStorage = diskStorage({
        destination: (_, __, cb) => cb(null, "public/uploads/"),
        filename: (_, file, cb) => {
            const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);

            if (uploadType === UploadType.organizationPhoto) cb(null, `organization-photo-${unique + ext}`);
            if (uploadType === UploadType.categoryIcon) cb(null, `category-icon-${unique + ext}`);
            if (uploadType === UploadType.datasetAttachment) cb(null, `dataset-attachment-${unique + ext}`);
            if (uploadType === UploadType.visualizationThumbnail) cb(null, `visualization-thumbnail-${unique + ext}`);
            if (uploadType === UploadType.infographicBanner) cb(null, `infographic-banner-${unique + ext}`);
        },
    });

    return multer({
        storage: fileStorage,

        fileFilter: (_, file, cb) => {
            if (
                (uploadType === UploadType.organizationPhoto ||
                    uploadType === UploadType.categoryIcon ||
                    uploadType === UploadType.visualizationThumbnail ||
                    uploadType === UploadType.infographicBanner) &&
                (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png")
            )
                cb(null, true);
            else if (uploadType === UploadType.datasetAttachment) cb(null, true);
            else cb(new Error("invalid file type"));
        },
    });
};
