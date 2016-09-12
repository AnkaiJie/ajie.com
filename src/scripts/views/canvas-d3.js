define(['backbone', 'underscore', 'jquery', 'd3'], function(backbone, _, $, d3) {

    var Canvas = Backbone.View.extend({

        initialize: function(data) {
            _.extend(this, data);
            var rootNode = this.nodes.find(function(n) {
                return n.attributes.root && n.attributes.root === 1;
            });
            var width = $(window).width();
            var height = $(window).height();

            this.visNodes.push(_.extend(rootNode, { x: width / 2, y: height * 0.4 }));
            this.initializeForce();
        },

        id: 'canvas',
        visNodes: [],
        visEdges: [],

        initializeForce: function() {
            this.simulation = d3.forceSimulation();
            this.setPhysics();
            this.render();
            this.refresh();
        },

        refresh: function() {
            if (this.simulation) {
                this.simulation.stop();
                this.drawNodes();
                this.drawEdges();
                this.simulation
                    .nodes(this.visNodes)
                    .force('link', d3.forceLink(this.visEdges));
                this.simulation.force('link')
                    .links(this.visEdges);
                this.simulation.restart();
            }
        },

        setPhysics: function() {
            function dragstarted(d) {
                if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            this.drag = d3.drag()
                .on("start", _.bind(dragstarted, this))
                .on("drag", dragged)
                .on("end", _.bind(dragended,this));
            this.simulation
                .on('tick', _.bind(this.ticked, this));
        },


        drawNodes: function() {

            this.node = this.svg.append('g')
                .selectAll('circle')
                .data(this.visNodes)
                .enter().append('circle')
                .attr('r', 30)
                .call(this.drag);

        },

        drawEdges: function() {
            this.edge = this.svg.append('g')
                .selectAll('line')
                .data(this.visEdges)
                .enter()
                .append('line')
                .attr('stroke', 'black');
        },

        ticked: function() {
            console.log('tick');
            this.edge
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

            this.node
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        },

        render: function() {
            this.svg = d3.select(this.$el[0]).append('svg').attr('width', '100%').attr('height', '100%');
        }

    });

    return Canvas;

});
