define(['backbone', 'views/canvas-d3', 'jquery', 'views/info-panel', 'views/instruc'],
    function(backbone, Canvas, $, InfoPanel, Instruc) {

        var Index = Backbone.View.extend({
            id: 'mainPage',
            initialize: function(Nodes, Edges, Dispatch) {
                var canvas = new Canvas({ nodes: Nodes, edges: Edges, dispatch: Dispatch });
                var infoPanel = new InfoPanel({ dispatch: Dispatch });
                var instruc = new Instruc({ dispatch: Dispatch });
                this.$el.append(canvas.$el);
                this.$el.append(infoPanel.$el);
                canvas.$el.append(instruc.$el);
            }
        });
        return Index;

    });
