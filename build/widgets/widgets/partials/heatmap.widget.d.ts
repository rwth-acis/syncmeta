import { LitElement, PropertyValueMap } from "lit";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
declare const HeatMapWidget_base: typeof LitElement;
export declare class HeatMapWidget extends HeatMapWidget_base {
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
