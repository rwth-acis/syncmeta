import chai from 'chai';
import CreateNodeTester from './../canvas_widget/CreateNodeTester';
import CreateEdgeTester from './../canvas_widget/CreateEdgeTester';
import NodeDeleteTester from './../canvas_widget/NodeDeleteTester';
import EdgeDeleteTester from './../canvas_widget/EdgeDeleteTester';
import NodeMoveTester from './../canvas_widget/NodeMoveTester';
import NodeMoveZTester from './../canvas_widget/NodeMoveZTester';
import NodeResizeTester from './../canvas_widget/NodeResizeTester';
import HistoryManager from 'canvas_widget/HistoryManager';
        //TODO
        function RedoTester(trigger, shouldHaveLength, canvas, callback) {
            var expect = chai.expect;
            describe('Redo Test', function () {
                before(function (done) {
                    if (trigger)
                        $('#redo').click();
                    done();
                })

                it('Redolist should have expected length', function () {
                    expect(HistoryManager.getRedoList().length).to.be.equal(shouldHaveLength);
                });

                if (trigger) {
                    it('REDO - Test redone operation', function () {
                        var op = HistoryManager.getLatestOperation();
                        switch (op.constructor.name) {
                            case 'NodeAddOperation': {
                                CreateNodeTester('META - Redo NodeAddOperation Test', canvas, [op.getType(), op.getLeft(), op.getTop(), op.getWidth(), op.getHeight(), op.getZIndex(), null, op.getEntityId(), true], true);
                                break;
                            }
                            case 'NodeDeleteOperation': {
                                NodeDeleteTester('META - Redo NodeDeleteOperation Test', op.getEntityId(), true);
                                break;
                            }
                            case 'EdgeAddOperation': {
                                CreateEdgeTester('META - Redo EdgeAddOperation', canvas, [op.getType(), op.getSource(), op.getTarget(), null, op.getEntityId(), true], true);
                                break;
                            }
                            case 'EdgeDeleteOperation': {
                                EdgeDeleteTester('META- Redo EdgeDeleteOperation', op.getEntityId(), true);
                                break;
                            }
                            case 'NodeMoveOperation': {
                                NodeMoveTester('META - Redo NodeMoveOperation', [op.getEntityId(), op.getOffsetX(), op.getOffsetY(), null], true);
                                break;
                            }
                            case 'NodeMoveOperation': {
                                NodeMoveTester('META - Redo NodeMoveOperation', [op.getEntityId(), op.getOffsetX(), op.getOffsetY(), null], true);
                                break;
                            }
                            case 'NodeMoveZOperation': {
                                NodeMoveZTester('META - Redo NodeMoveZOperation', [op.getEntityId(), op.getOffsetZ(), null], true);
                                break;
                            }
                            case 'NodeResizeOperation':{
                                NodeResizeTester('META - Redo NodeResizeOperation', [op.getEntityId(), op.getOffsetX(), op.getOffsetY(), null], true);
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
        export default RedoTester;

    