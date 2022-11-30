import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductImage from "./sections/ProductImage";
import ProductInfo from "./sections/ProductInfo";
import { Row, Col } from "antd";

function DetailProductPage(props) {
  const productId = props.match.params.productId;

  const [Product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setProduct(response.data.product[0]);
        } else {
        }
      });
  }, []);

  return (
    <div style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>{Product.title}</h1>
      </div>
      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          {/* ProductImage */}

          <ProductImage detail={Product} />
        </Col>

        <Col lg={12} sm={24}>
          {/* Product Info */}
          <ProductInfo></ProductInfo>
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
