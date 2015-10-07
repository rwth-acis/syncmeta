define([],
    function () {

    function makeViewNode(type, $shape, anchors, attributes, nodeType) {

        ViewNode.prototype.constructor = ViewNode;
        function ViewNode(id, left, top, width, height, zIndex) {
            var viewNode = new nodeType(id, left, top, width, height, zIndex);

            viewNode.set$shape($shape);
            viewNode.setAnchorOptions(anchors);
            viewNode.setCurrentViewType(type);
            //TODO attributes here

            return viewNode;

        }

        ViewNode.get$shape = function(){
            return $shape;
        };

        ViewNode.getAnchors = function(){
            return anchors;
        };

        ViewNode.getTargetNodeType = function(){
            return nodeType;
        };
        return ViewNode;
    }

    return makeViewNode;
});