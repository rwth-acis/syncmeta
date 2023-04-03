import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { LitElement, PropertyValueMap } from "lit";
declare const PaletteWidget_base: typeof LitElement;
export declare class PaletteWidget extends PaletteWidget_base {
    widgetName: any;
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void>;
    createRenderRoot(): this;
    hideErrorAlert(): void;
    showErrorAlert(message: string): void;
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
