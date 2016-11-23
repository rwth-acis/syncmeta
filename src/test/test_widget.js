$(function() {
    require([
        './../test/test_widget/PromiseTests',
        './../test/test_widget/EntityManagerTests',
        './../test/test_widget/SpaceRegexTester'], function(PromiseTests,EntityManagerTests,SpaceRegexTester) {
        mocha.setup('bdd');
        mocha.reporter('html');
        mocha.timeout(10000);
        SpaceRegexTester();
        EntityManagerTests();
        //PromiseTests();
        mocha.run();
        
        
    });
    
    
    
});
