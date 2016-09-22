define(['backbone', 'underscore', 'data/node'], function(Backbone, _, Node) {
	return Backbone.Collection.extend({
		model: Node,
		url: function() {
			return this.url;
		},
		initialize: function(config) {
			_.extend(this, config);
		},

		excol: function(node, expand) {
			if (expand) {
				var exp = this.expandNode(node.id);
				return exp;
			} else {
				
			}

		},

		expandNode: function(id) {
			var node = this.get(id);
			
			node.set({expanded: true});
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
				return n.attributes;
			});

			edgesToAdd = _.map(edgesToAdd, function(e){
				return e.attributes;
			});

			return {
				newNodes: nodesToAdd,
				newEdges: edgesToAdd
			};
		}

	});
});
