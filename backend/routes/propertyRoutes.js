const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");
const propertyController = require("../controllers/propertyController");

console.log("🔥 PROPERTY ROUTES LOADED");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `properties/${unique}-${file.originalname}`);
    }
  })
});

// =============================
// GET ALL PROPERTIES
// =============================
router.get("/", propertyController.getAllProperties);

// =============================
// GET PROPERTY BY ID
// =============================
router.get("/:id", propertyController.getPropertyById);

// =============================
// CREATE PROPERTY
// =============================
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "availability_image", maxCount: 1 }
  ]),
  propertyController.createProperty
);

// =============================
// UPDATE PROPERTY
// =============================
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "availability_image", maxCount: 1 }
  ]),
  propertyController.updateProperty
);

// =============================
// DELETE PROPERTY
// =============================
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;
