import React, { useState, useEffect } from "react";
import { Page, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";

export function Newcampaign() {
    const [productList, updateproductList] = useState([]);
    const [isPickerOpen, setPickerOpen] = useState(false);
    const [newTitles, setNewTitles] = useState(["type"]);
  
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    useEffect(async () => {
        const resp = await fetch("/get-products").then((res) => res.json());
        const products = resp.products;
        updateproductList(products);
        console.log("this is products" + JSON.stringify(products))
      }, []);

    const setIsPickerOpen = () => {
        setPickerOpen(true);
      };

      const removeTag = (typeOfTag) => {
        let arr = newTitles;
    
        let newActiveTags = arr.filter((type) => type !== typeOfTag);
    
        setNewTitles(newActiveTags);
      };
    
      const addTag = (addTag) => {
        let currentTags = [...newTitles];
        console.log(newTitles);
        currentTags.push(addTag);
    
        setNewTitles(currentTags);
      };

  const chooseType = (type, product) => {
    if (type == "vendor") {
      return <span>{product.vendor}</span>;
    }
    if (type == "type") {
      return <span>{product.productType}</span>;
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
    
    actionVerb="select"
  />
   {productList.map((product, i) => (
       {product}
      ))}
  
  </Page>
  )
}
