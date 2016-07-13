define(['chai', 'canvas_widget/HistoryManager'], function(chai, HistoryManager) {
    //TODO
    function UndoTester(OperationType) {
        var expect = chai.expect;
        describe('Undo Test', function() {
            before(function(done) {
                $('#undo').click();
                done();
            })
           
            
           
        });
    }
    return UndoTester;
});