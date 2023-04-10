import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { LitElement, PropertyValueMap } from "lit";
declare const GuidanceWidget_base: typeof LitElement;
export declare class GuidanceWidget extends GuidanceWidget_base {
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};