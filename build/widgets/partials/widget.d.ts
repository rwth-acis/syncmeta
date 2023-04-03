import { LitElement } from "lit";
type Constructor<T = {}> = new (...args: any[]) => T;
export declare const SyncMetaWidget: <T extends Constructor<LitElement>>(superClass: T, widgetName: string) => T;
export {};
