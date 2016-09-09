define(['backbone', 'underscore', 'jquery', 'd3'], function(backbone, _, $, d3) {

    var Canvas = Backbone.View.extend({

        initialize: function(data) {
            _.extend(this, data);
        },

        id: 'canvas',

        visNodes: [],
        visEdges: [],

        render: function() {
            var svg = d3.select(this.$el[0]).append('svg').attr('width', '100%').attr('height', '100%'),
                width = $(window).width(),
                height = $(window).height();

            var rootNode = this.nodes.find(function(n) {
                return n.attributes.root && n.attributes.root === 1;
            });

            this.visNodes.push(_.extend(rootNode, { x: width / 2, y: height * 0.4 }));

            this.simulation = d3.forceSimulation()
                .force('charge', d3.forceManyBody())
                .force('link', d3.forceLink(this.visEdges))
                .force('center', d3.forceCenter());

            this.edges = svg.append('g')
                .selectAll('line')
                .data(this.visEdges)
                .enter()
                .append('line')
                .attr('stroke', 'black');

            this.nodes = svg.append('g')
                .selectAll('circle')
                .data(this.visNodes)
                .enter().append('circle')
                .attr('r', 30)
                .call(d3.drag()
                    .on('start', this.dragstart)
                    .on("drag", this.dragged)
                    .on("end", this.dragended));

            this.simulation
                .nodes(this.visNodes)
                .on('tick', this.ticked());

            this.simulation.force('link')
                .links(this.visEdges);

        },

        dragstarted: function(d) {
            d.fx = d.x;
            d.fy = d.y;
        },

        dragged: function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        },

        dragended: function (d) {
            d.fx = null;
            d.fy = null;
        },

        ticked: function() {
            this.edges
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            this.nodes
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }
    });

    return Canvas;

});
