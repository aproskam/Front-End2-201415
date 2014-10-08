var APPIE = APPIE || {};

(function($, $$, hasClass) {

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

            console.log('store data in localStorage')
            localStorage.setItem('movies', (data));

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
        }        
    };

})(APPIE.Utils.$, APPIE.Utils.$$, APPIE.Utils.hasClass);