import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./sections/UserCardBlock";
function CartPage(props) {
  // 유저 카트 정보 가져오기
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0);

  useEffect(() => {
    let cartItems = [];

    // Redux 부분안에 Cart Field안에 cart가 있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      // 있을때
      if (props.user.userData.cart.length > 0) {
        // 상품 가져오기
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });
        dispatch(getCartItems(cartItems, props.user.userData.cart))
        .then(response => {calculateTotal(response.payload)});
      }
    }
  }, [props.user.userData]);

  let calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.map(item => {
      total += parseInt(item.price,10) * item.quantity;
    });
    setTotal(total);
  }

  let removeFromCart = (productId) => {

    dispatch(removeCartItem(productId))
    .then(response => {

    })

  }

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>

      <div>
        {/* <UserCardBlock products= {props.user.cartDetail.product && props.user.cartDetail.product}></UserCardBlock> */}
        <UserCardBlock products={props.user.cartDetail} removeItem= {removeFromCart}></UserCardBlock>

      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Total Amount: ${Total}</h2>
      </div>
    </div>
  );
}

export default CartPage;
