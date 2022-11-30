import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";

function ProductImage(props) {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    if (props.detail.images && props.detail.images.length > 0) {
      let images = [];

      props.detail.images.map((item) => {
        images.push({
          // Dynamic하게 처리 해주는게 맞음
          original: `http://localhost:5000/${item}`,
          thumbnail: `http://localhost:5000/${item}`,
        });
      });
      // 항상 동적으로 변경된 내용은 usestate setter를 통해 바꿔준다.
      setImages(images);
      console.log(Images);
    } 

    /**
     * [] 비어 있을때는 렌더링 됐을때 라이프 사이클을 작동 시키는데, detail이 없음
     * [props.detail] 이라고 넣어주면, props의 detail의 값이 변경 되었을때 라이프 사이클을 한번더 작동 하게 되는것
     * 렌더링 -> 작동 -> effect -> 변경 -> 다시 작동
     */
  }, [props.detail]);

  return (
    <div>
      <ImageGallery items={Images} />
    </div>
  );
}
export default ProductImage
