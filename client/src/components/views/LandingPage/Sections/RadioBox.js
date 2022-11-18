import { Collapse, Radio } from "antd";
import React from "react";
import { useState } from "react";
const { Panel } = Collapse;
function RadioBox(props) {

	// id -> 0으로 Datas.js 의 0dmfh
	const [Value, setValue] = useState(0);

	const renderRadioboxList = () => (
		props.list && props.list.map(value =>(
			<Radio key={value._id} value={value._id} onChange = {(event) => handleChange(event)}>
				{value.name}
			</Radio>
	)));

	const handleChange = (event) => {
		setValue(event.target.value);
		console.log(Value);
		// props.handleFilters(Value);
		// Value가 한 타이밍 늦게 들어가기 때문에 event값으로 전달한다.
		props.handleFilters(event.target.value);
	}

  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Price" key="1">
          <Radio.Group>
						{renderRadioboxList()}
					</Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
