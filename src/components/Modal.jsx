import React, {useState} from "react";
import { Button, ButtonGroup } from "@shopify/polaris"
import "../style.css";

export default function Modal({open, closeModal, setMsg}) {
    
const [formmsg, setformmsg] = useState("")
 const handleClick = () =>{
     console.log("handleClick")
    closeModal()
 }
 const handleChange = (e) => {
     setformmsg(e.target.value)
     console.log("this is form msg "  + formmsg)
 }

 const sendMsg = () =>{
     setMsg(formmsg)
 }

  return (
     <div className = "modal" style={ { display: open == true ? 'block' : 'none' } }> 
     <p>Enter your custom message</p>
    <div class="wrapper" >
      <div class="search">
        <input type="textarea" onChange = {handleChange} placeholder="..." />
      </div>
    </div>
       <ButtonGroup>
        <Button onClick={handleClick}>Close</Button>
        <Button primary onClick={sendMsg}>Save</Button>
       </ButtonGroup>
    </div>
  );
}
