define(['backbone', 'underscore', 'jquery'], function(backbone, _, $) {

    var Panel = Backbone.View.extend({
    	initialize: function(options) {
    		_.extend(this, options);
    		this.listenTo(this.dispatch, 'openInfo', this.handleNodeClick);
    	},

    	handleNodeClick: function(node){
    		console.log('In handle click for dispatch');
    		console.log(node);
    	}
    });

    return Panel;
});
