import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Card, Row, Icon } from "antd";
import Meta from "antd/lib/card/Meta";

function LandingPage() {
  const [Product, setProduct] = useState([]);

  useEffect(() => {
    // let body
    axios.post("/api/product/products").then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setProduct(response.data.productInfo);
      } else {
        alert("상품을 가져오는데 실패 했습니다.");
      }
    });
  }, []);

  const renderCards = Product.map((product, index) => {
    console.log(product)
    return (
    <Col lg={6} md={8} xs={24} key={index}>
      <Card cover={<img style={{width: '100%', maxHeight: '150px'}} src={`http://localhost:5000/${product.images[0]}`} />}
      >
        <Meta title={product.title} description={`$${product.price}`} />
      </Card>
     </Col>
    )
  });

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travle Anywere <Icon type="rocket" />
        </h2>
      </div>

{/* gutter는 여백을 주는데 [] */}
      <Row gutter={[16, 16]}>
        {renderCards}
        </Row>

      <div style={{ justifyContent: "center" }}>
        <button>더보기</button>
      </div>
    </div>
  );
}

export default LandingPage;