import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = () => {

  const [value, setValue] = useState("hello my name is aman bisht");

  useEffect(() => {
    const sfdt = JSON.parse(localStorage.getItem("sfdt"))
    let text;
    sfdt.sections[0].blocks.map((sfdtObj,index)=>{
       
    })
  }, []);

  const handleChange = (content, delta, source, editor) => {
    console.log(editor.getContents())
    setValue(content);
  };


  return <ReactQuill theme="snow" value={value} onChange={handleChange} style={{
    width:"500px",
    height:"600px"
  }} />;
};

export default QuillEditor;
