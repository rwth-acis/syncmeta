export declare const CONFIG: {
    TEST: {
        USER: string;
        EMAIL: string;
        CANVAS: boolean;
        ATTRIBUTE: boolean;
        PALETTE: boolean;
        ACTIVITY: boolean;
    };
    LAYER: {
        META: string;
        MODEL: string;
    };
    WIDGET: {
        NAME: {
            MAIN: string;
            PALETTE: string;
            ATTRIBUTE: string;
            ACTIVITY: string;
            GUIDANCE: string;
            HEATMAP: string;
            METADATA: string;
            OPENAPI: string;
        };
    };
    ENTITY: {
        NODE: string;
        EDGE: string;
        ATTR: string;
        VAL: string;
    };
    IWC: {
        FLAG: {
            PUBLISH_GLOBAL: string;
            PUBLISH_LOCAL: string;
        };
        ACTION: {
            SYNC: string;
            DATA: string;
            DATA_ARRAY: string;
        };
        POSITION: {
            NODE: {
                ADD: number;
                DEL: number;
                POS: number;
                Z: number;
                DIM: number;
            };
            EDGE: {
                ADD: number;
                DEL: number;
                MOV: number;
            };
            ATTR: {
                ADD: number;
                DEL: number;
            };
        };
    };
    OPERATION: {
        TYPE: {
            INSERT: string;
            UPDATE: string;
            DELETE: string;
        };
    };
    ACTIVITY: {
        TYPE: {
            NODEADD: number;
            EDGEADD: number;
            NODEDEL: number;
            EDGEDEL: number;
            NODEATTRCHANGE: number;
        };
    };
    DATA: {
        RELATION: {
            GLOBAL: {
                MAIN: {
                    MAIN: {
                        OPERATION: string;
                    };
                };
            };
            LOCAL: {
                PALETTE: {
                    MAIN: {
                        TOOLSELECTION: string;
                    };
                };
                MAIN: {
                    ATTRIBUTE: {
                        NODESELECTION: string;
                        NODEADDITION: string;
                        ATTRIBUTECHANGE: string;
                    };
                    ACTIVITY: {
                        NEWACTIVITY: string;
                    };
                    PALETTE: {
                        TOOLSELECTION: string;
                    };
                };
                ATTRIBUTE: {
                    MAIN: {
                        ATTRIBUTECHANGE: string;
                    };
                };
            };
        };
    };
    NS: {
        PERSON: {
            TITLE: string;
            JABBERID: string;
            MBOX: string;
        };
        MY: {
            MODEL: string;
            METAMODEL: string;
            INSTANCE: string;
            VIEWPOINT: string;
            VIEW: string;
            COPY: string;
            GUIDANCEMODEL: string;
            METAMODELPREVIEW: string;
            GUIDANCEMETAMODEL: string;
            LOGICALGUIDANCEREPRESENTATION: string;
        };
    };
};
