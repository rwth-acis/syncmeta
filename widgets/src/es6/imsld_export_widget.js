import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import Util from "./Util";
import MFExport from "./lib/mfexport";
import JSZip from "jszip";
import ILDE from "./lib/ildeApi";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";

const openapp = new OpenAppProvider().openapp;
var XML_PREFIX = "imsld:";

function formatXML(xml) {
  var formatted = "";
  var reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, "$1\r\n$2$3");
  var pad = 0;
  jQuery.each(xml.split("\r\n"), function (index, node) {
    var indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad != 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    var padding = "";
    for (var i = 0; i < pad; i++) {
      padding += "  ";
    }

    formatted += padding + node + "\r\n";
    pad += indent;
  });

  return formatted;
}

function XXML(tagName, innerText, prefix) {
  var _prefix = prefix || "",
    _node = XXML.doc.createElement(_prefix + tagName);

  this.getNode = function () {
    return _node;
  };

  this.attr = function (name, value) {
    if (typeof name === "string" && typeof value === "string") {
      _node.setAttribute(name, value);
    }
    return this;
  };

  this.append = function (xml) {
    if (typeof xml === "string") {
      xml = XXML.doc.createTextNode(xml);
    } else if (xml instanceof XXML) {
      xml = xml.getNode();
    } else {
      return this;
    }
    _node.appendChild(xml);
    return this;
  };

  if (typeof innerText === "string") {
    this.append(innerText);
  }

  return this;
}

class IMSLDXML extends XXML {
  static doc = document.implementation.createDocument(null, null, null);
  constructor(tagName, innerText) {
    super(tagName, innerText, XML_PREFIX);
    return this;
  }
}

function getKey(node, key) {
  var attributeId, attribute;

  for (attributeId in node.attributes) {
    if (node.attributes.hasOwnProperty(attributeId)) {
      attribute = node.attributes[attributeId];
      if (attribute.name === key) {
        return attributeId;
      }
    }
  }
  return "";
}

function getValue(node, key) {
  var attributeId, attribute;

  for (attributeId in node.attributes) {
    if (node.attributes.hasOwnProperty(attributeId)) {
      attribute = node.attributes[attributeId];
      if (attribute.name === key) {
        return attribute.value.value;
      }
    }
  }
  return "";
}

function getNeighborsByEdgeType(data, sourceId, edgeType, isBiDir) {
  var edgeId,
    edge,
    neighbors = {};

  isBiDir = isBiDir === true;
  for (edgeId in data.edges) {
    if (data.edges.hasOwnProperty(edgeId)) {
      edge = data.edges[edgeId];
      if (edge.type === edgeType) {
        if (sourceId === edge.source) {
          neighbors[edge.target] = data.nodes[edge.target];
        } else if (isBiDir && sourceId === edge.target) {
          neighbors[edge.source] = data.nodes[edge.source];
        }
      }
    }
  }
  return neighbors;
}

function getSequences(data, nodeIds) {
  function getSequence(nodeId, visitedNodes, sequences) {
    var seq = [],
      neightbors;

    if (visitedNodes.indexOf(nodeId) === -1) {
      seq.push(nodeId);
      visitedNodes.push(nodeId);
    } else {
      for (
        var i = 0, numOfSequences = sequences.length;
        i < numOfSequences;
        i++
      ) {
        if (sequences[i].length > 0 && sequences[i][0] === nodeId) {
          seq = sequences.splice(i, 1)[0];
          break;
        }
      }
      return seq;
    }
    neightbors = getNeighborsByEdgeType(data, nodeId, "Sequence", false);
    if (_.size(neightbors) > 0) {
      return seq.concat(
        getSequence(_.keys(neightbors)[0], visitedNodes, sequences)
      );
    }
    return seq;
  }

  var currentSequence = [],
    visitedNodes = [],
    sequences = [],
    nodeId;

  for (nodeId in nodeIds) {
    if (nodeIds.hasOwnProperty(nodeId) && visitedNodes.indexOf(nodeId) === -1) {
      currentSequence = getSequence(nodeId, visitedNodes, sequences);
      sequences.push(currentSequence);
    }
  }

  return sequences;
}

var PREFIX = {
  ACT: "act",
  ACTIVITY: {
    SUPPORT: "sa",
    LEARNING: "la",
    ACTIVITY_STRUCTURE: "as",
  },
  CONFERENCE: "conference",
  ENVIRONMENT: "env",
  FILE: "file",
  ITEM: "item",
  LEARNING_DESIGN: "ld",
  LEARNING_OBJECT: "lo",
  ROLE: "role",
  ROLEPART: "rolepart",
  ROLES: "roles",
  WEBSITE: "website",
};

var SEPARATOR = "-";

