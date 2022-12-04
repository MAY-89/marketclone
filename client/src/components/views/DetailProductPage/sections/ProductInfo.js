import React from "react";
import { Button, Descriptions } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../_actions/user_actions";

function ProductInfo(props) {
  const dispatch = useDispatch();

  const clickHandler = () => {
    // 필요한 정보를 Cart 필드에 넣어주겠음
    /**
     * 1. 상품 ID
     * 2. 상품 갯수
     * 3. 장바구니 추가 일자
     */
    // 여기서는 axios에 바로 넣지 않겠음 리덕스 훅 이용
    dispatch(addToCart(props.detail._id));
    
  };
  return (
    <div>
      <Descriptions title="Product Info" bordered>
        <Descriptions.Item label="Price">
          {props.detail.price}
        </Descriptions.Item>
        <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
        <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {props.detail.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button size="large" shape="round" type="danger" onClick={clickHandler}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;