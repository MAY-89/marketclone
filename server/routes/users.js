const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");

const async = require('async');


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
      });
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

router.get("/removeFromCart", auth, (req, res) => {
  // 카트 안의 지우고자 하는 상품을 삭제
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      "$pull": { cart: {"id": req.query.id }}
    },
    {new : true},
    (err, userInfo) => {
      console.log("*******************");
      console.log("cart : "+ userInfo.cart);
      console.log("userInfo : "+ userInfo)
      let cart = userInfo.cart;
      let array = cart.map(item => {
        return item.id;
      });

    // product collection에서 현재 남아 있는 상품들의 정보를 가져오기
      Product.find(
        { _id: {$in: array}}
      ).populate("writer")
      .exec((err, productInfo) => {
        console.log("productInfo : " + productInfo);
        return res.status(200).json({
          productInfo, cart
        })
      })
    }
  );
});

router.post("/successBuy", auth, (req, res) => {
  
  /**
   * userCollection안에 history안에 결제 정보 넣어주기
   * 
   * Payment Collection 안에 자세한 결제 정보 넣어주기
   * 
   * sold 상품이 팔린 숫자 만큼 숫자 카운팅 해줄것(Product)
   */

  let history = []
  let transactionData = {};

  // 1. userCollection안에 history안에 결제 정보 넣어주기

  req.body.cartDetail.forEach(item =>{
    history.push({
      dataOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentId
    })

    // 2 Payment Collection 안에 자세한 결제 정보 넣어주기
    transactionData.user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
    transactionData.data = req.body.paymentData
    transactionData.data = history

    // history 정보 저장
    User.findOneAndUpdate(
      {_id: req.user._id},
      { $push: { history: history},
        $set: { cart: []}    },
      { new : true},
      (err, user) => {

        if(err) return res.json({success: false, err})

        // payment에다 transaction 정보 저장
        const payment = new Payment(transactionData);
        payment.save((err, doc) => {
          if(err) return res.json({success: false, err})

          // 3. Production Collection에 Sold Count 하기
          // async를 왜 쓰냐?
          // 현재 제품의 몇개?
          let products = [];
          doc.product.forEach(item =>{
            products.push({id: item.id, quantity: item.quantity})
          })
          /**
           * async
           * 반복문을 돌려서 id를 찾고 그 아이디에 따라서 해야 되는 조건문 및 반복문을 작성한다.
           * 아래와 같이 키 값을 입력 하면, 코드가 복잡해 지지 않고 간소화 되고 클린코드를 작성할수 있다.
           */
          async.eachSeries(products, (item, callback) => {

            Product.update(
              {_id: item.id}, // 키 값
              { // 행위
                $inc: {
                  "sold": item.quantity
                }
              },
              {new : false}, // 다시 리턴으로 값을 돌려 줄건지?
              callback
            )

          }, (err) => {
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({
              success : true,
              cart : user.cart,
              cartDetail: []
            })
          }
          )
        });
      }
    )
  });
});

module.exports = router;
