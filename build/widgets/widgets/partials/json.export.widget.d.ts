import { LitElement, PropertyValueMap } from "lit";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
declare const JSONExportWidget_base: typeof LitElement;
export declare class JSONExportWidget extends JSONExportWidget_base {
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
