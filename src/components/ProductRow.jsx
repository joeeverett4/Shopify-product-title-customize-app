import React, { Component } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Page, Tag } from "@shopify/polaris";
import Product from "../../server/models/Product";
import "../style.css";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { gql, useMutation } from "@apollo/client";

import { userLoggedInFetch } from "../App";

export class ProductRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryValue: "",
      isPickerOpen: false,
      products: [],
      newTitles: ["type"],
    };
 
  }

  render() {
    const onSelection = async ({ selection = [] }) => {
      /**
       * `selection` is always an array.
       * We have `selectMultiple: false`, so we know we can just grab
       * the item at index 0, since there is only 1 item.
       */
      const productDetails = {
        test: "hello",
      };
      const response = await this.fetch("/mongo", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetails)
      });



console.log(count)
     
      this.setState({
        products: selection,
      });
    };

    const setIsPickerOpen = () => {
    
      this.setState({
        isPickerOpen: true,
      });
    };

    const removeTag = (typeOfTag) => {
      let arr = this.state.newTitles;

      let newActiveTags = arr.filter((type) => type !== typeOfTag);

      this.setState({
        newTitles: newActiveTags,
      });
    };

    const addTag = (addTag) => {
      let currentTags = this.state.newTitles;

      currentTags.push(addTag);

      this.setState({
        newTitles: currentTags,
      });
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
      if (tag == "vendor") {
        return <Tag onRemove={() => removeTag("vendor")}>Product Vendor</Tag>;
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
          {this.state.newTitles.map((activetag) => renderActiveTag(activetag))}
        </div>

        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          selectMultiple={true}
          open={this.state.isPickerOpen}
          onSelection={onSelection}
          actionVerb="select"
        />
        {this.state.products.map((product, i) => (
          <div className="product-container" key={i}>
            <img src={product.images[0].originalSrc} />
            <p className="product-vendor">{product.vendor}</p>
            {this.state.newTitles &&
              this.state.newTitles.map((type) => (
                <>{chooseType(type, product)}</>
              ))}
            <p>£ {product.variants[0].price}</p>
          </div>
        ))}
      </Page>
    );
  }
}
