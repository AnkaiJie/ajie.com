define(['backbone', 'underscore', 'jquery',
    'text!templates/infoPanel.html'
], function(backbone, _, $, infoTemplate) {

    var Panel = Backbone.View.extend({

        template: _.template(infoTemplate),
        className: 'info-section',

        initialize: function(options) {
            _.extend(this, options);
            this.listenTo(this.dispatch, 'toggleInfo', this.toggleVis);
            this.listenTo(this.dispatch, 'test', this.test);
            this.render();
        },

        toggleVis: function(node) {
            var $el = this.$el;
            if (node && node.selected) {
                this.loadInfo(node);
                $el.css('width', '600px');
            } else {
                $el.css('width', '0px');
            }
        },

        loadInfo: function(node) {
            var $d = $('div .datastuff');
            $d.empty();
            var info = node.info;
            $d.append('<img src="' + info.dpic + '" style="width:304px; height:228px;">')
            $d.append('<h1>' + info.title + '</h1>')
            $d.append('<h3>' + info.desc + '</h3>')
        },

        test: function() {
            console.log('in test');
        },

        render: function() {
            this.$el.html(this.template);
        }
    });

    return Panel;
});
