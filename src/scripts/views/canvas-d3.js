define(['backbone', 'underscore', 'jquery', 'd3'], function(backbone, _, $, d3) {
    var Canvas = Backbone.View.extend({
        render: function() {
            var x = d3.scaleLinear()
                .range([0, 90])
                .domain([0, 9]);

            console.log(x(1));
        }
    });

    return Canvas;
});
