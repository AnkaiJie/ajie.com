define(['backbone', 'views/canvas-d3', 'jquery'], function(backbone, Canvas, $) {

    var Index = Backbone.View.extend({
        id: 'mainPage',
        initialize: function(Nodes, Edges) {
            var canvas = new Canvas({ nodes: Nodes, edges: Edges });
            this.$el.append(canvas.$el);
        },

        render: function() {

        }

    });
    return Index;

});
