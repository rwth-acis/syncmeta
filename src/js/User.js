define(['jqueryui', 'Util'], function($, Util){
    var deferred = $.Deferred();
    var url = localStorage.userinfo_endpoint + '?access_token=' + localStorage.access_token;
    $.get(url, function(data){
        var space = {user: {}};
        space.user[CONFIG.NS.PERSON.TITLE] = data.name;
        space.user[CONFIG.NS.PERSON.JABBERID] = data.sub;
        space.user[CONFIG.NS.PERSON.MBOX] = data.email;
        space.user.globalId = -1;
        console.info('User promise by ' + frameElement.name, space);
        deferred.resolve(space);
    });

    return deferred.promise();
});