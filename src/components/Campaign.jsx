import React, { useState, useEffect } from "react";
import fetchIntercept from 'fetch-intercept';
import { Page, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { userLoggedInFetch } from "../App";
import "../style.css";
import Sortlist from "./Sortlist";
import Productlist from "./Productlist";
import Modal from "./Modal";
import SaveModal from "./SaveModal";
import Welcome from "./Welcome";
import Newsortlist from "./Newsortlist"
import Enabler from "./Enabler";
import { metafiledAPICalls } from "../helpers/index.js"

export function Campaign() {
  const [productList, updateproductList] = useState([]);
  const [currentproductList, updatecurrentproductList] = useState([]);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [newTitles, setNewTitles] = useState(["title"]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);


  useEffect(async () => {
    const resp = await fetch("/get-products").then((res) => res.json());
    const secondresp = await fetch("/api/store/themes/main").then((res) => res.json());
    // console.log(secondresp[0])
    // const thirdresp = await fetch("/scripttag");
    const products = resp.products;
  
    updateproductList(products);
  }, []);

  const setIsPickerOpen = (val) => {
   
    setPickerOpen(val);
  };

  const passModalToChild = () => {
    setModalOpen(false);
    setSaveModalOpen(false);
    console.log("passModal")
  };

  const passMsgToChild = (msg) => {
    setCustomMsg(msg);
    console.log("this is custommsg from campaign  " + customMsg);
  };

  function updateTitlesFromChild(newValue) {
    setNewTitles(newValue);
  }

  function updateProductsFromChild(newProducts) {
   
    updateproductList(newProducts);
  }

  function updatecurrentProductsFromChild(newProducts) {
    
    updatecurrentproductList(newProducts);
  }

  const removeTag = (typeOfTag) => {
    let arr = newTitles;
   
    let newActiveTags = arr.filter((type) => type.includes(typeOfTag) === false);
 
    setNewTitles(newActiveTags);
  };

  const setModalHack = () => {
    
    setModalOpen(true);
    addTag("message");
    return <Tag onRemove={() => removeTag("message")}>Custom message</Tag>;
  };

  function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => v.includes(value) && count++);
    return count;
  }

  const addTag = (addTag) => {
    let currentTags = [...newTitles];
    let val = getOccurrence(currentTags, addTag);
    
    let result = addTag.concat(val);

    currentTags.push(result);

    setNewTitles(currentTags);
  };
  const homeAPICalls = async () => {
    
    let val = document.querySelectorAll(".product-title");
    let i = 0;
    let obj = [];
    let newObj = {};

    setSaveModalOpen(true)
    
    for (const element of productList) {
        
      if (val.length != 0 && val[i] != undefined) {
        newObj = {
          newTitle: val[i].innerText,
          message: customMsg,
        };
      } else {
        newObj = {
          newTitle: "",
          message:"",
        };
      }
      console.log("this is val i inner text  " +  val[i].innerText)
      i++;
      const res = Object.assign(element, newObj);
      obj.push(res);
      
    }


    
    const res = await fetch("/deletemeta", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentproductList),
    });

    const response = await fetch("/createmeta", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productList),
    });

    console.log("homeAPIcalls finished")
  
  };
  
  const renderActiveTag = (tag) => {
    if (tag.includes("title")) {
      return (
        <div className="Tags-button">
          Product Title
          <span className = "svg--container" onClick={() => removeTag(tag)}>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
  <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>

          </span>
        </div>
      );
    }
    if (tag.includes("vendor")) {
      return (
        <div className="Tags-button">
          Product Vendor
          <span className = "svg--container" onClick={() => removeTag(tag)}>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
  <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
          </span>
        </div>
      );
    }
    if (tag.includes("type")) {
      return  <div className="Tags-button">
      Product Type
      <span className = "svg--container" onClick={() => removeTag(tag)}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
    if (tag.includes("tags")) {
      return  <div className="Tags-button">
      Product Tags
      <span className = "svg--container" onClick={() => removeTag(tag)}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
    if (tag.includes("variant")) {
      return  <div className="Tags-button">
      Product Variant
      <span className = "svg--container" onClick={() => removeTag(tag)}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
    if (tag.includes("message")) {
      return  <div className="Tags-button">
      Custom Message
      <span className = "svg--container" onClick={() => removeTag(tag)}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
  };

  return (
    <Page 
    title="Hello Joe joe.everett34@gmail.com"
    
    primaryAction = {
      {
      content: "Save",
      onAction: () => homeAPICalls()
      }
    }
    >
      <section style = {{padding:"20px 0px"}}>
      <Welcome />
      </section>
      <section style = {{padding:"20px 0px"}}>
      <Enabler />
      </section>
      <div className="tags">
      <button className="Tags-button" onClick={() => addTag("title")}>
          Product Title
        </button>
        <button className="Tags-button" onClick={() => addTag("vendor")}>
          Product Vendor
        </button>
        <button className="Tags-button" onClick={() => addTag("type")}>
          Product Type
        </button>
        <button className="Tags-button" onClick={() => addTag("tags")}>
          Product Tag
        </button>
        <button className="Tags-button" onClick={() => addTag("variant")}>
          Product Variant
        </button>
        <button className="Tags-button" onClick={() => setModalHack()}>
          Custom Message
        </button>
      </div>
      <Modal
        open={isModalOpen}
        closeModal={passModalToChild}
        setMsg={passMsgToChild}
      />
     <SaveModal
      open={isSaveModalOpen}
      closeModal={passModalToChild}
     /> 

      <Sortlist
        titles={newTitles}
        updateTitles={updateTitlesFromChild}
        renderActiveTag={renderActiveTag}
        removeTag={removeTag}
      />
      <Productlist
        products={productList}
        
        titles={newTitles}
        updateProducts={updateProductsFromChild}
        updatecurrentProducts = {updatecurrentProductsFromChild}
        setPicker={setIsPickerOpen}
        pickerStatus={isPickerOpen}
        custommsg={customMsg}
      />
     
    </Page>
  );
}
