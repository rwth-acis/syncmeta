define(['chai','canvas_widget/EntityManager'], function(chai, EntityManager){

    function CreateEdgeTester(title, canvas, args, testOnly, callback){
        var expect = chai.expect;
        var p_type = args[0];
        var p_id = args[4];
        describe('CANVAS - ' + title, function(){
            var edgeId = null;
            before(function (done) {
                if(!testOnly)
                edgeId = canvas.createEdge.apply(this, args);
                else 
                edgeId = p_id;
                done();
            });
            it(p_type + ':'+ edgeId + ' should be in EntityManager',function(){
                expect(EntityManager.findEdge(edgeId)).to.be.not.null;
            });

            it(p_type + ':'+ edgeId +' node should be in Canvas', function(){
                expect($('.'+edgeId).length).to.be.equal(1);
            });

            it(p_type + ':'+ edgeId +' node should be in Yjs', function(){
                const edgeMap = y.getMap("edges");
                expect(edgeMap.opContents.hasOwnProperty(edgeId)).to.be.true;
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