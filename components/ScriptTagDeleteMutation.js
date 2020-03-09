import React from 'react'
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { Button } from "@shopify/polaris";


const DELETE_TIMER = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`

class ScriptTagCreateMutation extends React.Component {
	render() {
		const scriptTagId = this.props.scriptTagId;
	  
	  return (
	    <Mutation mutation={DELETE_TIMER}>
	      {(scriptTagDelete, { data, loading, error }) => {
	        if (loading) return <div>Loading…</div>;
	        if (error) return <div>{error.message}</div>;
	        if (data) {
	        	console.log(data);
						// this.props.saveResult();
	        }
	        return (
	          <div>
	            <Button 
	              type="submit"
	              size="large"
	              onClick={e => {
	                e.preventDefault();
	                scriptTagDelete({ variables: { id: scriptTagId } });
	              }}
	            >
	              Save Delete
	            </Button>
	          </div>
	        )
	      }}
	    </Mutation>
	  )
	}
}

export default ScriptTagCreateMutation