import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { routesConfigUsers } from "./users/routes-config-users";
import { routesConfigQuestions } from "./questions/routes-config-questions";

admin.initializeApp();
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesConfigUsers(app);
routesConfigQuestions(app);

export const api = functions.region("europe-west1").https.onRequest(app);
