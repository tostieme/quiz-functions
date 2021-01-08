import { Request, Response } from "express";

export function isAuthorizedAsUser(opts: {
  hasRole: String;
  allowSameUser?: boolean;
}) {
  return (req: Request, res: Response, next: Function) => {
    const { role, uid } = res.locals;
    const { id } = req.params;

    if (opts.allowSameUser && id && uid === id) return next();

    if (!role) return res.status(403).send();

    if (opts.hasRole === "user") return next();

    return res.status(403).send();
  };
}

export function isAuthorizedAsAdmin(opts: {
  hasRole: String;
  allowSameUser?: boolean;
}) {
  return (req: Request, res: Response, next: Function) => {
    const { role, uid } = res.locals;
    const { id } = req.params;

    if (opts.allowSameUser && id && uid === id) return next();

    if (!role) return res.status(403).send();

    if (opts.hasRole === "admin") return next();

    return res.status(403).send();
  };
}
