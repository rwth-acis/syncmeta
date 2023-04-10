export class Intent {
    constructor(sender: any, receiver: any, action: any, data: any, global: any);
    sender: any;
    receiver: any;
    data: any;
    dataType: string;
    action: any;
    categories: string[];
    extras: {};
    flags: string[];
}
export class Client {
    constructor(componentName: any, categories: any, origin: any, y: any);
    _y: any;
    _componentName: string;
    _connected: boolean;
    _categories: any;
    _callback: any;
    _origin: any;
    connect(callback: Function): void;
    disconnect(): void;
    publish(intent: any): void;
    publishLocal(intent: any, origin: any): void;
    publishGlobal(intent: any, y: any): void;
    receiveMessage(event: Event): void;
}
export class util {
    static FLAGS: {
        PUBLISH_LOCAL: string;
        PUBLISH_GLOBAL: string;
    };
    static validateIntent(intent: any): boolean;
}
declare namespace _default {
    export { Client };
    export { util };
}
export default _default;
//# sourceMappingURL=iwc.d.ts.map