import chai from 'chai';
import NodeMoveZOperation from 'operations/ot/NodeMoveZOperation';
import EntityManager from 'canvas_widget/EntityManager';

        function NodeMoveZTester(title, args, testOnly, callback) {
            var expect = chai.expect;
            var id = args[0];
            var expectedZIndex, node;
            describe('CANVAS - ' + title, function () {
                var nodeId = null;
                before(function (done) {
                    node = EntityManager.findNode(id);
                    if (!testOnly) {
                        expectedZIndex = node.getZIndex() + args[1]; //offsetX
                        var operation = new NodeMoveZOperation(id, args[1], args[2]);
                        node.propagateNodeMoveZOperation(operation);
                    }
                    else {
                        expectedZIndex = node.getZIndex();
                    }
                    done();
                });

                it('MOVEZ: Node ' + id + ' should have a correct Z-Index', function () {
                    expect(node.getZIndex()).to.be.equal(expectedZIndex);
                });

                it('MOVEZ: Node ' + id + ' should have correct Z-Index in Y-Map', function(){
                    expect(node.getYMap().get('zIndex')).to.be.equal(expectedZIndex);
                });

                after(function (done) {
                    if (callback)
                        callback(null, id);
                    done();
                });
            })
        }
        export default NodeMoveZTester;
    