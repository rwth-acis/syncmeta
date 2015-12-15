define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/AbstractCanvasTool',
    'canvas_widget/EntityManager'
],/** @lends NodeTool */function($,jsPlumb,AbstractCanvasTool,EntityManager) {

    NodeTool.prototype = new AbstractCanvasTool();
    NodeTool.prototype.constructor = NodeTool;
    /**
     * NodeTool
     * @class canvas_widget.NodeTool
     * @extends canvas_widget.AbstractCanvasTool
     * @memberof canvas_widget
     * @constructor
     */
    function NodeTool(name,className,description,defaultWidth,defaultHeight){
        AbstractCanvasTool.call(
            this,
            name,
            className||"tool-node",
            description||"Add a node"
        );

        var _defaultWidth = defaultWidth||100,
            _defaultHeight = defaultHeight||50;

        /**
         * Mount the tool on canvas
         */
        this.mount = function(){
            var $canvas = this.getCanvas().get$canvas();
            var that = this;
            AbstractCanvasTool.prototype.mount.call(this);

            //Enable Node Addition
            $canvas.on("mouseup.nodeadd",function(ev){
                var offsetClick,
                    offsetCanvas;

                if (ev.which != 1) return;
                offsetClick = $(ev.target).offset();
                offsetCanvas = $(this).offset();
                that.getCanvas().createNode(that.getName(),ev.originalEvent.offsetX+offsetClick.left-offsetCanvas.left,ev.originalEvent.offsetY+offsetClick.top-offsetCanvas.top,_defaultWidth,_defaultHeight);
                /*if(this == ev.target){
                    that.canvas.callListeners(CONFIG.CANVAS.LISTENERS.NODEADD,that.name,ev.originalEvent.offsetX,ev.originalEvent.offsetY,_defaultWidth,_defaultHeight);
                }*/
                that.getCanvas().resetTool();
            });

            $canvas.bind("contextmenu", function(ev){
                if(ev.target == this){
                    ev.preventDefault();
                    that.getCanvas().resetTool();
                    return false;
                }
                return true;
            });

            $canvas.find(".node")
                .bind("contextmenu", function(ev){
                ev.preventDefault();
                that.getCanvas().resetTool();
                that.getCanvas().select(EntityManager.findNode($(this).attr("id")));
                return false;
            });
        };

        /**
         * Unmount the tool from canvas
         */
        this.unmount = function(){
            var $canvas = this.getCanvas().get$canvas();
            AbstractCanvasTool.prototype.unmount.call(this);

            //Disable Node Addition
            $canvas.off("mouseup.nodeadd");

            $canvas.unbind("contextmenu");
            $canvas.find(".node").unbind("contextmenu");
        };

    }

    return NodeTool;

});