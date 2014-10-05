var APPIE = APPIE || {};

(function($, $$, hasClass) {
    //controller init object
    APPIE.controller = {

        init: function() {
            // initialize APP objects
            APPIE.router.init();
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


                },
                'movies': function() {
                    APPIE.sections.toggle('section[data-route="movies"]');
                    console.log("route changed: movies");

                    APPIE.xhr.trigger('GET', 'http://dennistel.nl/movies', APPIE.appcontent.movies);
                    console.log("get data for: movies");
                },
                '*': function() {
                    APPIE.sections.toggle('section[data-route="about"]');
                    console.log("route changed: default");
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
        movies: function(data) {
            console.log('create model for movies');

            var model =  {
                "movies": JSON.parse(data),
                "moviesDirective": {
                    cover: {
                        src: function () {
                            return this.cover;
                        },
                        alt: function () {
                            return this.title + ' cover';
                        }

                    }
                }
            };
            return APPIE.sections.renderMovies(model);
        },
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
        }
    };

    //Sections object
    APPIE.sections = {
        renderAbout: function(model) {
            console.log('render about');
            var sectionAbout = document.querySelector('section[data-route="about"]');
            Transparency.render(sectionAbout, model.about);
        },
        renderMovies: function(model) {
            console.log('render movies');
            var sectionMovies = document.querySelector('section[data-route="movies"]');
            Transparency.render(sectionMovies, model.movies, model.moviesDirective);
        },
        toggle: function(section) {

            var sections = document.querySelectorAll('#content section');

            for(i=0; i<sections.length; i++) {
                sections[i].classList.remove('active');
            }
            if (!hasClass(document.querySelector(section), 'active')) {
                document.querySelector(section).classList.add('active');
            }
        }
    };

    APPIE.controller.init();

})(APPIE.Utils.$, APPIE.Utils.$$, APPIE.Utils.hasClass);