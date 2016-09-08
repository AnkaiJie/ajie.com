define(['backbone', 'underscore', 'data/node'], function(Backbone, _, Node) {
	return Backbone.Collection.extend({
		model: Node,
		url: function() {
			return this.url;
		},
		initialize: function(config){
			_.extend(this, config);
		}
	});
});
