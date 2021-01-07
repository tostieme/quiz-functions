import { Application } from "express";
import { getAll } from "./controller";
// import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorized } from "../auth/authorized";

export function routesConfigQuestions(app: Application) {
  app.get("/questions", getAll);
}
