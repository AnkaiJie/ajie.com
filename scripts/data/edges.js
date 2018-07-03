define(['backbone', 'underscore', 'data/edge'], function(Backbone, _, Edge) {
    return Backbone.Collection.extend({
        model: Edge,
        url: function() {
            return this.url;
        },
        initialize: function(config) {
            _.extend(this, config);
        }
    });
});
