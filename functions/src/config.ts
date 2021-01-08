import { ConnectionOptions } from "typeorm";
import "reflect-metadata";

// Will be true on deployed functions
export const prod = process.env.NODE_ENV === "production";

export const sqlConfig: ConnectionOptions = {
  name: "fun",
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
      socketPath: "/cloudsql/quiz-functions-c9bae:europe-west3:quiz-functions", // change
    },
  }),
};

export const firebaseConfig = {
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  apiKey: "AIzaSyDdMak4fnpI16b9Rfj7cPIR7vgrTegmjDA",
  authDomain: "quiz-functions-c9bae.firebaseapp.com",
  projectId: "quiz-functions-c9bae",
  storageBucket: "quiz-functions-c9bae.appspot.com",
  messagingSenderId: "97116656288",
  appId: "1:97116656288:web:f4d83572a04c55b9972fc5",
  measurementId: "G-GPN9EGX0Z2",
};
