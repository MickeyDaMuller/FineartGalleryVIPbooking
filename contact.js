jQuery(function ($) {
    // Asynchronously Load the map API
    // var script = document.createElement('script');
    // script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    // document.body.appendChild(script);
    google.maps.event.addDomListener(window, 'load', initialize);
    var map;
    var directionsDisplayDriving;
    var directionsDisplayTransit;
    var directionResponseForDriving = null;
    var directionResponseForTransit = null;

    function initialize() {
        var bounds = new google.maps.LatLngBounds();
        var mapStyle = [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}];
        var styledMap = new google.maps.StyledMapType(mapStyle, {name: "Alserkal"});
        var mapOptions = {
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            },
            scrollwheel: false
        };
        // Display a map on the page
        map = new google.maps.Map(document.getElementById("contact-map"), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        google.maps.event.trigger(map, 'resize');
        map.setTilt(45);
        // Multiple Markers
        var markers = [
            ['Alserkal\x20Avenue', 25.14071,55.226318],
        ];
        // Info Window Content
        var infoWindowContent = [
            ['<div class="info_content">' +
            '<p><strong>Alserkal\x20Avenue</strong></p>' +
            '<p>Street\x2017,\x20Al\x20Quoz\x201\x3Cbr\x20\x2F\x3E\x0D\x0AP.O.Box\x3A\x20390099\x3Cbr\x20\x2F\x3E\x0D\x0ADubai,\x20U.A.E\x3Cbr\x20\x2F\x3E\x0D\x0A\x3Cbr\x20\x2F\x3E\x0D\x0ABy\x20Car\x3A\x20\x3Cbr\x20\x2F\x3E\x0D\x0AFrom\x20Sheikh\x20Zayed\x20Road,\x20take\x20the\x20Al\x20Manara\x20exit\x20\x28Exit\x2043\x29\x20into\x20Al\x20Quoz\x20Go\x20straight\x20on\x20Al\x20Manara\x20Street\x20until\x20you\x20reach\x20the\x20traffic\x20light\x20facing\x20Home\x20Centre.\x20At\x20this\x20junction,\x20turn\x20right.\x20Drive\x20straight\x20then\x20turn\x20right\x20onto\x2017th\x20Street,\x20before\x20the\x20Avenue.\x20At\x20the\x20end\x20of\x20the\x20road,\x20turn\x20left\x20onto\x206A\x20Street\x20for\x20parking.\x3Cbr\x20\x2F\x3E\x0D\x0A\x3Cbr\x20\x2F\x3E\x0D\x0ABy\x20Metro\x3A\x20The\x20closest\x20metro\x20station\x20to\x20Alserkal\x20Avenue\x20is\x20Noor\x20Bank\x20station.\x20From\x20there,\x20you\x20will\x20need\x20to\x20take\x20a\x20taxi\x20to\x20our\x20location.</p>' +
            '<p><strong>\x2B\x209714\x20333\x203464</strong></p>' +
            '<p><a style="color:#666666;" href="mailto:info\x40alserkalavenue.ae">info\x40alserkalavenue.ae</a></p>' + '</div>']
        ];
        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        // Loop through our array of markers & place each one on the map
        for (i = 0; i < markers.length; i++) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: '\x2Fen\x2Fmedia\x2F9f897a72\x2Dbf49\x2D11e5\x2D8b71\x2Df23c9161897b\x2Fview.php',
                title: markers[i][0]
            });
            // Allow each marker to have an info window
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));
            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }
        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
            this.setZoom(15);
            google.maps.event.removeListener(boundsListener);
        });
        map.set('styles', [
            {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [
                    {color: "#00FF00"}
                ]
            }
        ]);
    }

    function getCurrentLocation() {
        $('#directionInfo').hide();
        $('#direction-by-car').html('');
        $('#direction-by-bus').html('');
        if (navigator.geolocation) {
            $('#ActIndicator').show();
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $('#ActIndicator').hide();
            alert("Geolocation is not supported by this browser.");
        }
    }


    function showPosition(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;


        directionsDisplayDriving = new google.maps.DirectionsRenderer();
        directionsDisplayDriving.setMap(map);
        directionsDisplayDriving.setPanel(document.getElementById('direction-by-car'));

        directionsDisplayTransit = new google.maps.DirectionsRenderer();
                directionsDisplayTransit.setPanel(document.getElementById('direction-by-bus'));

        var directionResponseForDriving = null;
        var directionResponseForTransit = null;


        var directionsServiceDriving = new google.maps.DirectionsService();
        var requestDriving = {
            origin: lat + ',' + lng,
            destination: '25.14071,55.226318',
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsServiceDriving.route(requestDriving, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionResponseForDriving = response;
                directionsDisplayDriving.setDirections(response);
                $('#directionInfo').show();
                $('#ActIndicator').hide();
            }
        });

        var directionsServiceTransit = new google.maps.DirectionsService();
        var requestTransit = {
            origin: lat + ',' + lng,
            destination: '25.14071,55.226318',
            travelMode: google.maps.TravelMode.TRANSIT
        };
        directionsServiceTransit.route(requestTransit, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionResponseForTransit = response;
                directionsDisplayTransit.setDirections(response);

            }
        });
    }

    $('#getDirectionLink').click(function (e) {
        e.preventDefault();
        getCurrentLocation();
    });

    $('#buttonDByCar').bind('click',function(event) {
        directionsDisplayDriving.setMap(map);
        directionsDisplayTransit.setMap(null);
    });

    $('#buttonDByBus').bind('click',function(event) {
        directionsDisplayDriving.setMap(null);
        directionsDisplayTransit.setMap(map);
    });

});