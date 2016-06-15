define(['chai','canvas_widget/EntityManager'], function(chai, EntityManager){
    function EdgeDeleteTester(title, id, disableTrigger, callback){
        var expect = chai.expect;

        describe('CANVAS - ' + title, function() {
            if(!disableTrigger) {
                before(function (done) {
                    EntityManager.findEdge(id).triggerDeletion();
                    done();
                });
            }
            it(id +' edge should no longer be in EntityManager', function(){
                expect(EntityManager.findEdge(id)).to.be.null;
            });

            it(id + ' edge should no longer be in Canvas DOM', function(){
                expect($('.'+id).length).to.be.equal(0);
            });

            it(id + ' edge should no longer be in Yjs data model', function(){
                expect(y.share.data.get('model').edges.hasOwnProperty(id)).to.be.false;
            });

            after(function(done){
                if(callback)
                    callback();
                done();
            })

        });
    }
    return EdgeDeleteTester;
});