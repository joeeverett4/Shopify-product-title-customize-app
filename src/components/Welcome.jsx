import React from 'react';
import {Card,Icon,Stack,Heading} from '@shopify/polaris';
import {CircleInformationMajor} from '@shopify/polaris-icons';
import "../style.css";

function Welcome() {
  return (
    <Card 
    title={
        <Stack>
          <Icon source={CircleInformationMajor} />
          <Heading>How to use the app?</Heading>
        </Stack>
      } sectioned >
  <p>Variant Title King helps you to change product title based on the selected variant. It helps your customers to understand your variants better.</p>
  <p>All you need to do is create a template for the product title, just once!</p>
</Card>
  )
}

export default Welcome