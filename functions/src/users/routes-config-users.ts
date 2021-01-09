import { Application } from "express";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorizedAsAdmin } from "../auth/authorized";
// import { isAuthorizedAsAdmin } from "../auth/authorized";
import {
  createAdminUser,
  createUser,
  deleteUser,
  deleteUserFromDaba,
  getUsers,
  login,
  logout,
  promoteRole,
  signup,
} from "./user_controller";

export function routesConfigUsers(app: Application) {
  // Signup Route
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/logout", isAuthenticated, logout);

  // Test Route for getting all Users in SQL Database
  app.get("/users", getUsers);
  app.post("/adminUser", createAdminUser); // nur zum Testen
  app.post("/user", isAuthenticated, isAuthorizedAsAdmin, createUser);
  app.delete("/users/:id", isAuthenticated, isAuthorizedAsAdmin, deleteUser);
  app.post("/users/:id", isAuthenticated, isAuthorizedAsAdmin, promoteRole);
  // Nur zum aufräumen in der Daba
  app.delete("/daba/:id", deleteUserFromDaba);
}
