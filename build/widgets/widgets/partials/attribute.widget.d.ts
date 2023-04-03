import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { LitElement } from "lit";
declare const AttributeWidget_base: typeof LitElement;
export declare class AttributeWidget extends AttributeWidget_base {
    widgetName: any;
    firstUpdated(e: any): void;
    hideErrorAlert(): void;
    showErrorAlert(message: string): void;
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
