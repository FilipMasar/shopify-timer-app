import React from 'react'

class PreviewTimer extends React.Component {

	render() {

		let container_style = {
		  padding: '0px',
		  margin: '10px 0px',
			left: '0px',
			top: '0px',
	    width: '100%',
	    backgroundColor: "hsla(" + this.props.color.hue + "," + this.props.color.saturation*100 + "%," + this.props.color.brightness*100 + "%," + this.props.color.alpha + ")",
	    textAlign: 'center',
	  }

		const p_style = {
			boxSizing: 'border-box',
		  fontSize: '1.5em',
		  margin: '0px',
		  marginRight: '0px',
		  display: 'inline-block',
		  verticalAlign: 'middle',
  		color: 'white',
		}

		const inner_div_style = {
			display: 'inline-block',
			verticalAlign: 'middle',
  		color: 'white',
		}

		const li_style = {
			display: 'inline-block',
		  fontSize: '1em',
		  listStyleType: 'none',
		  padding: '0em 1em',
		  textTransform: 'uppercase',
		  margin: '0px',
		  marginBottom: '0px',
  		color: 'white',
		}

		const span_style = {
			position: 'relative',
	  	display: 'block',
		  fontSize: '3.5rem',
		  marginTop: '5px',
		  marginBottom: '5px',
		  padding: '0px',
  		color: 'white',
		}

		return (
	    <div style={container_style}>  
        <p style={p_style}>{this.props.text}</p>         
        <div style={inner_div_style}>
          <ul>      
            <li style={li_style}><span style={span_style}>0</span>days</li>      
            <li style={li_style}><span style={span_style}>12</span>Hours</li>      
            <li style={li_style}><span style={span_style}>34</span>Minutes</li>      
            <li style={li_style}><span style={span_style}>56</span>Seconds</li>    
          </ul>
        </div>
      </div>
	  )
	}
}

export default PreviewTimer