const express = require("express");
const recordRouter = express.Router();
const {
  postRecord,
  getAllRecords,
  getRecordByUser,
  deleteRecord,
  updateRecord,
  getRecordOnScroll,
} = require("../controllers/record");
const { authenticateToken } = require("../middlewares/recordMiddleware");
const Multer = require("multer");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

recordRouter
  .route("/uploadRecord")
  .post([authenticateToken, multer.single("imgfile")], postRecord);

recordRouter.route("/").get(getAllRecords);
recordRouter.route("/page/:pageNumber").get(getRecordOnScroll);

recordRouter.route("/user").get(authenticateToken, getRecordByUser);

recordRouter.route("/:id").delete(authenticateToken, deleteRecord);

recordRouter
  .route("/update/:id")
  .patch([authenticateToken, multer.single("imgfile")], updateRecord);

module.exports = recordRouter;
