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
                return this.expandNode(node.id);
            } else {

            }

        },

        expandNode: function(id) {
            var node = this.get(id);
            node.set({expanded: true});
            var edgesToAdd = this.edges.where({sourceId: id});

            var nodesToAdd = this.filter(function(n){
            	var inNew = false;
            	_.each(edgesToAdd, function(edge){
            		if (n.attributes.id === edge.attributes.targetId){
            			inNew = true;
            		}
            	});
            	return inNew;
            });

            return {
            	newNodes: nodesToAdd,
            	newEdges: edgesToAdd
            };
        }

    });
});
