import { Application } from "express";
import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorizedAsAdmin } from "../auth/authorized";
import {
  createAdminUser,
  deleteUser,
  deleteUserFromDaba,
  getUsers,
  login,
  logout,
  signup,
} from "./user_controller";

export function routesConfigUsers(app: Application) {
  // Signup Route
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/logout", isAuthenticated, logout);

  // Test Route for getting all Users in SQL Database
  app.get("/users", getUsers);
  app.post("/adminUser", createAdminUser);
  app.delete("/users/:id", deleteUser); // TODO: Muss Admin Route sein
  // Nur zum aufräumen in der Daba
  app.delete("/daba/:id", deleteUserFromDaba);
}
