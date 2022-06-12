import React, { useState, useEffect } from "react";
import { Page, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import "../style.css";
import Sortlist from "./Sortlist";
import Productlist from "./Productlist";
import Modal from "./Modal";
import Welcome from "./Welcome";

export function Campaign() {
  const [productList, updateproductList] = useState([]);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [newTitles, setNewTitles] = useState(["type"]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  useEffect(async () => {
    const resp = await fetch("/get-products").then((res) => res.json());
    // const secondresp = await fetch("/api/store/themes/main").then((res) => res.json());
    // console.log(secondresp[0])
    // const thirdresp = await fetch("/scripttag");
    const products = resp.products;

    updateproductList(products);
  }, []);

  const setIsPickerOpen = (val) => {
    console.log(val);
    setPickerOpen(val);
  };

  const passModalToChild = () => {
    setModalOpen(false);
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

  const removeTag = (typeOfTag) => {
    let arr = newTitles;

    let newActiveTags = arr.filter((type) => type !== typeOfTag);

    setNewTitles(newActiveTags);
  };

  const setModalHack = () => {
    console.log("is picker open??  " + isPickerOpen);
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
    console.log("dis is addhikhtag");
    let result = addTag.concat(val);

    currentTags.push(result);

    setNewTitles(currentTags);
  };

  const renderActiveTag = (tag) => {
    if (tag.includes("vendor")) {
      return (
        <div className="Tags-button">
          Product Vendor
          <span className = "svg--container" onClick={() => console.log("svg")}>
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
      <span className = "svg--container" onClick={() => console.log("svg")}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
    if (tag.includes("tags")) {
      return  <div className="Tags-button">
      Product Tags
      <span className = "svg--container" onClick={() => console.log("svg")}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
    if (tag.includes("variant")) {
      return  <div className="Tags-button">
      Product Variant
      <span className = "svg--container" onClick={() => console.log("svg")}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
    if (tag.includes("message")) {
      return  <div className="Tags-button">
      Custom Message
      <span className = "svg--container" onClick={() => console.log("svg")}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor"></path>
</svg>
      </span>
    </div>
    }
  };

  return (
    <Page title="">
      <Welcome />
      <div className="tags">
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
        setPicker={setIsPickerOpen}
        pickerStatus={isPickerOpen}
        custommsg={customMsg}
      />
    </Page>
  );
}
