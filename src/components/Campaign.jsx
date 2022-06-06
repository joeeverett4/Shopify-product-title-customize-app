import React, { useState, useEffect } from "react";
import { Page, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import "../style.css";
import Sortlist from "./Sortlist";
import Productlist from "./Productlist";

export function Campaign() {
  const [productList, updateproductList] = useState([]);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [newTitles, setNewTitles] = useState(["type"]);

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  useEffect(async () => {
    const resp = await fetch("/get-products").then((res) => res.json());
    const products = resp.products;

    updateproductList(products);
  }, []);

  const setIsPickerOpen = (val) => {
    setPickerOpen(val);
  };

  function updateTitlesFromChild(newValue) {
    setNewTitles(newValue);
  }

  function updateProductsFromChild(newProducts) {
    console.log("this is updating products");
    updateproductList(newProducts);
  }

  const removeTag = (typeOfTag) => {
    let arr = newTitles;

    let newActiveTags = arr.filter((type) => type !== typeOfTag);

    setNewTitles(newActiveTags);
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

  const renderActiveTag = (tag) => {
    console.log("renderActive");
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
  };

  return (
    <Page
      title="Build your Product title"
      primaryAction={{
        content: "Choose products",
        onAction: () => setIsPickerOpen(true),
      }}
    >
      <div className="tags">
        <Tag onClick={() => addTag("vendor")}>Product Vendor</Tag>
        <Tag onClick={() => addTag("type")}>Product Type</Tag>
        <Tag onClick={() => addTag("tags")}>Product Tag</Tag>
        <Tag onClick={() => addTag("variant")}>Product Variant</Tag>
      </div>
      {/* 
      <div className="active-tags">
        {newTitles.map((activetag, i) => renderActiveTag(activetag))}
      </div>
  */}
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
      />
      {/*
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        selectMultiple={true}
        open={isPickerOpen}
        onSelection={onSelection}
        actionVerb="select"
      />
      {productList.map((product, i) => (
        <div className="product-container" key={i}>
          <img src={product?.images[0].originalSrc} />
          <p className="product-vendor">{product.vendor}</p>
          <p className="product-title">
            {newTitles &&
              newTitles.map((type) => <>{chooseType(type, product)}</>)}
          </p>
          <p>£ {product.variants[0].price}</p>
        </div>
      ))}
            */}
    </Page>
  );
}
