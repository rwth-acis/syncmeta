define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/BooleanAttribute',
    'attribute_widget/IntegerAttribute',
    'attribute_widget/FileAttribute',
    'attribute_widget/SingleSelectionAttribute',
    'attribute_widget/SingleValueAttribute',
    'text!templates/attribute_widget/node.html'
],/** @lends Node */function($,jsPlumb,_,AbstractNode,BooleanAttribute,IntegerAttribute,FileAttribute,SingleSelectionAttribute,SingleValueAttribute,nodeHtml) {

    //noinspection JSUnusedLocalSymbols
    /**
     * makeNode
     * @class attribute_widget.makeNode
     * @memberof attribute_widget
     * @constructor
     * @param type Type of node
     * @param shapeType
     * @param customShape
     * @param customAnchors
     * @param color
     * @param attributes
     * @returns {Node}
     */
    function makeNode(type,shapeType,customShape,customAnchors,color,attributes){

        Node.prototype = new AbstractNode();
        Node.prototype.constructor = Node;
        /**
         * Node
         * @class attribute_widget.Node
         * @extends attribute_widget.AbstractNode
         * @constructor
         * @param {string} id Entity identifier of node
         * @param {number} left x-coordinate of node position
         * @param {number} top y-coordinate of node position
         * @param {number} width Width of node
         * @param {number} height Height of node
         */
        function Node(id,left,top,width,height){
            var that = this;

            AbstractNode.call(this,id,type,left,top,width,height);

            /**
             * jQuery object of node template
             * @type {jQuery}
             * @private
             */
            var $template = $(_.template(nodeHtml,{type: type}));

            /**
             * jQuery object of DOM node representing the node
             * @type {jQuery}
             * @private
             */
            var _$node = AbstractNode.prototype.get$node.call(this).append($template);



            var init = function(){
                var attribute, attributeId, attrObj = {};

                for(attributeId in attributes){
                    if(attributes.hasOwnProperty(attributeId)){
                        attribute = attributes[attributeId];
                        if(attribute.hasOwnProperty('visibility') && attribute.visibility === 'hide')
                            continue;
                        switch(attribute.value){
                            case "boolean":
                                attrObj[attributeId] = new BooleanAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                break;
                            case "string":
                                attrObj[attributeId] = new SingleValueAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                //TODO: Add option to set identifier attribute in metamodel
                                if(attribute.key.toLowerCase() === 'title' || attribute.key.toLowerCase() === "name"){
                                    that.setLabel(attrObj[attributeId]);
                                }
                                break;
                            case "integer":
                                attrObj[attributeId] = new IntegerAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                break;
                            case "file":
                                attrObj[attributeId] = new FileAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                break;
                            default:
                                if(attribute.options){
                                    attrObj[attributeId] = new SingleSelectionAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that,attribute.options);
                                }
                        }
                    }
                }
                that.setAttributes(attrObj);

                //_$node.find(".label").append(that.getLabel().get$node());

                var $attributeNode = _$node.find(".attributes");
                for(var attributeKey in attrObj){
                    if(attrObj.hasOwnProperty(attributeKey)){
                        $attributeNode.append(attrObj[attributeKey].get$node());
                    }
                }
            };

            init();

        }
        Node.prototype.applyAttributeRenaming = function(renamingAttributes){
            var renAttr, $attr, attributes = this.getAttributes();
            for(var attrKey in attributes){
                if(attributes.hasOwnProperty(attrKey)){
                    renAttr = renamingAttributes[attrKey];
                    $attr = attributes[attrKey].get$node();
                    if(renAttr){
                        if(renAttr.visibility === 'hide'){
                            $attr.hide();
                        }
                        else {
                            $attr.find('.name').text(renAttr.key);
                            if($attr.is(':hidden')){
                                $attr.show();
                            }
                        }
                    }
                    else{
                        $attr.hide();
                    }
                }
            }
        };

        Node.getType = function(){
            return type;
        };
        Node.getAttributes = function(){
            return attributes;
        };
        return Node;
    }

    return makeNode;

});