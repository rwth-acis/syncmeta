define(['chai'], function(chai){
    function ViewpointModelintTest(){
        var expect = chai.expect;

        var viewpointName = 'ViewpointmodelingTest';

        describe('CANVAS - Create Viewpoint', function(){
            before(function(done){
                $('#viewsShow').click();
                $('#btnCreateViewpoint').click();
                $('#txtNameViewpoint').val(viewpointName);
                $('#btnAddViewpoint').click();
                done();
            })

            it('CANVAS- View should be in drop down menu', function(){
                expect($('#ddmViewSelection').find('#' + viewpointName).length).to.be.equal(1);
            })
            
            it('CANVAS - View should be in y.getMap("views")', function () {
              const viewsMap = y.getMap("views");
              expect(viewsMap.keys().indexOf(viewpointName)).to.be.not.equal(
                -1
              );
            });

            after(function(done){
                describe('CANVAS - Load Empty Viewpoint', function(){
                    before(function(d){
                         $('#btnShowView').click();
                         d();
                    })

                    it('CANVAS - Check current label', function(){
                        expect($('#lblCurrentView').text()).to.be.equal("View:"+viewpointName);
                    })
                    
                    after(function(d){
                        //$('#btnDelViewPoint').click();
                        d();
                       
                    })
                })
                done();
            })
        })
    }
    return ViewpointModelintTest;
})