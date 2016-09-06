require.config({
    paths: {
        "jquery": "bower_lib/jquery/dist/jquery",
        "underscore": "bower_lib/underscore/underscore",
        "backbone": "bower_lib/backbone/backbone",
        "d3": "bower_lib/d3/d3"

    }
});


require(['views/app'], function(App) {
    new App;
});
