define(['backbone', 'underscore', 'data/node'], function(Backbone, _, Node) {
	return Backbone.Collection.extend({
		model: Node,
		url: function() {
			return this.url;
		},
		initialize: function(config) {
			_.extend(this, config);
		},


		recurseCollapse: function(nodeId, visibleNodes, accNodes, accEdges) {
			var targEdges = this.edges.where({source: nodeId});
			var edgeRecurse = function(edge){
				var attrs = edge.attributes;
				var targId = attrs.target;
				if (visibleNodes.indexOf(targId)!==-1){
					accEdges.push(attrs.id);
					accNodes.push(targId);

					this.recurseCollapse(targId, visibleNodes, accNodes, accEdges);
				}
			};
			_.each(targEdges, _.bind(edgeRecurse, this));
		},

		getNodesCollapsed: function(node, nodeList) {
			var id = node.id;
			var accNodes = [];
			var accEdges = [];
			var nodeIds = _.map(nodeList, function(n){
				return n.id;
			});
			this.recurseCollapse(id, nodeIds, accNodes, accEdges);
			return {
				nodesToRemove: accNodes,
				edgesToRemove: accEdges
			};

		},

		getNodeExpansion: function(nodeAttr) {
			var id = nodeAttr.id;
			var node = this.get(id);
			
			var edgesToAdd = this.edges.where({source: id});

			var nodesToAdd = this.filter(function(n){
				var inNew = false;
				_.each(edgesToAdd, function(edge){
					if (n.attributes.id === edge.attributes.target){
						inNew = true;
					}
				});
				return inNew;
			});

			nodesToAdd = _.map(nodesToAdd, function(n){
				return _.clone(n.attributes);
			});

			edgesToAdd = _.map(edgesToAdd, function(e){
				return _.clone(e.attributes);
			});

			return {
				newNodes: nodesToAdd,
				newEdges: edgesToAdd
			};
		}

	});
});
