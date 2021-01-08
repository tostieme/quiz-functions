import { Application } from "express";
import { isAuthenticated } from "../auth/authenticated";
import {
  createAdminUser,
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
}
