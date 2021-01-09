import { Application } from "express";
import {
  createOneQuestion,
  deleteQuestion,
  getAllQuestions,
  getOneQuestion,
} from "./question_controller";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorizedAsAdmin } from "../auth/authorized";
// import { isAuthorizedAsUser } from "../auth/authorized";

export function routesConfigQuestions(app: Application) {
  app.get("/questions", getAllQuestions);
  app.get("/question/:questionID", getOneQuestion);
  app.post(
    "/question",
    isAuthenticated,
    isAuthorizedAsAdmin,
    createOneQuestion
  );
  app.delete(
    "/question/:questionID",
    isAuthenticated,
    isAuthorizedAsAdmin,
    deleteQuestion
  );
}
