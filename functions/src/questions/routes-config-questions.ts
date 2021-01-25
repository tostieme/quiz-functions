import { Application } from "express";
import {
  createOneQuestion,
  deleteQuestion,
  editQuestion,
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
  app.put("/question/:questionID", isAuthenticated,
  isAuthorizedAsAdmin,editQuestion);
  app.delete(
    "/question/:questionID",
    isAuthenticated,
    isAuthorizedAsAdmin,
    deleteQuestion
  );
  // app.post("/question/file", uploadFiles);
}
