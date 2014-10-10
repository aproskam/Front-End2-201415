var APPIE = APPIE || {};

(function($, $$, hasClass) {
    //controller init object
    APPIE.controller = {

        init: function() {
            // initialize APP objects
            APPIE.checker.webstorage();
        }
    };

    APPIE.checker = {
        webstorage: function() {
            if (Modernizr.localstorage) {
                // window.localStorage is available!
                console.log("localStorage supported");

				APPIE.xhr.trigger('GET', 'http://dennistel.nl/movies', function (response) {
					localStorage.setItem('movies', response);
					APPIE.router.init();
				});

            } else {
                console.log("no support for localStorage :(");

				APPIE.xhr.trigger('GET', 'http://dennistel.nl/movies', function (response) {
					window.globalData = response;
					window.localStorage.getItem = function(){return globalData};

					APPIE.router.init();
				});

                // no native support for HTML5 storage :(
                // maybe try dojox.storage or a third-party solution
            }
        }
    };

    //Router object
    APPIE.router = {
        init: function() {
            console.log("router begins");

            routie({
                'about': function() {
                    APPIE.sections.toggle('section[data-route="about"]');
                    console.log("route changed: about");

                    APPIE.appcontent.about();
                    console.log("get data for: about");
                },
                'movies': function() {
                    APPIE.sections.toggle('section[data-route="movies"]');
                    console.log("route changed: movies");

					APPIE.appcontent.movies();
                    console.log("get data for: movies");
                },
                'movies/:id': function(id) {
                    APPIE.sections.toggle('section[data-route="movie-details"]');
                    console.log("route changed: movie id", id);

                    APPIE.appcontent.movie(id);
                    console.log("get data for: movie " + id);
                },
                '*': function() {
                    APPIE.sections.toggle('section[data-route="about"]');
                    console.log("route changed: default");

                    APPIE.appcontent.about();
                    console.log("get data for: about");
                }
            });
        }
    };


    APPIE.xhr = {
        trigger: function (type, url, success, data) {
            var req = new XMLHttpRequest;
            req.open('GET', url, true);

            req.setRequestHeader('Content-type','application/json');

            type === 'POST' ? req.send(data) : req.send(null);

            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status === 200 || req.status === 201) {
                        success(req.responseText);
                    }
                }
            }
        }
    };


    //DATA Object
    APPIE.appcontent = {
        about: function() {
            console.log('create model for about');

            var model =  {
                "about": [
                    {
                        "title": "About",
                        "description": "An overview of movies"
                    }

                ]
            };
            return APPIE.sections.renderAbout(model);
        },

        movies: function(data) {

            console.log('create model for movies');

            var model =  {
                "movies": JSON.parse(localStorage.getItem('movies')),
                "moviesDirective": {
                    cover: {
                        src: function () {
                            return this.cover;
                        },
                        alt: function () {
                            return this.title + ' cover';
                        }
                    },
                    details: {
                        href: function() {
                            return '#movies/' + (this.id - 1);
                        }
                    }
                }
            };
            return APPIE.sections.renderMovies(model);
        },

        movie: function(id) {
			console.log('create model for movie ', id);
            var model = {
                "movieDetails": JSON.parse(localStorage.getItem('movies'))[id],
                "movieDirective": {
                    cover: {
                        src: function () {
							console.log(this);
                            return this.cover;
                        },
                        alt: function () {
                            return this.title + ' cover';
                        }
                    }
                }
            };            
            return APPIE.sections.renderMovie(model);
        }
    };

    //Sections object
    APPIE.sections = {
        renderAbout: function(model) {
            console.log('render about');
            var sectionAbout = $('section[data-route="about"]');
            Transparency.render(sectionAbout, model.about);
        },
        renderMovies: function(model) {
            console.log('render movies');
            var sectionMovies = $('section[data-route="movies"]');
            Transparency.render(sectionMovies, model.movies, model.moviesDirective);
        },
        renderMovie: function(model) {
            console.log('render details movie ' + model.movieDetails.id);
            var sectionMovie = $('section[data-route="movie-details"]');
            Transparency.render(sectionMovie, model.movieDetails, model.movieDirective);
        },
        toggle: function(section) {

            var sections = $$('#content section');

			console.log('!!!!!!!!!!!!!');


            for(var i=0; i<sections.length; i++) {
                sections[i].classList.remove('active');
            }
            if (!hasClass(document.querySelector(section), 'active')) {
                document.querySelector(section).classList.add('active');
            }
        }
    };

    APPIE.controller.init();

})(APPIE.Utils.$, APPIE.Utils.$$, APPIE.Utils.hasClass);