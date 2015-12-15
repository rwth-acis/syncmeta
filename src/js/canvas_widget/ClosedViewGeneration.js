define(['lodash',
        'canvas_widget/ViewTypesUtil'],
    function(_,ViewTypesUtil) {
        function CVG(canvas, json){
            var _canvas = canvas;
            var _json = json;

            ViewTypesUtil.GetCurrentBaseModel().then(function(baseModel){
                var origin;
                for(var nodeKey in _json.nodes){
                    if(_json.nodes.hasOwnProperty(nodeKey) && baseModel.nodes.hasOwnProperty(_json.nodes[nodeKey])){
                        origin = _json.nodes[nodeKey];
                        var node = baseModel.nodes[origin];
                        _canvas.createNode(node.type, node.left, node.top, node.width, node.height, node.zIndex, node, nodeKey);
                    }
                }
                origin = null;
                for(var edgeKey in _json.edges){
                    if(_json.edges.hasOwnProperty(edgeKey)) {
                        var edge = _json.edges[edgeKey];
                        var edgeJson = null;
                        if (_json.edges[edgeKey].hasOwnProperty('origin') && baseModel.edges.hasOwnProperty(_json.edges[edgeKey].origin)) {
                            edgeJson = baseModel.edges[_json.edges[edgeKey].origin];
                            origin = _json.edges[edgeKey].origin;
                        }
                        _canvas.createEdge(edge.type, edge.source, edge.target, edgeJson, edgeKey, $('#lblCurrentView').text());
                    }
                }
            });
        }
        return CVG;

    });
