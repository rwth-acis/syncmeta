define(['Util','guidance_widget/CollaborationStrategy'
],function(Util,CollaborationStrategy) {

    var AvoidConflictsStrategy = CollaborationStrategy.extend({
        onGuidanceOperation: function(data){
        	//Do not accept any collaboration guidance
        }
    });

    AvoidConflictsStrategy.NAME = "Avoid Conflicts Strategy";
    AvoidConflictsStrategy.ICON = "user";

    return AvoidConflictsStrategy;

});
