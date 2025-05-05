
  var map, marker;

  function initMap1() {
      map = new mappls.Map('map', {
          center: [25.5045, 86.4701],
          zoomControl: true,
          location: true,
      });
      map.addListener('load', function() {
          marker = new mappls.Marker({
              map: map,
              position: {
                  "lat": 25.5045,
                  "lng": 86.4701
              },
              fitbounds: true,
              draggable: true,
              html: '<div><img class="dropdown" src="https://apis.mapmyindia.com/map_v3/1.png"></div>'
          });
      });
  }