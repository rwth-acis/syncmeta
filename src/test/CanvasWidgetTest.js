requirejs.config({
    baseUrl:"<%= grunt.config('baseUrl') %>/js",
    paths: {
        chai : "lib/vendor/test/chai",
        mocha:'lib/vendor/test/mocha',
        WebConsoleReporter:'./../test/WebConsole'
    }
});
define(['jquery','chai','WebConsoleReporter','canvas_widget/EntityManager','mocha'],
    function($,chai, WebConsoleReporter,EntityManager){

        function CanvasWidgetTestMain(canvas){
            $('body').append($('<div id="mocha" style="display: none"></div>'));

            mocha.setup('bdd');
            mocha.reporter(WebConsoleReporter);
            mocha.timeout(5000);

            var expect = chai.expect;
            describe('Canvas GUI Test', function(){
                it('CANVAS - canvas drawing panel should exists', function(){
                    expect($('#canvas').length).to.be.equal(1);
                });
                if(EntityManager.getLayer() === CONFIG.LAYER.META) {
                    describe('CANVAS - META - Create Object node ', function(){
                        var nodeId = null;
                        before(function(done){
                            canvas.createNode('Object',4200,4400,100,200,1000,null,'1234567890').done(function(id){
                                nodeId = id;
                                done();
                            });
                        });
                        it('Object node compare node Id', function(){
                           expect(nodeId).to.be.equal('1234567890');
                        });
                        it('Object node should be in EntityManager',function(){
                            expect(EntityManager.findNode(nodeId)).to.be.not.null;
                        });

                        it('Object node should be in Canvas', function(){
                            expect($('#'+nodeId).length).to.be.equal(1);
                        });

                        it('Object node should be in Yjs', function(){
                            expect(y.share.nodes.opContents.hasOwnProperty(nodeId)).to.be.true;
                        });
                        after(function(done){
                            describe('CANVAS - META - Create Relationship node ', function(){
                                var nodeId2 = null;
                                before(function(done){
                                    canvas.createNode('Relationship',4400,4400,100,200,1000,null).done(function(id){
                                        nodeId2 = id;
                                        done();
                                    });
                                });
                                it('Relationship node should be in EntityManager',function(){
                                    expect(EntityManager.findNode(nodeId2)).to.be.not.null;
                                });

                                it('Relationship node should be in Canvas', function(){
                                    expect($('#'+nodeId2).length).to.be.equal(1);
                                });

                                it('Relationship node should be in Yjs', function(){
                                    expect(y.share.nodes.opContents.hasOwnProperty(nodeId2)).to.be.true;
                                });
                                after(function(done){
                                    describe('CANVAS - META - Create Bi-Dir-Association edge', function(){
                                        var edgeId = null;
                                        before(function(done){
                                            canvas.createEdge('Bi-Dir-Association',nodeId,nodeId2,null).done(function(id){
                                                edgeId = id;
                                                done()
                                            });
                                        });

                                        it('Bi-Dir-Association edge should be in EntityManager', function(){
                                            expect(EntityManager.findEdge(edgeId)).to.be.not.null;
                                        });

                                        it('Bi-Dir-Association edge should be in Canvas', function(){
                                           expect($('.'+edgeId).length).to.be.not.equal(0);
                                        });

                                        it('Bi-Dir-Association edge should be in Yjs', function(){
                                            expect(y.share.edges.opContents.hasOwnProperty(edgeId)).to.be.true;

                                        });

                                        after(function(done){
                                            EntityManager.findNode(nodeId2).triggerDeletion();
                                            EntityManager.findNode(nodeId).triggerDeletion();
                                            done();
                                        });
                                    });
                                    done();
                                })
                            });
                            done();
                        })
                    });


                }
            });
            mocha.run();
        }
        return CanvasWidgetTestMain;
    });