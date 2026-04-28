const express = require("express");
const { signupHandler, signinHandler, logoutHandler } = require("../controllers/user");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../upload");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/signin", (req, res) => {
  const success = req.query.registered === '1' ? "Account created! Please sign in." : null;
  res.render("signin", { success });
});

router.get("/signup", (req, res) => res.render("signup", {}));

router.get("/logout", logoutHandler);

router.post("/signin", signinHandler);

router.post("/signup", upload.single("profileImageURL"), signupHandler);

module.exports = router;
