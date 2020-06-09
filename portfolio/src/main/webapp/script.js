// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


var i = 0; 			// Start Point
var images = [];	// Images Array  
var time = 3000;	// Time Between Switch
	 
// Image List
images[0] = "images/skate2.jpg";
images[1] = "images/skateboard.jpg";

images[2] = "images/read.jpg";
images[3] = "images/read3.jpg";
images[4] = "images/read4.jpg";

images[5] = "images/photography1.jpg";
images[6] = "images/photography-1.jpg";
images[7] = "images/photography.jpg";
images[8] = "images/photo-3.jpg";
images[9] = "images/photo2.jpg";

images[10] = "images/art.jpg";
images[11] = "images/art4.jpg";
images[12] = "images/art5.jpg";


// Change Image
function changeImg(){
	document.slide.src = images[i];
	// Check If Index Is Under Max
	if(i < images.length - 1){
	  // Add 1 to Index
	  i++; 
	} else { 
		// Reset Back To O
		i = 0;
	}
	// Run function every x seconds
	setTimeout("changeImg()", time);
}

// Run function when page loads
window.onload=changeImg;


var countDownDate = new Date("May 5, 2022 16:00:00").getTime();
var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("grad").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("grad").innerHTML = "EXPIRED";
  }
}, 1000);

function getServerComments() {
  const maxComment = sessionStorage.getItem("max-comments") || 1;
  document.getElementById("max-comments").value = maxComment;
  document.getElementById('history').innerHTML = '';
  fetch('/data?max-comments=' + maxComment).then(response => response.json()).then((comments) => {
   
    // Build the list of saved comments.
    const commentsListElement = document.getElementById('history');  
        for (i = 0; i < comments.length; i++) {
            commentsListElement.appendChild(
                createListElement(comments[i]));
        }
  });
}

/** Creates an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

/* Reloads page after maximum number of comments is changed.*/
function reloadComments() {
  const maxComment = document.getElementById("max-comments").value;
  const newLocal = 'max-comments';
  sessionStorage.setItem(newLocal, maxComment);
  getServerComments();
}

/** Tells the server to delete the comment. */
function deleteComments() {
  if (window.confirm("Are sure you want to delete all comments?")){
    //Delete comments and update server with the deleted data.
    fetch('/data', {method: 'DELETE'}).then(getServerComments).catch(error => void console.error(error));
    }
}
