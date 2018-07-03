define(['backbone', 'views/canvas-d3', 'jquery', 'views/info-panel', 'views/instruc'],
    function(backbone, Canvas, $, InfoPanel, Instruc) {

        var Index = Backbone.View.extend({
            id: 'mainPage',
            initialize: function(Nodes, Edges, Dispatch) {
                this.width = $(window).width();
                this.height = $(window).height();
                this.nodeRadius = Math.max(10, Math.min(this.width, this.height) * 0.05);

                var canvas = new Canvas({ nodes: Nodes, edges: Edges, dispatch: Dispatch, 
                    nodeRadius: this.nodeRadius, width:this.width, height:this.height });
                var infoPanel = new InfoPanel({ dispatch: Dispatch, nodeRadius: this.nodeRadius });
                var instruc = new Instruc({ dispatch: Dispatch, nodeRadius: this.nodeRadius });
                this.$el.append(canvas.$el);
                this.$el.append(infoPanel.$el);
                canvas.$el.append(instruc.$el);
            }
        });
        return Index;

    });
