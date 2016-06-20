$(function() {
    require([
        './../test/test_widget/PromiseTests',
        './../test/test_widget/EntityManagerTests'], function(PromiseTests,EntityManagerTests) {
        mocha.setup('bdd');
        mocha.reporter('html');
        mocha.timeout(10000);
        EntityManagerTests();
        PromiseTests();
        mocha.run();
    });
    
    
    
});
