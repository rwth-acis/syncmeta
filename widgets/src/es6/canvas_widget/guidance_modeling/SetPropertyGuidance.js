import "jquery-ui";
import _ from "lodash-es";
import SingleValueAttribute from "../SingleValueAttribute";
import SingleSelectionAttribute from "../SingleSelectionAttribute";
import IntegerAttribute from "../IntegerAttribute";
import BooleanAttribute from "../BooleanAttribute";
import FileAttribute from "../FileAttribute";
import loadHTML from "../../html.template.loader";
const setPropertyGuidanceHtml = await loadHTML(
  "../../../html/templates/guidance_modeling/set_property_guidance.html",
  import.meta.url
);
// import "bootstrap";
function SetPropertyGuidance(id, label, entity, propertyName, canvas) {
  var _id = id;
  var _label = label;
  var _entityId = entity.getEntityId();
  var _propertyName = propertyName;
  var _canvas = canvas;
  var _entityAttribute = null;
  var _$node = $(
    _.template(setPropertyGuidanceHtml)({ text: label, icon: "edit" })
  );
  var _propertyInput;

  var entityAttributes = entity.getAttributes();

  for (var attribId in entityAttributes) {
    var attrib = entityAttributes[attribId];
    if (
      attrib.getEntityId() ==
      entity.getEntityId() + "[" + propertyName.toLowerCase() + "]"
    )
      _entityAttribute = attrib;
  }

  if (_entityAttribute instanceof SingleValueAttribute) {
    _propertyInput = new SingleValueAttribute(
      entity.getEntityId() + "[" + propertyName.toLowerCase() + "]",
      propertyName,
      entity
    );
    // @ts-ignore
    _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
    // @ts-ignore

    if (_entityAttribute.getRootSubjectEntity().constructor.name === "Edge") {
      const edgeMap = y.getMap("edges");
      var ymap = edgeMap.get(entity.getEntityId());
      var ytext = ymap.get(
        entity.getEntityId() + "[" + propertyName.toLowerCase() + "]"
      );
      ytext.bind(_propertyInput.getValue().get$node()[0]);
    } else {
      const nodesMap = y.getMap("nodes");
      var ymap = nodesMap.get(entity.getEntityId());
      var ytext = ymap.get(
        entity.getEntityId() + "[" + propertyName.toLowerCase() + "]"
      );
      ytext.bind(_propertyInput.getValue().get$node()[0]);
    }

    /* _entityAttribute.get$node().find(".val").bind("input", function(){
                 // @ts-ignore
_propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
// @ts-ignore
             });
 
             _propertyInput.get$node().find(".val").bind("input", function(){
                 _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
             });*/

    _$node
      .find(".property-input")
      .append(_propertyInput.get$node().find(".val").prop("disabled", false));
  } else if (_entityAttribute instanceof SingleSelectionAttribute) {
    // @ts-ignore
    var options = _entityAttribute.getOptions();
    _propertyInput = new SingleSelectionAttribute(
      entity.getEntityId() + "[" + propertyName.toLowerCase() + "]",
      propertyName,
      entity,
      options,
      true
    );
    // @ts-ignore
    _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
    // @ts-ignore
    _propertyInput
      .getValue()
      .get$node()
      .bind("change", function (ev) {
        _entityAttribute
          .getValue()
          .setValue(_propertyInput.getValue().getValue());
      });

    _$node.find(".property-input").append(_propertyInput.getValue().get$node());
    _$node.find(".property-input").click(function (ev) {
      ev.stopPropagation();
    });
  } else if (_entityAttribute instanceof IntegerAttribute) {
    _propertyInput = new IntegerAttribute(
      entity.getEntityId() + "[" + propertyName.toLowerCase() + "]",
      propertyName,
      entity,
      true
    );
    // @ts-ignore
    _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
    // @ts-ignore

    _entityAttribute
      // @ts-ignore
      .get$node()
      .find(".val")
      .bind("change", function () {
        _propertyInput
          .getValue()
          .setValue(_entityAttribute.getValue().getValue());
      });

    _propertyInput
      .get$node()
      .find(".val")
      .bind("change", function (ev) {
        _entityAttribute
          .getValue()
          .setValue(_propertyInput.getValue().getValue());
      });

    _$node
      .find(".property-input")
      .append(_propertyInput.get$node().find(".val").prop("disabled", false));
    _$node.find(".property-input").click(function (ev) {
      ev.stopPropagation();
    });
  } else if (_entityAttribute instanceof BooleanAttribute) {
    _propertyInput = new BooleanAttribute(
      entity.getEntityId() + "[" + propertyName.toLowerCase() + "]",
      propertyName,
      entity,
      true
    );
    // @ts-ignore
    _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
    // @ts-ignore

    _entityAttribute
      // @ts-ignore
      .get$node()
      .find(".val")
      .bind("change", function () {
        _propertyInput
          .getValue()
          .setValue(_entityAttribute.getValue().getValue());
      });

    _propertyInput
      .get$node()
      .find(".val")
      .bind("change", function (ev) {
        _entityAttribute
          .getValue()
          .setValue(_propertyInput.getValue().getValue());
      });

    _$node
      .find(".property-input")
      .append(_propertyInput.get$node().find(".val"));
    _$node.find(".property-input").click(function (ev) {
      ev.stopPropagation();
    });
  } else if (_entityAttribute instanceof FileAttribute) {
    _propertyInput = new FileAttribute(
      entity.getEntityId() + "[" + propertyName.toLowerCase() + "]",
      propertyName,
      entity,
      true
    );
    //@ts-ignore
    _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
    // @ts-ignore

    // _entityAttribute.get$node().find(".val").bind("change", function(){
    //     // @ts-ignore
    _propertyInput.getValue().setValue(_entityAttribute.getValue().getValue());
    // @ts-ignore
    // });

    // _propertyInput.get$node().find(".val").bind("change", function(ev){
    //     _entityAttribute.getValue().setValue(_propertyInput.getValue().getValue());
    // });

    _$node.find(".property-input").append(_propertyInput.getValue().get$node());
    _$node.find(".property-input").click(function (ev) {
      ev.stopPropagation();
    });
  }
  if (_propertyInput)
    _propertyInput
      .get$node()
      .find(".val")
      .keypress(function (ev) {
        //The event is never triggered
        if (ev.which == 13) {
          _$node.find(".bs-dropdown-toggle").dropdown("toggle");
        }
      });

  //guidanceFollowed does not exists, seems to be unnecessary and obsolete
  /*_$node.on('show.bs.dropdown', function () {
         _canvas.guidanceFollowed();
        });*/

  _$node.hover(
    function () {
      if (_entityId) _canvas.highlightEntity(_entityId);
    },
    function () {
      if (_entityId) _canvas.unhighlightEntity(_entityId);
    }
  );

  this.get$node = function () {
    return _$node;
  };
}

export default SetPropertyGuidance;
