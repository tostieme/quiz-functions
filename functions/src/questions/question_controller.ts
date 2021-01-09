import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { handleError } from "../util/errorHandler";
import auth from "firebase";

// const admin.firestore() = admin.firestore();

export async function getAllQuestions(req: Request, res: Response) {
  try {
    let questions = [];
    const snapshot = await admin.firestore().collection("questions").get();
    snapshot.forEach((doc) => {
      questions.push({
        questionID: doc.id,
        testFeld: doc.data().testFeld,
      });
    });
    return res.json(questions);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getOneQuestion(req: Request, res: Response) {
  try {
    let questionData = {};
    const snapshot = await admin
      .firestore()
      .doc(`/questions/${req.params.questionID}`)
      .get();
    if (!snapshot.exists) {
      return res.status(400).send({ error: "Question not found" });
    }
    questionData = snapshot.data();
    // questionData.questionID = snapshot.id;
    return res.status(200).send(questionData);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function createOneQuestion(req: Request, res: Response) {
  try {
    if (req.body.testFeld.trim() === "") {
      return res.status(400).json({ body: "Body must ne not empty" });
    }
    const questionCollection = admin.firestore().collection("questions");
    await questionCollection.add({
      testFeld: req.body.testFeld,
    });
    return res.status(200).send({ message: "Question added successfully!" });
  } catch (error) {
    return handleError(res, error);
  }
}

//delete a question
export async function deleteQuestion(req: Request, res: Response) {
  try {
    const document = await admin
      .firestore()
      .doc(`/questions/${req.params.questionID}`);
    const documentSnapshot = document.get();
    const currentUserDisplayName = auth.auth().currentUser.displayName;
    if (!(await documentSnapshot).exists) {
      return res.status(403).send({ error: "Question not found" });
    }
    if (
      (await documentSnapshot).data().displayName !== currentUserDisplayName
    ) {
      return res.status(403).send({ error: "Unauthorized" });
    } else {
      await document.delete();
      return res.send({ message: "Question was deleted successfully" });
    }
  } catch (error) {
    return handleError(res, error);
  }
}
