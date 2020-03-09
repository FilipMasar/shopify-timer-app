import {
  Button,
  ColorPicker,
  Frame,
  Layout,
  Page,
  SettingToggle,
  TextField,
  TextStyle,
  Toast,
  SkeletonPage
} from "@shopify/polaris";

import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import axios from 'axios'

import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import '../node_modules/react-datetime-picker/dist/DateTimePicker.css';
import '../node_modules/react-calendar/dist/Calendar.css';
import '../node_modules/react-clock/dist/Clock.css';

import PreviewTimer from '../components/PreviewTimer'
import SkeletonSettings from '../components/SkeletonSettings'


const GET_TAGS = gql`
  query {
    scriptTags(first: 10) {
      edges {
        node {
          id
          src
        }
      }
    }
  }
`
function ScriptTagsQuery() {
  return (
    <Query query={GET_TAGS}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading…</div>;
        if (error) return <div>{error.message}</div>;
        console.log(data);
        return null
      }}
    </Query>
  )
}

function ToastExample() {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="Message sent" onDismiss={toggleActive} />
  ) : null;

  return (
    <div>
      <Frame>
          <Toast content="Message sent" onDismiss={toggleActive} />
      </Frame>
    </div>
  );
}

class AnnotatedLayout extends React.Component {
  constructor() {
    super()
    this.state = {
      enabled: false,
      text: "Sales on all t-shirts end in: ",
      color: {
        hue: 0,
        brightness: 0,
        saturation: 0,
        alpha: 1
      },
      startDate: new Date().getTime(),
      endDate: new Date().getTime(),
      saving: false,
      showToast: false,
      loadingData: true,
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.onStartChange = this.onStartChange.bind(this)
    this.onEndChange = this.onEndChange.bind(this)
    this.toggleToast = this.toggleToast.bind(this)
  }

  componentDidMount() {
    // get settings from DB
    this.getDataFromDB()
      .then(res => {
        this.setState(res)
        this.setState({
          loadingData: false
        })
      })
      .catch(err => console.log(err));
  }

  getDataFromDB = async () => {
    const response = await fetch('/api/userdata');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  }

  handleTextChange(value, id) {
    this.setState({ 
      text: value
    })
  }

  handleColorChange(color) {
    this.setState({ 
      color: color
    })
  }

  handleToggle() {
    const value = !this.state.enabled 
    this.setState({
      enabled: value
    })
  }

  toggleToast() {
    const value = !this.state.showToast 
    this.setState({
      showToast: value
    })
  }

  onStartChange(value) {
    if(value == null) {
      this.setState({
        startDate: 0
      })
    } else {
      this.setState({
        startDate: value.getTime()
      })
    }
  }

  onEndChange(value) {
    if(value == null) {
      this.setState({
        endDate: 0
      })
    } else {
      this.setState({
        endDate: value.getTime()
      })
    }
  }

  postData = () => {
    this.setState({
      saving: true
    })
    axios.post('/api/postdata', {data: this.state})
      .then(response => {
        this.setState({
          saving: false,
          showToast: true
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          saving: false
        })
      })
  }


  render() {
    const contentStatus = this.state.enabled ? "Disable" : "Enable";
    const textStatus = this.state.enabled ? "enabled" : "disabled";

    return (
      <Frame>
      {this.state.loadingData ? (
        <SkeletonSettings />
      ) : (
        <Page
          title="Settings"
          primaryAction={{
            content: 'Save', 
            onAction: this.postData,
            loading: this.state.saving
          }}
        >
          <Layout>
            {/* ENABLE / DISABLE */}
            <Layout.AnnotatedSection
              title="Show Timer"
              description="Show/Hide top sticky timer on your webpages"
            >
              <SettingToggle
                action={{
                  content: contentStatus,
                  onAction: this.handleToggle,
                  returnValue: "range"
                }}
                enabled={this.state.enabled}
              >
                Timer is{" "}
                <TextStyle variation="strong">{textStatus}</TextStyle>.
              </SettingToggle>
            </Layout.AnnotatedSection>

            {/* TIME PICKER */}
            <Layout.AnnotatedSection
              title="Set time interval"
              description="set time when timer should be counting"
            >
              <div style={{marginTop: "20px"}}>
                <div style={{display: "inline-block", marginRight: "20px"}}>
                  <p>Start at:</p>
                  <DateTimePicker
                    onChange={this.onStartChange}
                    value={new Date(this.state.startDate)}
                  />
                </div>
                <div style={{display: "inline-block"}}>
                  <p>Expire at:</p>
                  <DateTimePicker
                    onChange={this.onEndChange}
                    value={new Date(this.state.endDate)}
                  />
                </div>
              </div>
            </Layout.AnnotatedSection>
            
            {/* PREVIEW */}       
            <Layout.AnnotatedSection
              title="Timer Preview"
              description="Showing color and text of your timer"
            >
            </Layout.AnnotatedSection>

            <PreviewTimer text={this.state.text} color={this.state.color} />
            
            {/* COLOR PICKER */}       
            <Layout.AnnotatedSection
              title="Background color"
              description="Add a product to Sample App, it will automatically be discounted."
            >
              <ColorPicker onChange={this.handleColorChange} color={this.state.color} allowAlpha />
            </Layout.AnnotatedSection>

            {/* TEXT */}
            <Layout.AnnotatedSection
              title="Announcement text"
              description="Announcement next to the timer"
            >
              <TextField label="Announcement" value={this.state.text} id="idecko" onChange={this.handleTextChange} />
            </Layout.AnnotatedSection>
            
            {/* SAVE Button */}
            <Layout.AnnotatedSection
              title="Save your changes."
              description="Don't forget to save your changes"
              al
            > 
              <Button type="submit" size="large" onClick={this.postData} loading={this.state.saving}>Save</Button>
            </Layout.AnnotatedSection>

          </Layout>

          { this.state.showToast && <Toast content="Timer updated" onDismiss={this.toggleToast} /> }
        </Page>
      )}
      </Frame>
    );
  }
}

export default AnnotatedLayout;
