define(['chai',
    './../canvas_widget/CreateNodeTester',
    './../canvas_widget/CreateEdgeTester',
    './../canvas_widget/NodeDeleteTester',
    './../canvas_widget/EdgeDeleteTester',
    './../canvas_widget/NodeMoveTester',
    './../canvas_widget/NodeMoveZTester',
    './../canvas_widget/NodeResizeTester',
    'canvas_widget/HistoryManager'], function (chai, CreateNodeTester, CreateEdgeTester, NodeDeleteTester, EdgeDeleteTester, NodeMoveTester, NodeMoveZTester, NodeResizeTester, HistoryManager) {
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
        return UndoTester;
    });