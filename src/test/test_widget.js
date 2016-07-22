$(function() {
    require([
        './../test/test_widget/PromiseTests',
        './../test/test_widget/EntityManagerTests',
        './../test/test_widget/PluginTest'], function(PromiseTests,EntityManagerTests, PluginTest) {
        mocha.setup('bdd');
        mocha.reporter('html');
        mocha.timeout(10000);
        EntityManagerTests();
        //PromiseTests();
        PluginTest();
        mocha.run();
        
        
    });
    
    
    
});
