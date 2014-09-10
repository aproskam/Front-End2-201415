//NAMESPACE = controleert of het object APP heet en anders er voor zorgt
//            en anders het object defineert als APP. (gebruikt om andere
//			  andere modules aan te kunnen spreken in aparte bestanden)
var APP = APP || {}
//SELF INVOKING ANONYMOUS FUNCTION - zorgt er voor dat het script wordt ingeladen
//                                   en in een local scope komt te staan.
(function(){

	var APP.controller = {
		init: function(){
			gps.startInterval();
			debug.geoErrorHandler();
		}
	}

	var APP.gps = {
		startInterval: function() {

		},
		updatePosition: function() {

		},
		setPosition: function() {

		},
		checkLocations: function() {

		},
		calculateDistance: function() {

		}
	}

	var APP.maps = {	
		generate: function() {

		},
		isNumber: function() {

		},
		updatePosition: function() {

		}
	}

	var APP.debug = {
		geoErrorHandler: function() {

		},
		message: function() {

		},
		setCustomDebugging: function() {

		}
	}

	controller.init();
})();