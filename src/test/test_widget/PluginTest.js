define(['lib/vendor/test/chai', 'lib/yjs-sync'], function(chai, yjsSync) {
    function SyncMetaPluginTest() {
        yjsSync().done(function(y) {
            syncmeta.ySyncMetaInstance = y;
            var currentNode = null;
            syncmeta.onNodeAdd(function(event) {
                var test = event;


            })

            syncmeta.onEdgeAdd(function(event) {
                var test = event;
            });

            syncmeta.onEntitySelect(function(entityId) {

                var test = event;
            })

            syncmeta.onNodeSelect(function(nodeId) {
                currentNode = nodeId;
                syncmeta.onNodeMove(function(event) {
                    var test = event;
                }, nodeId);

                syncmeta.onNodeAttributeChange(function(value, entityId, attrId) {
                    var test = event;
                }, nodeId);
            })

            syncmeta.onNodeDelete(function(nodeId) {
                var test = nodeId;
            });

            syncmeta.onEdgeDelete(function(nodeId) {
                var test = nodeId;
            });
            syncmeta.onNodeMove(function(event) {
                var test = true;
            })
            
            syncmeta.onNodeResize(function(event){
                var test = event;
            });
            
            syncmeta.onNodeMoveZ(function(event){
                var test = event;
            })
            
            syncmeta.onNodeAttributeChange(function(value, entityId, attrId){
               console.info('onNodeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId); 
            });
            syncmeta.onEdgeAttributeChange(function(value, entityId, attrId){
               console.info('onEdgeAttributeChange:  value: ' + value + ' entityId: ' + entityId + ' attrId: ' + attrId); 
            });
                
            var expect = chai.expect;
        });
    }
    return SyncMetaPluginTest;
})