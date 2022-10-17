

    function makeViewNode(type, $shape, anchors, attributes, nodeType, conditions, conj) {

        ViewNode.prototype.constructor = ViewNode;
        function ViewNode(id, left, top, width, height, zIndex) {
            var viewNode = new nodeType(id, left, top, width, height, zIndex);

            viewNode.set$shape($shape);
            viewNode.setAnchorOptions(anchors);
            viewNode.setCurrentViewType(type);

            return viewNode;

        }

        ViewNode.getConditions = function(){
          return conditions;
        };

        ViewNode.getConditionConj = function(){
            return conj;
        };

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

    export default makeViewNode;
