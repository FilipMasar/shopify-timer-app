import { EmptyState, Layout, Page } from "@shopify/polaris";
import { ResourcePicker, TitleBar, Context } from "@shopify/app-bridge-react";
import { Redirect } from '@shopify/app-bridge/actions';

import store from "store-js";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";


class Index extends React.Component {

  static contextType = Context;

  render() {
    const app = this.context;
    const redirectToSettings = () => {
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.APP, '/settings');
    };

    return (
      <Page>

        <TitleBar
          primaryAction={{
            content: "Add timer",
            onAction: redirectToSettings
          }}
        />

        <Layout>
          <EmptyState
            heading="Add Timer to your web"
            action={{
              content: "Add TIMER",
              onAction: redirectToSettings
            }}
            image={img}
          >
            <p>Customize your timer.</p>
          </EmptyState>
        </Layout>
        
 
      </Page>
    );
  }
}

export default Index;
