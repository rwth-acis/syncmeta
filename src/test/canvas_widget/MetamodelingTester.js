define(['chai', 'async',
    'canvas_widget/EntityManager',
    './../canvas_widget/CreateNodeTester',
    './../canvas_widget/CreateEdgeTester',
    './../canvas_widget/NodeDeleteTester',
    './../canvas_widget/EdgeDeleteTester',
    './../canvas_widget/NodeMoveTester',
    './../canvas_widget/NodeMoveZTester',
    './../canvas_widget/NodeResizeTester',
    './../canvas_widget/UndoTester',
    './../canvas_widget/RedoTester'],
    function (chai, async, EntityManager, CreateNodeTester, CreateEdgeTester, NodeDeleteTester, EdgeDeleteTester, NodeMoveTester, NodeMoveZTester, NodeResizeTester, UndoTester, RedoTester) {
        return function MetamodelingTester(canvas) {

            var expect = chai.expect;

            async.parallel({
                objectNode: async.apply(CreateNodeTester, 'META - Create Object node', canvas, ['Object', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, '1234567890'], false),
                abstractNode: async.apply(CreateNodeTester, 'Meta - Create Abstract node', canvas, ['Abstract Class', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null], false),
                relationshipNode: async.apply(CreateNodeTester, 'Meta - Relationship node', canvas, ['Relationship', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null], false)
            },
                function (err, result) {
                    async.parallel({
                        editLabelTest: function (callback) {
                            describe('CANVAS - Edit label of Object node', function () {
                                var node = null;
                                before(function (done) {
                                    node = EntityManager.find(result.objectNode);
                                    this.timeout(1000);
                                    node.getLabel().getValue().setValue('Test Label');
                                    done();
                                });

                                it('Object node should have a label in model and DOM', function () {
                                    expect(node.getLabel().getValue().getValue()).to.be.equal('Test Label');
                                });

                                it('Object node should have a label in ytext', function () {
                                    var ytext = node.getLabel().getValue().getYText();
                                    expect(ytext).to.be.not.null;
                                    expect(ytext.toString()).to.be.equal('Test Label');
                                });
                                after(function (done) {
                                    callback(null, true);
                                    done();
                                })
                            });
                        },
                        generalisation: async.apply(CreateEdgeTester, 'META - Create Generalisation edge', canvas, ['Generalisation', result.objectNode, result.abstractNode, null, null], false),
                        biDirAssociation: async.apply(CreateEdgeTester, 'META - Create Bi-Dir-Association edge', canvas, ['Bi-Dir-Association', result.objectNode, result.relationshipNode, null, null], false)
                    },
                        function (err, edgeList) {
                            async.series([
                                async.apply(UndoTester, false, 5, canvas),
                                async.apply(RedoTester, false, 0, canvas),
                                async.apply(EdgeDeleteTester, 'META - Delete Generalisation from object to abstract class', edgeList.generalisation, false),
                                async.apply(NodeDeleteTester, 'META - Delete abstract class node', result.abstractNode, false),
                                async.apply(NodeDeleteTester, 'META - Delete object node', result.objectNode, false),
                                async.apply(EdgeDeleteTester, 'META - Delete Bi-Dir-Assocation from object to relationship', edgeList.biDirAssociation, true),
                                async.apply(NodeDeleteTester, 'META - Delete relationship node', result.relationshipNode, false),
                                async.apply(UndoTester, true, 9, canvas),
                                async.apply(RedoTester, false, 1, canvas),
                                async.apply(UndoTester, true, 8, canvas),
                                async.apply(UndoTester, true, 7, canvas),
                                async.apply(RedoTester, true, 2, canvas),
                                async.apply(RedoTester, true, 1, canvas),
                                async.apply(RedoTester, true, 0, canvas),
                                async.apply(UndoTester, false, 10, canvas),
                                async.apply(CreateNodeTester, 'META - Create Enumeration node', canvas, ['Enumeration', JSC.integer(1000, 8500)(), JSC.integer(1000, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null], false)
                            ], function(err, results){
                                async.series([
                                    async.apply(NodeMoveTester, 'META - Move the Enumeration node', [results[15],  JSC.integer(0, 100)(),  JSC.integer(0, 100)(), null], false),
                                    async.apply(NodeMoveZTester, 'META - Move the Enumeration Z-Index', [results[15], JSC.integer(0, 100)(), null], false),
                                    async.apply(NodeResizeTester, 'META - Resize the Enumeration node', [results[15], JSC.integer(300, 500)(), JSC.integer(300, 500)(), null], false),
                                     async.apply(UndoTester, true, 13, canvas),
                                    async.apply(UndoTester, true, 12, canvas),
                                    async.apply(UndoTester, true, 11, canvas),
                                    async.apply(UndoTester, true, 10, canvas)
                                ]);
                            });
                        });
                });

        }
    })