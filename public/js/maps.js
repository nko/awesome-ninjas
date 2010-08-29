// google maps implementation
( function ( $ ) {
    var gLocalSearch, map_canvas, options, map, gCurrentResults, searchResCont;


// Create our "tiny" marker icon
    var gYellowIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_yellow.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    var gRedIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_red.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    var gSmallShadow = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_shadow.png",
      new google.maps.Size(22, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    

    function searchComplete() {
        // if no results then return
        if ( !gLocalSearch.results ) return;
        
        gCurrentResults = [];
        for (var i = 0; i < gLocalSearch.results.length; i++) {
            gCurrentResults.push(new LocalResult(gLocalSearch.results[i]));
        }

        var attribution = gLocalSearch.getAttribution();
        if (attribution) {
            searchResCont.appendChild( attribution );
        }

        // Move the map to the first result
        var first = gLocalSearch.results[0];
        map.setCenter(new google.maps.LatLng(parseFloat(first.lat),
                                            parseFloat(first.lng)));
    }


    // var map initialize
    function initialize() {
        map_canvas = $( '#map-canvas' ).get(0);
        options = {
            zoom: 10,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map( map_canvas, options );

        //initialize the search
        // Initialize the local searcher
        gLocalSearch = new GlocalSearch();
        gLocalSearch.setSearchCompleteCallback(null, searchComplete );
        gLocalSearch.setCenterPoint( map.getCenter() );
        gLocalSearch.execute( Anj.data.search + ',' + Anj.data.address );

        $( map_canvas ).append( '<div id="map-results"><h2>Search Results: </h2><div id="search-result-cont"></div></div>' );
        searchResCont = $('#search-result-cont').get(0);
    }



    // A class representing a single Local Search result returned by the
    // Google AJAX Search API.
    // http://gmaps-samples-v3.googlecode.com/svn/trunk/localsearch/places.html
    function LocalResult(result) {
      var me = this;
      me.result_ = result;
      me.resultNode_ = me.node();
      me.marker_ = me.marker();
      google.maps.event.addDomListener(me.resultNode_, 'mouseover', function() {
        // Highlight the marker and result icon when the result is
        // mouseovered.  Do not remove any other highlighting at this time.
        me.highlight(true);
      });
      google.maps.event.addDomListener(me.resultNode_, 'mouseout', function() {
        // Remove highlighting unless this marker is selected (the info
        // window is open).
        if (!me.selected_) me.highlight(false);
      });
      google.maps.event.addDomListener(me.resultNode_, 'click', function() {
        me.select();
      });
      searchResCont.appendChild(me.resultNode_);
    }

    LocalResult.prototype.node = function() {
      if (this.resultNode_) return this.resultNode_;
      return this.html();
    };

    // Returns the GMap marker for this result, creating it with the given
    // icon if it has not already been created.
    LocalResult.prototype.marker = function() {
      var me = this;
      if (me.marker_) return me.marker_;
      var marker = me.marker_ = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(me.result_.lat),
                                         parseFloat(me.result_.lng)),
        icon: gYellowIcon, shadow: gSmallShadow, map: map});
      google.maps.event.addListener(marker, "click", function() {
        me.select();
      });
      return marker;
    };

    // Unselect any selected markers and then highlight this result and
    // display the info window on it.
    LocalResult.prototype.select = function() {
      unselectMarkers();
      this.selected_ = true;
      this.highlight(true);
      gInfoWindow.setContent(this.html(true));
      gInfoWindow.open(map, this.marker());
    };

    LocalResult.prototype.isSelected = function() {
      return this.selected_;
    };

    // Remove any highlighting on this result.
    LocalResult.prototype.unselect = function() {
      this.selected_ = false;
      this.highlight(false);
    };

    // Returns the HTML we display for a result before it has been "saved"
    LocalResult.prototype.html = function() {
      var me = this;
      var container = document.createElement("div");
      container.className = "unselected";
      container.appendChild(me.result_.html.cloneNode(true));
      return container;
    }

    LocalResult.prototype.highlight = function(highlight) {
      this.marker().setOptions({icon: highlight ? gRedIcon : gYellowIcon});
      this.node().className = "unselected" + (highlight ? " red" : "");
    }



    $( document ).ready( initialize );
} )( jQuery );

