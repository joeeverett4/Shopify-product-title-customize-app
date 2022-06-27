import React from "react";
import { useState } from "react";
import {useNavigate} from '@shopify/app-bridge-react';
import {
  Layout,
  Card,
  Stack,
  Heading,
  Subheading,
  TextContainer,
  Button,
} from "@shopify/polaris";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import "../style.css"
export default function Enabler() {

  const [isEnabled, setEnabled] = useState(true)

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const navigate = useNavigate();

 async function enableordisable() {
  if(isEnabled){ 
  const enable = {
    body: "true"
  }
   await fetch("/enablemeta", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enable),
  }); 
  setEnabled(false)
  }
  else{
    const disable = {
      body: "false"
    }
     await fetch("/enablemeta", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(disable),
    }); 
    setEnabled(true)
  }
 }

 async function tBilling(){
   console.log("t-billing")
  const resp = await fetch("/testbilling").then((res) => res.json())
  const body = resp.res
  navigate(body)
 }

  function renderButton() {
    if(isEnabled){
    return <Button primary onClick = {() => enableordisable()}>Enable</Button>;
    }
    if(!isEnabled){
      return <Button outline onClick = {() => enableordisable()}>Disable</Button>;
    }
  }
  return (
    <Layout>
      <Layout.Section>
        <Card  sectioned>
          
              <div style = {{display:"flex"}}>
               <div style = {{marginRight:"auto"}}> 
              <Heading>Master Switch</Heading>
              <p>This app is enabled</p>
              </div>
              {renderButton()}
              <Button outline onClick = {() => tBilling()}>Test</Button>;
              </div>
           
        </Card>
      </Layout.Section>
    </Layout>
  );
}
