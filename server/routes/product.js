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

router.post("/products", (req, res) => {

  // DB에 있는 모든 Product 가져오기
  // populate 누가 등록 했는지 확인 하기
  Product.find()
  .populate("writer")
  .exec((err, productInfo) =>{
    if(err) return res.status(400).json({success : false, err})
    return res.status(200).json({success: true, productInfo});
  })

});

module.exports = router;
