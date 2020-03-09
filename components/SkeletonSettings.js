import React from 'react'

import {
  SkeletonPage,
  SkeletonBodyText,
  Card,
  Layout
} from "@shopify/polaris";

class SkeletonSettings extends React.Component {

  render() {

    return (
      <SkeletonPage title="Products" primaryAction secondaryActions={2}>
        <Layout>
          <Layout.Section>
            <Card sectioned title="Show Timer">
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Set time interval">
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Timer Preview">
              <SkeletonBodyText />
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Background color">
              <SkeletonBodyText />
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Announcement text">
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Save your changes">
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    )
  }
}

export default SkeletonSettings