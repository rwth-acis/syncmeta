define(['Util','guidance_widget/CollaborationStrategy'
],function(Util,CollaborationStrategy) {

    var AvoidConflictsStrategy = CollaborationStrategy.extend({
        onShareGuidanceActivityOperation: function(operation){
        	//Do not accept any collaboration guidance
        	return;
        }
    });

    AvoidConflictsStrategy.NAME = "Avoid Conflicts Strategy";
    AvoidConflictsStrategy.ICON = "user";

    return AvoidConflictsStrategy;

});