function createZIP(data) {
  var manifestXXML,
    organizationsXXML,
    resourcesXXML,
    learningDesignXXML,
    componentsXXL,
    rolesXXML,
    activitiesXXML,
    methodXXL,
    supportActivityXXML,
    learningActivityXXML,
    activityStructureXXML,
    supportedRoleXXML,
    supportedRoles,
    supportedRoleId,
    supportedRole,
    involvedRoleXXML,
    involvedRoles,
    involvedRoleId,
    involvedRole,
    involvedActivityXXML,
    involvedActivities,
    involvedActivityId,
    involvedActivity,
    /*supportActivityXXML,*/ supportActivityId,
    supportActivities,
    supportActivity,
    /*learningActivityXXML,*/ learningActivityId,
    learningActivities,
    learningActivity,
    learningObjectivesXXML,
    learningObjectXXML,
    activityDescriptionXXML,
    resourceXXML,
    resourceId,
    resources,
    resource,
    /*environmentXXML,*/ environmentId,
    environments,
    environment,
    environmentsXXML,
    environmentXXML,
    servicesXXML,
    serviceXXML,
    conferenceXXML,
    conferences,
    conferenceId,
    conference,
    participantXXML,
    participants,
    participantId,
    participant,
    playXXML,
    act,
    actXXML,
    actXMMLSet = {},
    rolePartXXML,
    roleParts,
    rolePartId,
    rolePart,
    groupedActIds,
    groupedActId,
    nodeId,
    node,
    deferred,
    promises = [],
    filename,
    files = {};

  var zip = new JSZip();

  function makeFileCallback(url, deferred) {
    return function (data) {
      files[url] = data;
      zip.file(data.name, data.data.split(",")[1], { base64: true });
      deferred.resolve();
    };
  }

  if (data) {
    manifestXXML = new XXML("manifest")
      .attr("xmlns", "http://www.imsglobal.org/xsd/imscp_v1p1")
      .attr("xmlns:imsld", "http://www.imsglobal.org/xsd/imsld_v1p0")
      .attr("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
      .attr(
        "xsi:schemaLocation",
        "http://www.imsglobal.org/xsd/imscp_v1p1 http://www.imsglobal.org/xsd/imscp_v1p1.xsd http://www.imsglobal.org/xsd/imsld_v1p0 http://www.imsglobal.org/xsd/IMS_LD_Level_A.xsd"
      )
      .attr("identifier", "Manifest");

    organizationsXXML = new XXML("organizations");
    resourcesXXML = new XXML("resources");
    learningDesignXXML = new IMSLDXML("learning-design")
      .attr(
        "identifier",
        getValue(data.attributes, "Identifier") ||
          PREFIX.LEARNING_DESIGN + SEPARATOR + Util.generateRandomId()
      )
      .attr("uri", getValue(data.attributes, "URI") || "http://example.com")
      .attr(
        "sequence-used",
        getValue(data.attributes, "Uses IMS Simple Sequencing").toString()
      )
      .attr("version", "1.0.0")
      .attr("level", "A")
      .append(new IMSLDXML("title", getValue(data.attributes, "Title")));

    componentsXXL = new IMSLDXML("components");
    methodXXL = new IMSLDXML("method");

    rolesXXML = new IMSLDXML("roles").attr(
      "identifier",
      PREFIX.ROLES + SEPARATOR + Util.generateRandomId()
    );

    for (nodeId in data.nodes) {
      if (data.nodes.hasOwnProperty(nodeId)) {
        node = data.nodes[nodeId];
        switch (node.type) {
          case "File":
            deferred = $.Deferred();
            filename = getValue(node, "Filename");
            if (filename) {
              $.get(filename + "/:representation").done(
                makeFileCallback(filename, deferred)
              );
              promises.push(deferred.promise());
            } else {
              files[filename] = {
                name: "undefined",
                data: "undefined",
                type: "undefined",
              };
            }
        }
      }
    }

    return $.when.apply($, promises).then(function () {
      for (nodeId in data.nodes) {
        if (data.nodes.hasOwnProperty(nodeId)) {
          node = data.nodes[nodeId];
          switch (node.type) {
            //Activities
            case "Support Activity":
              activitiesXXML = activitiesXXML || new IMSLDXML("activities");
              supportActivityXXML = new IMSLDXML("support-activity")
                .attr(
                  "identifier",
                  PREFIX.ACTIVITY.SUPPORT + SEPARATOR + nodeId
                )
                .attr("isvisible", getValue(node, "isVisible"))
                .append(new IMSLDXML("title", getValue(node, "Title")));

              //Supported Role
              supportedRoles = getNeighborsByEdgeType(
                data,
                nodeId,
                "Supported Role",
                false
              );
              for (supportedRoleId in supportedRoles) {
                if (supportedRoles.hasOwnProperty(supportedRoleId)) {
                  supportedRole = supportedRoles[supportedRoleId];
                  switch (supportedRole.type) {
                    case "Learner":
                    case "Staff":
                      supportedRoleXXML = new IMSLDXML("role-ref").attr(
                        "ref",
                        PREFIX.ROLE + SEPARATOR + supportedRoleId
                      );
                      supportActivityXXML.append(supportedRoleXXML);
                      break;
                  }
                }
              }

              //Uses Environment
              environments = getNeighborsByEdgeType(
                data,
                nodeId,
                "Uses Environment",
                false
              );
              for (environmentId in environments) {
                if (environments.hasOwnProperty(environmentId)) {
                  environment = environments[environmentId];
                  switch (environment.type) {
                    case "Environment":
                      environmentXXML = new IMSLDXML("environment-ref").attr(
                        "ref",
                        PREFIX.ENVIRONMENT + SEPARATOR + environmentId
                      );
                      supportActivityXXML.append(environmentXXML);
                      break;
                  }
                }
              }

              //Activity Description
              activityDescriptionXXML = new IMSLDXML("activity-description");
              resources = getNeighborsByEdgeType(
                data,
                nodeId,
                "Activity Description",
                false
              );
              for (resourceId in resources) {
                if (resources.hasOwnProperty(resourceId)) {
                  resource = resources[resourceId];
                  switch (resource.type) {
                    case "File":
                      resourceXXML = new IMSLDXML("item")
                        .attr(
                          "identifier",
                          PREFIX.ITEM +
                            SEPARATOR +
                            nodeId +
                            SEPARATOR +
                            resourceId
                        )
                        .attr(
                          "identifierref",
                          PREFIX.FILE + SEPARATOR + resourceId
                        ) // + SEPARATOR + files[getValue(resource,'Filename')].name)
                        .append(
                          new IMSLDXML("title", getValue(resource, "Title"))
                        );
                      activityDescriptionXXML.append(resourceXXML);
                      break;
                    case "Website":
                      resourceXXML = new IMSLDXML("item")
                        .attr(
                          "identifier",
                          PREFIX.ITEM +
                            SEPARATOR +
                            nodeId +
                            SEPARATOR +
                            resourceId
                        )
                        .attr(
                          "identifierref",
                          PREFIX.FILE + SEPARATOR + resourceId
                        ) // + SEPARATOR + getValue(resource,'URL'))
                        .append(
                          new IMSLDXML("title", getValue(resource, "Title"))
                        );
                      activityDescriptionXXML.append(resourceXXML);
                      break;
                  }
                }
              }
              supportActivityXXML.append(activityDescriptionXXML);

              activitiesXXML.append(supportActivityXXML);
              break;

            case "Learning Activity":
              activitiesXXML = activitiesXXML || new IMSLDXML("activities");
              learningActivityXXML = new IMSLDXML("learning-activity")
                .attr(
                  "identifier",
                  PREFIX.ACTIVITY.LEARNING + SEPARATOR + nodeId
                )
                .attr("isvisible", getValue(node, "isVisible"))
                .append(new IMSLDXML("title", getValue(node, "Title")));

              //Learning Objectives
              resources = getNeighborsByEdgeType(
                data,
                nodeId,
                "Has Learning Objective",
                false
              );
              if (_.size(resources) > 0) {
                learningObjectivesXXML = new IMSLDXML("learning-objectives");
                for (resourceId in resources) {
                  if (resources.hasOwnProperty(resourceId)) {
                    resource = resources[resourceId];
                    switch (resource.type) {
                      case "File":
                        resourceXXML = new IMSLDXML("item")
                          .attr(
                            "identifier",
                            PREFIX.ITEM +
                              SEPARATOR +
                              nodeId +
                              SEPARATOR +
                              resourceId
                          )
                          .attr(
                            "identifierref",
                            PREFIX.FILE + SEPARATOR + resourceId
                          ) // + SEPARATOR + files[getValue(resource,'Filename')].name)
                          .append(
                            new IMSLDXML("title", getValue(resource, "Title"))
                          );
                        learningObjectivesXXML.append(resourceXXML);
                        break;
                      case "Website":
                        resourceXXML = new IMSLDXML("item")
                          .attr(
                            "identifier",
                            PREFIX.ITEM +
                              SEPARATOR +
                              nodeId +
                              SEPARATOR +
                              resourceId
                          )
                          .attr(
                            "identifierref",
                            PREFIX.FILE + SEPARATOR + resourceId
                          ) // + SEPARATOR + getValue(resource,'URL'))
                          .append(
                            new IMSLDXML("title", getValue(resource, "Title"))
                          );
                        learningObjectivesXXML.append(resourceXXML);
                        break;
                    }
                  }
                }
                learningActivityXXML.append(learningObjectivesXXML);
              }

              //Uses Environment
              environments = getNeighborsByEdgeType(
                data,
                nodeId,
                "Uses Environment",
                false
              );
              for (environmentId in environments) {
                if (environments.hasOwnProperty(environmentId)) {
                  environment = environments[environmentId];
                  switch (environment.type) {
                    case "Environment":
                      environmentXXML = new IMSLDXML("environment-ref").attr(
                        "ref",
                        PREFIX.ENVIRONMENT + SEPARATOR + environmentId
                      );
                      learningActivityXXML.append(environmentXXML);
                      break;
                  }
                }
              }

              //Activity Description
              activityDescriptionXXML = new IMSLDXML("activity-description");
              resources = getNeighborsByEdgeType(
                data,
                nodeId,
                "Activity Description",
                false
              );
              for (resourceId in resources) {
                if (resources.hasOwnProperty(resourceId)) {
                  resource = resources[resourceId];
                  switch (resource.type) {
                    case "File":
                      resourceXXML = new IMSLDXML("item")
                        .attr(
                          "identifier",
                          PREFIX.ITEM +
                            SEPARATOR +
                            nodeId +
                            SEPARATOR +
                            resourceId
                        )
                        .attr(
                          "identifierref",
                          PREFIX.FILE + SEPARATOR + resourceId
                        ) // + SEPARATOR + files[getValue(resource,'Filename')].name)
                        .append(
                          new IMSLDXML("title", getValue(resource, "Title"))
                        );
                      activityDescriptionXXML.append(resourceXXML);
                      break;
                    case "Website":
                      resourceXXML = new IMSLDXML("item")
                        .attr(
                          "identifier",
                          PREFIX.ITEM +
                            SEPARATOR +
                            nodeId +
                            SEPARATOR +
                            resourceId
                        )
                        .attr(
                          "identifierref",
                          PREFIX.FILE + SEPARATOR + resourceId
                        ) // + SEPARATOR + getValue(resource,'URL'))
                        .append(
                          new IMSLDXML("title", getValue(resource, "Title"))
                        );
                      activityDescriptionXXML.append(resourceXXML);
                      break;
                  }
                }
              }
              learningActivityXXML.append(activityDescriptionXXML);

              if (String(getValue(node, "isCompleted")) === "false") {
                if (getValue(node, "Completion Rule") === "User Choice") {
                  learningActivityXXML.append(
                    new IMSLDXML("complete-activity").append(
                      new IMSLDXML("user-choice")
                    )
                  );
                } else {
                  //'Time Limit'
                  learningActivityXXML.append(
                    new IMSLDXML("complete-activity").append(
                      new IMSLDXML("time-limit")
                    )
                  );
                }
              }

              activitiesXXML.append(learningActivityXXML);
              break;

            case "Activity Structure":
              activitiesXXML = activitiesXXML || new IMSLDXML("activities");
              activityStructureXXML = new IMSLDXML("activity-structure")
                .attr(
                  "identifier",
                  PREFIX.ACTIVITY.ACTIVITY_STRUCTURE + SEPARATOR + nodeId
                )
                .attr(
                  "number-to-select",
                  getValue(node, "Minimum number of activities")
                )
                .attr("structure-type", getValue(node, "Structure Type"));

              //Uses Environment
              environments = getNeighborsByEdgeType(
                data,
                nodeId,
                "Uses Environment",
                false
              );
              for (environmentId in environments) {
                if (environments.hasOwnProperty(environmentId)) {
                  environment = environments[environmentId];
                  switch (environment.type) {
                    case "Environment":
                      environmentXXML = new IMSLDXML("environment-ref").attr(
                        "ref",
                        PREFIX.ENVIRONMENT + SEPARATOR + environmentId
                      );
                      activityStructureXXML.append(environmentXXML);
                      break;
                  }
                }
              }

              //Has Support Activity
              supportActivities = getNeighborsByEdgeType(
                data,
                nodeId,
                "Has Support Activity",
                false
              );
              for (supportActivityId in supportActivities) {
                if (supportActivities.hasOwnProperty(supportActivityId)) {
                  supportActivity = supportActivities[supportActivityId];
                  switch (supportActivity.type) {
                    case "Support Activity":
                      supportActivityXXML = new IMSLDXML(
                        "support-activity-ref"
                      ).attr(
                        "ref",
                        PREFIX.ACTIVITY.SUPPORT + SEPARATOR + supportActivityId
                      );
                      activityStructureXXML.append(supportActivityXXML);
                      break;
                  }
                }
              }

              //Has Learning Activity
              learningActivities = getNeighborsByEdgeType(
                data,
                nodeId,
                "Has Learning Activity",
                false
              );
              for (learningActivityId in learningActivities) {
                if (learningActivities.hasOwnProperty(learningActivityId)) {
                  learningActivity = learningActivities[learningActivityId];
                  switch (learningActivity.type) {
                    case "Learning Activity":
                      learningActivityXXML = new IMSLDXML(
                        "learning-activity-ref"
                      ).attr(
                        "ref",
                        PREFIX.ACTIVITY.LEARNING +
                          SEPARATOR +
                          learningActivityId
                      );
                      activityStructureXXML.append(learningActivityXXML);
                      break;
                  }
                }
              }

              activitiesXXML.append(activityStructureXXML);
              break;

            //Environments
            case "Environment":
              environmentsXXML =
                environmentsXXML || new IMSLDXML("environments");
              environmentXXML = new IMSLDXML("environment")
                .attr("identifier", PREFIX.ENVIRONMENT + SEPARATOR + nodeId)
                .append(new IMSLDXML("title", getValue(node, "Title")));

              //Uses Conference Service
              conferences = getNeighborsByEdgeType(
                data,
                nodeId,
                "Uses Conference Service",
                false
              );
              for (conferenceId in conferences) {
                if (conferences.hasOwnProperty(conferenceId)) {
                  conference = conferences[conferenceId];
                  switch (conference.type) {
                    case "Conference":
                      serviceXXML = new IMSLDXML("service").attr(
                        "identifier",
                        PREFIX.CONFERENCE + SEPARATOR + conferenceId
                      );
                      conferenceXXML = new IMSLDXML("conference")
                        .attr(
                          "conference-type",
                          getValue(conference, "Conference Type")
                        )
                        .append(
                          new IMSLDXML("title", getValue(conference, "Title"))
                        );
                      participants = getNeighborsByEdgeType(
                        data,
                        conferenceId,
                        "Has Participant",
                        false
                      );
                      for (participantId in participants) {
                        if (participants.hasOwnProperty(participantId)) {
                          participant = participants[participantId];
                          switch (participant.type) {
                            case "Learner":
                            case "Staff":
                              participantXXML = new IMSLDXML(
                                "participant"
                              ).attr(
                                "role-ref",
                                PREFIX.ROLE + SEPARATOR + participantId
                              );
                              conferenceXXML.append(participantXXML);
                              break;
                          }
                        }
                      }
                      resources = getNeighborsByEdgeType(
                        data,
                        conferenceId,
                        "Conference Description",
                        false
                      );
                      for (resourceId in resources) {
                        if (resources.hasOwnProperty(resourceId)) {
                          resource = resources[resourceId];
                          switch (resource.type) {
                            case "File":
                              resourceXXML = new IMSLDXML("item")
                                .attr(
                                  "identifier",
                                  PREFIX.ITEM +
                                    SEPARATOR +
                                    conferenceId +
                                    SEPARATOR +
                                    resourceId
                                )
                                .attr(
                                  "identifierref",
                                  PREFIX.FILE + SEPARATOR + resourceId
                                ) // + SEPARATOR + files[getValue(resource,'Filename')].name)
                                .append(
                                  new IMSLDXML(
                                    "title",
                                    getValue(resource, "Title")
                                  )
                                );
                              conferenceXXML.append(resourceXXML);
                              break;
                            case "Website":
                              resourceXXML = new IMSLDXML("item")
                                .attr(
                                  "identifier",
                                  PREFIX.ITEM +
                                    SEPARATOR +
                                    conferenceId +
                                    SEPARATOR +
                                    resourceId
                                )
                                .attr(
                                  "identifierref",
                                  PREFIX.FILE + SEPARATOR + resourceId
                                ) // + SEPARATOR + getValue(resource,'URL'))
                                .append(
                                  new IMSLDXML(
                                    "title",
                                    getValue(resource, "Title")
                                  )
                                );
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
              learningObjectXXML = new IMSLDXML("learning-object")
                .attr(
                  "identifier",
                  PREFIX.LEARNING_OBJECT + SEPARATOR + Util.generateRandomId()
                )
                .attr("isvisible", "true");
              resources = getNeighborsByEdgeType(
                data,
                nodeId,
                "Contains Learning Object",
                false
              );
              for (resourceId in resources) {
                if (resources.hasOwnProperty(resourceId)) {
                  resource = resources[resourceId];
                  switch (resource.type) {
                    case "File":
                      resourceXXML = new IMSLDXML("item")
                        .attr(
                          "identifier",
                          PREFIX.ITEM +
                            SEPARATOR +
                            nodeId +
                            SEPARATOR +
                            resourceId
                        )
                        .attr(
                          "identifierref",
                          PREFIX.FILE + SEPARATOR + resourceId
                        ) // + SEPARATOR + files[getValue(resource,'Filename')].name)
                        .append(
                          new IMSLDXML("title", getValue(resource, "Title"))
                        );
                      learningObjectXXML.append(resourceXXML);
                      break;
                    case "Website":
                      resourceXXML = new IMSLDXML("item")
                        .attr(
                          "identifier",
                          PREFIX.ITEM +
                            SEPARATOR +
                            nodeId +
                            SEPARATOR +
                            resourceId
                        )
                        .attr(
                          "identifierref",
                          PREFIX.FILE + SEPARATOR + resourceId
                        ) // + SEPARATOR + getValue(resource,'URL'))
                        .append(
                          new IMSLDXML("title", getValue(resource, "Title"))
                        );
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
                new IMSLDXML("learner")
                  .attr("identifier", PREFIX.ROLE + SEPARATOR + nodeId)
                  .attr("create-new", getValue(node, "Create New"))
                  .append(new IMSLDXML("title", getValue(node, "Title")))
              );
              break;
            case "Staff":
              rolesXXML.append(
                new IMSLDXML("staff")
                  .attr("identifier", PREFIX.ROLE + SEPARATOR + nodeId)
                  .attr("create-new", getValue(node, "Create New"))
                  .append(new IMSLDXML("title", getValue(node, "Title")))
              );
              break;

            //Acts
            case "Act":
              actXXML = new IMSLDXML("act")
                .attr("identifier", PREFIX.ACT + SEPARATOR + nodeId)
                .append(new IMSLDXML("title", getValue(node, "Title")));

              //Has Role Part
              roleParts = getNeighborsByEdgeType(
                data,
                nodeId,
                "Has Role Part",
                false
              );
              for (rolePartId in roleParts) {
                if (roleParts.hasOwnProperty(rolePartId)) {
                  rolePart = roleParts[rolePartId];
                  switch (rolePart.type) {
                    case "Role Part":
                      rolePartXXML = new IMSLDXML("role-part")
                        .attr(
                          "identifier",
                          PREFIX.ROLEPART + SEPARATOR + rolePartId
                        )
                        .append(
                          new IMSLDXML("title"),
                          getValue(rolePart, "Title")
                        );

                      //Involved Roles
                      involvedRoles = getNeighborsByEdgeType(
                        data,
                        rolePartId,
                        "Involves Role",
                        false
                      );
                      for (involvedRoleId in involvedRoles) {
                        if (involvedRoles.hasOwnProperty(involvedRoleId)) {
                          involvedRole = involvedRoles[involvedRoleId];
                          switch (involvedRole.type) {
                            case "Learner":
                            case "Staff":
                              involvedRoleXXML = new IMSLDXML("role-ref").attr(
                                "ref",
                                PREFIX.ROLE + SEPARATOR + involvedRoleId
                              );
                              rolePartXXML.append(involvedRoleXXML);
                              break;
                          }
                        }
                      }
                      actXXML.append(rolePartXXML);

                      //Involved Activity
                      involvedActivities = getNeighborsByEdgeType(
                        data,
                        rolePartId,
                        "Involves Activity",
                        false
                      );
                      for (involvedActivityId in involvedActivities) {
                        if (
                          involvedActivities.hasOwnProperty(involvedActivityId)
                        ) {
                          involvedActivity =
                            involvedActivities[involvedActivityId];
                          switch (involvedActivity.type) {
                            case "Learning Activity":
                              involvedActivityXXML = new IMSLDXML(
                                "learning-activity-ref"
                              ).attr(
                                "ref",
                                PREFIX.ACTIVITY.LEARNING +
                                  SEPARATOR +
                                  involvedActivityId
                              );
                              rolePartXXML.append(involvedActivityXXML);
                              break;
                            case "Support Activity":
                              involvedActivityXXML = new IMSLDXML(
                                "support-activity-ref"
                              ).attr(
                                "ref",
                                PREFIX.ACTIVITY.SUPPORT +
                                  SEPARATOR +
                                  involvedActivityId
                              );
                              rolePartXXML.append(involvedActivityXXML);
                              break;
                            case "Activity Structure":
                              involvedActivityXXML = new IMSLDXML(
                                "activity-structure-ref"
                              ).attr(
                                "ref",
                                PREFIX.ACTIVITY.ACTIVITY_STRUCTURE +
                                  SEPARATOR +
                                  involvedActivityId
                              );
                              rolePartXXML.append(involvedActivityXXML);
                              break;
                            case "Environment":
                              involvedActivityXXML = new IMSLDXML(
                                "environment-ref"
                              ).attr(
                                "ref",
                                PREFIX.ACTIVITY.ENVIRONMENT +
                                  SEPARATOR +
                                  involvedActivityId
                              );
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
              resourceXXML = new XXML("resource")
                .attr("identifier", PREFIX.FILE + SEPARATOR + nodeId) // + SEPARATOR + files[getValue(node,'Filename')].name)
                .attr("type", "webcontent")
                .attr(
                  "href",
                  encodeURI(
                    files[getValue(node, "Filename")].name !== "undefined"
                      ? files[getValue(node, "Filename")].name
                      : "http://dbis.rwth-aachen.de/cms"
                  )
                )
                .append(
                  new XXML("file").attr(
                    "href",
                    encodeURI(
                      files[getValue(node, "Filename")].name !== "undefined"
                        ? files[getValue(node, "Filename")].name
                        : "http://dbis.rwth-aachen.de/cms"
                    )
                  )
                );
              resourcesXXML.append(resourceXXML);
              break;
            case "Website":
              resourceXXML = new XXML("resource")
                .attr("identifier", PREFIX.FILE + SEPARATOR + nodeId) // + SEPARATOR + getValue(node,'URL'))
                .attr("type", "webcontent")
                .attr(
                  "href",
                  encodeURI(
                    getValue(node, "URL") || "http://dbis.rwth-aachen.de/cms"
                  )
                );
              resourcesXXML.append(resourceXXML);
              break;
          }
        }
      }

      componentsXXL.append(rolesXXML);

      if (activitiesXXML) {
        componentsXXL.append(activitiesXXML);
      }
      if (environmentsXXML) {
        componentsXXL.append(environmentsXXML);
      }
      var groupedPlays = getSequences(data, actXMMLSet);
      for (var i = 0, numOfPlays = groupedPlays.length; i < numOfPlays; i++) {
        playXXML = new IMSLDXML("play").attr("isvisible", "true");
        for (
          var j = 0, numOfActs = groupedPlays[i].length;
          j < numOfActs;
          j++
        ) {
          playXXML.append(actXMMLSet[groupedPlays[i][j]]);
        }
        methodXXL.append(playXXML);
      }

      learningDesignXXML.append(componentsXXL);
      learningDesignXXML.append(methodXXL);

      organizationsXXML.append(learningDesignXXML);
      manifestXXML.append(organizationsXXML).append(resourcesXXML);

      zip.file(
        "imsmanifest.xml",
        '<?xml version="1.0" encoding="utf-8"?>\n' +
          formatXML(manifestXXML.getNode().outerHTML)
      );

      return zip;
    });
  }

  return $.Deferred().resolve().promise();
}

$("#imsld").click(function () {
  MFExport.getJSON(function (data, title) {
    createZIP(data).then(function (zip) {
      if (zip) {
        var link = document.createElement("a");
        link.download = title + ".zip";
        link.href = "data:application/zip;base64," + zip.generate();
        link.click();
      }
    });
  });
});
window.createImsldZip = function (f) {
  MFExport.getJSON(function (data, title) {
    createZIP(data).then(function (zip) {
      if (zip) {
        var blob = zip.generate({ type: "blob" });
        console.log(
          "uitdarne dutirane dturinadet runiaeuia e-uiae---------- udiatren d-- "
        );
        f(blob);
      } else {
        console.log(
          "for some reason you were not able to create the fucking zip"
        );
        var blob = new Blob([], { type: "data:application/zip;base64," });
        f(blob);
      }
    });
  });
};

$(function () {
  var ilde;

  var space = new openapp.oo.Resource(openapp.param.space());
  var context;
  var existing_ilde_id;
  var existing_ilde_title;
  var existing_ilde_resource;
  openapp.resource.get(openapp.param.space(), function (s) {
    context = s;
  });
  function createResource(ildeid, ildetitle) {
    var resource = getIldeResource();
    var currentTime = new Date();
    var documentText = {
      ilde: ildeid,
      title: ildetitle,
      resource: resource,
    };
    space.create({
      relation: openapp.ns.role + "data",
      type: "my:ns:documentText",
      representation: documentText,
      callback: function (sub) {
        // Success notification
        saySuccess();
      },
    });
  }
  // if possible, get the existing ilde id, title, and
  // installation url (in the following named 'resource')
  function getResource() {
    space.getSubResources({
      relation: openapp.ns.role + "data",
      type: "my:ns:documentText",
      onEach: function (documentText) {
        documentText.getRepresentation("rdfjson", function (r) {
          if (r.ilde != null) {
            existing_ilde_id = r.ilde;

            var downloadButton = $("#downloadIldeButton");
            if (downloadButton.classList != null) {
              downloadButton.classList.remove("nodisplay");
            }
            existing_ilde_id = r.ilde;
            existing_ilde_title = r.title;
            existing_ilde_resource = r.resource;
            lockIldeResource(r.resource);
            whenIldeExists();
          }
        });
      },
    });
  }
  // if there is an existing ildeid, find it.
  getResource();
  // Function that is called, when ilde exists.
  function whenIldeExists() {
    $("#syncIldeDiv").removeClass("nodisplay");
    $("#createIldeDiv").addClass("nodisplay");
    var resource = getIldeResource();
    var url;
    if (resource === "") {
      url = "http://ilde.upf.edu/pg/lds/vieweditor/" + existing_ilde_id;
    } else {
      url =
        "http://ilde.upf.edu/" +
        resource +
        "/pg/lds/vieweditor/" +
        existing_ilde_id;
    }
    $("#ildeLink").attr("href", url);
    $("#ildeLink").text(url);
  }
  function whenIldeNotExists() {
    $("#syncIldeDiv").addClass("nodisplay");
    $("#createIldeDiv").removeClass("nodisplay");
  }
  // Delete everything about ilde in openapp.
  function deleteAllResources() {
    //ilde.deleteLdsById(existing_ilde_id); // the ILDE rest service does not support CORS
    //$("#removeIldeButton").addClass("loading_button");
    var mlist = openapp.resource
      .context(context)
      .sub(openapp.ns.role + "data")
      .type("my:ns:documentText")
      .list();
    for (var i = 0; i < mlist.length; i++) {
      openapp.resource.del(mlist[i].uri);
    }
    // delete existing_ilde_id and existing_ilde_title
    existing_ilde_id = null;
    existing_ilde_title = null;
    ilde = null;
    unlockIldeResource();
    whenIldeNotExists();
    saySuccess("Space is now unlinked");
  }
  // Print a success message for a short period of time.
  function saySuccess() {
    $("#success_notification").removeClass("nodisplay");
    setTimeout(function () {
      $("#success_notification").addClass("nodisplay");
    }, 1500);
    gadgets.window.adjustHeight();
  }
  // Print aan error message for a short period of time.
  function sayError(error_message) {
    console.log("idle error: stuff happened");
    var error_div = $(".error_notification");
    error_div.removeClass("nodisplay");
    error_div.text(error_message);
    setTimeout(function () {
      error_div.addClass("nodisplay");
    }, 3000);
    gadgets.window.adjustHeight();
  }
  window.sayError = sayError;
  // execute a function ('aOnLogin'), after the user filled in its
  // credentials, and the ilde ressource is created. (see ildeApi.js in lib)
  // When the user is already logged in (variable ilde exists), then
  // apply it right away.
  function applyOnLogin(aOnLogin) {
    if (ilde == null) {
      $("#ilde_upload_form").addClass("nodisplay");
      $("#ilde_login_form").removeClass("nodisplay");
      gadgets.window.adjustHeight();
      $("#ilde_login_form").submit(function (event) {
        var username = this.querySelector("[name=username]").value;
        var password = this.querySelector("[name=password]").value;
        var resource = this.querySelector("[name=resource]").value;
        ilde = new ILDE(username, password, getIldeResource());
        ilde.onLoginSuccess(function () {
          lockIldeResource(resource);
          $("#ilde_login_form").addClass("nodisplay");
          $("#ilde_upload_form").removeClass("nodisplay");
          aOnLogin();
          gadgets.window.adjustHeight();
        });
        ilde.onLoginFail(function () {
          sayError("Please check your login credentils and installation URL!");
          ilde = null;
        });
        event.preventDefault();
      });
    } else {
      aOnLogin();
      event.preventDefault();
    }
  }
  function unlockIldeResource() {
    var ir = $("#ildeResource");
    ir.val("http://ilde.upf.edu/");
    ir.removeClass("inputreadonly");
    ir.removeAttr("readonly");
  }
  // Lock the url to the ilde installation.
  // This implies, that the login field is not editable anymore
  // and the url cannot be changed.
  // set res_s = "agora" or res_s = "http://ilde.upf.edu/agora" has the same effect.
  function lockIldeResource(res_s) {
    if (res_s == null) {
      sayError("This is not a valid installation URL!");
      return false;
    }
    if (res_s[res_s.length - 1] != "/" && res_s != "") {
      res_s = res_s + "/";
    }
    var ress = res_s.split("/");
    var resource;
    if (ress.length > 1) {
      resource = ress[3];
      if (resource === "pg") {
        resource = "";
      }
    } else {
      resource = ress[0];
    }

    $("#ildeResource").val("http://ilde.upf.edu/" + resource);
    $("#ildeResource").addClass("inputreadonly");
    $("#ildeResource").attr("readonly", "true");
    return true;
  }
  // Get the url to the ilde installation.
  // This will return something like "agora" for http://ilde.upf.edu/agora
  function getIldeResource() {
    var res = $("#ildeResource").val();
    if (res.length > 0 && res[res.length - 1] != "/") {
      res = res + "/";
    }
    var eles = res.split("/");
    if (eles[3] != null) {
      return eles[3];
    } else {
      return "undefined";
    }
  }
  // push to ilde. This will get the jsson via MFExport and then
  // push it on the server.
  function syncButtonEvent() {
    applyOnLogin(function () {
      MFExport.getJSON(function (design, title) {
        if (existing_ilde_title != null) {
          title = existing_ilde_title;
        }
        window.createImsldZip(function (zip) {
          ilde.replaceLds(existing_ilde_id, design, zip, function () {
            console.log("ILDE design was replaced.");
            saySuccess();
          });
        });
      });
    });
  }
  // A new design is created when this event occurs.
  // Either, the user filled in an existing ilde design url,
  // (then it will fetch this design first, and the "parent" in properties.xsd is set.then
  // Or a completely new design is created with the existing design in the space.
  //
  function createButtonEvent() {
    function sendCreateButtonEvent() {
      try {
        var message = {
          action: "CREATE_ILDE_BUTTON_PRESSED",
          component: "",
          data: "",
          dataType: "",
          flags: ["PUBLISH_GLOBAL"],
          extras: {
            ilderesource: getIldeResource(),
            existing_ilde_id: existing_ilde_id,
            existing_ilde_title: existing_ilde_title,
          },
        };
        applyWhenIwcClientExists(function () {
          iwcClient.publish(message);
        });
      } catch (e) {
        console.log("was not able to send the intent yet");
      }
    }
    var eles = $("#existingIldeUrl").val();
    if (eles[eles.length - 1] != "/" && eles != "") {
      eles = eles + "/";
    }
    eles = eles.split("/");
    var goback;
    if (eles[eles.length - 1] === "") {
      goback = 2;
    } else {
      goback = 1;
    }
    var id = parseInt(eles[eles.length - goback]);
    if (isNaN(id)) {
      if ($("#existingIldeUrl")[0].value.length > 0) {
        sayError("Please provide a valid URL!");
        return;
      }
      applyOnLogin(function () {
        MFExport.getJSON(function (design, title) {
          // create new ilde design
          window.createImsldZip(function (blob) {
            ilde.newLds(design, blob, null, function (result) {
              existing_ilde_id = result[0].querySelector("id").textContent;
              existing_ilde_title = title;
              createResource(existing_ilde_id, title);
              whenIldeExists();
              sendCreateButtonEvent();
            });
          });
        });
      });
    } else {
      var resource = eles[3];
      if (resource === "pg") {
        resource = "";
      }
      if (lockIldeResource(resource)) {
        applyOnLogin(function () {
          ilde.getLdsDataById(id, function (lds_model) {
            window.createImsldZip(function (blob) {
              ilde.newLds(lds_model, blob, id, function (result) {
                existing_ilde_id = result[0].querySelector("id").textContent;
                createResource(existing_ilde_id, "");
                importFromIlde(existing_ilde_id, lds_model);
                sendCreateButtonEvent();
              });
            });
          });
        });
      }
    }
  }
  var iwcClient = null;
  $("#createIldeButton").click(createButtonEvent);
  $("#syncIldeButton").click(syncButtonEvent);
  $("#removeIldeButton").click(function () {
    try {
      var message = {
        action: "REMOVE_ILDE_BUTTON_PRESSED",
        component: "",
        data: "",
        dataType: "",
        flags: ["PUBLISH_GLOBAL"],
        extras: {},
      };
      applyWhenIwcClientExists(function () {
        iwcClient.publish(message);
      });
    } catch (e) {
      console.log("was not able to send the intent yet");
    }
  });

  // now we do the same for intents
  function watchEvents(intent) {
    if (intent.action === "CREATE_ILDE_BUTTON_PRESSED") {
      lockIldeResource(intent.extras.ilderesource);
      existing_ilde_id = intent.extras.existing_ilde_id;
      existing_ilde_title = intent.extras.existing_ilde_title;
      whenIldeExists();
    } else if (intent.action === "REMOVE_ILDE_BUTTON_PRESSED") {
      deleteAllResources();
    }
  }
  var whenIwcExists = [];
  function tryToSetIwcClient() {
    if (window._addIwcIntentListener != null) {
      iwcClient = window._iwc_instance_;
      window._addIwcIntentListener(watchEvents);
      for (var i = 0; i < whenIwcExists.length; i++) {
        whenIwcExists[i]();
      }
    } else {
      setTimeout(tryToSetIwcClient, 500);
    }
  }
  function applyWhenIwcClientExists(f) {
    if (window._addIwcIntentListener == null) {
      whenIwcExists.push(f);
    } else {
      f();
    }
  }
  tryToSetIwcClient();

  //
  // Fetch an existing design from ilde and use it in this space.
  // Therefore, the openapp resource is overwritten and all widgets must be reloaded.
  // In shared.js we define some helpers that will be implemented in all widgets.
  // When you call window._reloadThisFuckingInstance, then all instances will receive an iwc
  // intent, and perform a magical  window.reload(). Then, hopefully, all widgets use the
  // same design. This works, of course, only if openapp isnt a bitch at the moment.
  //
  function importFromIlde(iid, lds_model) {
    function getData(type) {
      var spaceUri = openapp.param.space(),
        listOfDataUris = [],
        promises = [],
        mainDeferred = $.Deferred(),
        deferred = $.Deferred();

      openapp.resource.get(
        spaceUri,
        (function (deferred) {
          return function (space) {
            var resourceUri, resourceObj, values;
            for (resourceUri in space.data) {
              if (space.data.hasOwnProperty(resourceUri)) {
                resourceObj = space.data[resourceUri];
                if (
                  resourceObj[
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                  ] &&
                  _.isArray(
                    resourceObj[
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                    ]
                  )
                ) {
                  values = _.map(
                    resourceObj[
                      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                    ],
                    function (e) {
                      return e.value;
                    }
                  );

                  if (
                    _.contains(values, "http://purl.org/role/terms/Data") &&
                    _.contains(values, type)
                  ) {
                    listOfDataUris.push(resourceUri);
                  }
                }
              }
            }
            deferred.resolve();
          };
        })(deferred)
      );
      promises.push(deferred.promise());

      $.when.apply($, promises).then(function () {
        mainDeferred.resolve(listOfDataUris);
      });

      return mainDeferred.promise();
    }
    getData(CONFIG.NS.MY.MODEL).then(function (modelUris) {
      if (modelUris.length > 0) {
        _.map(modelUris, function (uri) {
          openapp.resource.del(uri);
        });
      }
      space.create({
        relation: openapp.ns.role + "data",
        type: CONFIG.NS.MY.MODEL,
        representation: lds_model,
        callback: window._reloadThisFuckingInstance,
      });
    });
  }
  gadgets.window.adjustHeight();
});
