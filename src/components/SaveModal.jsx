import React from 'react'
import { TextContainer, Heading } from '@shopify/polaris'

export default function SaveModal({ open, closeModal }) {

    const handleClick = () => {
        console.log("handleClick");
        closeModal();
        console.log(open)
      };
  return (
    <div
    id="saveModal"
    class="modal"
    style={open ? { display: "block" } : { display: "none" }}
  >
    <div class="modal-content">
      <span class="close" onClick={() => handleClick()}>
        &times;
      </span>
      <TextContainer>
        <Heading>Successfully saved</Heading>
        
<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 511.999 511.999" xmlSpace="preserve" style = {{width:"70px"}}>
<path style={{fill:"#B7E183"}} d="M502.87,75.474c-12.201-12.204-31.952-12.205-44.154-0.001L163.89,370.299L53.284,259.693  c-12.201-12.204-31.952-12.205-44.154-0.001c-12.173,12.174-12.173,31.981,0,44.153L141.814,436.53  c12.199,12.198,31.953,12.2,44.153,0L502.87,119.626C515.042,107.453,515.042,87.645,502.87,75.474z"/>
<path style={{fill:"#71DE56"}} d="M502.87,75.474c-12.201-12.204-31.952-12.205-44.154-0.001L243.511,290.678v88.306L502.87,119.626  C515.042,107.453,515.042,87.645,502.87,75.474z"/>
</svg>
      </TextContainer>
      
    </div>
  </div>
  )
}

