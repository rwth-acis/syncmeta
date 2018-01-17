define([],
    function () {

        function makeViewNode(type, attributes, nodeType) {

            ViewNode.prototype.constructor = ViewNode;
            function ViewNode(id, left, top, width, height, zIndex) {
                var viewNode = new nodeType(id, left, top, width, height, zIndex);
                viewNode.applyAttributeRenaming(attributes);
                return viewNode;

            }

            ViewNode.getTargetNodeType = function(){
                return nodeType;
            };
            ViewNode.getAttributes = function(){
                return attributes;
            };
            return ViewNode;
        }

        return makeViewNode;
    });