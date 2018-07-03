define(['backbone', 'jquery', 'text!templates/instruc.html'], function(backbone, $, instructTemplate) {

    var Instructions = Backbone.View.extend({
        className: 'instruction-box',
        template: _.template(instructTemplate),
        initialize: function(options) {
            _.extend(this, options);
            this.listenTo(this.dispatch, 'firstClick', this.hide);
            this.render();
        },
        hide: function() {
            this.$el.css('visibility', 'hidden');
        },
        render: function() {
            this.$el.html(this.template);
        }

    });
    
    return Instructions;

});
