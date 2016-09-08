define(['backbone', 'underscore', 'jquery', 'd3'], function(backbone, _, $, d3) {

    var Canvas = Backbone.View.extend({

        initialize: function(data) {
            _.extend(this, data);
        },
        id: 'canvas',
        className: 'container main-canvas',

        visNodes: [],
        visEdges: [],

        render: function() {
            this.canvas = d3.select(this.$el[0]).append('svg').attr('width', '100%').attr('height', '100%');
            var svg = this.canvas.select('svg');
            console.log(svg);

            var rootNode = this.nodes.find(function(n) {
                return n.attributes.root && n.attributes.root === 1;
            });

            var sim = d3.forceSimulation()
                .nodes(this.visNodes)
                .force('charge', d3.forceManyBody())
                .force('link', d3.forceLink(this.visEdges))
                .force('center', d3.forceCenter());

            console.log(sim);

        }
    });

    return Canvas;

});
