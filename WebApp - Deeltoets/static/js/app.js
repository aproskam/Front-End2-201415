var APPIE = APPIE || {};

(function() {
	//controller init object
	APPIE.controller = {

		init: function() {
			// initialize APP objects
			APPIE.router.init();
			APPIE.sections.init();
		}
	};

	//Router object
	APPIE.router = {
		init: function() {
			console.log("router begins")

			routie({
				'about': function() {
					
					APPIE.sections.toggle('section[data-route="about"]');
					console.log("load section about")
				},
				'movies': function() {
					
					APPIE.sections.toggle('section[data-route="movies"]');
					console.log("load section movies")
				},
				'*': function() {
					APPIE.sections.toggle('section[data-route="about"]');
					console.log("section about loaded")
				}
			});
		}
	};

	//DATA Object
	APPIE.appcontent = {

		about: function() {
			titel: 'About';
			description: 'All about the about app';
		},

		movies: [
			{ title: '', releaseDate: '', description: '', cover: ''}
		]
	};

	//Sections object
	APPIE.sections = {

		init: function() {
			APPIE.sections.about();
			APPIE.sections.movies();
		},
		about: function() {
			
			var sectionAbout = document.querySelector('section[data-route="about"]');
			
			Transparency.render(sectionAbout, APPIE.appcontent.about);
		},
		movies: function() {
			var sectionMovies = document.querySelector('section[data-route="movies"]');
			
			Transparency.render(sectionMovies, APPIE.appcontent.movies);
		},
		toggle: function(section) {
			
			var sections = document.querySelectorAll('#content section');
			
			for(i=0; i<sections.length; i++) {
				sections[i].classList.remove('active');
			} 
			if (!document.querySelector(section).classList.contains('active')) {
				document.querySelector(section).classList.add('active');
			}
		}
	};

	APPIE.controller.init();

})();