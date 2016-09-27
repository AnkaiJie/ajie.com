define(['backbone', 'underscore', 'jquery', 'd3'], function(backbone, _, $, d3) {
    var nodeCircle = Backbone.View.extend({
    	initialize: function() {
    		this.d3 = d3.select(this.el);
    	},
        render: function() {
        	return this;
        }

    });

    return nodeCircle;
});
