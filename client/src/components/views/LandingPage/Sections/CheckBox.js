import { Checkbox, Collapse } from "antd";
import React from "react";
import { useState } from "react";

const { Panel } = Collapse;

function CheckBox(props) {

	// 체크된 id를 가지고 있는다.
	const [Checked, setChecked] = useState([]);

	const handleToggle = (id) => {
		// 누른 Index를 구한다.

		// 전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면

		// 빼줌

		// 없으면 State에 넣어준다.

		const currentIndex = Checked.indexOf(id);

		const newChecked = [...Checked];

		if(currentIndex === -1){
			newChecked.push(id)
		} 
		else{
			newChecked.splice(currentIndex, 1);
		}
		setChecked(newChecked);
		// 부모 콤포넌트로 전달해줌
		props.handleFilters(newChecked);
	}

	const renderCheckboxList = () => props.list && props.list.map((value, index) =>(
		<React.Fragment key={index}>
			<Checkbox onChange ={() => handleToggle(value._id)} checked = {Checked.indexOf(value._id) === -1 ? false : true}/>
				<span>{value.name}</span>
		</React.Fragment>
	))

  return (
    <div>
      <Collapse defaultActiveKey={["0"]} >
        <Panel header="Continents" key="1">
          {renderCheckboxList()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
