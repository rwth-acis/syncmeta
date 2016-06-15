define(['chai','canvas_widget/EntityManager'], function(chai, EntityManager){

    function CreateNodeTester(title, canvas){
        var expect = chai.expect;

        this.test_createNode = function(type, left,top,width, height, zIndex, json, id, callback){
            describe('CANVAS - ' + title, function(){
                var nodeId = null;
                before(function(done){
                    canvas.createNode(type, left,top,width,height,zIndex,json,id).done(function(id){
                        nodeId = id;
                        done();
                    });
                });

                if(id){
                    it(type + ':' + id + ' compare node Ids', function(){
                        expect(nodeId).to.be.equal(id);
                    });
                }

                it(type + ':'+ id + ' should be in EntityManager',function(){
                    expect(EntityManager.findNode(nodeId)).to.be.not.null;
                });

                it(type + ':'+ id +' node should be in Canvas', function(){
                    expect($('#'+nodeId).length).to.be.equal(1);
                });

                it(type + ':'+ id +' node should be in Yjs', function(){
                    expect(y.share.nodes.opContents.hasOwnProperty(nodeId)).to.be.true;
                });

                after(function(done){
                    if(callback)
                        callback(nodeId);
                    done();
                });
            })
        }

    }

    return CreateNodeTester;
});