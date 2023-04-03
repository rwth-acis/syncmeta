import chai from 'chai';
import async from 'async';
import EntityManager from 'canvas_widget/EntityManager';
import CreateNodeTester from './../canvas_widget/CreateNodeTester';
import CreateEdgeTester from './../canvas_widget/CreateEdgeTester';
import NodeDeleteTester from './../canvas_widget/NodeDeleteTester';
import EdgeDeleteTester from './../canvas_widget/EdgeDeleteTester';
import NodeMoveTester from './../canvas_widget/NodeMoveTester';
import NodeMoveZTester from './../canvas_widget/NodeMoveZTester';
import NodeResizeTester from './../canvas_widget/NodeResizeTester';
import UndoTester from './../canvas_widget/UndoTester';
import RedoTester from './../canvas_widget/RedoTester';
        export default function ModelingTester(canvas) {

            var expect = chai.expect;

            async.parallel({
                entityNode: async.apply(CreateNodeTester, 'MODEL - Create Entity node', canvas, ['Entity', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, '1234567890'], false),
                relationshipNode: async.apply(CreateNodeTester, 'MODEL - Create Relationship node', canvas, ['Relationship', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null], false),
                entityNode2: async.apply(CreateNodeTester, 'MODEL - Create second Entity node', canvas, ['Entity', JSC.integer(0, 8500)(), JSC.integer(0, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null], false)
            },
                function (err, result) {
                    async.parallel({
                        associationEdge1: async.apply(CreateEdgeTester, 'MODEL - Create Association edge', canvas, ['Associations', result.entityNode, result.relationshipNode, null, null], false),
                        associationEdge2: async.apply(CreateEdgeTester, 'MODEL - Create Association edge', canvas, ['Associations', result.entityNode2, result.relationshipNode, null, null], false)
                    },
                        function (err, edgeList) {
                            async.series([
                                async.apply(UndoTester, false, 5, canvas),
                                async.apply(RedoTester, false, 0, canvas),
                                async.apply(EdgeDeleteTester, 'MODEL - Delete Assocation Edge 1', edgeList.associationEdge1, false),
                                async.apply(NodeDeleteTester, 'MODEL - Delete Entity node 1', result.entityNode, false),
                                async.apply(NodeDeleteTester, 'MODEL - Delete Entity node 2', result.entityNode2, false),
                                async.apply(EdgeDeleteTester, 'MODEL - Delete Association Edge 2', edgeList.associationEdge2, true),
                                async.apply(NodeDeleteTester, 'MODEL - Delete relationship node', result.relationshipNode, false),
                                async.apply(UndoTester, true, 9, canvas),
                                async.apply(RedoTester, false, 1, canvas),
                                async.apply(UndoTester, true, 8, canvas),
                                async.apply(UndoTester, true, 7, canvas),
                                async.apply(RedoTester, true, 2, canvas),
                                async.apply(RedoTester, true, 1, canvas),
                                async.apply(RedoTester, true, 0, canvas),
                                async.apply(UndoTester, false, 10, canvas),
                                async.apply(CreateNodeTester, 'MODEL - Create Entity node', canvas, ['Entity', JSC.integer(1000, 8500)(), JSC.integer(1000, 8500)(), JSC.integer(100, 300)(), JSC.integer(100, 300)(), JSC.integer(100, 1000)(), null, null], false)
                            ], function(err, results){
                                async.series([
                                    async.apply(NodeMoveTester, 'MODEL - Move the Entity node', [results[15],  JSC.integer(0, 100)(),  JSC.integer(0, 100)(), null], false),
                                    async.apply(NodeMoveZTester, 'MODEL - Move the Entity Z-Index', [results[15], JSC.integer(0, 100)(), null], false),
                                    async.apply(NodeResizeTester, 'MODEL - Resize the Entity node', [results[15], JSC.integer(300, 500)(), JSC.integer(300, 500)(), null], false),
                                     async.apply(UndoTester, true, 13, canvas),
                                    async.apply(UndoTester, true, 12, canvas),
                                    async.apply(UndoTester, true, 11, canvas),
                                    async.apply(UndoTester, true, 10, canvas)
                                ]);
                            });
                        });
                });

        }
    