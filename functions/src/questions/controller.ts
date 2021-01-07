import { Request, Response } from "express";
import * as admin from "firebase-admin";

export async function getAll(req: Request, res: Response) {
  try {
    const listQuestions = await admin.firestore().collection("questions").get();
    const questions = listQuestions.docs;
    return res.status(200).send({ questions });
  } catch (err) {
    return handleError(res, err);
  }
}

function handleError(res: Response, err: any) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
