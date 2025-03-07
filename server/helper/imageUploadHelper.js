const express = require("express");
const app = express();
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const saltedMd5 = require("salted-md5");
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey");
require("dotenv").config();


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET_URL,
});

app.locals.bucket = admin.storage().bucket();

const uploadImage = async (file) => {
    const name = saltedMd5(file.originalname, "SUPER-S@LT!");
    const fileName = name + path.extname(file.originalname);
    const uploadFileResponse = await app.locals.bucket
        .file(fileName)
        .createWriteStream()
        .end(file.buffer);

    const uploadedFile = app.locals.bucket.file(
        uploadFileResponse._readable._writable.file
    );

    let signedUrls = await uploadedFile.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
    });
    let imgUrl = await signedUrls[0];
    return imgUrl;
};

module.exports = uploadImage;
