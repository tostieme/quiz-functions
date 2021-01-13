import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { handleError } from "../util/errorHandler";
import auth from "firebase";

// import file handling stuff
// import * as BusBoy from "busboy";
// import * as path from "path";
// import * as os from "os";
// import * as fs from "fs";
// import { checkFileType } from "../util/validators";
// import { firebaseConfig } from "../config";

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
    const snapshot = await admin
      .firestore()
      .doc(`/questions/${req.params.questionID}`)
      .get();
    if (!snapshot.exists) {
      return res.status(400).send({ error: "Question not found" });
    }
    const questionData = snapshot.data();
    // questionData.questionID = snapshot.id;
    return res.status(200).send(questionData);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function createOneQuestion(req: Request, res: Response) {
  try {
    if (req.body.questionBody.trim() === "") {
      return res.status(400).json({ body: "Body must ne not empty" });
    }
    const { displayName } = res.locals;
    const questionCollection = admin.firestore().collection("questions");
    await questionCollection.add({
      testFeld: req.body.testFeld,
      questionBody: req.body.questionBody,
      correctAnswer: req.body.correctAnswer,
      wrongAnswer1: req.body.wrongAnswer1,
      wrongAnswer2: req.body.wrongAnswer2,
      wrongAnswer3: req.body.wrongAnswer3,
      imageUrl: req.body.imageUrl,
      videoUrl: req.body.videoUrl,
      audioUrl: req.body.audioUrl,
      createdAt: new Date().toISOString(),
      displayName: displayName,
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

// handle file upload
// export async function uploadFiles(req: Request, res: Response) {
//   const busboy = new BusBoy({ headers: req.headers });
//   let imageFilename: string;
//   let filepath;
//   let mimetypeGlob;

//   busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
//     console.log(fieldname);
//     console.log(filename);
//     console.log(mimetype);
//     if (!checkFileType(mimetype)) {
//       return res.status(400).send({ error: "Wrong file type submitted" });
//     }
//     // image.png
//     const imageExtension = filename.split(".")[filename.split(".").length - 1];
//     imageFilename = `${Math.round(
//       Math.random() * 1000000000
//     )}.${imageExtension}`;

//     filepath = path.join(os.tmpdir(), imageFilename);
//     mimetypeGlob = mimetype;

//     file.pipe(fs.createWriteStream(filepath));
//   });
//   busboy.on("finish", function () {
//     admin
//       .storage()
//       .bucket()
//       .upload(filepath, {
//         resumable: false,
//         metadata: {
//           metadata: {
//             contentType: mimetypeGlob,
//           },
//         },
//       });
//     //const imageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFilename}?alt=media`;
//     //await admin.firestore().doc(`/questions/${req.})
//   });
// }
