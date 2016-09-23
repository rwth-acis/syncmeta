define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/BooleanAttribute',
    'attribute_widget/IntegerAttribute',
    'attribute_widget/FileAttribute',
    'attribute_widget/SingleSelectionAttribute',
    'attribute_widget/SingleValueAttribute',
    'attribute_widget/AbstractEdge'
],/** @lends Edge */function($,jsPlumb,_,BooleanAttribute,IntegerAttribute,FileAttribute,SingleSelectionAttribute,SingleValueAttribute,AbstractEdge) {

    //noinspection JSUnusedLocalSymbols
    /**
     * makeEdge
     * @class attribute_widget.makeEdge
     * @memberof attribute_widget
     * @constructor
     * @param {string} type Type of edge
     * @param arrowType
     * @param shapeType
     * @param color
     * @param overlay
     * @param overlayPosition
     * @param overlayRotate
     * @param attributes
     * @returns {Edge}
     */
    function makeEdge(type,arrowType,shapeType,color,overlay,overlayPosition,overlayRotate,attributes){
        Edge.prototype = new AbstractEdge();
        Edge.prototype.constructor = Edge;
        /**
         * Edge
         * @class attribute_widget.Edge
         * @extends attribute_widget.AbstractEdge
         * @param {string} id Entity identifier of edge
         * @param {attribute_widget.AbstractNode} source Source node
         * @param {attribute_widget.AbstractNode} target Target node
         * @constructor
         */
        function Edge(id,source,target){
            var that = this;

            AbstractEdge.call(this,type,id,source,target);

            /**
             * jQuery object of DOM node representing the node
             * @type {jQuery}
             * @private
             */
            var _$node = AbstractEdge.prototype.get$node.call(this);

            var init = function(){
                var attribute, attributeId, attrObj = {};
                for(attributeId in attributes){
                    if(attributes.hasOwnProperty(attributeId)){
                        attribute = attributes[attributeId];
                        if(attribute.hasOwnProperty('position') && attribute.position === 'hide')
                            continue;
                        switch(attribute.value){
                            case "boolean":
                                attrObj[attributeId] = new BooleanAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                break;
                            case "string":
                                attrObj[attributeId] = new SingleValueAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
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

            this.registerYType = function(){
                AbstractEdge.prototype.registerYType.call(this);

                var registerValue = function(ymap, value){
                   try {
                        ymap.get(value.getEntityId()).then(function(ytext) {
                            value.registerYType(ytext);
                        })
                    }
                    catch (e) {
                        //Try it again after a timeout
                        window.syncmetaLog.firstAttemptFail[value.getEntityId()] = 0;
                        setTimeout(function() {
                            try {
                                ymap.get(value.getEntityId()).then(function(ytext) {
                                    value.registerYType(ytext);
                                })
                            }
                            catch (e) {
                              window.syncmetaLog.errors[value.getEntityId()] = 0 ;
                              console.error('ATTRIBUTE: Failed to retrieve ytext property with id '+ value.getEntityId() +' from ymap with id ' + that.getEntityId());
                            }
                        }, 500);
                    }
                };
                y.share.edges.get(that.getEntityId()).then(function(ymap){
                    for(var attributeKey in attributes){
                        if(attributes.hasOwnProperty(attributeKey)){
                            var attribute = attributes[attributeKey];
                            if(attribute.value === 'string')
                                registerValue(ymap, that.getAttribute(attributeKey).getValue());
                        }
                    }
                });

            };

            init();

        }

        Edge.prototype.applyAttributeRenaming = function(renamingAttributes) {
            var renAttr, $attr, attributes = this.getAttributes();
            for(var attrKey in attributes){
                if(attributes.hasOwnProperty(attrKey)){
                    renAttr = renamingAttributes[attrKey];
                    $attr = attributes[attrKey].get$node();
                    if(renAttr){
                        if(renAttr.position === 'hide'){
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

        Edge.getType = function(){
            return type;
        };
        Edge.getAttributes = function(){
            return attributes;
        };
        return Edge;
    }

    return makeEdge;

});