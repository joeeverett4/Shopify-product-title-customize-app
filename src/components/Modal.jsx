import React, { useState, useCallback } from "react";
import {
  Button,
  ButtonGroup,
  TextField,
  TextContainer,
  Heading,
} from "@shopify/polaris";
import "../style.css";

export default function Modal({ open, closeModal, setMsg }) {
  const [value, setValue] = useState("");

  const handleChange = useCallback((newValue) => setValue(newValue), []);
  const handleClick = () => {
    console.log("handleClick");
    closeModal();
  };

  const sendMsg = () => {
    console.log(value);
    setMsg(value);
    closeModal();
  };

  return (
    <div
      id="myModal"
      class="modal"
      style={open ? { display: "block" } : { display: "none" }}
    >
      <div class="modal-content">
        <span class="close" onClick={() => handleClick()}>
          &times;
        </span>
        <TextContainer>
          <Heading>Write your custom message</Heading>
          å
          <TextField
          label=""
          value={value}
          onChange={handleChange}
          autoComplete="off"
        />
        <Button primary onClick={() => sendMsg()}>Save</Button>
        </TextContainer>
        
      </div>
    </div>
  );
}
