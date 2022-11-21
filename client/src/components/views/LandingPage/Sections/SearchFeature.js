import React from "react";
import { Input, Space } from "antd";
import { useState } from "react";
const { Search } = Input;

function SearchFeature(props) {
  const [SearchTerm, setSearchTerm] = useState("");

  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value);
    props.refreshFunction(event.currentTarget.value);
  };
  return (
    <div>
      <Search
        placeholder="input search text"
        onChange={searchHandler}
        style={{
          width: 200,
        }}
      />
    </div>
  );
}

export default SearchFeature;
