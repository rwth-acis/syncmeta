define(['jqueryui'], function ($) {
	function ViewTypesUtil() {};
	
	ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList = function (nodes) {
		var selectionList = {};
		for(var key in nodes){
			if(nodes.hasOwnProperty(key)){
				selectionList[key] = nodes[key].getLabel().getValue().getValue();
			}
		}
		return selectionList;
	};
		ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2 = function (nodes) {
		var selectionList = {};
		for(var key in nodes){
			if(nodes.hasOwnProperty(key)){
				selectionList[key] = nodes[key].label.value.value;
			}
		}
		return selectionList;
	};
	var Done = function(){
		
	}
	
	ViewTypesUtil.GetCurrentBaseModel = function () {
		var resourceSpace = new openapp.oo.Resource(openapp.param.space());
		var deferred = $.Deferred();
		resourceSpace.getSubResources({
			relation : openapp.ns.role + "data",
			type : CONFIG.NS.MY.MODEL,
			onAll : function (data) {
				if (data === null || data.length === 0) {
					deferred.resolve([]);
				} else {
					data[0].getRepresentation("rdfjson", function (representation) {
						if (!representation) {
							deferred.resolve([]);
						} else {
							deferred.resolve(representation);
						}
					});
				}
			}
		});
		return deferred.promise();
	}
	return ViewTypesUtil;
});
