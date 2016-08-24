define(['chai', 'canvas_widget/EntityManager'], function(chai, EntityManager) {
    function EdgeDeleteTester(title, id, disableTrigger, callback) {
        var expect = chai.expect;

        describe('CANVAS - ' + title, function() {
            if (!disableTrigger) {
                before(function(done) {
                    EntityManager.findEdge(id).triggerDeletion();
                    done();
                });
            }
            it(id + ' edge should no longer be in EntityManager', function() {
                expect(EntityManager.findEdge(id)).to.be.null;
            });

            it(id + ' edge should no longer be in Canvas DOM', function() {
                expect($('.' + id).length).to.be.equal(0);
            });

            it(id + ' edge should no longer be in Yjs data model', function() {
                expect(y.share.data.get('model').edges.hasOwnProperty(id)).to.be.false;
            });

            it(id + ' edge should no longer be in y nodes', function() {
                expect(y.share.edges.get(id)).to.be.undefined;
                expect(y.share.edges.keys().indexOf(id)).to.be.equal(-1);
            });

            after(function(done) {
                if (callback)
                    callback(null, id);
                done();
            })

        });
    }
    return EdgeDeleteTester;
});