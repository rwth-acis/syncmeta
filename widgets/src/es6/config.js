export const CONFIG = {
  TEST: {
    USER: "Luigi Test",
    EMAIL: "luigi.test05@gmail.com",
    CANVAS: false,
    ATTRIBUTE: false,
    PALETTE: false,
    ACTIVITY: false,
  },
  LAYER: {
    META: "META",
    MODEL: "MODEL",
  },
  WIDGET: {
    NAME: {
      MAIN: "Canvas",
      PALETTE: "Palette",
      ATTRIBUTE: "Property Browser",
      ACTIVITY: "User Activity",
      GUIDANCE: "Guidance",
      HEATMAP: "Heatmap",
      METADATA: "METADATA",
      OPENAPI: "Metadata Widget",
      DEBUG: "Debug",
      IMSLD_EXPORT: "IMSLD Export",
      JSON_EXPORT: "JSON Export",
      VIEWCONTROL: "View Control",
    },
  },
  ENTITY: {
    NODE: "node",
    EDGE: "edge",
    ATTR: "attr",
    VAL: "val",
  },
  IWC: {
    FLAG: {
      PUBLISH_GLOBAL: "PUBLISH_GLOBAL",
      PUBLISH_LOCAL: "PUBLISH_LOCAL",
    },
    ACTION: {
      SYNC: "ACTION_SYNC",
      DATA: "ACTION_DATA",
      DATA_ARRAY: "ACTION_DATA_ARRAY",
    },
    POSITION: {
      NODE: {
        ADD: 0,
        DEL: 0,
        POS: 1,
        Z: 2,
        DIM: 3,
      },
      EDGE: {
        ADD: 0,
        DEL: 0,
        MOV: 1,
      },
      ATTR: {
        ADD: 0,
        DEL: 0,
      },
    },
  },
  OPERATION: {
    TYPE: {
      INSERT: "insert",
      UPDATE: "update",
      DELETE: "delete",
    },
  },
  ACTIVITY: {
    TYPE: {
      NODEADD: 0,
      EDGEADD: 1,
      NODEDEL: 2,
      EDGEDEL: 3,
      NODEATTRCHANGE: 4,
    },
  },
  DATA: {
    RELATION: {
      GLOBAL: {
        MAIN: {
          MAIN: {
            OPERATION: "MAIN2MAIN4OPERATION",
          },
        },
      },
      LOCAL: {
        PALETTE: {
          MAIN: {
            TOOLSELECTION: "PALETTE2MAIN4TOOLSELECTION",
          },
        },
        MAIN: {
          ATTRIBUTE: {
            NODESELECTION: "MAIN2ATTRIBUTE4NODESELECTION",
            NODEADDITION: "MAIN2ATTRIBUTE4NODEADDITION",
            ATTRIBUTECHANGE: "MAIN2ATTRIBUTE4ATTRIBUTECHANGE",
          },
          ACTIVITY: {
            NEWACTIVITY: "MAIN2ACTIVITY4NEWACTIVITY",
          },
          PALETTE: {
            TOOLSELECTION: "MAIN2PALETTE4TOOLSELECTION",
          },
        },
        ATTRIBUTE: {
          MAIN: {
            ATTRIBUTECHANGE: "ATTRIBUTE2MAIN4ATTRIBUTECHANGE",
          },
        },
      },
    },
  },
  NS: {
    PERSON: {
      TITLE: "http://purl.org/dc/terms/title",
      JABBERID: "http://xmlns.com/foaf/0.1/jabberID",
      MBOX: "http://xmlns.com/foaf/0.1/mbox",
    },
    MY: {
      MODEL: "my:ns:model",
      METAMODEL: "my:ns:metamodel",
      INSTANCE: "my:ns:instance",
      VIEWPOINT: "my:ns:viewpoint",
      VIEW: "my:ns:view",
      COPY: "my:ns:copy",
      GUIDANCEMODEL: "my:ns:guidancemodel",
      METAMODELPREVIEW: "my:ns:metamodelpreview",
      GUIDANCEMETAMODEL: "my:ns:guidancemetamodel",
      LOGICALGUIDANCEREPRESENTATION: "my:ns:logicalguidancerepresentation",
    },
  },
};

export function getWidgetTagName(name) {
  //@ts-ignore
  if(!name) return;
  let widgetName = name;
  widgetName = widgetName.replace(/\s+/g, "-");
  return `${widgetName}-widget`.toLowerCase();
}
