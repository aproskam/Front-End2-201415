(function() {
	'use strict'

	var check = {

		init: function () {
			debug_message("Controleer of GPS beschikbaar is...");

			if (geo_position_js.init()) {
				this.available;
			} else (unavailable) {
				this.unavailable;
			}
		},

		available: function() {
			debug_message("GPS is beschikbaar, vraag positie.");
    		gps.update();
    		interval = self.setInterval(gps.update(), gps.update.refresh);
		},

		unavailable: function() {
			debug_message('GPS is niet beschikbaar.');
		},
	}

	var gps = {

		this.currentPosition = null;
		// Vraag de huidige positie aan geo.js, stel een callback in voor het resultaat
		update: function() {
			intervalCounter++;
    		geo_position_js.getCurrentPosition(this.position, _geo_error_handler, {enableHighAccuracy:true});

    		var refresh = {
    			rate: 1000;
    		}
		},
		// Callback functie voor het instellen van de huidige positie, vuurt een event af
		position: function(position) {
			currentPosition = position;
    		ET.fire("POSITION_UPDATED");
    		debug_message(intervalCounter+" positie lat:"+position.coords.latitude+" long:"+position.coords.longitude);
		}
	}
})();

// GOOGLE MAPS FUNCTIES
/**
 * generate_map(myOptions, canvasId)
 *  roept op basis van meegegeven opties de google maps API aan
 *  om een kaart te genereren en plaatst deze in het HTML element
 *  wat aangeduid wordt door het meegegeven id.
 *
 *  @param myOptions:object - een object met in te stellen opties
 *      voor de aanroep van de google maps API, kijk voor een over-
 *      zicht van mogelijke opties op http://
 *  @param canvasID:string - het id van het HTML element waar de
 *      kaart in ge-rendered moet worden, <div> of <canvas>
 */
function generate_map(myOptions, canvasId){
// TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
    debug_message("Genereer een Google Maps kaart en toon deze in #"+canvasId)
    map = new google.maps.Map(document.getElementById(canvasId), myOptions);

    var routeList = [];
    // Voeg de markers toe aan de map afhankelijk van het tourtype
    debug_message("Locaties intekenen, tourtype is: "+tourType);
    for (var i = 0; i < locaties.length; i++) {

        // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
        try {
            (localStorage.visited==undefined||isNumber(localStorage.visited))?localStorage[locaties[i][0]]=false:null;
        } catch (error) {
            debug_message("Localstorage kan niet aangesproken worden: "+error);
        }

        var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
        routeList.push(markerLatLng);

        markerRij[i] = {};
        for (var attr in locatieMarker) {
            markerRij[i][attr] = locatieMarker[attr];
        }
        markerRij[i].scale = locaties[i][2]/3;

        var marker = new google.maps.Marker({
            position: markerLatLng,
            map: map,
            icon: markerRij[i],
            title: locaties[i][0]
        });
    }
// TODO: Kleur aanpassen op het huidige punt van de tour
    if(tourType == LINEAIR){
        // Trek lijnen tussen de punten
        debug_message("Route intekenen");
        var route = new google.maps.Polyline({
            clickable: false,
            map: map,
            path: routeList,
            strokeColor: 'Black',
            strokeOpacity: .6,
            strokeWeight: 3
        });

    }

    // Voeg de locatie van de persoon door
    currentPositionMarker = new google.maps.Marker({
        position: kaartOpties.center,
        map: map,
        icon: positieMarker,
        title: 'U bevindt zich hier'
    });

    // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
    ET.addListener(POSITION_UPDATED, update_positie);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Update de positie van de gebruiker op de kaart
function update_positie(event){
    // use currentPosition to center the map
    var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
    map.setCenter(newPos);
    currentPositionMarker.setPosition(newPos);
}

// FUNCTIES VOOR DEBUGGING

function _geo_error_handler(code, message) {
    debug_message('geo.js error '+code+': '+message);
}
function debug_message(message){
    (customDebugging && debugId)?document.getElementById(debugId).innerHTML:console.log(message);
}
function set_custom_debugging(debugId){
    debugId = this.debugId;
    customDebugging = true;
}