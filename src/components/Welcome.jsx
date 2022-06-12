import React from "react";
import {
  Layout,
  Card,
  Icon,
  Stack,
  Heading,
  TextContainer,
} from "@shopify/polaris";
import { CircleInformationMajor } from "@shopify/polaris-icons";
import "../style.css";

function Welcome() {
  return (
    <Layout>
      <Layout.Section>
        <Heading className="customer-welcome">
          Hello Joe, joe.everett34@gmail.coms
        </Heading>
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
