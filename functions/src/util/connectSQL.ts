import { Connection, createConnection, getConnection } from "typeorm";
import { sqlConfig } from "../config";

export const connect = async () => {
  let connection: Connection;
  try {
    connection = getConnection(sqlConfig.name);
    console.log(connection);
  } catch (err) {
    console.log("SQL Verbindung nicht offen - Erstelle neue Verbindung");
    connection = await createConnection(sqlConfig);
  }
  return connection;
};
