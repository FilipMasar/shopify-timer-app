import React from 'react'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Button } from "@shopify/polaris";


const ADD_TIMER = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
        src
      }
      userErrors {
        field
        message
      }
    }
  }
`

class ScriptTagCreateMutation extends React.Component {

	render() {
		return (
	    <Mutation mutation={ADD_TIMER}>
	      {(scriptTagCreate, { data, loading, error }) => {
	        if (loading) return <div>Loading…</div>;
	        if (error) return <div>{error.message}</div>;
	        if (data) {
	        	console.log(data)
	        	// this.props.saveResult(data.scriptTagCreate.scriptTag.id);
	        }
	        return (
	          <div>
	            <Button 
	              type="submit"
	              size="large" 
	              onClick={e => {
	                e.preventDefault();
	                scriptTagCreate({ variables: { input: { "src": "https://d9d299f1.ngrok.io/timer2.js"} } });
	              }}
	            >
	              Save Create
	            </Button>
	          </div>
	        )
	      }}
	    </Mutation>
	  )
	}
}

export default ScriptTagCreateMutation