define(['backbone', 'underscore', 'jquery', 'd3', 
	'text!templates/canvas.html'], function(backbone, _, $, d3, canvasTemplate) {

	var Canvas = Backbone.View.extend({

		initialize: function(data) {
			_.extend(this, data);
		},
    	id: 'canvas',
    	class: 'container main-canvas',
		template: _.template(canvasTemplate),

		render: function() {
			this.$el.append(this.template(this));
			//var canvas = d3.select(this.el).append('svg').attr('width', '100%').attr('height', '100%');
		}
	});

	return Canvas;

});
 