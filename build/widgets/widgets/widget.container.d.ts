import { LitElement } from "lit";
import "./partials/main.widget";
import "./partials/attribute.widget";
import "./partials/debug.widget";
import "./partials/palette.widget";
import "./partials/activity.widget";
export declare class WidgetContainer extends LitElement {
    createRenderRoot(): this;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
}
