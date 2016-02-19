define([
    'jqueryui',
    'lodash',
    'canvas_widget/SingleValueAttribute',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/IntegerAttribute',
    'canvas_widget/BooleanAttribute',
    'canvas_widget/FileAttribute',
    'text!templates/canvas_widget/abstract_node.html',
    'text!templates/guidance_modeling/set_property_guidance.html',
    'bootstrap'
],function($,_,SingleValueAttribute,SingleSelectionAttribute,IntegerAttribute,BooleanAttribute,FileAttribute,abstractNodeHtml, setPropertyGuidanceHtml) {
    function SetPropertyGuidance(id, label, entity, propertyName, canvas){
        var _id = id;
        var _label = label;
        var _entityId = entity.getEntityId();
        var _propertyName = propertyName;
        var _canvas = canvas;
        var _entityAttribute = null;
        var _$node = $(_.template(setPropertyGuidanceHtml, {text: label, icon:'edit'}));
        var _propertyInput;

        var entityAttributes = entity.getAttributes();

        for(var attribId in entityAttributes){
            var attrib = entityAttributes[attribId];
            if(attrib.getEntityId() == entity.getEntityId()+"["+propertyName.toLowerCase()+"]")
                _entityAttribute = attrib;
        }

        if(_entityAttribute instanceof SingleValueAttribute){
            _propertyInput = new SingleValueAttribute(entity.getEntityId()+"["+propertyName.toLowerCase()+"]",propertyName,entity);
            _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());

            _entityAttribute.get$node().find(".val").bind("input", function(){
                _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            });

            _propertyInput.get$node().find(".val").bind("input", function(){
                _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
            });

            _$node.find(".property-input").append(_propertyInput.get$node().find(".val").prop("disabled", false));
        }
        else if(_entityAttribute instanceof SingleSelectionAttribute){
            var options = _entityAttribute.getOptions();
            _propertyInput = new SingleSelectionAttribute(entity.getEntityId()+"["+propertyName.toLowerCase()+"]",propertyName,entity, options, true);
            _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            _propertyInput.getValue().get$node().bind("change", function(ev){
                _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
            });

            _$node.find(".property-input").append(_propertyInput.getValue().get$node());
            _$node.find(".property-input").click(function(ev){
                ev.stopPropagation();
            });
        }
        else if(_entityAttribute instanceof IntegerAttribute){
            _propertyInput = new IntegerAttribute(entity.getEntityId()+"["+propertyName.toLowerCase()+"]",propertyName,entity, true);
            _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            
            _entityAttribute.get$node().find(".val").bind("change", function(){
                _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            });

            _propertyInput.get$node().find(".val").bind("change", function(ev){
                _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
            });

            _$node.find(".property-input").append(_propertyInput.get$node().find(".val").prop("disabled", false));
            _$node.find(".property-input").click(function(ev){
                ev.stopPropagation();
            });
        }
        else if(_entityAttribute instanceof BooleanAttribute){
            _propertyInput = new BooleanAttribute(entity.getEntityId()+"["+propertyName.toLowerCase()+"]",propertyName,entity, true);
            _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            
            _entityAttribute.get$node().find(".val").bind("change", function(){
                _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            });

            _propertyInput.get$node().find(".val").bind("change", function(ev){
                _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
            });

            _$node.find(".property-input").append(_propertyInput.get$node().find(".val"));
            _$node.find(".property-input").click(function(ev){
                ev.stopPropagation();
            });
        }
        else if(_entityAttribute instanceof FileAttribute){
            _propertyInput = new FileAttribute(entity.getEntityId()+"["+propertyName.toLowerCase()+"]",propertyName,entity, true);
            //_propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            
            // _entityAttribute.get$node().find(".val").bind("change", function(){
            //     _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
            // });

            // _propertyInput.get$node().find(".val").bind("change", function(ev){
            //     _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
            // });

            _$node.find(".property-input").append(_propertyInput.getValue().get$node());
            _$node.find(".property-input").click(function(ev){
                ev.stopPropagation();
            });
        }

        _propertyInput.get$node().find(".val").keypress(function(ev){
            if(ev.which == 13){
                _$node.find(".bs-dropdown-toggle").dropdown('toggle');
            }
        });

        //guidanceFollowed does not exists, seems to be unnecessary and obsolete
        /*_$node.on('show.bs.dropdown', function () {
         _canvas.guidanceFollowed();
        });*/


        _$node.hover(function(){
            if(_entityId)
                _canvas.highlightEntity(_entityId);
        },
        function(){
            if(_entityId)
                _canvas.unhighlightEntity(_entityId);
        });

        this.get$node = function(){
            return _$node;
        };

    }

    return SetPropertyGuidance;

});