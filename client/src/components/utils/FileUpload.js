import React, { useState } from "react";
import Dropzone from "react-dropzone";
import  { Icon } from 'antd';
import axios from 'axios';

const FileUpload = (props) => {


    const [Images, setImages] = useState([]);

    const dropHandler = (files) =>{

        let formData = new FormData;

        const config = {
            header :{'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0]);
        // file 전송시에는 formData와 양식을 함께 보내준다.
        // api, form, 형식
        axios.post('/api/product/image', formData, config)
        .then(response =>{
            if(response.data.success){
                setImages([...Images, response.data.filePath]);
                props.refreshFunction([...Images, response.data.filePath]);
            }else{
                alert('파일 저장 실패');
            }
        })
    }

    const deleteHandler = (image) =>{
      const currentIndex = Images.indexOf(image);

      // 이미지 복사
      let newImages = [...Images];
      // 새로운 State를 생성
      newImages.splice(currentIndex, 1);
      // set을 통해 새로운 State를 공금
      setImages(newImages);
      props.refreshFunction(newImages);

    }

  return (
    <div style={{ display: "flex", justifyContient: "space-between" }}>
      <Dropzone onDrop={(dropHandler)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              style={{
                width: "300px",
                height: "240px",
                border: "1px solid lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
             <Icon type ="plus" style={{fontSize: '3rem'}} />
            </div>
          </section>
        )}
      </Dropzone>

        <div style={{display:'flex', width: '350px', height:'240px', overflowX:'scroll'}}>
            {Images.map((image, idx)=>(
                <div onClick={()=> deleteHandler(image)} key={idx}>
                    <img style={{minWidth:'300px', width:'300px', height:'240px'}}
                    src ={`http://localhost:5000/${image}`}/>
                </div>
            ))}

        </div>
    </div>
  );
};

export default FileUpload;
