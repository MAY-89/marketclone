import React, { useState } from "react";
import { Typography, Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload";

const { TextArea } = Input;
const Constinents =[
	{key:1, value:"Africa"},
	{key:2, value:"Asia"},
	{key:3, value:"Europe"},
	{key:4, value:"Australia"},
	{key:5, value:"North America"},
	{key:6, value:"South America"},
	{key:7, value:"Antarctica"},
]

function UploadProductPage() {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState("");
  const [Continent, setContinent] = useState(1);
  const [Images, setImages] = useState([]);

  const titleChangeHandler = (e) => {
    setTitle(e.currentTarget.value);
  };
  const descriptionChangeHandler = (e) => {
    setDescription(e.currentTarget.value);
  };
  const priceChangeHandler = (e) => {
    setPrice(e.currentTarget.value);
  };
  const continenChangetHandler = (e) => {
    setContinent(e.currentTarget.value);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 level={2}>여행상품 업로드</h2>
      </div>
      <form>
        {/* DropZone */}
				<FileUpload/>
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={Description} />
        <br />
        <br />
        <label>가격</label>
        <Input type="number" onChange={priceChangeHandler} value={Price} />
        <br />
        <br />
        <select style={{maxWidth:"300px"}} onChange={continenChangetHandler} value={Continent}>
					{/* Map Method를 이용하여 배열을 순환 하도록 함 */}
          {Constinents.map(item =>(
						<option key={item.key} value={item.key}>{item.value}</option>
					))}
        </select>
        <br />
        <br />
        <button>확인</button>
      </form>
    </div>
  );
}
export default UploadProductPage;
