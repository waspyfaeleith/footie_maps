var MapWrapper = function(container, coords, zoom) {
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  });
  this.geoLocate();
  this.currentCoords = {};
  this.directionsDisplay = new google.maps.DirectionsRenderer();
};

MapWrapper.prototype = {

  addInfoWindow: function(coords, text) {
      var marker = this.addMarker(coords);
      marker.addListener('click', function() {
        var infoWindow = new google.maps.InfoWindow({
          content: text
        });
        infoWindow.open(this.map, marker);
      });
  },

  getCurrentCoords: function() {
    var coords;
    navigator.geolocation.getCurrentPosition(function(position) {
      coords = {lat: position.coords.latitude, lng: position.coords.longitude};
    });
  },

  geoLocate: function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      var center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.googleMap.setCenter(center);
      this.googleMap.setZoom(15);
      this.currentCoords = center;
      this.addMarker(center);
    }.bind(this));
    // var coords = this.getCurrentCoords();
    // this.googleMap.setCenter(coords);
    // this.addMarker(coords);
  },

  addMarker: function(coords) {
    var marker = new google.maps.Marker({
      position: coords,
      map: this.googleMap
    });
  },

  addStadiumMarker: function(stadium) {
    var marker = new google.maps.Marker({
      position: stadium.coords,
      map: this.googleMap,
      icon: 'images/football.png'
    });
    return marker;
  },

  addStadiumInfoWindow: function(stadium) {
    var info = stadium.team +
                '\n' + stadium.name + '\nCapacity: ' + stadium.capacity;
    var marker = this.addStadiumMarker(stadium.coords);
    marker.addListener('click', function() {
      console.log('showing info');
      var infoWindow = new google.maps.InfoWindow({
        content: info
      });
      infoWindow.open(this.map, marker);
    });
  },

  locateStadium: function(stadium) {
    this.googleMap.setCenter(stadium.coords);
    this.googleMap.setZoom(15);
    this.addStadiumMarker(stadium);
    this.addStadiumInfoWindow(stadium);
  },

  addClickEvent: function() {
    this.googleMap.addListener('click', function(event) {
      var position = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      //this.addMarker(position);
    }.bind(this));
  },

  getDirectionsToStadium: function(stadium) {
    var dirMap;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
        zoom: 16,
        center: stadium.coords
    };
    this.directionsDisplay.setMap(this.googleMap);
    var orig = this.currentCoords.lat + ',' + this.currentCoords.lng;
    //var dest = position.lat() + ',' + position.lng();
    var dest = stadium.coords.lat + ',' + stadium.coords.lng;
    var request = {
      origin: orig,
      destination: dest,
      travelMode: google.maps.TravelMode.DRIVING
      //travelMode: google.maps.TravelMode.TRANSIT
    };
    var directionsService = new google.maps.DirectionsService();

    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(result);
      }
    }.bind(this));
  }
};
