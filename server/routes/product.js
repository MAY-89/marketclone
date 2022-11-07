const express = require('express');
const multer = require('multer');
const router = express.Router();
const {Product} = require('../models/Product')


//=================================
//             Product
//=================================

const storage = multer.diskStorage({
    // 파일 경로
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    // 파일 저장 시 이름
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })

  var upload = multer({storage: storage}).single("file");

router.post("/image", (req, res) => {

    upload(req, res, err =>{
        if(err){
            return req.json({success: false, err});
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.fileName})
    });
});

router.post("/", (req, res) => {

  // 넘어온 데이터 DB 저장
  const product = new Product(req.body);

  product.save((err) => {
    if(err) return res.status(400).json({success: false, err});

    return res.status(200).json({success : true});
  });
});

module.exports = router;
