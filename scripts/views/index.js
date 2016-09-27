define(['backbone', 'views/canvas-d3', 'jquery', 'views/info-panel'],
    function(backbone, Canvas, $, InfoPanel) {

        var Index = Backbone.View.extend({
            id: 'mainPage',
            initialize: function(Nodes, Edges, Dispatch) {
                var canvas = new Canvas({ nodes: Nodes, edges: Edges, dispatch: Dispatch });
                var infoPanel = new InfoPanel({dispatch: Dispatch});
                this.$el.append(canvas.$el);
            }
        });
        return Index;

    });
