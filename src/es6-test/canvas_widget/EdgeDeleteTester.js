import chai from 'chai';
import EntityManager from 'canvas_widget/EntityManager';
    function EdgeDeleteTester(title, id, testOnly, callback) {
        var expect = chai.expect;

        describe('CANVAS - ' + title, function() {
            if (!testOnly) {
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
                const dataMap = y.getMap("data");
                expect(dataMap.get("model").edges.hasOwnProperty(id)).to.be
                  .false;
            });

            it(id + ' edge should no longer be in y nodes', function() {
                const edgeMap = y.getMap("edges");
                expect(edgeMap.get(id)).to.be.undefined;
                expect(edgeMap.has(id)).to.be.equal(-1);
            });

            after(function(done) {
                if (callback)
                    callback(null, id);
                done();
            })

        });
    }
    export default EdgeDeleteTester;
