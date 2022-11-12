const { json } = require("express");
const uploadImage = require("../helper/imageUploadHelper");
const Record = require("../model/recordSchema");

const postRecord = async (req, res) => {
  const { address, location, description, category, subCategory } = req.body;

  const imgUrl = await uploadImage(req.file);

  try {
    const record = await Record.create({
      address,
      location,
      description,
      category,
      subCategory,
      date: new Date().toDateString(),
      time: new Date().toTimeString(),
      imgUrl,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { message: "Record uploaded successfully" },
    });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const getAllRecords = async (req, res) => {
  try {
    const allRecords = await Record.find({}).sort({ _id: -1 })
    res.status(200).json({ success: true, data: allRecords });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const getRecordOnScroll = async (req, res) => {
  const { pageNumber } = req.params;
  const batchSize = 25;
  const end = batchSize * Number(pageNumber);
  const start = end - batchSize;
  try {
    const allRecords = await Record.find({}).sort({ _id: -1 })
    res.status(200).json({ success: true, data: allRecords.slice(start, end) });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const getRecordByUser = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id }).sort({ _id: -1 })
    res.status(200).json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecord = await Record.findByIdAndDelete({ _id: id });
    if (deletedRecord) {
      res
        .status(201)
        .json({ success: true, message: "Record deleted successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No record found with given id" });
    }
  } catch {
    res.status(500).json({ success: false, err });
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  if (req.isAdmin) {
    try {
      const record = await Record.findByIdAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      });

      record ? res.status(201).json({ success: true, message: "Record updated successfully" }) :
        res.status(404).json({ success: false, message: "No record found with this id" });
    } catch (err) {
      res.status(500).json({ success: false, err });
    }
  } else {
    res.status(401).json({ success: false, message: "Authorized person is not admin" })
  }
};

const getRecentRecords = async (req, res) => {

  const { limit, userId } = req.query;
  const queryObject = {};
  const queryLimit = limit || 5;

  if (userId) {
    queryObject._id = userId;
  }

  try {
    const allRecords = await Record.find(queryObject).sort({ _id: -1 }).limit(queryLimit);
    res.status(200).json({ success: true, nHbits: allRecords.length, data: allRecords });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
}

module.exports = {
  postRecord,
  getAllRecords,
  getRecordOnScroll,
  getRecordByUser,
  deleteRecord,
  updateRecord,
  getRecentRecords
};
