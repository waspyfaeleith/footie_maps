var getStadiumToFind = function() {
  var dropdown = document.querySelector('#ddlClub');
  var index = dropdown.options[dropdown.selectedIndex].value;
  var stadiumToFind = stadiums[index];
  //console.log(stadiumToFind)
  return stadiumToFind;
};

var findClub = function() {
  console.log('Clicked');
  var stadiumToFind = getStadiumToFind();
  map.locateStadium(stadiumToFind);
};

var getDirections = function() {
  var stadiumToFind = getStadiumToFind();
  map.getDirectionsToStadium(stadiumToFind);
};

var readCSVFile = function() {
  var txtFile = new XMLHttpRequest();
  txtFile.open('GET', './stadiums.csv', true);
  allText = txtFile.responseText;
  console.log(allText);
  txtFile.onreadystatechange = function()
  {
      allText = txtFile.responseText;
      allTextLines = allText.split(/\r\n|\n/);
      console.log(allText);
  };
};

var populateDropDown = function(dropDownList) {
  for (var i = 0; i < stadiums.length; i++) {
    var el = document.createElement('option');
    //console.log(stadiums[i])
    el.textContent = stadiums[i].team;
    el.value = i;
    dropDownList.appendChild(el);
  }
};

var addStadiumMarkers = function(map) {
  stadiums.forEach(function(stadium) {
    map.addStadiumMarker(stadium);
  })
}

//taken from https://stackoverflow.com/questions/14446447/javascript-read-local-text-file
function readTextFile(file)
{
    var allText;
    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function()
    {
        if (rawFile.readyState === 4)
        {
            if (rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    //console.log(allText);
    return allText;
}

// taken from http://fahdshariff.blogspot.co.uk/2014/08/converting-csv-to-json-in-javascript.html
var toJson = function(csvData) {
  var lines = csvData.split('\n');
  var colNames = lines[0].split(',');
  var records = [];
  for (var i = 1; i < lines.length; i++) {
    var record = {};
    var bits = lines[i].split(',');
    for (var j = 0; j < bits.length; j++) {
      record[colNames[j]] = bits[j];
    }
    records.push(record);
  }
  return records;
};

var populateStadiums = function(jsonArray) {
  jsonArray.forEach(function(stadiumInfo) {
    var stadium = new Stadium(stadiumInfo);
    stadiums.push(stadium);
  });
};

var stadiums = [];
var map;

var initialize = function() {
  var mapDiv = document.querySelector('#main-map');
  var buttonFindClub = document.querySelector('#btnFindClub');
  var buttonGetDirections = document.querySelector('#btnGetDirections');
  var selectClub = document.querySelector('#ddlClub');

  var center = { lat: 56.152958, lng: -3.799375 };

  var mainMap = new MapWrapper(mapDiv, center, 15);
  map = mainMap;
  //mainMap.addMarker(center);
  mainMap.addClickEvent();

  buttonFindClub.addEventListener('click', findClub);
  buttonGetDirections.addEventListener('click', getDirections);
  
  var csv = readTextFile('stadiums.csv');
  var json = toJson(csv);
  //console.log(json);

  populateStadiums(json);
  populateDropDown(selectClub);
  addStadiumMarkers(mainMap);
};

window.addEventListener('load', initialize);
