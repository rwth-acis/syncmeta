define(['chai','canvas_widget/EntityManager'], function(chai, EntityManager){

    function CreateEdgeTester(title, canvas, args, callback){
        var expect = chai.expect;
        var p_type = args[0];

        describe('CANVAS - ' + title, function(){
            var edgeId = null;
            before(function(done){
                canvas.createEdge.apply(this,args).done(function(id){
                    edgeId = id;
                    done()
                });
            });
            it(p_type + ':'+ edgeId + ' should be in EntityManager',function(){
                expect(EntityManager.findEdge(edgeId)).to.be.not.null;
            });

            it(p_type + ':'+ edgeId +' node should be in Canvas', function(){
                expect($('.'+edgeId).length).to.be.equal(1);
            });

            it(p_type + ':'+ edgeId +' node should be in Yjs', function(){
                expect(y.share.edges.opContents.hasOwnProperty(edgeId)).to.be.true;
            });

            after(function(done){
                if(callback)
                    callback(null,edgeId);
                done();
            });
        })
    }
    return CreateEdgeTester;
});