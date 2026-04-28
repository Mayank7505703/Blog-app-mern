const express = require("express");
const authMiddleware = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const {
  homePageHandler,
  getBlogById,
  addBlogGetHandler,
  addBlogPostHandler
} = require("../controllers/blog");

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.get("/blog/:id", getBlogById);
// Public
router.get("/home", homePageHandler);

// Protected page
router.get("/addBlog", authMiddleware, addBlogGetHandler);

// Protected submit + file upload
router.post(
  "/addBlog",
  authMiddleware,
  upload.single("coveredImageURL"),
  addBlogPostHandler
);

module.exports = router;