const path = require("path");
const fs = require("fs");
const multer = require("multer");

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MAX_VARIANT_IMAGES = 20;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: MAX_VARIANT_IMAGES,
  },
  fileFilter(_req, file, cb) {
    if (!file.mimetype?.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const variantImagesUpload = upload.array("images", MAX_VARIANT_IMAGES);

function handleUploadError(err, req, res, next) {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image file is too large (max 5MB)" });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: `Too many images uploaded (max ${MAX_VARIANT_IMAGES})`,
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Unexpected file field. Use `images` for variant images.",
        field: "images",
      });
    }

    return res.status(400).json({ message: err.message });
  }

  return res.status(400).json({
    message: err.message || "Image upload failed",
  });
}

function withVariantImagesUpload(req, res, next) {
  variantImagesUpload(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }
    return next();
  });
}

module.exports = {
  MAX_VARIANT_IMAGES,
  withVariantImagesUpload,
  handleUploadError,
};
