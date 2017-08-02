var Stadium = function(jsonObject) {
  this.team = jsonObject["Team"];
  this.name = jsonObject["Name"];
  this.capacity = parseInt(jsonObject["Capacity"]);
  this.coords = { lat: parseFloat(jsonObject["Latitude"]), lng: parseFloat(jsonObject["Longitude"]) };
}