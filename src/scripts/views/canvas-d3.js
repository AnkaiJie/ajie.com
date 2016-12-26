define(['backbone', 'underscore', 'jquery', 'd3', 'contextMenu'], 
    function(backbone, _, $, d3, contextMenu) {

    var Canvas = Backbone.View.extend({

        initialize: function(data) {
            _.extend(this, data);
            var rootNode = _.clone(this.nodes.find(function(n) {
                return n.attributes.root && n.attributes.root === 1;
            }).attributes);
            this.width = $(window).width();
            this.height = $(window).height();
            rootNode = _.extend(rootNode, { fx: 0, fy: 0 });
            this.visNodes.push(rootNode);
            this.selectedNode = rootNode;
            this.initializeForce();


        },

        id: 'canvas',
        visNodes: [],
        visEdges: [],
        // events: {
        //     'click svg': 'clickCanvas'
        // },

        // clickCanvas: function(e) {
        //     this.dispatch.trigger('toggleInfo');
        // },

        initializeForce: function() {
            this.simulation = d3.forceSimulation();
            this.setPhysics();
            this.render();
            this.refresh();
        },

        refresh: function() {
            if (this.simulation) {
                this.simulation.stop();
                this.drawEdges();
                this.drawNodes();
                this.simulation
                    .nodes(this.visNodes)
                    .force('link', d3.forceLink().id(function(d){
                       return d.id; 
                    }));

                this.simulation.force('link')
                    .links(this.visEdges)
                    .distance(250);
                this.simulation.restart();
            }
        },

        setPhysics: function() {
            this.simulation
                .force('charge', d3.forceManyBody().strength(-1500))
                .on('tick', _.bind(this.ticked, this));


        },

        excolNode: function(d) {
            if (d.expanded) {
                this.collapseNode(d);
            } else {
                this.expandNode(d);
            }
        },

        expandNode: function(d) {
            if (!d.expanded) {
                d.expanded = true;
                var items = this.nodes.getNodeExpansion(d);

                this.visNodes = this.visNodes.concat(items.newNodes);
                this.visEdges = this.visEdges.concat(items.newEdges);
                this.refresh();
            }
        },

        collapseNode: function(d) {
            if (d.expanded) {
                d.expanded = false;
                var removes = this.nodes.getNodesCollapsed(d, this.visNodes);
                this.visNodes = _.filter(this.visNodes, function(n) {
                    return removes.nodesToRemove.indexOf(n.id) === -1;
                });
                this.visEdges = _.filter(this.visEdges, function(e) {
                    return removes.edgesToRemove.indexOf(e.id) === -1;
                });
                this.refresh();

            }
        },

        drawNodes: function() {
            d3.selectAll('.nodes').remove();

            var excol = function(d) {
                if (!d3.event.active){
                    this.simulation.alpha(1);
                } 
                this.excolNode(d);
                d3.event.preventDefault();
            };

            var expand = function() {
                this.simulation.alpha(1);
                this.expandNode(this.selectedNode);
            };

            var collapse = function() {
                this.collapseNode(this.selectedNode);
            };

            var trigPanel = function() {
                var d = this.selectedNode;
                if (d.selected) {
                    d.selected = false;
                } else {
                    d.selected = true;
                }
                this.dispatch.trigger('toggleInfo', d);
            };

            var clickCanvas = function() {
                if (d3.event);
                var self = this;
                _.map(self.visNodes, function(node, key) {
                    self.visNodes[key].selected = false;
                });
                this.dispatch.trigger('firstClick');
                this.dispatch.trigger('toggleInfo');
            };

            //Nodes context menu
            $.contextMenu({
                selector: 'g.nodes',
                trigger: 'left',
                //autoHide: 'true',
                className:'context-custom',
                items: {
                    'focus': {
                        name: 'Show Info',
                        icon: 'fa-bullseye',
                        callback: _.bind(trigPanel, this)
                    },
                    'sep1': '---------',
                    'expand': {
                        name: 'Expand',
                        icon: 'fa-expand',
                        callback: _.bind(expand, this)
                    },
                    'collapse': {
                        name: 'Collapse',
                        icon: 'fa-compress',
                        callback: _.bind(collapse, this)
                    }
                }
            });

            this.firstMd = true;

            var dragstarted = function(d) {
                if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                if (this.firstMd) {
                    this.ix = d.fx;
                    this.iy = d.fy;
                    this.firstMd = false;
                }
            };



            var dragged = function(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            };

            var dragended = function(d) {
                this.dispatch.trigger('firstClick');
                if (!d3.event.active) this.simulation.alphaTarget(0);
                d3.event.sourceEvent.stopPropagation(); 
                // This was to trigger show info when dragged a bit
                if (Math.abs(this.ix - d.fx) < 5 && Math.abs(this.iy - d.fy) < 5) {
                    //fix for d3 chrome dragging issue, which is ok but not always ideal. 
                    $(':hover').last().click();
                }
                this.firstMd = true;
                if (!d.root) {
                    d.fx = null;
                    d.fy = null;
                }
            };

            this.drag = d3.drag()
                .on("start", _.bind(dragstarted, this))
                .on("drag", _.bind(dragged, this))
                .on("end", _.bind(dragended, this));

            //only for d3node reference
            var self = this;
            this.d3node = this.svg.selectAll('g.node')
                .data(this.visNodes)
                .enter().append('g')
                .attr('class', 'nodes')
                .attr('transform', 'translate(' + this.width / 2 + ', ' + this.height * 0.4 + ')')
                .call(this.drag)
                .on('click', function(d) {
                    console.log('CLICKED');
                    self.selectedNode = d;
                })
                .on('contextmenu', _.bind(excol, this));

            this.svg.on('click', _.bind(clickCanvas, this));

            var circles = this.d3node.append('circle')
                .attr('r', 50)
                .attr('fill', 'white');


            var images = this.d3node.append('g:image')
                .attr('xlink:href', function(d) {
                    return d.picture;
                })
                .attr("class", "img-circle")
                .attr("height", 100)
                .attr("width", 100);

            var node_labels = this.d3node.append("text")
                .attr("class", "node-label")
                .attr("fill", 'black')
                .text(function(d) {
                    return d.name;
                });


        },

        drawEdges: function() {
            d3.selectAll('.edges').remove();

            this.d3edge = this.svg.selectAll('g.edges')
                .data(this.visEdges)
                .enter().append('g')
                .attr('class', 'edges')
                .attr('transform', 'translate(' + this.width / 2 + ', ' + this.height * 0.4 + ')');

            var lines = this.d3edge.append('line')
                .attr('stroke', 'black');
        },

        ticked: function() {
            console.log('tick');
            this.d3edge.selectAll('line')
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

            this.d3node.selectAll('circle')
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });

            this.d3node.selectAll('image')
                .attr("x", function(d) {
                    return d.x - 50;
                })
                .attr("y", function(d) {
                    return d.y - 50;
                });

            this.d3node.selectAll('text')
                .attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y + 65;
                });
        },

        render: function() {
            this.svg = d3.select(this.$el[0]).append('svg')
                .attr('width', '100%').attr('height', '100%');
            // this.svg.call(d3.zoom().on('zoom', ))
        }

    });

    return Canvas;

});
