import chai from 'chai';
import CreateNodeTester from './../canvas_widget/CreateNodeTester';
import CreateEdgeTester from './../canvas_widget/CreateEdgeTester';
import NodeDeleteTester from './../canvas_widget/NodeDeleteTester';
import EdgeDeleteTester from './../canvas_widget/EdgeDeleteTester';
import NodeMoveTester from './../canvas_widget/NodeMoveTester';
import NodeMoveZTester from './../canvas_widget/NodeMoveZTester';
import NodeResizeTester from './../canvas_widget/NodeResizeTester';
import HistoryManager from 'canvas_widget/HistoryManager';
        /**
         * Tester for Undo Operations
         */
        function UndoTester(trigger, shouldHaveLength, canvas, callback) {
            var expect = chai.expect;
            describe('Undo Test', function () {
                before(function (done) {
                    if (trigger)
                        $('#undo').click();
                    done();
                });

                it('Undolist should have expected length', function () {
                    expect(HistoryManager.getUndoList().length).to.be.equal(shouldHaveLength);
                });

                if (trigger) {
                    it('UNDO - Test undone operation', function () {
                        var op = HistoryManager.getLatestOperation();
                        switch (op.constructor.name) {
                            case 'NodeAddOperation': {
                                CreateNodeTester('META - Undo NodeAddOperation Test', canvas, [op.getType(), op.getLeft(), op.getTop(), op.getWidth(), op.getHeight(), op.getZIndex(), null, op.getEntityId(), true], true);
                                break;
                            }
                            case 'NodeDeleteOperation': {
                                NodeDeleteTester('META - Undo NodeDeleteOperation Test', op.getEntityId(), true);
                                break;
                            }
                            case 'EdgeAddOperation': {
                                CreateEdgeTester('META - Undo EdgeAddOperation', canvas, [op.getType(), op.getSource(), op.getTarget(), null, op.getEntityId(), true], true);
                                break;
                            }
                            case 'EdgeDeleteOperation': {
                                EdgeDeleteTester('META- Undo EdgeDeleteOperation', op.getEntityId(), true);
                                break;
                            }
                            case 'NodeMoveOperation': {
                                NodeMoveTester('META - Undo NodeMoveOperation', [op.getEntityId(), op.getOffsetX(), op.getOffsetY(), null], true);
                                break;
                            }
                            case 'NodeMoveZOperation': {
                                NodeMoveZTester('META - Undo NodeMoveZOperation', [op.getEntityId(), op.getOffsetZ(), null], true);
                                break;
                            }
                            case 'NodeResizeOperation':{
                                NodeResizeTester('META - Undo NodeResizeOperation', [op.getEntityId(), op.getOffsetX(), op.getOffsetY(), null], true);
                                break;
                            }
                        }
                    });
                }

                after(function (done) {
                    if (callback)
                        callback(null);
                    done();
                });
            });
        }
        export default UndoTester;
    