// google maps implementation
( function ( $ ) {

    // var map initialize
    function initialize() {
        var map_canvas, options, map;

        map_canvas = $( '#map-canvas' ).get(0);
        options = {
            zoom: 10,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map( map_canvas, options );
    }


    $( document ).ready( initialize );
} )( jQuery );