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

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});
google.charts.load('current', {'packages':['geochart'], 'mapsApiKey': 'AIzaSyCsXue58CAXOH-5VWiXjHjhBa-0lr5Mlk8'});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawPieChart);
google.charts.setOnLoadCallback(drawAfricaMap);


var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

window.onload=currentSlide(1);

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
  liElement.setAttribute('class','user-comment');
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

function createMap() {

  var mahal = {lat: 27.1751, lng: 78.0421};
  var wall =  {lat: 40.433082, lng: 116.564137};
  var eye = {lat: 51.503413, lng: -0.11953};

  const map1 = new google.maps.Map(
      document.getElementById('map1'),
      {center: mahal, zoom: 18, heading: 90, mapTypeId: 'satellite',
      tilt: 45,
       styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]});
  var options3 = {
        backgroundColor: "#006994",
    };

  var marker1 = new google.maps.Marker({position: mahal, map: map1, title: "Taj Mahal"});

  const map2 = new google.maps.Map(
      document.getElementById('map2'),
      {center: wall, zoom: 18, heading: 90, mapTypeId: 'satellite',
      tilt: 45, styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#847e72'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]});
  var options2 = {
        backgroundColor: "#006994",
    };
  var marker2 = new google.maps.Marker({position: wall, map: map2, title: "The Great Wall of China"});

  const map3 = new google.maps.Map(
      document.getElementById('map3'),
      {center: eye, zoom: 18, heading: 90, mapTypeId: 'satellite',
      tilt: 45,styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: "#006994"}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]});
  var options3 = {
        backgroundColor: "#006994",
    };
 var marker3 = new google.maps.Marker({position: eye, map: map3, title: "The London Eye"});
}

var map;
/* Editable marker that displays when a user clicks in the map. */
var editMarker;

/** Creates a map that allows users to add markers. */
function createUserMap() {
   map = new google.maps.Map(
      document.getElementById('map4'),
      {center: {lat: 38.5949, lng: -94.8923}, zoom: 4});


  // When the user clicks in the map, show a marker with a text box the user can
  // edit.
  map.addListener('click', (event) => {
    createMarkerForEdit(event.latLng.lat(), event.latLng.lng());
  });

  fetchMarkers();
}

/** Fetches markers from the backend and adds them to the map. */
function fetchMarkers() {
  fetch('/user-markers').then(response => response.json()).then((markers) => {
    markers.forEach(
        (marker) => {
            createMarkerForDisplay(marker.lat, marker.lng, marker.content)});
  });
}

/** Creates a marker that shows a read-only info window when clicked. */
function createMarkerForDisplay(lat, lng, content) {
  const marker =
      new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});
  
  const infoWindow = new google.maps.InfoWindow({content: content});
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

/** Sends a marker to the backend for saving. */
function postMarker(lat, lng, content) {
  const params = new URLSearchParams();
  params.append('lat', lat);
  params.append('lng', lng);
  params.append('content', content);

  fetch('/user-markers', {method: 'POST', body: params});
}

/** Creates a marker that shows a textbox the user can edit. */
function createMarkerForEdit(lat, lng) {
  // If we're already showing an editable marker, then remove it.
  if (editMarker) {
    editMarker.setMap(null);
  }

  editMarker =
      new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

  const infoWindow =
      new google.maps.InfoWindow({content: buildInfoWindowInput(lat, lng)});

  // When the user closes the editable info window, remove the marker.
  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    editMarker.setMap(null);
  });

  infoWindow.open(map, editMarker);
}

/**
 * Builds and returns HTML elements that show an editable textbox and a submit
 * button.
 */
function buildInfoWindowInput(lat, lng) {
  const textBox = document.createElement('textarea');
  const button = document.createElement('button');
  button.appendChild(document.createTextNode('Submit'));

  button.onclick = () => {
    postMarker(lat, lng, textBox.value);
    createMarkerForDisplay(lat, lng, textBox.value);
    editMarker.setMap(null);
  };

  const containerDiv = document.createElement('div');
  containerDiv.appendChild(textBox);
  containerDiv.appendChild(document.createElement('br'));
  containerDiv.appendChild(button);

  return containerDiv;
}


function userMaps() {
    createMap();
    createUserMap();
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawPieChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Living Status');
    data.addColumn('number', 'Percentages');
    data.addRows([
        ['Children with homes', 31.4],
        ['Children living on streets', 56.9],
        ['Children living both home and streets', 11.8],
    ]);

    // Set chart options
    var options = {'title':'Zimbabwe Children Living Status',
                    backgroundColor: 'transparent',
                    legendTextStyle: { color: 'rgb(214, 207, 207)', fontSize: 10},
                    titleTextStyle: { color: 'rgb(214, 207, 207)', fontSize: 20},
                    'width':600,
                    'height':550};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart-one'));
    chart.draw(data, options);
}

function drawAfricaMap() {
  
    var data = google.visualization.arrayToDataTable([
        ['Country',   'Unemployment Rate'],
        ['Algeria', 11.7], ['Angola', 31.8], ['Benin', 2.5], ['Botswana', 18.2],
        ['Burkina Faso', 6.15], ['Burundi', 1.54], ['Cameroon', 3.34],
        ['Canary Islands', 25.68], ['Cape Verde', 14.66],
        ['Central African Republic', 6.52], ['Chad', 2.32],
        ['Comoros', 3.7], ['Ivory Coast', 2.48], ['CD-KN', 2.48],
        ['Congo, DR', 10.40], ['Djibouti', 11.3],
        ['Egypt', 11.59], ['Equatorial Guinea', 9.2], ['Eritrea', 5.19],
        ['Ethiopia', 2.08], ['Gabon', 19.61], ['Gambia', 8.9], ['Ghana', 6.78],
        ['Guinea', 4.6], ['Guinea-Bissau', 2.44], ['Kenya', 9.31],
        ['Lesotho', 23.48], ['Liberia', 6], ['Libya', 17.3], ['Madagascar', 1.66],
        ['Malawi', 5.38], ['Mali', 9.44], ['Mauritania', 10.32],
        ['Mauritius', 7.3], ['Morocco', 9.03], ['Mozambique', 23.78], ['Namibia', 23.19],
        ['Niger', 0.26], ['Nigeria', 6.11],
        ['Rwanda', 17], ['São Tomé and Principe', 13.4], ['Senegal', 6.52],
        ['Seychelles', 2.68], ['Sierra Leone', 4.3], ['Somalia', 13.96],
        ['Sudan', 12.88], ['South Africa', 27.32], ['SS', 12.7],
        ['Swaziland', 22.48], ['Tanzania', 1.91], ['Togo', 2.7], ['Tunisia', 15.4],
        ['Uganda', 2.4], ['Western Sahara', 2.4], ['Zambia', 14.7],
        ['Zimbabwe', 4.9]
    ]);

    var options = {
        region: '002', // Africa
        backgroundColor: "#006994",
        colors: ['purple']
    };

    var chart = new google.visualization.GeoChart(document.getElementById('chart-two'));
        chart.draw(data, options);
}