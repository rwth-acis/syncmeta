define([
    'iwcotw',
    'jqueryui',
    'lodash',
    'operations/non_ot/ObjectGuidanceFollowedOperation',
    'canvas_widget/SingleValueAttribute',
    'text!templates/canvas_widget/abstract_node.html',
    'text!templates/guidance_modeling/set_property_guidance.html',
    'bootstrap'
],/** @lends ContextNode */function(IWCOTW, $,_,ObjectGuidanceFollowedOperation,SingleValueAttribute,abstractNodeHtml, setPropertyGuidanceHtml) {
    function SetPropertyGuidance(id, label, entity, propertyName, canvas){
        var _iwc = IWCOTW.getInstance(CONFIG.WIDGET.NAME.MAIN);
        var _id = id;
        var _label = label;
        var _entityId = entity.getEntityId();
        var _propertyName = propertyName;
        var _canvas = canvas;
        var _entityAttribute = null;
        var _$node = $(_.template(setPropertyGuidanceHtml, {text: label, icon:'edit'}));
        _propertyInput = new SingleValueAttribute(entity.getEntityId()+"["+propertyName.toLowerCase()+"]",propertyName,entity)

        var entityAttributes = entity.getAttributes();
        for(var attribId in entityAttributes){
            var attrib = entityAttributes[attribId];
            if(attrib.getEntityId() == entity.getEntityId()+"["+propertyName.toLowerCase()+"]")
                _entityAttribute = attrib;
        }

        _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());

        _entityAttribute.get$node().find(".val").bind("input", function(){;
            _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
        });

        _propertyInput.get$node().find(".val").bind("input", function(ev){
            _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
        });
        _propertyInput.get$node().find(".val").keypress(function(ev){
            if(ev.which == 13){
                _$node.find(".bs-dropdown-toggle").dropdown('toggle');
            }
        });

        _$node.on('show.bs.dropdown', function () {
          _canvas.guidanceFollowed();
        });

        _$node.find(".property-input").append(_propertyInput.get$node().find(".val").prop("disabled", false));

        _$node.hover(function(){
            if(_entityId)
                _canvas.highlightNode(_entityId);
        },
        function(){
            if(_entityId)
                _canvas.unhighlightNode(_entityId);
        });

        this.get$node = function(){
            return _$node;
        };

    };

    return SetPropertyGuidance;

});