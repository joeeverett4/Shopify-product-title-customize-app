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
        <Card title = "Welcome to Create Product Title!" sectioned>
          <Stack spacing="loose" vertical={true}>
          <TextContainer>
        
        <p>
          Move the tags below to create your product title
        </p>
        </TextContainer>
        </Stack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card
          title={
            <Stack>
              <Icon source={CircleInformationMajor} />
              <Heading>How to use the app?</Heading>
            </Stack>
          }
          sectioned
        >
          <p>
            Variant Title King helps you to change product title based on the
            selected variant. It helps your customers to understand your
            variants better.
          </p>
          <p>
            All you need to do is create a template for the product title, just
            once!
          </p>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default Welcome;
