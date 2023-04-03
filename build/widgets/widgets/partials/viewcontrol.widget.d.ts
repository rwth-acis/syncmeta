import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { CSSResultGroup, LitElement, PropertyValueMap } from "lit";
declare const ViewControlWidget_base: typeof LitElement;
export declare class ViewControlWidget extends ViewControlWidget_base {
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    static styles?: CSSResultGroup;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
