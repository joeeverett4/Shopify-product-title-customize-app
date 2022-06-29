import React, { useState } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import {Button} from '@shopify/polaris';
import { userLoggedInFetch } from "../App";
import "../style.css";

export default function Productlist({ products, titles, updateProducts, updatecurrentProducts, setPicker, pickerStatus, custommsg }) {

  const [isPickerOpen, setPickerOpen] = useState(false);
  
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);




  const onSelection = async ({ selection = [] }) => {
   
    /* let val = document.querySelectorAll(".product-title");
    let i = 0;
    let obj = [];
    let newObj = {};

    
    
    for (const element of selection) {
        
      if (val.length != 0 && val[i] != undefined) {
        newObj = {
          newTitle: val[i].innerText,
          message: custommsg,
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
  */
   

    const sendValues = products;

    updatecurrentProducts(sendValues)
    updateProducts(selection);

    setPickerOpen(false);
    
    /*
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
    */
    
  };


  const chooseType = (type, product) => {
 
    if (type.includes("title")) {
      return <>{product.title + " "}</>;
    }

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
    if (type.includes("message")) {
        return <>{custommsg + " "}</>;
      }
  };

  return (
    <>
    <div className = "btn-container">
      <Button onClick  = {() => setPickerOpen(true)} primary>Choose Products</Button>
      </div>
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        selectMultiple={true}
        open={isPickerOpen}
        onSelection={onSelection}
        actionVerb="select"
      />
      {products.map((product, i) => (
        <div className="product-container" key={i}>
          <img src={product?.images[0].originalSrc} />
          <p className="product-vendor">{product.vendor}</p>
          <p className="product-title">
            {titles && titles.map((type) => <>{chooseType(type, product)}</>)}
          </p>
          <p>£ {product.variants[0].price}</p>
        </div>
      ))}
      
    </>
  );
}
