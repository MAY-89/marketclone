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
  // req.user ๋ auth์ ์๋ user ์?๋ณด๋ฅผ ๋ฐ๋ก ์ฌ์ฉํ?์ ์์
  User.findOne({ _id: req.user._id },
    // User Collection์ ํด๋น ์?์?์ ์?๋ณด๋ฅผ ๊ฐ์?ธ์ด
    (err, userInfo) => {
      // ๊ฐ์?ธ์จ ์?๋ณด์์ ์นดํธ์๋ค ๋ฃ์ผ๋?ค๊ณ? ํ๋ ์ํ์ด ์ด๋ฏธ ๋ค์ด ์๋์ง ํ์ธํ๋ค.
      let duplicate = false;
      userInfo.cart.forEach((item) => {
        if (item.id == req.body.productId) {
          duplicate = true;
        }
      });
        if (duplicate == true) {
          // ์ํ์ด ์์๋ ์นด์ดํธ ์ถ๊ฐ
          User.findOneAndUpdate(
            { _id: req.user._id, "cart.id": req.body.productId },
            { $inc: { "cart.$.quantity": 1 } }, //increment : ์ฆ๊ฐ
            { new: true }, // ์๋ฐ์ดํธ ํ์ ๊ฒฐ๊ณผ ๊ฐ์ ๋ฐ๊ธฐ ์ํด์ true, ๋ฐ๋๋ false
            (err, userInfo) => {
              if (err) return res.status(200).json({ success: false, err });
      
              return res.status(200).send(userInfo.cart);
            });
        } else {
          // ์ํ์ด ์์๋ ์๋ก์ด ์ถ๊ฐ
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
  // ์นดํธ ์์ ์ง์ฐ๊ณ?์ ํ๋ ์ํ์ ์ญ์?
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

    // product collection์์ ํ์ฌ ๋จ์ ์๋ ์ํ๋ค์ ์?๋ณด๋ฅผ ๊ฐ์?ธ์ค๊ธฐ
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
   * userCollection์์ history์์ ๊ฒฐ์? ์?๋ณด ๋ฃ์ด์ฃผ๊ธฐ
   * 
   * Payment Collection ์์ ์์ธํ ๊ฒฐ์? ์?๋ณด ๋ฃ์ด์ฃผ๊ธฐ
   * 
   * sold ์ํ์ด ํ๋ฆฐ ์ซ์ ๋งํผ ์ซ์ ์นด์ดํ ํด์ค๊ฒ(Product)
   */

  let history = []
  let transactionData = {};

  // 1. userCollection์์ history์์ ๊ฒฐ์? ์?๋ณด ๋ฃ์ด์ฃผ๊ธฐ

  req.body.cartDetail.forEach(item =>{
    history.push({
      dataOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentId
    })

    // 2 Payment Collection ์์ ์์ธํ ๊ฒฐ์? ์?๋ณด ๋ฃ์ด์ฃผ๊ธฐ
    transactionData.user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
    transactionData.data = req.body.paymentData
    transactionData.data = history

    // history ์?๋ณด ์?์ฅ
    User.findOneAndUpdate(
      {_id: req.user._id},
      { $push: { history: history},
        $set: { cart: []}    },
      { new : true},
      (err, user) => {

        if(err) return res.json({success: false, err})

        // payment์๋ค transaction ์?๋ณด ์?์ฅ
        const payment = new Payment(transactionData);
        payment.save((err, doc) => {
          if(err) return res.json({success: false, err})

          // 3. Production Collection์ Sold Count ํ๊ธฐ
          // async๋ฅผ ์ ์ฐ๋?
          // ํ์ฌ ์?ํ์ ๋ช๊ฐ?
          let products = [];
          doc.product.forEach(item =>{
            products.push({id: item.id, quantity: item.quantity})
          })
          /**
           * async
           * ๋ฐ๋ณต๋ฌธ์ ๋๋?ค์ id๋ฅผ ์ฐพ๊ณ? ๊ทธ ์์ด๋์ ๋ฐ๋ผ์ ํด์ผ ๋๋ ์กฐ๊ฑด๋ฌธ ๋ฐ ๋ฐ๋ณต๋ฌธ์ ์์ฑํ๋ค.
           * ์๋์ ๊ฐ์ด ํค ๊ฐ์ ์๋?ฅ ํ๋ฉด, ์ฝ๋๊ฐ ๋ณต์กํด ์ง์ง ์๊ณ? ๊ฐ์ํ ๋๊ณ? ํด๋ฆฐ์ฝ๋๋ฅผ ์์ฑํ?์ ์๋ค.
           */
          async.eachSeries(products, (item, callback) => {

            Product.update(
              {_id: item.id}, // ํค ๊ฐ
              { // ํ์
                $inc: {
                  "sold": item.quantity
                }
              },
              {new : false}, // ๋ค์ ๋ฆฌํด์ผ๋ก ๊ฐ์ ๋๋?ค ์ค๊ฑด์ง?
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
