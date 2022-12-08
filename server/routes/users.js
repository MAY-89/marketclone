const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { Product } = require("../models/Product");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.post("/addToCart", auth, (req, res) => {
  // req.user 는 auth에 있는 user 정보를 바로 사용할수 있음
  
  User.findOne({ _id: req.user._id },
    // User Collection에 해당 유저의 정보를 가져옴
    (err, userInfo) => {
      // 가져온 정보에서 카트에다 넣으려고 하는 상품이 이미 들어 있는지 확인한다.
      let duplicate = false;
      userInfo.cart.forEach((item) => {
        if (item.id == req.body.productId) {
          duplicate = true;
        }
        if (duplicate == true) {
          // 상품이 있을때 카운트 추가
          User.findOneAndUpdate(
            { _id: req.user._id, "cart.id": req.body.productId },
            { $inc: { "cart.$.quantity": 1 } }, //increment : 증가
            { new: true }, // 업데이트 후에 결과 값을 받기 위해서 true, 반대는 false
            (err, userInfo) => {
              if (err) return res.status(200).json({ success: false, err });
      
              return res.status(200).send(userInfo.cart);
            });
        } else {
          // 상품이 없을때 새로이 추가
          User.findOneAndUpdate(
            { _id: req.user._id },
            {
              $push: {
                cart: {
                  id: req.body.productId,
                  quantity: 1,
                  data: Date.now(),
                },
              },
            },
            { new: true },
            (err, userInfo) => {
              if (err) return res.status(200).json({ success: false, err });
              return res.status(200).send(userInfo.cart);
            });
        }
      });
    });
});
router.get("/removeFromCart", auth, (req, res) => {
  // 카트 안의 지우고자 하는 상품을 삭제
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { cart: req.query.id },
    },
    {new : true},
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map(item => {
        return item.id;
      })
    }
  );

  // product collection에서 현재 남아 있는 상품들의 정보를 가져오기
  Product.find(
    {id: {$in: array}}
  ).populate("writer")
  .exec((err, productInfo) => {
    return res.status(200).json({
      productInfo, cart
    })
  })
});

module.exports = router;
