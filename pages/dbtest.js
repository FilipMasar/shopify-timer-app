import React, { Component } from 'react';
import axios from 'axios'

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Mutation, Query, graphql } from 'react-apollo';
import {Provider, Loading} from '@shopify/app-bridge-react';


import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import '../node_modules/react-datetime-picker/dist/DateTimePicker.css';
import '../node_modules/react-calendar/dist/Calendar.css';
import '../node_modules/react-clock/dist/Clock.css';


import {
  Banner,
  Button,
  ColorPicker,
  ChoiceList,
  Layout,
  Page,
  SettingToggle,
  TextField,
  TextStyle
} from "@shopify/polaris";


class Dbtest extends Component {
  constructor() {
    super()
    this.state = {
      date: new Date(),
    }

    this.onTimeChange = this.onTimeChange.bind(this)
  }

  onTimeChange = (value, id) => {
    console.log(value)
    console.log(id)
    this.setState({
      date: value
    })
  }


  async componentDidMount() {
    // get shopID
    // await fetch("/api/shopOrigin")
    //   .then(response => response.json())
    //   .then(json => {
    //     const id = json["data"].replace('.myshopify.com', '');
    //     this.setState({shopID: id})
    //   })

    // // get settings from DB
    // this.getDataFromDB()
    //   .then(res => {
    //     this.setState({ settings: res })
    //     console.log("after:")
    //     console.log(this.state)
    //   })
    //   .catch(err => console.log(err));
  }

  // _________ universal method for calling API _________
  //
  // getCollections = () => {
  //   var fetchUrl = "/api/shopOrigin";
  //   var method = "GET";
  //   fetch(fetchUrl, { method: method })
  //   .then(response => response.json())
  //   .then(json => {
  //     const id = json["data"].replace('.myshopify.com', '');
  //     this.setState({shopID: id})
  //   })
  // }

  getDataFromDB = async () => {
    console.log("before DB: ")
    console.log(this.state)
    const response = await fetch('/api/userdata/' + this.state.shopID);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  postData = (e) => {
    axios.post('/api/postdata', {data: this.state.settings, shopID: e})
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }


  render() {
    const GET_ID = gql`
      query {
        shop{
          myshopifyDomain
        }
      }
    `

    return (
      <div>
        <DateTimePicker
          onChange={this.onTimeChange}
          value={this.state.date}
          id="mnau"
        />
      </div>
    );
  }
}

export default Dbtest;