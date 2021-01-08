import { Request, Response } from "express";
import { handleError } from "../util/errorHandler";

export async function isAuthorizedAsUser(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    console.log("In isAuthorizedAsUser Try Block");
    const { role } = res.locals;
    // const { id } = req.params;

    // if (opts.allowSameUser && id && uid === id) return next();

    if (!role) return res.status(403).send();

    if (role === "user") return next();
  } catch (err) {
    return handleError(res, err);
  }
}

export async function isAuthorizedAsAdmin(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    console.log("In isAuthorizedAsAdmin Try Block");
    const { role } = res.locals;
    // const { id } = req.params;

    // if (opts.allowSameUser && id && uid === id) return next();

    if (!role) return res.status(403).send();

    if (role === "admin") return next();
  } catch (err) {
    return handleError(res, err);
  }
}
