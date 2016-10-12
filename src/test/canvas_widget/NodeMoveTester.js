define(['chai', 'operations/ot/NodeMoveOperation', 'canvas_widget/EntityManager'],
    function (chai, NodeMoveOperation, EntityManager) {

        function NodeMoveTester(title, args, testOnly, callback) {
            var expect = chai.expect;
            var id = args[0];
            var expectedTop, expectedLeft, node;
            describe('CANVAS - ' + title, function () {
                var nodeId = null;
                before(function (done) {
                    node = EntityManager.findNode(id);
                    if (!testOnly) {
                        expectedLeft = node.getAppearance().left + args[1]; //offsetX
                        expectedTop = node.getAppearance().top + args[2]; //offsetY
                        var operation = new NodeMoveOperation(id, args[1], args[2], args[3]);
                        node.propagateNodeMoveOperation(operation);
                    }
                    else {
                        expectedLeft = node.getAppearance().left;
                        expectedTop = node.getAppearance().top;
                    }
                    done();
                });

                it('MOVE: Node ' + id + ' should be at correct position in Canvas', function () {
                    expect(node.getAppearance().left).to.be.equal(expectedLeft);
                    expect(node.getAppearance().top).to.be.equal(expectedTop);
                });
                 
                it('MOVE: Node ' + id + 'should have correct values in Y-Map', function(){
                    expect(node.getYMap().get('left')).to.be.equal(expectedLeft);
                    expect(node.getYMap().get('top')).to.be.equal(expectedTop);
                });

                after(function (done) {
                    if (callback)
                        callback(null, id);
                    done();
                });
            })
        }
        return NodeMoveTester;
    });