define(['jqueryui', 'lodash'], function ($,_) {
	function ViewTypesUtil() {}
	
    ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList = function (nodes) {
        var selectionList = {};
        for(var key in nodes){
            if(nodes.hasOwnProperty(key)){
                selectionList[key] = nodes[key].getLabel().getValue().getValue();
            }
        }
        return selectionList;
    };
    ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2 = function (nodes, types) {
        var selectionList = {};
        selectionList['empty'] = '';
        for(var key in nodes){
            if(nodes.hasOwnProperty(key)){
                if(_.indexOf(types, nodes[key].type) != -1)
                    selectionList[key] = nodes[key].label.value.value;
            }
        }
        return selectionList;
    };
    return ViewTypesUtil;
});
