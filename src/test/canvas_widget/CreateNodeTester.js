define(['chai', 'canvas_widget/EntityManager'], function (chai, EntityManager) {

    function CreateNodeTester(title, canvas, args, testOnly, callback) {
        var expect = chai.expect;
        var p_type = args[0];
        var p_Id = args[7];

        describe('CANVAS - ' + title, function () {
            var nodeId = null;
            before(function (done) {
                if (!testOnly)
                    nodeId = canvas.createNode.apply(this, args);
                else
                    nodeId = p_Id;
                done();
            });

            if (p_Id) {
                it(p_type + ':' + p_Id + ' compare node Ids', function () {
                    expect(nodeId).to.be.equal(p_Id);
                });
            }

            it(p_type + ':' + p_Id + ' should be in EntityManager', function () {
                expect(EntityManager.findNode(nodeId)).to.be.not.null;
            });

            it(p_type + ':' + p_Id + ' node should be in Canvas', function () {
                expect($('#' + nodeId).length).to.be.equal(1);
            });

            it(p_type + ':' + p_Id + ' node should be in Yjs', function () {
                const nodesMap = y.getMap("nodes");
                expect(nodesMap.opContents.hasOwnProperty(nodeId)).to.be.true;
            });

            after(function (done) {
                if (callback)
                    callback(null, nodeId);
                done();
            });
        })
    }
    return CreateNodeTester;
});