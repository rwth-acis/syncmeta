define(['lodash', 'Util', 'viewcanvas_widget/ViewTypesUtil', 'viewcanvas_widget/EntityManager'],
    function(_, Util,ViewTypesUtil,EntityManager) {
        function CVG(canvas, json){
            var _canvas = canvas;
            var _json = json;

            ViewTypesUtil.GetCurrentBaseModel().then(function(baseModel){
                var origin;
               for(var nodeKey in _json.nodes){
                   if(_json.nodes.hasOwnProperty(nodeKey) && baseModel.nodes.hasOwnProperty(_json.nodes[nodeKey])){
                       origin = _json.nodes[nodeKey];
                       var node = baseModel.nodes[origin];
                       _canvas.createNode(node.type, node.left, node.top, node.width, node.height, node.zIndex, node, nodeKey, CONFIG.WIDGET.NAME.VIEWCANVAS, $('#lblCurrentView').text());
                       var viewTypeNode  = EntityManager.findNode(nodeKey);
                       if(viewTypeNode)
                           viewTypeNode.setOrigin(origin);

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
                        var viewTypeEdge  = EntityManager.findEdge(edgeKey);
                        if(viewTypeEdge && origin)
                            viewTypeEdge.setOrigin(origin);
                    }
                }
            });
        }
        return CVG;

    });
