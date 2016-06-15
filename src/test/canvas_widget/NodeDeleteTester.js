define(['chai','canvas_widget/EntityManager'], function(chai, EntityManager){
    function NodeDeleteTester(title, nodeId, callback){
        var expect = chai.expect;

        describe('CANVAS - ' + title, function() {
            before(function (done) {
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
                expect(y.share.data.get('model').nodes.hasOwnProperty(nodeId)).to.be.false;
            });

            after(function(done){
                if(callback)
                    callback();
                done();
            })
        });
    }
    return NodeDeleteTester;
});