require.config({
    paths: {
        "jquery": "bower_lib/jquery/dist/jquery",
        "underscore": "bower_lib/underscore/underscore",
        "backbone": "bower_lib/backbone/backbone",

    }
});


require(['views/app'], function(App) {
    new App;
});
