import React from "react";
import {
  Layout,
  Card,
  Icon,
  Stack,
  Heading,
  Subheading,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import { CircleInformationMajor } from "@shopify/polaris-icons";
import "../style.css";

function Welcome() {
  return (
    <Layout>
      <Layout.Section>
        <Card title="Welcome to Create Product Title! 🎉" sectioned>
          <Stack spacing="loose" vertical={true}>
            <TextContainer>
              <h2>Setup instructions</h2>
              <div className="d-flex">
                <h4>1. Add from the tags below to create your product title</h4>
                <div className="Tags-row">
                  <div className="Tags-button">Product Title</div>

                  <div className="Tags-button">Product Vendor</div>
                  <div className="Tags-button">Product Type</div>
                  <div className="Tags-button">Product Variant</div>
                  <div className="Tags-button">Custom Message</div>
                </div>
                <h4>
                  2. You can drag and drop to change the order of the different
                  elements
                </h4>
                <div className="Tags-row">
                  <div className="Tags-button">
                    Product Vendor
                    <span className="svg--container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        class="icon icon-close"
                        fill="none"
                        viewBox="0 0 18 17"
                      >
                        <path
                          d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span>&#8644;</span>

                  <div className="Tags-button">
                    Product Variant
                    <span className="svg--container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        class="icon icon-close"
                        fill="none"
                        viewBox="0 0 18 17"
                      >
                        <path
                          d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span>&#8644;</span>

                  <div className="Tags-button">
                    Custom Message
                    <span className="svg--container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        class="icon icon-close"
                        fill="none"
                        viewBox="0 0 18 17"
                      >
                        <path
                          d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </TextContainer>
          </Stack>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default Welcome;
