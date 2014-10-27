//NAMESPACE
var APPIE = APPIE || {};

//Self-Invloking Anonymous function
(function($, $$, hasClass) {
    //controller init object
    APPIE.controller = {

        init: function() {
            // initialize APP objects
            APPIE.storageLoader.webstorage();
        }
    };

    APPIE.storageLoader = {
        webstorage: function() {
            if (Modernizr.localstorage) {
                // window.localStorage is available!
                console.log("localStorage supported");

				APPIE.xhr.trigger('GET', 'http://dennistel.nl/movies', function (response) {
					localStorage.setItem('movies', response);
					APPIE.router.init();
				});

            //FALLBACK if webstorage is not supported, JSON data is put in the global scope
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
                    $('section[data-route="movies"]').classList.remove('flex');
                    APPIE.sections.toggle('section[data-route="about"]');
                    console.log("route changed: about");

                    APPIE.appcontent.about();
                    console.log("get data for: about");
                },
                'movies': function() {

                    $('.spinner').classList.add('active');

                    

                    setTimeout(function() {
                        $('.spinner').classList.remove('active');
                        $('section[data-route="movies"]').classList.add('flex');

                        APPIE.sections.toggle('section[data-route="movies"]');
                        console.log("route changed: movies");

                    }, 2000);

                    

                    APPIE.appcontent.movies();
                    console.log("get data for: movies");
                    
                },
                'movies/genre/:genre': function(genre) {
                    APPIE.sections.toggle('section[data-route="movie-genre"]');
                    console.log("route changed: movie genre", genre);

                    APPIE.appcontent.movieGenre(genre);
                    console.log("get data for: movie genre" + genre);
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
        },
        spinnerOn: function() {
            
        },
        spinnerOff: function() {
            
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

            var model = {
                "about": [
                    {
                        "title": "About",
                        "description": "The Movie Database (TMDb) was started as a side project in 2008 to help the media center community serve high resolution posters and fan art. What started as a simple image sharing community has turned into one of the most actively user edited movie database on the Internet. With an initital data contribution from a project called omdb (thank you!), the goal was to create our own product and service. We launched the first version of the database in early 2009. Along with the website we also launched one of first and only free movie data API's. Today, our service is used by tens of millions of people every week and is often regarded as the single best place to get movie data and images. Whether you're interested in what movies have won the Oscar for best picture, maintaining a personal watchlist, or like to develop applications of your own, we hope you'll love everything our service has to offer. So explore a little. Search for your favorite movie. Build a list of movies you want to watch. We're really proud of the service we've built and hope you find it as useful as we do."
                    }

                ]
            };
            return APPIE.sections.renderAbout(model);
        },

        movies: function(data) {
            console.log('create model for movies');

            var model = {

                "movies": APPIE.manipulate.reviewData(),
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
                    },
                    genres: { 
                        genre: {
                            href: function() {
                                return "#movies/genre/" + (this.value);
                            },
                            text: function() {
                                return this.value;
                            }
                        },
                    },
                    reviews: {
                        text: function(){                       
                            if(isNaN(this.reviews)){
                                return 'No score available';
                            } else {
                                return this.reviews;
                            }
                        }
                    }
                }
            };
            return APPIE.sections.renderMovies(model);
        },

        movieGenre: function(genre) {
            console.log('create model for movie genre:', genre);
            var model = {
                "genreMovies": APPIE.manipulate.filter(genre),

                "moviesDirective": {
                    cover : {
                        src: function() {
                            return this.cover;
                        }
                    },
                    details: {
                        href: function() {
                            return '#movies/' + (this.id - 1);
                        }
                    },
                    genres: { 
                        genre: {
                            href: function() {
                                return "#movies/genre/" + (this.value);
                            },
                            text: function() {
                                return this.value;
                            }
                        }
                    }
                }
            };
            return APPIE.sections.renderGenre(model);
        },

        movie: function(id) {
			console.log('create model for movie ', id);
            var model = {
                "movieDetails": APPIE.manipulate.reviewData()[id],
                "movieDirective": {
                    cover: {
                        src: function () {
							console.log(this);
                            return this.cover;
                        },
                        alt: function () {
                            return this.title + ' cover';
                        }
                    },
                    actors: {
                        url_photo: {
                            src: function() {
                                return this.url_photo;
                            }
                        },
                        url_profile: {
                            href: function() {
                                return this.url_profile;
                            }
                        },
                    }
                }
            };            
            return APPIE.sections.renderMovie(model);
        }
    };

    //Manipulate JSON data object
    APPIE.manipulate = {

        //Manipulate review scores
        reviewData: function() {

            console.log("manipulate review scores")
            // get data
            var data = JSON.parse(localStorage.getItem('movies'));

            //map reduce
            _.map(data, function (movie, i) {
                    movie.reviews   = _.reduce(movie.reviews,   function(memo, review){   return memo + review.score; }, 0) / movie.reviews.length;
                    
                    console.log(movie.reviews)
                })  
            return data;
        },

        //Manipulate movie genre
        filter: function(genre) {

            console.log("manipulate genre filter")
            // get data
            var data = JSON.parse(localStorage.getItem('movies'));

            // loop over data
            for (var i = 0; i < data.length; i++) { 
                // filter data based on hash
                var data = _.filter(data, function (data) {
                    // return objects if object contains genre
                    return _.contains(data.genres, genre);
                });
            };
            return data
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
        renderGenre: function(model) {
            console.log('render genre movies ' + model.genreMovies.genres);
            var sectionGenre = $('section[data-route="movie-genre"]');
            Transparency.render(sectionGenre, model.genreMovies, model.moviesDirective);            
        },
        renderMovie: function(model) {
            console.log('render details movie ' + model.movieDetails.id);
            var sectionMovie = $('section[data-route="movie-details"]');
            Transparency.render(sectionMovie, model.movieDetails, model.movieDirective);
        },
        toggle: function(section) {

            var sections = $$('#content section');
            for(var i=0; i<sections.length; i++) {
                sections[i].classList.remove('active');
            }
            if (!hasClass(document.querySelector(section), 'active')) {
                document.querySelector(section).classList.add('active');
            }
        }
    };

    APPIE.controller.init();

            
    //Touch event - swipe to show filter menu
    var element = $('section[data-route="movies"]');
    Hammer(element).on("swipeleft", function(event) {        
        console.log('swipe left: show filter menu');
        $('.nav-filter').classList.add('active');
    });
    Hammer(element).on("swiperight", function(event) {        
        console.log('swipe right: hide filter menu');
        $('.nav-filter').classList.remove('active');
    });                

})(APPIE.Utils.$, APPIE.Utils.$$, APPIE.Utils.hasClass);