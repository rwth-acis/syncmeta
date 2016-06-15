define(['chai','canvas_widget/EntityManager'], function(chai, EntityManager){

    function CreateEdgeTester(title, canvas){
        var expect = chai.expect;

        this.test_createEdge = function(type, sourceId,targetId,json, id, callback){
            describe('CANVAS - ' + title, function(){
                var edgeId = null;
                before(function(done){
                    canvas.createEdge(type,sourceId,targetId,json,id).done(function(id){
                        edgeId = id;
                        done()
                    });
                });
                it(type + ':'+ edgeId + ' should be in EntityManager',function(){
                    expect(EntityManager.findEdge(edgeId)).to.be.not.null;
                });

                it(type + ':'+ edgeId +' node should be in Canvas', function(){
                    expect($('.'+edgeId).length).to.be.equal(1);
                });

                it(type + ':'+ edgeId +' node should be in Yjs', function(){
                    expect(y.share.edges.opContents.hasOwnProperty(edgeId)).to.be.true;
                });

                after(function(done){
                    if(callback)
                        callback(edgeId);
                    done();
                });
            })
        }

    }

    return CreateEdgeTester;
});