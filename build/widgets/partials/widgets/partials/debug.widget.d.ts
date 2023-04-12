import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { LitElement, PropertyValueMap } from "lit";
declare const DebugWidget_base: typeof LitElement;
export declare class DebugWidget extends DebugWidget_base {
    widgetName: any;
    $spinner: JQuery<HTMLElement>;
    $fileObject: any;
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    hideErrorAlert(): void;
    showErrorAlert(message: string): void;
    render(): import("lit-html").TemplateResult<1>;
    importModel(): void;
    deleteModel(): void;
    deleteMetamodel(): void;
    feedback(msg: string): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
