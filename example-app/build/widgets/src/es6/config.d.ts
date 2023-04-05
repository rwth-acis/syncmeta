export function getWidgetTagName(name: any): string;
export namespace CONFIG {
    export namespace TEST {
        const USER: string;
        const EMAIL: string;
        const CANVAS: boolean;
        const ATTRIBUTE: boolean;
        const PALETTE: boolean;
        const ACTIVITY: boolean;
    }
    export namespace LAYER {
        const META: string;
        const MODEL: string;
    }
    export namespace WIDGET {
        namespace NAME {
            export const MAIN: string;
            const PALETTE_1: string;
            export { PALETTE_1 as PALETTE };
            const ATTRIBUTE_1: string;
            export { ATTRIBUTE_1 as ATTRIBUTE };
            const ACTIVITY_1: string;
            export { ACTIVITY_1 as ACTIVITY };
            export const GUIDANCE: string;
            export const HEATMAP: string;
            export const METADATA: string;
            export const OPENAPI: string;
            export const DEBUG: string;
            export const IMSLD_EXPORT: string;
            export const JSON_EXPORT: string;
            export const VIEWCONTROL: string;
        }
    }
    export namespace ENTITY {
        const NODE: string;
        const EDGE: string;
        const ATTR: string;
        const VAL: string;
    }
    export namespace IWC {
        namespace FLAG {
            const PUBLISH_GLOBAL: string;
            const PUBLISH_LOCAL: string;
        }
        namespace ACTION {
            const SYNC: string;
            const DATA: string;
            const DATA_ARRAY: string;
        }
        namespace POSITION {
            export namespace NODE_1 {
                const ADD: number;
                const DEL: number;
                const POS: number;
                const Z: number;
                const DIM: number;
            }
            export { NODE_1 as NODE };
            export namespace EDGE_1 {
                const ADD_1: number;
                export { ADD_1 as ADD };
                const DEL_1: number;
                export { DEL_1 as DEL };
                export const MOV: number;
            }
            export { EDGE_1 as EDGE };
            export namespace ATTR_1 {
                const ADD_2: number;
                export { ADD_2 as ADD };
                const DEL_2: number;
                export { DEL_2 as DEL };
            }
            export { ATTR_1 as ATTR };
        }
    }
    export namespace OPERATION {
        namespace TYPE {
            const INSERT: string;
            const UPDATE: string;
            const DELETE: string;
        }
    }
    export namespace ACTIVITY_2 {
        export namespace TYPE_1 {
            const NODEADD: number;
            const EDGEADD: number;
            const NODEDEL: number;
            const EDGEDEL: number;
            const NODEATTRCHANGE: number;
        }
        export { TYPE_1 as TYPE };
    }
    export { ACTIVITY_2 as ACTIVITY };
    export namespace DATA_1 {
        namespace RELATION {
            namespace GLOBAL {
                export namespace MAIN_1 {
                    export namespace MAIN_2 {
                        const OPERATION_1: string;
                        export { OPERATION_1 as OPERATION };
                    }
                    export { MAIN_2 as MAIN };
                }
                export { MAIN_1 as MAIN };
            }
            namespace LOCAL {
                export namespace PALETTE_2 {
                    export namespace MAIN_3 {
                        const TOOLSELECTION: string;
                    }
                    export { MAIN_3 as MAIN };
                }
                export { PALETTE_2 as PALETTE };
                export namespace MAIN_4 {
                    export namespace ATTRIBUTE_2 {
                        const NODESELECTION: string;
                        const NODEADDITION: string;
                        const ATTRIBUTECHANGE: string;
                    }
                    export { ATTRIBUTE_2 as ATTRIBUTE };
                    export namespace ACTIVITY_3 {
                        const NEWACTIVITY: string;
                    }
                    export { ACTIVITY_3 as ACTIVITY };
                    export namespace PALETTE_3 {
                        const TOOLSELECTION_1: string;
                        export { TOOLSELECTION_1 as TOOLSELECTION };
                    }
                    export { PALETTE_3 as PALETTE };
                }
                export { MAIN_4 as MAIN };
                export namespace ATTRIBUTE_3 {
                    export namespace MAIN_5 {
                        const ATTRIBUTECHANGE_1: string;
                        export { ATTRIBUTECHANGE_1 as ATTRIBUTECHANGE };
                    }
                    export { MAIN_5 as MAIN };
                }
                export { ATTRIBUTE_3 as ATTRIBUTE };
            }
        }
    }
    export { DATA_1 as DATA };
    export namespace NS {
        namespace PERSON {
            const TITLE: string;
            const JABBERID: string;
            const MBOX: string;
        }
        namespace MY {
            const MODEL_1: string;
            export { MODEL_1 as MODEL };
            export const METAMODEL: string;
            export const INSTANCE: string;
            export const VIEWPOINT: string;
            export const VIEW: string;
            export const COPY: string;
            export const GUIDANCEMODEL: string;
            export const METAMODELPREVIEW: string;
            export const GUIDANCEMETAMODEL: string;
            export const LOGICALGUIDANCEREPRESENTATION: string;
        }
    }
}
//# sourceMappingURL=config.d.ts.map