define(['backbone', 'views/canvas-d3'], function(Backbone, Canvas) {
    var App = Backbone.View.extend({
        initialize: function() {
            console.log('Started main view');
            (new Canvas).render();
        }
    });

    return App;
});
