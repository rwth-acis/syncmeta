define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/EntityManager',
    'canvas_widget/guidance_modeling/GhostEdge',
    'text!templates/guidance_modeling/ghost_edge.html',
    'bootstrap'
],function($, jsPlumb, _, EntityManager, GhostEdge, ghostEdgeHtml) {
    function GhostEdgeGuidance(canvas, node1, node2){
        var _button = $(ghostEdgeHtml);
        var _dropdown = _button.find(".bs-dropdown-toggle");
        _dropdown.detach();
        var _dropdownList = _button.find(".edge-list");
        _dropdownList.detach();
        var _canvas = canvas;
        var that = this;
        var _edges = [];
        var _node1 = node1;
        var _node2 = node2;
        var _currentEdge = null;

        _node1.addGhostEdge(this);
        _node2.addGhostEdge(this);

        _button.hover(function(){
            $(this).css({"opacity": 1});
        },function(){
            $(this).css({"opacity": 0.4});
        });
        this.show = function(){
            _currentEdge.connect(_button);
        };

        this.addEdge = function(edgeFunction, source, target){
            var edge = new GhostEdge(_canvas, edgeFunction, source, target);
            _edges.push(edge);
            var listItem = $("<li><a href='javascript:;'></a></li>");
            listItem.click(function(){
                that.remove();
                that.setCurrentEdge(edge);
                that.show();
            });
            listItem.find("a").text(edge.getLabel());
            _dropdownList.append(listItem);

            if(_edges.length == 1){
                this.setCurrentEdge(edge);
            }
            if(_edges.length == 2){
                _button.append(_dropdown);
                _button.append(_dropdownList);
            }
        };

        this.remove = function(){
            _button.detach();
            if(_currentEdge)
                _currentEdge.remove();
        };

        this.getNode1 = function(){
            return _node1;
        };

        this.getNode2 = function(){
            return _node2;
        };

        this.setCurrentEdge = function(edge){
            if(_currentEdge)
                _currentEdge.remove();
            _currentEdge = edge;
            _button.find(".label").text(_currentEdge.getLabel());

            var createEdgeButton = _button.find(".create-edge-button");
            createEdgeButton.off("click");
            createEdgeButton.click(function(event){
                event.stopPropagation();
                that.remove();
                //if(EntityManager.getViewId() !== null && EntityManager.getLayer() === CONFIG.LAYER.MODEL){
                //    _canvas.createEdge(_currentEdge.getEdgeFunction().VIEWTYPE, _currentEdge.getSource().getEntityId(), _currentEdge.getTarget().getEntityId());
                //}
                //else {
                _canvas.createEdge(_currentEdge.getEdgeFunction().getType(), _currentEdge.getSource().getEntityId(), _currentEdge.getTarget().getEntityId());
                //}
                //guidanceFollowed does not exists, seems to be unnecessary and obsolete
                //_canvas.guidanceFollowed();
            });
        };
    }

    return GhostEdgeGuidance;

});