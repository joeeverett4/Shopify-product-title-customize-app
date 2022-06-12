import React, { useState, useEffect } from "react";
import { Page, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import "../style.css";
import Sortlist from "./Sortlist";
import Productlist from "./Productlist";
import Modal from "./Modal";
import Welcome from "./Welcome"

export function Campaign() {
  const [productList, updateproductList] = useState([]);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [newTitles, setNewTitles] = useState(["type"]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("")

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
    console.log(val)
    setPickerOpen(val);
  };

  const passModalToChild = () => {
    
    setModalOpen(false)
  }

  const passMsgToChild = (msg) => {
   
    setCustomMsg(msg)
    console.log("this is custommsg from campaign  " + customMsg)
  }

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
    console.log("is picker open??  " + isPickerOpen)
    setModalOpen(true)
    addTag("message")
    return <Tag onRemove={() => removeTag("message")}>Custom message</Tag>;
  }

  function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => v.includes(value) && count++);
    return count;
  }

  const addTag = (addTag) => {
    let currentTags = [...newTitles];
    let val = getOccurrence(currentTags, addTag);
   console.log("dis is addtag")
    let result = addTag.concat(val);

    currentTags.push(result);

    setNewTitles(currentTags);
  };

  const renderActiveTag = (tag) => {
    
    if (tag.includes("vendor")) {
      return <Tag onRemove={() => removeTag(tag)}>Product Vendor</Tag>;
    }
    if (tag.includes("type")) {
      return <Tag onRemove={() => removeTag(tag)}>Product Type</Tag>;
    }
    if (tag.includes("tags")) {
      return <Tag onRemove={() => removeTag(tag)}>Product Tag</Tag>;
    }
    if (tag.includes("variant")) {
      return <Tag onRemove={() => removeTag(tag)}>Product Variant</Tag>;
    }
    if (tag.includes("message")) {
    
     return <Tag onRemove={() => removeTag(tag)}>Custom message</Tag>;
    }
  };

  return (
    
    <Page
      title="Collection with custom product titles"
      primaryAction={{
        content: "Choose products",
        onAction: () => setIsPickerOpen(true),
      }}
    >
      <Welcome />
      <div className="tags">
        <Tag onClick={() => addTag("vendor")}>Product Vendor</Tag>
        <Tag onClick={() => addTag("type")}>Product Type</Tag>
        <Tag onClick={() => addTag("tags")}>Product Tag</Tag>
        <Tag onClick={() => addTag("variant")}>Product Variant</Tag>
        <Tag onClick={() => setModalHack()}>Custom Message</Tag>
      </div>
      <Modal open = {isModalOpen} closeModal = {passModalToChild} setMsg = {passMsgToChild} />
     
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
        custommsg = {customMsg}
      />
    </Page>
  );
}
