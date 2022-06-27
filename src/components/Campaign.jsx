import React, { useState, useEffect } from "react";
import { Page, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";

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
    /**
     * `selection` is always an array.
     * We have `selectMultiple: false`, so we know we can just grab
     * the item at index 0, since there is only 1 item.
     *
     */
    
   // console.log("this is selection  " + JSON.stringify(selection));

   let val = document.querySelectorAll(".product-title")
   let i = 0;

   console.log(val)

  /*
    for (const element of selection) {
     const newObj = {
       newTitle : val[i].innerText
     }
     i++
     const res = Object.assign(element,newObj)
     console.log(res)
  }

  */

    

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
      body: JSON.stringify(selection),
    });
 
    

  };

  const setIsPickerOpen = () => {
    setPickerOpen(true);
  };

  const onCancel = () => {
    setPickerOpen(false);
    console.log("onCancel")
  }

  const removeTag = (typeOfTag) => {
    let arr = newTitles;

    let newActiveTags = arr.filter((type) => type !== typeOfTag);

    setNewTitles(newActiveTags);
  };

  const addTag = (addTag) => {
    let currentTags = [...newTitles];
    
    currentTags.push(addTag);

    setNewTitles(currentTags);
  };

  const chooseType = (type, product) => {
    if (type == "vendor") {
      return <>{product.vendor}</>;
    }
    if (type == "type") {
      return <>{product.productType}</>;
    }
    if (type == "tags") {
      return product.tags.map((tag) => {
        if (tag.includes("app_") == true) {
          tag = tag.split("app_");
          return tag;
        }
      });
    }
  };

  const renderActiveTag = (tag) => {
    console.log("renderaC");
    if (tag == "vendor") {
      return <Tag onRemove={() => removeTag("vendor")}>Product Vendo</Tag>;
    }
    if (tag == "type") {
      return <Tag onRemove={() => removeTag("type")}>Product Type</Tag>;
    }
    if (tag == "tags") {
      return <Tag onRemove={() => removeTag("tags")}>Product Tag</Tag>;
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
      </div>

      <div className="active-tags">
        {newTitles.map((activetag) => renderActiveTag(activetag))}
      </div>

      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        selectMultiple={true}
        open={isPickerOpen}
        onSelection={onSelection}
        onCancel={onCancel}
        actionVerb="select"
      />
      {productList.map((product, i) => (
        <div className="product-container" key={i}>
          <img src={product?.images[0].originalSrc} />
          <p className="product-vendor">{product.vendor}</p>
          <p className = "product-title">{newTitles &&
            newTitles.map((type) => <>{chooseType(type, product)}</>)}</p>
          <p>£ {product.variants[0].price}</p>
        </div>
      ))}
    </Page>
  );
}
