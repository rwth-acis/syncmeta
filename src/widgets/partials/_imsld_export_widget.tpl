<script type="application/javascript">
requirejs([
    'jqueryui',
    'lodash',
    'Util',
    'mfexport',
    'jszip'
],function($,_,Util,MFExport,JSZip){

    var XML_PREFIX = 'imsld:';

    function formatXML(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

    function XXML(tagName,innerText,prefix){
        var _prefix = prefix || '',
                _node = XXML.doc.createElement(_prefix + tagName);

        this.getNode = function(){
            return _node;
        };

        this.attr = function(name, value){
            if(typeof name === 'string' && typeof value === 'string'){
                _node.setAttribute(name,value);
            }
            return this;
        };

        this.append = function(xml){
            if(typeof xml === 'string'){
                xml = XXML.doc.createTextNode(xml);
            } else if(xml instanceof XXML){
                xml = xml.getNode();
            } else {
                return this;
            }
            _node.appendChild(xml);
            return this;
        };

        if(typeof innerText === 'string'){
            this.append(innerText);
        }

        return this;
    }
    XXML.doc = document.implementation.createDocument(null, null, null);

    IMSLDXML.prototype = new XXML();
    IMSLDXML.prototype.constructor = IMSLDXML;
    function IMSLDXML(tagName,innerText){
        XXML.call(this,tagName,innerText,XML_PREFIX);
        return this;
    }

    function getKey(node,key){
        var attributeId,
                attribute;

        for(attributeId in node.attributes){
            if(node.attributes.hasOwnProperty(attributeId)){
                attribute = node.attributes[attributeId];
                if(attribute.name === key){
                    return attributeId;
                }

            }
        }
        return '';
    }

    function getValue(node,key){
        var attributeId,
                attribute;

        for(attributeId in node.attributes){
            if(node.attributes.hasOwnProperty(attributeId)){
                attribute = node.attributes[attributeId];
                if(attribute.name === key){
                    return attribute.value.value;
                }

            }
        }
        return '';
    }

    function getNeighborsByEdgeType(data,sourceId,edgeType,isBiDir){
        var edgeId,
            edge,
            neighbors = {};

        isBiDir = isBiDir === true;
        for(edgeId in data.edges){
            if(data.edges.hasOwnProperty(edgeId)){
                edge = data.edges[edgeId];
                if(edge.type === edgeType){
                    if(sourceId === edge.source){
                        neighbors[edge.target] = data.nodes[edge.target];
                    } else if(isBiDir && sourceId === edge.target){
                        neighbors[edge.source] = data.nodes[edge.source];
                    }
                }
            }
        }
        return neighbors;
    }

    function getSequences(data,nodeIds){

        function getSequence(nodeId,visitedNodes,sequences){
            var seq = [],
                    neightbors;

            if(visitedNodes.indexOf(nodeId) === -1){
                seq.push(nodeId);
                visitedNodes.push(nodeId);
            } else {
                for(var i = 0, numOfSequences = sequences.length; i<numOfSequences; i++){
                    if(sequences[i].length > 0 && sequences[i][0] === nodeId){
                        seq = sequences.splice(i,1)[0];
                        break;
                    }
                }
                return seq;
            }
            neightbors = getNeighborsByEdgeType(data,nodeId,'Sequence',false);
            if(_.size(neightbors) > 0){
                return seq.concat(getSequence(_.keys(neightbors)[0],visitedNodes,sequences));
            }
            return seq;
        }

        var currentSequence = [],
                visitedNodes = [],
                sequences = [],
                nodeId;

        for(nodeId in nodeIds){
            if(nodeIds.hasOwnProperty(nodeId) && visitedNodes.indexOf(nodeId) === -1){
                currentSequence = getSequence(nodeId,visitedNodes,sequences);
                sequences.push(currentSequence);
            }
        }

        return sequences;
    }

    var PREFIX = {
        ACT: 'act',
        ACTIVITY: {
            SUPPORT: 'sa',
            LEARNING: 'la',
            ACTIVITY_STRUCTURE: 'as'
        },
        CONFERENCE: 'conference',
        ENVIRONMENT: 'env',
        FILE: 'file',
        ITEM: 'item',
        LEARNING_DESIGN: 'ld',
        LEARNING_OBJECT: 'lo',
        ROLE: 'role',
        ROLEPART: 'rolepart',
        ROLES: 'roles',
        WEBSITE: 'website'
    };

    var SEPARATOR = '-';

    function createZIP(data){

        var manifestXXML,
            organizationsXXML,
            resourcesXXML,

            learningDesignXXML,
            componentsXXL,
            rolesXXML,
            activitiesXXML,
            methodXXL,

            supportActivityXXML,learningActivityXXML,activityStructureXXML,
            supportedRoleXXML,supportedRoles,supportedRoleId,supportedRole,
            involvedRoleXXML,involvedRoles,involvedRoleId,involvedRole,
            involvedActivityXXML,involvedActivities,involvedActivityId,involvedActivity,
    /*supportActivityXXML,*/supportActivityId,supportActivities,supportActivity,
    /*learningActivityXXML,*/learningActivityId,learningActivities,learningActivity,
            learningObjectivesXXML,learningObjectXXML,activityDescriptionXXML,
            resourceXXML,resourceId,resources,resource,
    /*environmentXXML,*/environmentId,environments,environment,
            environmentsXXML,environmentXXML,
            servicesXXML,serviceXXML,
            conferenceXXML,conferences,conferenceId,conference,
            participantXXML,participants,participantId,participant,

            playXXML,
            act,actXXML,actXMMLSet = {},
            rolePartXXML,roleParts,rolePartId,rolePart,

            groupedActIds,groupedActId,
            nodeId,
            node,
            deferred, promises = [], filename, files = {};

        var zip = new JSZip();

        function makeFileCallback(url,deferred){
            return function(data){
                files[url] = data;
                zip.file(data.name,data.data.split(',')[1],{base64: true});
                deferred.resolve();
            }
        }

        if(data){
            manifestXXML = new XXML('manifest')
                    .attr('xmlns','http://www.imsglobal.org/xsd/imscp_v1p1')
                    .attr('xmlns:imsld','http://www.imsglobal.org/xsd/imsld_v1p0')
                    .attr('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance')
                    .attr('xsi:schemaLocation','http://www.imsglobal.org/xsd/imscp_v1p1 http://www.imsglobal.org/xsd/imscp_v1p1.xsd http://www.imsglobal.org/xsd/imsld_v1p0 http://www.imsglobal.org/xsd/IMS_LD_Level_A.xsd')
                    .attr('identifier','Manifest');

            organizationsXXML = new XXML('organizations');
            resourcesXXML = new XXML('resources');
            learningDesignXXML = new IMSLDXML('learning-design')
                    .attr('identifier',getValue(data.attributes,'Identifier')||PREFIX.LEARNING_DESIGN + SEPARATOR + Util.generateRandomId())
                    .attr('uri',getValue(data.attributes,'URI')||'http://example.com')
                    .attr('sequence-used',getValue(data.attributes,'Uses IMS Simple Sequencing').toString())
                    .attr('version','1.0.0')
                    .attr('level','A')
                    .append(new IMSLDXML('title',getValue(data.attributes,'Title')));

            componentsXXL = new IMSLDXML('components');
            methodXXL = new IMSLDXML('method');

            rolesXXML = new IMSLDXML('roles')
                    .attr('identifier',PREFIX.ROLES + SEPARATOR + Util.generateRandomId());

            for(nodeId in data.nodes){
                if(data.nodes.hasOwnProperty(nodeId)){
                    node = data.nodes[nodeId];
                    switch(node.type){
                        case "File":
                            deferred = $.Deferred();
                            filename = getValue(node,'Filename');
                            if(filename){
                                $.get(filename+'/:representation').done(makeFileCallback(filename,deferred));
                                promises.push(deferred.promise());
                            } else {
                                files[filename] = {
                                    name: 'undefined',
                                    data: 'undefined',
                                    type: 'undefined'
                                }
                            }
                    }
                }
            }

            return $.when.apply($,promises).then(function(){
                for(nodeId in data.nodes){
                    if(data.nodes.hasOwnProperty(nodeId)){
                        node = data.nodes[nodeId];
                        switch(node.type){

                            //Activities
                            case "Support Activity":
                                activitiesXXML = activitiesXXML || new IMSLDXML('activities');
                                supportActivityXXML = new IMSLDXML('support-activity')
                                        .attr('identifier',PREFIX.ACTIVITY.SUPPORT + SEPARATOR + nodeId)
                                        .attr('isvisible',getValue(node,'isVisible'))
                                        .append(new IMSLDXML('title',getValue(node,'Title')));

                                //Supported Role
                                supportedRoles = getNeighborsByEdgeType(data,nodeId,'Supported Role',false);
                                for(supportedRoleId in supportedRoles){
                                    if(supportedRoles.hasOwnProperty(supportedRoleId)){
                                        supportedRole = supportedRoles[supportedRoleId];
                                        switch(supportedRole.type){
                                            case "Learner":
                                            case "Staff":
                                                supportedRoleXXML = new IMSLDXML('role-ref')
                                                        .attr('ref',PREFIX.ROLE + SEPARATOR + supportedRoleId);
                                                supportActivityXXML.append(supportedRoleXXML);
                                                break;
                                        }
                                    }
                                }

                                //Uses Environment
                                environments = getNeighborsByEdgeType(data,nodeId,'Uses Environment',false);
                                for(environmentId in environments){
                                    if(environments.hasOwnProperty(environmentId)){
                                        environment = environments[environmentId];
                                        switch(environment.type){
                                            case 'Environment':
                                                environmentXXML = new IMSLDXML('environment-ref')
                                                        .attr('ref',PREFIX.ENVIRONMENT + SEPARATOR + environmentId);
                                                supportActivityXXML.append(environmentXXML);
                                                break;
                                        }
                                    }
                                }

                                //Activity Description
                                activityDescriptionXXML = new IMSLDXML('activity-description');
                                resources = getNeighborsByEdgeType(data,nodeId,'Activity Description',false);
                                for(resourceId in resources){
                                    if(resources.hasOwnProperty(resourceId)){
                                        resource = resources[resourceId];
                                        switch(resource.type){
                                            case 'File':
                                                resourceXXML = new IMSLDXML('item')
                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + files[getValue(resource,'Filename')].name)
                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                activityDescriptionXXML.append(resourceXXML);
                                                break;
                                            case 'Website':
                                                resourceXXML = new IMSLDXML('item')
                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + getValue(resource,'URL'))
                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                activityDescriptionXXML.append(resourceXXML);
                                                break;
                                        }
                                    }
                                }
                                supportActivityXXML.append(activityDescriptionXXML);


                                activitiesXXML.append(supportActivityXXML);
                                break;

                            case "Learning Activity":
                                activitiesXXML = activitiesXXML || new IMSLDXML('activities');
                                learningActivityXXML = new IMSLDXML('learning-activity')
                                        .attr('identifier',PREFIX.ACTIVITY.LEARNING + SEPARATOR + nodeId)
                                        .attr('isvisible',getValue(node,'isVisible'))
                                        .append(new IMSLDXML('title',getValue(node,'Title')));

                                //Learning Objectives
                                resources = getNeighborsByEdgeType(data,nodeId,'Has Learning Objective',false);
                                if(_.size(resources) > 0){
                                    learningObjectivesXXML = new IMSLDXML('learning-objectives');
                                    for(resourceId in resources){
                                        if(resources.hasOwnProperty(resourceId)){
                                            resource = resources[resourceId];
                                            switch(resource.type){
                                                case 'File':
                                                    resourceXXML = new IMSLDXML('item')
                                                            .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                            .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + files[getValue(resource,'Filename')].name)
                                                            .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                    learningObjectivesXXML.append(resourceXXML);
                                                    break;
                                                case 'Website':
                                                    resourceXXML = new IMSLDXML('item')
                                                            .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                            .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + getValue(resource,'URL'))
                                                            .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                    learningObjectivesXXML.append(resourceXXML);
                                                    break;
                                            }
                                        }
                                    }
                                    learningActivityXXML.append(learningObjectivesXXML);
                                }

                                //Uses Environment
                                environments = getNeighborsByEdgeType(data,nodeId,'Uses Environment',false);
                                for(environmentId in environments){
                                    if(environments.hasOwnProperty(environmentId)){
                                        environment = environments[environmentId];
                                        switch(environment.type){
                                            case 'Environment':
                                                environmentXXML = new IMSLDXML('environment-ref')
                                                        .attr('ref',PREFIX.ENVIRONMENT + SEPARATOR + environmentId);
                                                learningActivityXXML.append(environmentXXML);
                                                break;
                                        }
                                    }
                                }

                                //Activity Description
                                activityDescriptionXXML = new IMSLDXML('activity-description');
                                resources = getNeighborsByEdgeType(data,nodeId,'Activity Description',false);
                                for(resourceId in resources){
                                    if(resources.hasOwnProperty(resourceId)){
                                        resource = resources[resourceId];
                                        switch(resource.type){
                                            case 'File':
                                                resourceXXML = new IMSLDXML('item')
                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + files[getValue(resource,'Filename')].name)
                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                activityDescriptionXXML.append(resourceXXML);
                                                break;
                                            case 'Website':
                                                resourceXXML = new IMSLDXML('item')
                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + getValue(resource,'URL'))
                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                activityDescriptionXXML.append(resourceXXML);
                                                break;
                                        }
                                    }
                                }
                                learningActivityXXML.append(activityDescriptionXXML);

                                if(String(getValue(node,'isCompleted')) === 'false'){
                                    if(getValue(node,'Completion Rule') === 'User Choice'){
                                        learningActivityXXML.append(new IMSLDXML('complete-activity').append(new IMSLDXML('user-choice')));
                                    } else { //'Time Limit'
                                        learningActivityXXML.append(new IMSLDXML('complete-activity').append(new IMSLDXML('time-limit')));
                                    }
                                }

                                activitiesXXML.append(learningActivityXXML);
                                break;

                            case "Activity Structure":
                                activitiesXXML = activitiesXXML || new IMSLDXML('activities');
                                activityStructureXXML = new IMSLDXML('activity-structure')
                                        .attr('identifier',PREFIX.ACTIVITY.ACTIVITY_STRUCTURE + SEPARATOR + nodeId)
                                        .attr('number-to-select',getValue(node,'Minimum number of activities'))
                                        .attr('structure-type',getValue(node,'Structure Type'));

                                //Uses Environment
                                environments = getNeighborsByEdgeType(data,nodeId,'Uses Environment',false);
                                for(environmentId in environments){
                                    if(environments.hasOwnProperty(environmentId)){
                                        environment = environments[environmentId];
                                        switch(environment.type){
                                            case 'Environment':
                                                environmentXXML = new IMSLDXML('environment-ref')
                                                        .attr('ref',PREFIX.ENVIRONMENT + SEPARATOR + environmentId);
                                                activityStructureXXML.append(environmentXXML);
                                                break;
                                        }
                                    }
                                }

                                //Has Support Activity
                                supportActivities = getNeighborsByEdgeType(data,nodeId,'Has Support Activity',false);
                                for(supportActivityId in supportActivities){
                                    if(supportActivities.hasOwnProperty(supportActivityId)){
                                        supportActivity = supportActivities[supportActivityId];
                                        switch(supportActivity.type){
                                            case 'Support Activity':
                                                supportActivityXXML = new IMSLDXML('support-activity-ref')
                                                        .attr('ref',PREFIX.ACTIVITY.SUPPORT + SEPARATOR + supportActivityId);
                                                activityStructureXXML.append(supportActivityXXML);
                                                break;
                                        }
                                    }
                                }

                                //Has Learning Activity
                                learningActivities = getNeighborsByEdgeType(data,nodeId,'Has Learning Activity',false);
                                for(learningActivityId in learningActivities){
                                    if(learningActivities.hasOwnProperty(learningActivityId)){
                                        learningActivity = learningActivities[learningActivityId];
                                        switch(learningActivity.type){
                                            case 'Learning Activity':
                                                learningActivityXXML = new IMSLDXML('learning-activity-ref')
                                                        .attr('ref',PREFIX.ACTIVITY.LEARNING + SEPARATOR + learningActivityId);
                                                activityStructureXXML.append(learningActivityXXML);
                                                break;
                                        }
                                    }
                                }

                                activitiesXXML.append(activityStructureXXML);
                                break;

                            //Environments
                            case "Environment":
                                environmentsXXML = environmentsXXML || new IMSLDXML('environments');
                                environmentXXML = new IMSLDXML('environment')
                                        .attr('identifier',PREFIX.ENVIRONMENT + SEPARATOR + nodeId)
                                        .append(new IMSLDXML('title',getValue(node,'Title')));

                                //Uses Conference Service
                                conferences = getNeighborsByEdgeType(data,nodeId,'Uses Conference Service',false);
                                for(conferenceId in conferences){
                                    if(conferences.hasOwnProperty(conferenceId)){
                                        conference = conferences[conferenceId];
                                        switch(conference.type){
                                            case "Conference":
                                                serviceXXML = new IMSLDXML('service')
                                                        .attr('identifier',PREFIX.CONFERENCE + SEPARATOR + conferenceId);
                                                conferenceXXML = new IMSLDXML('conference')
                                                        .attr('conference-type',getValue(conference,'Conference Type'))
                                                        .append(new IMSLDXML('title',getValue(conference,'Title')));
                                                participants = getNeighborsByEdgeType(data,conferenceId,'Has Participant',false);
                                                for(participantId in participants){
                                                    if(participants.hasOwnProperty(participantId)){
                                                        participant = participants[participantId];
                                                        switch(participant.type){
                                                            case "Learner":
                                                            case "Staff":
                                                                participantXXML = new IMSLDXML('participant')
                                                                        .attr('role-ref',PREFIX.ROLE + SEPARATOR + participantId);
                                                                conferenceXXML.append(participantXXML);
                                                                break;
                                                        }
                                                    }
                                                }
                                                resources = getNeighborsByEdgeType(data,conferenceId,'Conference Description',false);
                                                for(resourceId in resources){
                                                    if(resources.hasOwnProperty(resourceId)){
                                                        resource = resources[resourceId];
                                                        switch(resource.type){
                                                            case 'File':
                                                                resourceXXML = new IMSLDXML('item')
                                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + conferenceId + SEPARATOR + resourceId)
                                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + files[getValue(resource,'Filename')].name)
                                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                                conferenceXXML.append(resourceXXML);
                                                                break;
                                                            case 'Website':
                                                                resourceXXML = new IMSLDXML('item')
                                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + conferenceId + SEPARATOR + resourceId)
                                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + getValue(resource,'URL'))
                                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                                conferenceXXML.append(resourceXXML);
                                                                break;
                                                        }
                                                    }
                                                }
                                                serviceXXML.append(conferenceXXML);
                                                environmentXXML.append(serviceXXML);
                                                break;
                                        }
                                    }
                                }

                                //Contains Learning Object
                                learningObjectXXML = new IMSLDXML('learning-object')
                                        .attr('identifier',PREFIX.LEARNING_OBJECT + SEPARATOR + Util.generateRandomId())
                                        .attr('isvisible','true');
                                resources = getNeighborsByEdgeType(data,nodeId,'Contains Learning Object',false);
                                for(resourceId in resources){
                                    if(resources.hasOwnProperty(resourceId)){
                                        resource = resources[resourceId];
                                        switch(resource.type){
                                            case 'File':
                                                resourceXXML = new IMSLDXML('item')
                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + files[getValue(resource,'Filename')].name)
                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                learningObjectXXML.append(resourceXXML);
                                                break;
                                            case 'Website':
                                                resourceXXML = new IMSLDXML('item')
                                                        .attr('identifier',PREFIX.ITEM + SEPARATOR + nodeId + SEPARATOR + resourceId)
                                                        .attr('identifierref',PREFIX.FILE + SEPARATOR + resourceId)// + SEPARATOR + getValue(resource,'URL'))
                                                        .append(new IMSLDXML('title',getValue(resource,'Title')));
                                                learningObjectXXML.append(resourceXXML);
                                                break;
                                        }
                                    }
                                }
                                environmentXXML.append(learningObjectXXML);

                                environmentsXXML.append(environmentXXML);
                                break;

                            //Roles
                            case "Learner":
                                rolesXXML.append(
                                        new IMSLDXML('learner')
                                                .attr('identifier',PREFIX.ROLE + SEPARATOR + nodeId)
                                                .attr('create-new',getValue(node,'Create New'))
                                                .append(new IMSLDXML('title',getValue(node,'Title')))
                                );
                                break;
                            case "Staff":
                                rolesXXML.append(
                                        new IMSLDXML('staff')
                                                .attr('identifier',PREFIX.ROLE + SEPARATOR + nodeId)
                                                .attr('create-new',getValue(node,'Create New'))
                                                .append(new IMSLDXML('title',getValue(node,'Title')))
                                );
                                break;

                            //Acts
                            case "Act":
                                actXXML = new IMSLDXML('act')
                                        .attr('identifier',PREFIX.ACT + SEPARATOR + nodeId)
                                        .append(new IMSLDXML('title',getValue(node,'Title')));

                                //Has Role Part
                                roleParts = getNeighborsByEdgeType(data,nodeId,'Has Role Part',false);
                                for(rolePartId in roleParts){
                                    if(roleParts.hasOwnProperty(rolePartId)){
                                        rolePart = roleParts[rolePartId];
                                        switch(rolePart.type){
                                            case 'Role Part':
                                                rolePartXXML = new IMSLDXML('role-part')
                                                        .attr('identifier',PREFIX.ROLEPART + SEPARATOR + rolePartId)
                                                        .append(new IMSLDXML('title'),getValue(rolePart,'Title'));

                                                //Involved Roles
                                                involvedRoles = getNeighborsByEdgeType(data,rolePartId,'Involves Role',false);
                                                for(involvedRoleId in involvedRoles){
                                                    if(involvedRoles.hasOwnProperty(involvedRoleId)){
                                                        involvedRole = involvedRoles[involvedRoleId];
                                                        switch(involvedRole.type){
                                                            case "Learner":
                                                            case "Staff":
                                                                involvedRoleXXML = new IMSLDXML('role-ref')
                                                                        .attr('ref',PREFIX.ROLE + SEPARATOR + involvedRoleId);
                                                                rolePartXXML.append(involvedRoleXXML);
                                                                break;
                                                        }
                                                    }
                                                }
                                                actXXML.append(rolePartXXML);

                                                //Involved Activity
                                                involvedActivities = getNeighborsByEdgeType(data,rolePartId,'Involves Activity',false);
                                                for(involvedActivityId in involvedActivities){
                                                    if(involvedActivities.hasOwnProperty(involvedActivityId)){
                                                        involvedActivity = involvedActivities[involvedActivityId];
                                                        switch(involvedActivity.type){
                                                            case "Learning Activity":
                                                                involvedActivityXXML = new IMSLDXML('learning-activity-ref')
                                                                        .attr('ref',PREFIX.ACTIVITY.LEARNING + SEPARATOR + involvedActivityId);
                                                                rolePartXXML.append(involvedActivityXXML);
                                                                break;
                                                            case "Support Activity":
                                                                involvedActivityXXML = new IMSLDXML('support-activity-ref')
                                                                        .attr('ref',PREFIX.ACTIVITY.SUPPORT + SEPARATOR + involvedActivityId);
                                                                rolePartXXML.append(involvedActivityXXML);
                                                                break;
                                                            case "Activity Structure":
                                                                involvedActivityXXML = new IMSLDXML('activity-structure-ref')
                                                                        .attr('ref',PREFIX.ACTIVITY.ACTIVITY_STRUCTURE + SEPARATOR + involvedActivityId);
                                                                rolePartXXML.append(involvedActivityXXML);
                                                                break;
                                                            case "Environment":
                                                                involvedActivityXXML = new IMSLDXML('environment-ref')
                                                                        .attr('ref',PREFIX.ACTIVITY.ENVIRONMENT + SEPARATOR + involvedActivityId);
                                                                rolePartXXML.append(involvedActivityXXML);
                                                                break;
                                                        }
                                                    }
                                                }
                                                actXXML.append(rolePartXXML);
                                                break;
                                        }
                                    }
                                }
                                actXMMLSet[nodeId] = actXXML;
                                break;

                            //Resources
                            case "File":
                                resourceXXML = new XXML('resource')
                                        .attr('identifier',PREFIX.FILE + SEPARATOR + nodeId)// + SEPARATOR + files[getValue(node,'Filename')].name)
                                        .attr('type','webcontent')
                                        .attr('href',encodeURI(files[getValue(node,'Filename')].name !== 'undefined' ? files[getValue(node,'Filename')].name : 'http://dbis.rwth-aachen.de/cms'))
                                        .append(new XXML('file').attr('href',encodeURI(files[getValue(node,'Filename')].name !== 'undefined' ? files[getValue(node,'Filename')].name : 'http://dbis.rwth-aachen.de/cms')));
                                resourcesXXML.append(resourceXXML);
                                break;
                            case "Website":
                                resourceXXML = new XXML('resource')
                                        .attr('identifier',PREFIX.FILE + SEPARATOR + nodeId)// + SEPARATOR + getValue(node,'URL'))
                                        .attr('type','webcontent')
                                        .attr('href',encodeURI(getValue(node,'URL')||'http://dbis.rwth-aachen.de/cms'));
                                resourcesXXML.append(resourceXXML);
                                break;
                        }
                    }
                }

                componentsXXL.append(rolesXXML);

                if(activitiesXXML){
                    componentsXXL.append(activitiesXXML);
                }
                if(environmentsXXML){
                    componentsXXL.append(environmentsXXML);
                }
                var groupedPlays = getSequences(data,actXMMLSet);
                for(var i = 0, numOfPlays = groupedPlays.length; i < numOfPlays; i++){
                    playXXML = new IMSLDXML('play')
                            .attr('isvisible','true');
                    for(var j = 0, numOfActs = groupedPlays[i].length; j < numOfActs; j++){
                        playXXML.append(actXMMLSet[groupedPlays[i][j]]);
                    }
                    methodXXL.append(playXXML);
                }

                learningDesignXXML.append(componentsXXL);
                learningDesignXXML.append(methodXXL);

                organizationsXXML.append(learningDesignXXML);
                manifestXXML.append(organizationsXXML).append(resourcesXXML);

                zip.file('imsmanifest.xml','<?xml version="1.0" encoding="utf-8"?>\n'+formatXML(manifestXXML.getNode().outerHTML));

                return zip;
            });
        }

        return $.Deferred().resolve().promise();
    }

    $("#imsld").click(function(){
        MFExport.getJSON(function(data,title){
            createZIP(data).then(function(zip){
                if(zip){
                    var link = document.createElement('a');
                    link.download = title + '.zip';
                    link.href = 'data:application/zip;base64,'+zip.generate();
                    link.click();
                }
            });
        });
    });

    });
</script>
<button id="imsld">Download ZIP</button>