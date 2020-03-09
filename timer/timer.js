
const startTime = {{startDate}}
const endTime = {{endDate}}
let divAppended = false


$(document).ready(function() {
	// add link to timer's css
	var timerCSS = '<link rel="stylesheet" type="text/css" href="{{HOST}}/timer.css">';
	$('head').prepend(timerCSS);

	// add div with timer
	var timerDiv = '<div class="container-advertlytic-timer middle-advertlytic-timer" id="unique-advertlytic-timer" style="background-color: hsla( {{color.hue}}, {{color.saturation}}%, {{color.brightness}}%, {{color.alpha}} )">				<p id="text-advertlytic-timer">{{ text }}</p>	 							<div style="display: inline-block;">				<ul>	    					<li><span id="days-advertlytic-timer"></span>days</li>	    					<li><span id="hours-advertlytic-timer"></span>Hours</li>	    					<li><span id="minutes-advertlytic-timer"></span>Minutes</li>	    					<li><span id="seconds-advertlytic-timer"></span>Seconds</li>	  				</ul>			</div>		</div>'
	let now = new Date().getTime();

	let distance2end = endTime - now;
  let distance2start = startTime - now;

  if(distance2start <= 0 && distance2end >= 0) {
  	$('body').prepend(timerDiv);
    divAppended = true
  }
});


const second = 1000,
    	minute = second * 60,
    	hour = minute * 60,
   		day = hour * 24;

let x = setInterval(function() {
  let now = new Date().getTime();
  
  let distance2end = endTime - now;
  let distance2start = startTime - now;

  if(divAppended) {

    if(distance2start > 0 || distance2end < 0) {
    	document.getElementById("container-advertlytic-timer").style.display = "none";
    } else {
  	  document.getElementById("days-advertlytic-timer").innerText = Math.floor(distance2end / (day));
  	  document.getElementById("hours-advertlytic-timer").innerText = Math.floor((distance2end % (day)) / (hour));
  	  document.getElementById("minutes-advertlytic-timer").innerText = Math.floor((distance2end % (hour)) / (minute));
  	  document.getElementById("seconds-advertlytic-timer").innerText = Math.floor((distance2end % (minute)) / second);
  	}
  }
}, second)
