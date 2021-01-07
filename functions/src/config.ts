// import {
//   ConnectionOptions,
//   Connection,
//   createConnection,
//   getConnection,
// } from "typeorm";
// import "reflect-metadata";

// // Will be true on deployed functions
// export const prod = process.env.NODE_ENV === "production";

// export const config: ConnectionOptions = {
//   name: "fun",
//   type: "mysql",
//   host: "127.0.0.1",
//   port: 3306,
//   username: "root", // review
//   password: "root", // review
//   database: "development",
//   synchronize: true,
//   logging: false,
//   entities: ["lib/entity/**/*.js"],

//   // Production Mode
//   ...(prod && {
//     database: "production",
//     logging: false,
//     // synchronize: false,
//     extra: {
//       socketPath: "/cloudsql/YOUR_CONNECTION_NAME", // change
//     },
//   }),
// };
