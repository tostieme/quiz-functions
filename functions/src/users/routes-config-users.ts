import { Application } from "express";
import { isAuthenticated } from "../auth/authenticated";
import { getUsers, login, logout, signup } from "./user_controller";
// import { isAuthorizedAsAdmin } from "../auth/authorized";

export function routesConfigUsers(app: Application) {
  // Signup Route
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/logout", isAuthenticated, logout);

  // Test Route for getting all Users in SQL Database
  app.get("/users", getUsers);
}
