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

        processTagArrays: function(info) {
            var colors = ['blue', 'green', 'red'];
            var s = '';
            var i = 0;
            for (var attr in info) {
                var arr = info[attr];

                s += '<div class="rib-group">';
                var col = colors[i % colors.length];
                if (attr == 'Awards') {
                    col = 'gold';
                    --i;
                }

                for (var tag in arr) {
                    s += '<div class="rib-wrap ribbon-wrapper small-' + col + '"><span>' + arr[tag] + '</span></div>';
                }
                s += '</div>';

                ++i;

            }
            return s;
        },

        loadInfo: function(node) {
            var $d = $('div .datastuff');
            $d.empty();
            var info = node.info;
            $d.append('<center><img src="' + info.dpic + '" class="img-circle"></center>');
            $d.append('<h1>' + info.title + '</h1>');


            var desc_body = '<div class="main-desc-body">';
            desc_body += '<h3>' + info.desc + '</h3>';

            if (info.tags) {
                desc_body += '<div class="info-tags">';
                desc_body += this.processTagArrays(info.tags);
                desc_body += '</div>';
            }

            if (info.links) {
                desc_body += '<div class="ext-links">';
                for (var src in info.links) {
                    if (src == 'github') {
                        desc_body += '<a class="btn btn-lg btn-social-icon btn-github" href ="' + info.links[src] + '" target="_blank"> <span class="fa fa-github"> </span> </a>';
                    } else if (src == 'resume') {
                        desc_body += '<a class="btn btn-lg" href ="' + info.links[src] + '" target="_blank"> <span class="fa fa-file"> </span> </a>';
                    }
                }
                desc_body += '</div>';
            }


            desc_body += '</div>';
            $d.append(desc_body);

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
