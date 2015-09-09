define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/BooleanAttribute',
    'canvas_widget/IntegerAttribute',
    'canvas_widget/FileAttribute',
    'canvas_widget/SingleValueAttribute',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/AbstractEdge'
],/** @lends makeEdge */function(require,$,jsPlumb,_,BooleanAttribute,IntegerAttribute,FileAttribute,SingleValueAttribute,SingleSelectionAttribute,AbstractEdge) {

    var arrows = function(color){
        return {
            //"bidirassociation": [], //No overlays for bi-dir-association
            "unidirassociation": ["Arrow", {
                width:20,
                length:30,
                location:1,
                foldback: 0.1,
                paintStyle: {
                    fillStyle: "#ffffff",
                    outlineWidth: 2,
                    outlineColor: color
                }
            }],
            "generalisation": ["Arrow", {
                width:20,
                length:30,
                location:1,
                foldback: 1,
                paintStyle: {
                    fillStyle: "#ffffff",
                    outlineWidth: 2,
                    outlineColor: color
                }
            }],
            "diamond": ["Arrow", {
                width:20,
                length:20,
                location:1,
                foldback: 2,
                paintStyle: {
                    fillStyle: "#ffffff",
                    outlineWidth: 2,
                    outlineColor: color
                }
            }]
        };
    };

    var shapes = {
        'straight': ["Straight", {gap: 0}],
        'curved': ["Bezier", {gap: 0}],
        'segmented': ["Flowchart", {gap: 0}]
    };

    var $colorTestElement = $('<div></div>');

    /**
     * makeEdge
     * @class canvas_widget.makeEdge
     * @memberof canvas_widget
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
        var shape = shapes.hasOwnProperty(shapeType) ? shapes[shapeType] : _.values(shapes)[0];
        color = color ? $colorTestElement.css('color','#aaaaaa').css('color',color).css('color') : '#aaaaaa';

        Edge.prototype = new AbstractEdge();
        Edge.prototype.constructor = Edge;
        /**
         * Edge
         * @class canvas_widget.Edge
         * @extends canvas_widget.AbstractEdge
         * @constructor
         * @param {string} id Entity identifier of edge
         * @param {canvas_widget.AbstractNode} source Source node
         * @param {canvas_widget.AbstractNode} target Target node
         */
        function Edge(id,source,target){
            var that = this;

            AbstractEdge.call(this,id,type,source,target,overlayRotate);

            var overlays = [];

            var init = function(){
                var attribute, attributeId, attrObj;

                var makeOverlayFunction = function(text){
                    return function() {
                        return $("<div></div>").append($("<div></div>").addClass("edge_label fixed").css('color',color).text(text));
                    };
                };

                var makeAttributeOverlayFunction = function(attributeId){
                    return function() {
                        return $("<div></div>").append($("<div></div>").addClass("edge_label").append(attrObj[attributeId].get$node()));
                    };
                };

                if(arrows().hasOwnProperty(arrowType)){
                    overlays.push(arrows(color)[arrowType]);
                }

                if(overlay){
                    switch(overlayPosition){
                        case "top":
                            overlays.push(["Custom", {
                                create:makeOverlayFunction(overlay),
                                location:0.9,
                                id:"label"
                            }]);
                            break;
                        case "bottom":
                            overlays.push(["Custom", {
                                create:makeOverlayFunction(overlay),
                                location:0.1,
                                id:"label"
                            }]);
                            break;
                        default:
                        case "center":
                            overlays.push(["Custom", {
                                create:makeOverlayFunction(overlay),
                                location:0.5,
                                id:"label"
                            }]);
                            break;
                    }
                }

                attrObj = {};
                for(attributeId in attributes){
                    if(attributes.hasOwnProperty(attributeId)){
                        attribute = attributes[attributeId];
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

                        switch(attribute.position){
                            case "top":
                                overlays.push(["Custom", {
                                    create:makeAttributeOverlayFunction(attributeId),
                                    location:1,
                                    id:"label "+attributeId
                                }]);
                                break;
                            case "center":
                                overlays.push(["Custom", {
                                    create:makeAttributeOverlayFunction(attributeId),
                                    location:0.5,
                                    id:"label "+attributeId
                                }]);
                                break;
                            case "bottom":
                                overlays.push(["Custom", {
                                    create:makeAttributeOverlayFunction(attributeId),
                                    location:0,
                                    id:"label "+attributeId
                                }]);
                                break;
                        }
                    }
                }
                that.setAttributes(attrObj);

                overlays.push(["Custom", {
                    create:function() {
                        that.get$overlay().hide().find('.type').addClass(shapeType);
                        return that.get$overlay();
                    },
                    location:0.5,
                    id:"label"
                }]);

                if(overlay){
                    that.get$overlay().find("input[name='Label']").css('visibility','hidden');
                }
            };

            /**
             * Connect source and target node and draw the edge on canvas
             */
            this.connect = function(){
                var source = this.getSource();
                var target = this.getTarget();
                var connectOptions = {
                    source: source.get$node(),
                    target: target.get$node(),
                    paintStyle:{
                        strokeStyle: color,
                        lineWidth: 2
                    },
                    endpoint: "Blank",
                    anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
                    connector: shape,
                    overlays: overlays,
                    cssClass: this.getEntityId()
                };

                if(source === target){
                    connectOptions.anchors = ["TopCenter","LeftMiddle"];
                }

                source.addOutgoingEdge(this);
                target.addIngoingEdge(this);

                this.setJsPlumbConnection(jsPlumb.connect(connectOptions));
                this.repaintOverlays();
                _.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});
            };

            /**
             * Get JSON representation of the edge
             * @returns {object}
             */
            this.toJSON = function(){
                var json = AbstractEdge.prototype.toJSON.call(this);
                json.type = type;
                return json;
            };

            init();
        }
        return Edge;
    }

    return makeEdge;

});