import { ConnectionOptions } from "typeorm";
import "reflect-metadata";

// Will be true on deployed functions
export const prod = process.env.NODE_ENV === "production";

export const sqlConfig: ConnectionOptions = {
  name: "users",
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root", // review
  password: "root", // review
  database: "development",
  synchronize: true,
  logging: false,
  entities: ["lib/entity/**/*.js"],

  // Production Mode
  ...(prod && {
    database: "production",
    logging: false,
    // synchronize: false,
    extra: {
      socketPath: "/cloudsql/fire-quizduell:europe-west3:users", // change
    },
  }),
};

export const firebaseConfig = {
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  apiKey: "AIzaSyBUXNmZ7OCxQAhTUZKPkLyLO8sWn2-PmRE",
  authDomain: "fire-quizduell.firebaseapp.com",
  projectId: "fire-quizduell",
  storageBucket: "fire-quizduell.appspot.com",
  messagingSenderId: "11323579019",
  appId: "1:11323579019:web:134084970adf9a43bad28e",
  measurementId: "G-1N8WP0X5CV",
};
