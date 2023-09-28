const express = require("express");
const router = express.Router();
const postDetails = require("../controller/postDetailsController");
router.get("/details/:id", postDetails.showPostDetails);
module.exports = router;
