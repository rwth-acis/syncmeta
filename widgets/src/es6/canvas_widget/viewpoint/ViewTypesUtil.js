import _ from "lodash";
import AttributeAddOperation from "../../operations/ot/AttributeAddOperation";
import Util from "../../Util";
function ViewTypesUtil() {}

ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList = function (nodes) {
  var selectionList = {};
  for (var key in nodes) {
    if (nodes.hasOwnProperty(key)) {
      selectionList[key] = nodes[key].getLabel().getValue().getValue();
    }
  }
  return selectionList;
};
ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2 = function (nodes, types) {
  var selectionList = {};
  selectionList["empty"] = "";
  for (var key in nodes) {
    if (nodes.hasOwnProperty(key)) {
      if (_.indexOf(types, nodes[key].type) != -1)
        selectionList[key] = nodes[key].label.value.value;
    }
  }
  return selectionList;
};

ViewTypesUtil.createReferenceToOrigin = function (viewtype) {
  const dataMap = y.getMap("data");
  var vls = dataMap.get("metamodelpreview");
  var originEntity;
  if (vls) {
    var targetAttr = viewtype.getAttribute(viewtype.getEntityId() + "[target]");
    var originId = targetAttr.getValue().getValue();
    if (viewtype.getType() === "ViewObject") {
      if (vls.nodes.hasOwnProperty(originId)) {
        originEntity = vls.nodes[originId];
        //By default the label for the ViewObject is the same as for the Origin
        viewtype.getLabel().getValue().setValue(originEntity.label);
      } else {
        //error referenc not found in vls, that should not happen
      }
    } else {
      if (vls.edges.hasOwnProperty(originId)) {
        originEntity = vls.edges[originId];
        //By default the label for the ViewObject is the same as for the Origin
        viewtype.getLabel().getValue().setValue(originEntity.label);
      } else {
        //error referenc not found in vls, that should not happen
      }
    }
    //Initialize the Renaming list Attribute
    var originAttrs = originEntity.attributes;
    var renamingList = viewtype.getAttribute("[attributes]");
    var optionMap = {};
    for (var attrKey in originAttrs) {
      if (originAttrs.hasOwnProperty(attrKey)) {
        var attr = originAttrs[attrKey];
        var id = Util.generateRandomId();
        var operation = new AttributeAddOperation(
          id,
          renamingList.getEntityId(),
          viewtype.getEntityId,
          "RenamingAttribute"
        );
        var renamingAttr =
          renamingList.propagateAttributeAddOperation(operation);
        renamingAttr.getKey().setValue(attr.key);
        renamingAttr.getRef().setValue(attr.key);
        optionMap[id] = attr.key;
      }
    }
    //Initialize the Condition list attribute
    viewtype.getYMap().set("updateConditionOption", optionMap);

    //targetAttr.get$node().hide();
    renamingList.get$node().show();
    viewtype
      .getAttribute(viewtype.getEntityId() + "[conjunction]")
      .get$node()
      .show();
    viewtype.getAttribute("[condition]").get$node().show();
  }
};

export default ViewTypesUtil;
