define(['Util','guidance_widget/CollaborationStrategy'
],function(Util,CollaborationStrategy) {

    var AvoidConflictsStrategy = CollaborationStrategy.extend({
        
    });

    AvoidConflictsStrategy.NAME = "Avoid Conflicts Strategy";
    AvoidConflictsStrategy.ICON = "user";

    return AvoidConflictsStrategy;

});
