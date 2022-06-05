import React, { useState, useEffect } from "react";
import { Page, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import "../style.css";

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

  const onSelection = async ({ selection = [] }) => {
    let val = document.querySelectorAll(".product-title");
    let i = 0;
    let obj = []
    let newObj = {}
    
    

    for (const element of selection) {
      if(val.length != 0 && val[i] != undefined){
        
       newObj = {
        newTitle: val[i].innerText,
      };
    }
    else{
       newObj = {
        newTitle: "",
      };
    }
      i++;
      const res = Object.assign(element, newObj);
      obj.push(res)
      
    }
   

    const sendValues = productList;

    updateproductList(selection);

    setPickerOpen(false);

    const res = await fetch("/deletemeta", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendValues),
    });

    const response = await fetch("/mongo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  };

  const setIsPickerOpen = () => {
    setPickerOpen(true);
  };

  const removeTag = (typeOfTag) => {
    let arr = newTitles;

    let newActiveTags = arr.filter((type) => type !== typeOfTag);

    setNewTitles(newActiveTags);
  };

  const addTag = async (addTag) => {
    let currentTags = [...newTitles];
    let val = await getOccurrence(currentTags,addTag)
    
    let result = addTag.concat(val)
    console.log(newTitles)
    currentTags.push(result);

    setNewTitles(currentTags);
  };

  function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v.includes(value) && count++));
    return count;
}

  const chooseType = (type, product) => {
    
    let val = getOccurrence(newTitles, type);

    

    if (type.includes("vendor")) {
     
      return <>{product.vendor + " "}</>;
    }
    if (type.includes("type")) {
      return <>{product.productType + " "}</>;
    }
    if (type.includes("variant")) {
      return <>{product.variants[0].title + " "}</>;
    }

    if (type.includes("tags")) {
      return product.tags.map((tag) => {
        if (tag.includes("app_") == true) {
          tag = tag.split("app_");
          return tag;
        }
      });
    }
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

  };

  return (
    <Page
      title="Build your Product title"
      primaryAction={{
        content: "Choose products",
        onAction: () => setIsPickerOpen(),
      }}
    >
      <div className="tags">
        <Tag onClick={() => addTag("vendor")}>Product Vendor</Tag>
        <Tag onClick={() => addTag("type")}>Product Type</Tag>
        <Tag onClick={() => addTag("tags")}>Product Tag</Tag>
        <Tag onClick={() => addTag("variant")}>Product Variant</Tag>
      </div>

      <div className="active-tags">
        {newTitles.map((activetag,i) => renderActiveTag(activetag))}
      </div>

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
    </Page>
  );
}
