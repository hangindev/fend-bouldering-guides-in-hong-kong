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

var styles = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#FFBB00"
            },
            {
                "saturation": 43.400000000000006
            },
            {
                "lightness": 37.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "hue": "#FFC200"
            },
            {
                "saturation": -61.8
            },
            {
                "lightness": 45.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 51.19999999999999
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 52
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#0078FF"
            },
            {
                "saturation": -13.200000000000003
            },
            {
                "lightness": 2.4000000000000057
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "hue": "#00FF6A"
            },
            {
                "saturation": -1.0989010989011234
            },
            {
                "lightness": 11.200000000000017
            },
            {
                "gamma": 1
            }
        ]
    }
]

var hongkongCenter = {lat: 22.358072, lng: 114.116857};

$(document).ready(function () {
   ko.applyBindings(new ViewModel());
});

function ViewModel() {
    var self = this;

    var map = new google.maps.Map(document.getElementById('map'), {
      center: hongkongCenter,
      styles: styles,
      disableDefaultUI: true,
      zoom: 11
    });
    var largeInfowindow = new google.maps.InfoWindow();
    // var bounds = new google.maps.LatLngBounds();
    this.selectedOption = ko.observable("All");
    this.markers = ko.observableArray([]);
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
        var lat = this.getPosition().lat()
        var lng = this.getPosition().lng()
        map.setCenter({lat: lat + 0.12, lng: lng});
        populateInfoWindow(this, largeInfowindow);
      });
    });


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

    function populateInfoWindow(marker, infowindow) {
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

        infowindow.setContent('<div>' + marker.title + '</div>' + '<div>Loading...</div>');

        $.getJSON(flickrurl, function(rsp) {
          var content = `
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
          `
          infowindow.setContent(content);
          for (var i=0 ; i < rsp.photos.photo.length && i < 5; i++) {
            photo = rsp.photos.photo[i];
            z_url = "http://farm" + photo.farm + ".static.flickr.com/" +
              photo.server + "/" + photo.id + "_" + photo.secret + "_" + "z.jpg";
            p_url = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
            $('.carousel-indicators').append('<li data-target="#carousel-example-generic" data-slide-to="'+ i + '"></li>');
            $('.carousel-inner').append('<div class="item"><a href="' + p_url + '">' + '<img alt="'+ photo.title + '"src="' + z_url + '"/>' + '</a></div>');
          }
          $('.carousel-indicators li').first().addClass("active");
          $('.carousel-inner .item').first().addClass("active");
        }).fail(function() {
          infowindow.setContent('<div>' + marker.title + '</div>' + '<div>Could not load photos from Flickr</div>')
        });
        infowindow.open(map, marker);
      }
    };
}
