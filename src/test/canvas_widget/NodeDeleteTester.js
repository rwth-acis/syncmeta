define(['chai','canvas_widget/EntityManager'], function(chai, EntityManager){
    function NodeDeleteTester(title, nodeId, testOnly, callback){
        var expect = chai.expect;

        describe('CANVAS - ' + title, function() {
            before(function (done) {
                if(!testOnly)
                    EntityManager.findNode(nodeId).triggerDeletion();
                done();
            });
            it( nodeId + ' node should no longer be in EntityManager', function(){
                expect(EntityManager.findNode(nodeId)).to.be.null;
            });

            it(nodeId + ' node should no longer be in Canvas DOM', function(){
                expect($('#'+nodeId).length).to.be.equal(0);
            });

            it(nodeId + ' node should no longer be in Yjs data model', function(){
                const dataMap = y.getMap("data");
                expect(dataMap.get("model").nodes.hasOwnProperty(nodeId)).to.be
                  .false;
            });
            
            it(nodeId + 'node should no longer b in y nodes map', function(){
            const nodesMap = y.getMap("nodes");
            expect(nodesMap.get(nodeId)).to.be.undefined;
            expect(nodesMap.keys().indexOf(nodeId)).to.be.equal(-1);
              
            });
            
            after(function(done){
                if(callback)
                    callback(null, nodeId);
                done();
            })
        });
    }
    return NodeDeleteTester;
});