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
        const allRecords = await Record.find({});
        res.status(200).json({ success: true, data: allRecords });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }
};

const getRecordByUser = async (req, res) => {

    try {
        const records = await Record.find({ userId: req.user._id });
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

    let imgUrl;

    if (req.file) {
        imgUrl = await uploadImage(req.file);
        req.body.imgUrl = imgUrl;
    }

    try {

        const record = await Record.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        });

        if (record) {
            res
                .status(201)
                .json({ success: true, message: "Record updated successfully" });
        } else {
            res
                .status(404)
                .json({ success: false, message: "No record found with this id" });
        }
    } catch (err) {
        res.status(500).json({ success: false, err });
    }
};

module.exports = {
    postRecord,
    getAllRecords,
    getRecordByUser,
    deleteRecord,
    updateRecord,
};
