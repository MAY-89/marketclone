import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";
import UserCardBlock from "./sections/UserCardBlock";
function CartPage(props) {
  // 유저 카트 정보 가져오기
  const dispatch = useDispatch();

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
        dispatch(getCartItems(cartItems, props.user.userData.cart));
      }
    }
  }, [props.user.userData]);

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>

      <div>
        {/* <UserCardBlock products= {props.user.cartDetail.product && props.user.cartDetail.product}></UserCardBlock> */}
        <UserCardBlock product={props.user.cartDetail}></UserCardBlock>

      </div>
    </div>
  );
}

export default CartPage;
