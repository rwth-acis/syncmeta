define(['lodash', 'Util', 'viewcanvas_widget/ViewTypesUtil'],
    function(_, Util,ViewTypesUtil) {
        function CVG(canvas, json){
            var _canvas = canvas;
            var _json = json;

            ViewTypesUtil.GetCurrentBaseModel().then(function(baseModel){
               for(var nodeKey in _json.nodes){
                   if(_json.nodes.hasOwnProperty(nodeKey) && baseModel.nodes.hasOwnProperty(_json.nodes[nodeKey])){
                       var node = baseModel.nodes[_json.nodes[nodeKey]];
                       _canvas.createNode(node.type, node.left, node.top, node.width, node.height, node.zIndex, node, nodeKey, CONFIG.WIDGET.NAME.VIEWCANVAS);
                   }
               }
                for(var edgeKey in _json.edges){
                    if(_json.edges.hasOwnProperty(edgeKey)){
                        var edge = _json.edges[edgeKey];
                        _canvas.createEdge(edge.type, edge.source, edge.target);
                    }
                }
            });
        }
        return CVG;

    });
