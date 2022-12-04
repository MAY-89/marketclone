import React from "react";
import { useEffect } from "react";
import { useDispatch} from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';

function cartPage(props) {
  // 유저 카트 정보 가져오기
  useEffect(() => {
		const dispatch = useDispatch();
		let cartItems = [];

		// Redux 부분안에 Cart Field안에 cart가 있는지 확인 
		if(props.user.userData && props.user.userData.cart){ // 있을때
			if(props.user.userData.cart.length > 0){
				// 상품 가져오기
				props.user.userData.cart.forEach(item => {
					cartItems.push(item.id)
				});

				dispatch(getCartItems(cartItems, props.user.userData.cart));

			}

		}else{ // 없을때

		}


	}, []);

  return <div></div>;
}

export default cartPage;
