import { Request, Response } from "express";
import * as admin from "firebase-admin";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: Function
) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ message: "Unauthorized1" });
  if (!authorization.startsWith("Bearer"))
    return res.status(401).send({ message: "Unauthorized2" });
  const split = authorization.split("Bearer ");
  if (split.length !== 2)
    return res.status(401).send({ message: "Unauthorized3" });

  const token = split[1];
  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    console.log("decodedToken", JSON.stringify(decodedToken));
    res.locals = {
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
      displayName: decodedToken.displayName,
    };
    console.log("Springe jetzt in authorized function");
    return next();
  } catch (err) {
    console.error(`${err.code} -  ${err.message}`);
    return res.status(401).send({ message: "Unauthorized4" });
  }
}
