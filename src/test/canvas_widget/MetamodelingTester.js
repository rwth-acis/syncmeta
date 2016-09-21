define(['chai', 'async',
    'canvas_widget/EntityManager',
    './../canvas_widget/CreateNodeTester',
    './../canvas_widget/CreateEdgeTester',
    './../canvas_widget/NodeDeleteTester',
    './../canvas_widget/EdgeDeleteTester',
    'jscheck'],
    function(chai, async, EntityManager, CreateNodeTester, CreateEdgeTester, NodeDeleteTester, EdgeDeleteTester) {
        return function MetamodelingTester(canvas) {

            var expect = chai.expect;

            async.parallel({
                objectNode: async.apply(CreateNodeTester, 'META - Create Object node', canvas, ['Object', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, '1234567890']),
                abstractNode: async.apply(CreateNodeTester, 'Meta - Create Abstract node', canvas, ['Abstract Class', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null]),
                relationshipNode: async.apply(CreateNodeTester, 'Meta - Relationship node', canvas, ['Relationship', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null])
            },
                function(err, result) {
                    async.parallel({
                        editLabelTest: function(callback) {
                            describe('CANVAS - Edit label of Object node', function() {
                                var node = null;
                                before(function(done) {
                                    node = EntityManager.find(result.objectNode);
                                    this.timeout(1000);
                                    node.getLabel().getValue().setValue('Test Label');
                                    done();
                                });

                                it('Object node should have a label in model and DOM', function() {
                                    expect(node.getLabel().getValue().getValue()).to.be.equal('Test Label');
                                });

                                it('Object node should have a label in ytext', function() {
                                    var ytext = node.getLabel().getValue().getYText();
                                    expect(ytext).to.be.not.null;
                                    expect(ytext.toString()).to.be.equal('Test Label');
                                });
                                after(function(done) {
                                    callback(null, true);
                                    done();
                                })
                            });
                        },
                        generalisation: async.apply(CreateEdgeTester, 'META - Create Generalisation edge', canvas, ['Generalisation', result.objectNode, result.abstractNode, null, null]),
                        biDirAssociation: async.apply(CreateEdgeTester, 'META - Create Bi-Dir-Association edge', canvas, ['Bi-Dir-Association', result.objectNode, result.relationshipNode, null, null])
                    },
                        function(err, edgeList) {
                            async.series([
                                async.apply(EdgeDeleteTester, 'META - Delete Generalisation from object to abstract class', edgeList.generalisation, false),
                                async.apply(NodeDeleteTester, 'META - Delete abstract class node', result.abstractNode)
                            ]);

                            async.series([
                                async.apply(NodeDeleteTester, 'META - Delete object node', result.objectNode),
                                async.apply(EdgeDeleteTester, 'META - Delete Bi-Dir-Assocation from object to relationship', edgeList.biDirAssociation, true),
                                async.apply(NodeDeleteTester, 'META - Delete relationship node', result.relationshipNode)
                            ])
                        });
                });

        }
    })