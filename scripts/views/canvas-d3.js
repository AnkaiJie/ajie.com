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
			var svg = d3.select(this.$el[0]).append('svg').attr('width', '100%').attr('height', '100%');
			var $svg = this.$('svg');
			console.log(svg);

			var rootNode = this.nodes.find(function(n) {
				return n.attributes.root && n.attributes.root === 1;
			});

			this.visNodes.push(_.extend(rootNode, {fx:0, fy:0}));

			var simulation = d3.forceSimulation()
				.force('charge', d3.forceManyBody())
				.force('link', d3.forceLink(this.visEdges))
				.force('center', d3.forceCenter());

			var edges = svg.append('g')
				.selectAll('line')
				.data(this.visEdges)
				.enter()
				.append('line')
				.attr('stroke', 'black');

			var node = svg.append('g')
				.selectAll('circle')
				.data(this.visNodes)
				.enter().append('circle')
				.attr('r', 30);

			simulation
				.nodes(this.visNodes);

			simulation.force('link')
				.links(this.visEdges);

			console.log(simulation);

		}
	});

	return Canvas;

});
