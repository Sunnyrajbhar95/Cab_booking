import multer from "multer";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Uploads");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "_" + Math.round(Math.random() * 1e9);

    // Replace spaces in the original filename with underscores
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
    const fileName = uniquePrefix + "_" + sanitizedFileName;

    cb(null, fileName);
  },
});

// Export the configured multer instance
export const uploads = multer({
  storage: storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // Limit file size to 50 MB
});
