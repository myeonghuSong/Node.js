const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limit: { fileSize: 5 * 1024 * 1024},
});

router.post('/img', upload.single('img'), (req, res) => {
    console.log(req.body, req.file);
    res.json({ url: `/img/${req.file.filename}` });
});

router.post('/');
module.exports = router;