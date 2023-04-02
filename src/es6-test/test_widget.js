$(function() {
    import PromiseTests from './../test/test_widget/PromiseTests';
import EntityManagerTests from './../test/test_widget/EntityManagerTests';
import SpaceRegexTester from './../test/test_widget/SpaceRegexTester';
        mocha.setup('bdd');
        mocha.reporter('html');
        mocha.timeout(10000);
        SpaceRegexTester();
        EntityManagerTests();
        //PromiseTests();
        mocha.run();
        
        
    
    
    
    
});
