define(['backbone', 'underscore', 'jquery', 'd3', 'contextMenu'], 
    function(backbone, _, $, d3, contextMenu) {

    var Canvas = Backbone.View.extend({

        initialize: function(data) {
            _.extend(this, data);
            var rootNode = _.clone(this.nodes.find(function(n) {
                return n.attributes.root && n.attributes.root === 1;
            }).attributes);
            rootNode = _.extend(rootNode, { fx: 0, fy: 0 });
            this.visNodes.push(rootNode);
            this.selectedNode = rootNode;
            this.initializeForce();

            this.isMobile = false; //initiate as false
            // device detection
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
                this.isMobile = true;
            }

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
                this.drawEdges();
                this.drawNodes();
                this.simulation
                    .nodes(this.visNodes)
                    .force('link', d3.forceLink().id(function(d){
                       return d.id; 
                    }));
                this.simulation.force('link')
                    .links(this.visEdges)
                    .distance(this.nodeRadius*3.5);
                this.simulation.restart();
            }
        },

        setPhysics: function() {
            this.simulation
                .force('charge', d3.forceManyBody().strength(-1000))
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

            var isNotParent = function() {
                return !this.selectedNode.parent;
            };

            var isNotExpanded = function() {
                return !this.selectedNode.expanded;
            };

            var expand = function(key, options) {
                var f = _.bind(isNotParent, this);
                if (!f()){
                    this.simulation.alpha(1);
                    this.expandNode(this.selectedNode);  
                }
            };

            var collapse = function(key, options) {
                var f = _.bind(isNotExpanded, this);
                if (!f()) {
                    this.collapseNode(this.selectedNode);
                }
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
                reposition: false,
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
                        disabled: _.bind(isNotParent, this),
                        callback: _.bind(expand, this)
                    },
                    'collapse': {
                        name: 'Collapse',
                        icon: 'fa-compress',
                        disabled: _.bind(isNotExpanded, this),
                        callback: _.bind(collapse, this)
                    }
                }
            });

            $.contextMenu.handle.layerClick = function() {
                var $this = $(this),
                root = $this.data('contextMenuRoot');
                root.$menu.trigger('contextmenu:hide');
            };

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
                if (Math.abs(this.ix - d.fx) < 5 && Math.abs(this.iy - d.fy) < 5 && !this.isMobile) {
                    this.selectedNode = d;
                    //fix for d3 chrome dragging issue, which is ok but not always ideal.
                    $(':hover').last().click();
                    this.dispatch.trigger('toggleInfo');
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
                    self.selectedNode = d;
                })
                .on('contextmenu', _.bind(excol, this));

            this.svg.on('click', _.bind(clickCanvas, this));

            var circles = this.d3node.append('circle')
                .attr('r', this.nodeRadius)
                .attr('fill', 'white');


            var images = this.d3node.append('g:image')
                .attr('xlink:href', function(d) {
                    return d.picture;
                })
                .attr("class", "img-circle")
                .attr("height", this.nodeRadius*2)
                .attr("width", this.nodeRadius*2);

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
            var self = this;
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
                    return d.x - self.nodeRadius;
                })
                .attr("y", function(d) {
                    return d.y - self.nodeRadius;
                });

            this.d3node.selectAll('text')
                .attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y + self.nodeRadius + 15;
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
