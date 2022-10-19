// index.ts
import { Router } from "@vaadin/router";
import "./static-app"; // Adding the lit-app component here for better performance

const routes = [
  {
    path: "/meta-modeling-space",
    component: "static-app",
  },
  {
    path: "/modeling-space",
    component: "static-app",
  },
];

const outlet = document.getElementById("outlet");
export const router = new Router(outlet);
router.setRoutes(routes);
