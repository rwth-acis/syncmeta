define(['chai', 'operations/ot/NodeResizeOperation', 'canvas_widget/EntityManager'],
    function (chai, NodeResizeOperation, EntityManager) {

        function NodeResizeTester(title, args, testOnly, callback) {
            var expect = chai.expect;
            var id = args[0];
            var expectedHeight, expectedHeight, node;
            describe('CANVAS - ' + title, function () {
                var nodeId = null;
                before(function (done) {
                    node = EntityManager.findNode(id);
                    if (!testOnly) {
                        expectedWidth = node.getAppearance().width + args[1]; //offsetX
                        expectedHeight = node.getAppearance().height + args[2]; //offsetY
                        var operation = new NodeResizeOperation(id, args[1], args[2], args[3]);
                        node.propagateNodeResizeOperation(operation);
                    }
                    else {
                        expectedWidth = node.getAppearance().width;
                        expectedHeight = node.getAppearance().height;
                    }
                    done();
                });

                it('RESIZE: Node ' + id + ' should have correct size', function () {
                    expect(node.getAppearance().width).to.be.equal(expectedWidth);
                    expect(node.getAppearance().height).to.be.equal(expectedHeight);
                });

                it('RESIZE: Node ' + id + ' should have correct values in Y-Map', function(){
                    expect(node.getYMap().get('width')).to.be.equal(expectedWidth);
                    expect(node.getYMap().get('height')).to.be.equal(expectedHeight);
                });

                after(function (done) {
                    if (callback)
                        callback(null, id);
                    done();
                });
            })
        }
        return NodeResizeTester;
    });