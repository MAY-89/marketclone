import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Card, Row, Icon, Carousel } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continents, price } from "./Sections/Datas";
import RadioBox from "./Sections/RadioBox";
function LandingPage() {
  const [Product, setProduct] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(4);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });

  useEffect(() => {
    // let body

    let body = {
      skip: Skip,
      limit: Limit,
    };
    getProduct(body);
  }, []);

  const getProduct = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore == true) {
          setProduct([...Product, ...response.data.productInfo]);
        } else {
          setProduct(response.data.productInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품을 가져오는데 실패 했습니다.");
      }
    });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit;
    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };
    getProduct(body);
    setSkip(skip);
  };

  const renderCards = Product.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    // getProduct를 이용해서 가져온 Product에 필터를 전달한다.
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };

    getProduct(body);
    setSkip(0);
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    showFilteredResults(newFilters);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travle Anywere <Icon type="rocket" />
        </h2>
      </div>

      <div>
        {/* Filter */}
        <Row gutter={[16, 16]}>
          <Col lg={12}  xs={24}>
            {/* CheckBox */}
            <CheckBox
              list={continents}
              handleFilters={(filters) => handleFilters(filters, "continents")}
            ></CheckBox>
          </Col>
          <Col lg={12} xs={24}>
            {/* RadioBox */}
            <RadioBox list = {price} handleFilters={(filters) => handleFilters(filters, "price")}>

            </RadioBox>
          </Col>
        </Row>
      </div>

      {/* gutter는 여백을 주는데 [] */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <br />
      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
