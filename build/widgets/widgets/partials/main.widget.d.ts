import "@jsplumb/browser-ui/css/jsplumbtoolkit.css";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { LitElement } from "lit";
declare const CanvasWidget_base: typeof LitElement;
export declare class CanvasWidget extends CanvasWidget_base {
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(e: any): Promise<void>;
}
export {};
