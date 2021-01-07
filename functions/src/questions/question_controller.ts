import { Request, Response } from "express";
import * as admin from "firebase-admin";

export async function getAll2(req: Request, res: Response) {
  admin
    .firestore()
    .collection("questions")
    .get()
    .then((data) => {
      let questions = [];
      data.forEach((doc) => {
        questions.push({
          questionID: doc.id,
          body: doc.data(),
          testFeld: doc.data().testFeld,
        });
      });
      return res.json(questions);
    })
    .catch((err) => console.error(err));
}

export async function getAll(req: Request, res: Response) {
  try {
    const questions = [];
    const snapshot = await admin.firestore().collection("questions").get();
    snapshot.forEach((doc) => {
      questions.push({
        questionID: doc.id,
        testFeld: doc.data().testFeld,
      });
      console.log(questions);
      // return res.json(questions);
    });
    return res.json(questions);
  } catch (error) {
    return handleError(res, error);
  }
}

function handleError(res: Response, err: any) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
