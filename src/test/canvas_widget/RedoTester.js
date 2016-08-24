define(['chai','canvas_widget/HistoryManager'], function(chai,HistoryManager) {
    //TODO
    function RedoTester() {
        var expect = chai.expect;
        describe('Redo Test', function() {
            before(function(done) {
                $('#redo').click();
                done();
            })
            
            
            
        });
    }
    return RedoTester;

});