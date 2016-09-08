require.config({
    paths: {
        "jquery": "bower_lib/jquery/dist/jquery",
        "underscore": "bower_lib/underscore/underscore",
        "backbone": "bower_lib/backbone/backbone",
        "d3": "bower_lib/d3/d3",
        "text": "bower_lib/text/text"
    }
});


require(['views/index', 'data/node', 'data/edge',
        'data/edges', 'data/nodes', 'jquery'
    ],
    function(Index, Node, Edge, AllEdges, AllNodes, $) {

        var nodeData = 'scripts/data/nodes.json';
        var edgeData = 'scripts/data/edges.json';

        var Nodes = new AllNodes({
            url: nodeData
        });

        var Edges = new AllEdges({
            url: edgeData
        });

        var renderIndex = function() {
            var index = new Index(Nodes, Edges);
            index.render();
            $('body').append(index.$el);
        }

        Nodes.fetch({
            success: function() {
                Edges.fetch({
                    success: function() {
                        renderIndex();
                    }
                });
            }
        });




    });
