// Bouldering location info
var spots = [
  {title: 'Just Climb Climbing Gym', location: {lat: 22.3345, lng: 114.198961}, indoor:true},
  {title: 'Attic V Climbing Gym', location: {lat: 22.248501, lng: 114.168127}, indoor:true},
  {title: 'GoNature Climbing Gym', location: {lat: 22.309079, lng: 114.224477}, indoor:true},
  {title: 'Ha Fa Shan bouldering', location: {lat: 22.383145, lng: 114.094746}, indoor:false},
  {title: 'Shek O Bouldering', location: {lat: 22.228432, lng: 114.2560054}, indoor:false},
  {title: 'Lamma Bouldering', location: {lat: 22.1979449, lng: 114.132661}, indoor:false},
  {title: 'Chung Hom Kok Bouldering', location: {lat: 22.212925, lng: 114.205061}, indoor:false},
  {title: 'Shek Lung Kung', location: {lat: 22.383353,  lng: 114.083333}, indoor:false}
];

// Google map styles
var styles = [
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f5f5f2"
            },
            {
                "visibility": "on"
            }
          ]
        },

    {        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "visibility": "off"
            }
        ]
    },

    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#71c8d4"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#e5e8e7"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "color": "#8ba129"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c7c7c7"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#a0d3d3"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "color": "#91b65d"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "gamma": 1.51
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },

    {
        "featureType": "landscape",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road"
    },
    {
        "featureType": "road"
    },
    {
        "featureType": "road.highway"
    }
]

var hongkongCenter = {lat: 22.358072, lng: 114.116857};

$(document).ready(function () {
   ko.applyBindings(new ViewModel());
});

function ViewModel() {
    var self = this;

    // Initialize map
    var map = new google.maps.Map(document.getElementById('map'), {
      center: hongkongCenter,
      styles: styles,
      disableDefaultUI: true,
      zoom: ( window.matchMedia("(min-width: 400px)").matches ) ? 11 : 10
    });

    this.infowindow = new google.maps.InfoWindow();
    this.selectedOption = ko.observable("All");
    this.markers = ko.observableArray([]);

    // Initialize markers according to the bouldering location info
    spots.forEach(function(spot){
      var position = spot.location,
          title = spot.title,
          indoor = spot.indoor;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        icon: (indoor) ? 'images/climbing-22.png' : 'images/outdoor.png',
        animation: google.maps.Animation.DROP,
        indoor: indoor,
        displayText: ko.observable(false)
      });

      self.markers.push(marker);
      marker.addListener('click', function() {
        self.bounce(this);
        self.populateInfoWindow(this);
      });
    });

    // Render location list when document ready/ users click on filter buttons
    (this.changeList = function() {
      hideMarkers();
      switch(self.selectedOption()) {
          case "Indoor":
              for (var i = 0; i < self.markers().length; i++) {
                var marker = self.markers()[i];
                marker.displayText(false);
                if (marker.indoor) {
                  marker.setMap(map);
                  marker.displayText(true);
                }
              }
              break;
          case "Outdoor":
              for (var i = 0; i < self.markers().length; i++) {
                var marker = self.markers()[i];
                marker.displayText(false);
                if (!marker.indoor) {
                  marker.setMap(map);
                  marker.displayText(true);
                }
              }
              break;
          default:
              for (var i = 0; i < self.markers().length; i++) {
                var marker = self.markers()[i];
                marker.setMap(map);
                marker.displayText(true);
              }
              break;
      }
      return true;
    })();

    function hideMarkers() {
      for (var i = 0; i < self.markers().length; i++) {
        self.markers()[i].setMap(null);
      }
    };

    this.openMenu = function() {
        document.getElementById("sideMenu").style.width = "320px";
        document.getElementById("sideMenu").style.left = "0";
    }

    this.closeMenu = function() {
        document.getElementById("sideMenu").style.width = "0";
        document.getElementById("sideMenu").style.left = "-30px";
    }

    // Marker bounces for 1500ms
    this.bounce = function(marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
          marker.setAnimation(null);
      }, 1500);
    };

    // Population info window
    this.populateInfoWindow = function(marker) {
      var infowindow = self.infowindow;

      // Use marker location as the map center
      var lat = marker.getPosition().lat();
      var lng = marker.getPosition().lng();
      var latoffset = 0.15;
      map.setCenter({lat: lat + latoffset, lng: lng});

      // Open one info window at a time
      if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
          map.setCenter(hongkongCenter);
          infowindow.marker = null;
        });

        var flickrurl = "https://api.flickr.com/services/rest/";
        flickrurl += '?' + $.param({
          'method': "flickr.photos.search",
          'api_key': "f2bd7c2074ddb1c91fe9041a3ca8fc98",
          'text': marker.title,
          'format': "json",
          'nojsoncallback': "1"
        });

        //Set loading msg
        infowindow.setContent('<h4 class="text-center">' + marker.title + '</h4><br>' + '<p class="text-center">Loading...</p>');

          // Get json from Flickr
          $.getJSON(flickrurl, function(rsp) {

            // If no related photos are found, update info window msg
            if (rsp.photos.photo.length === 0) {
              infowindow.setContent('<h4 class="text-center">' + marker.title + '</h4><br>' + '<p class="text-center">No related photos in Flickr</p>');
            }

            // Populate info window with Flickr photos(max. 8) using Bootstrap Carousel
            else {
              var content = '<h4 class="text-center">' + marker.title + '</h4>' + `
              <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
                <!-- Indicators -->
                <ol class="carousel-indicators"></ol>

                <!-- Wrapper for slides -->
                <div class="carousel-inner" role="listbox"></div>

                <!-- Controls -->
                <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                  <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                  <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                  <span class="sr-only">Next</span>
                </a>
              </div>
              <p class="text-right">Photos from Flickr</p>
            `
            infowindow.setContent(content);

            for (var i=0 ; i < rsp.photos.photo.length && i < 8; i++) {
              photo = rsp.photos.photo[i];
              z_url = "http://farm" + photo.farm + ".static.flickr.com/" +
                photo.server + "/" + photo.id + "_" + photo.secret + "_" + "z.jpg";
              p_url = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
              $('.carousel-indicators').append('<li data-target="#carousel-example-generic" data-slide-to="'+ i + '"></li>');
              $('.carousel-inner').append('<div class="item"><a href="' + p_url + '">' + '<img alt="'+ photo.title + '"src="' + z_url + '"/>' + '</a></div>');
            }
            $('.carousel-indicators li').first().addClass("active");
            $('.carousel-inner .item').first().addClass("active");
          }

        })

        // If data can't be loaded, update info window msg
        .fail(function() {
          infowindow.setContent('<div>' + marker.title + '</div>' + '<div>Could not load photos from Flickr</div>')
        });

        // Display info window on map
        infowindow.open(map, marker);
      }
    };

}
