import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { handleError } from "../util/errorHandler";
import auth from "firebase";
import jwt_decode from 'jwt-decode';
// import { v4 as uuidv4 } from "uuid";

// // import file handling stuff
// import * as BusBoy from "busboy";
// import * as path from "path";
// import * as os from "os";
// import * as fs from "fs";
// // import { isCorrectFileType } from "../util/validators";
// import { firebaseConfig } from "../config";
import { _onRequestWithOptions } from "firebase-functions/lib/providers/https";

export async function getAllQuestions(req: Request, res: Response) {

 



 try {
    let questions = [];
   
    const snapshot = await admin.firestore().collection("questions").get();
  snapshot.forEach((doc) => {
    const data = doc.data();
    const currentUser = req.headers.authorization;
    var currentUserDecoded = jwt_decode(currentUser)
    console.log(currentUserDecoded);
    console.log(data);
    if(data["displayName"]==currentUserDecoded["name"]){
   data["id"]=doc.id;
  
      questions.push( data);
    }
      console.log(questions);

     } );
     
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
    // TODO: Hinzufügen weiterer Checks
    if (req.body.questionBody.trim() === "") {
      return res.status(400).json({ body: "Body must ne not empty" });
    }
  
    const { displayName } = res.locals;
    const questionCollection = admin.firestore().collection("questions");
    await questionCollection.add({
      questionBody: req.body.questionBody,
      correctAnswer: req.body.correctAnswer,
      wrongAnswer1: req.body.wrongAnswer1,
      wrongAnswer2: req.body.wrongAnswer2,
      wrongAnswer3: req.body.wrongAnswer3,
      imageUrl: req.body.imageUrl,
      videoUrl: req.body.videoUrl,
      audioUrl: req.body.audioUrl,
      testFeld: req.body.testFeld,
      createdAt: new Date().toISOString(),
      displayName: displayName,
    });
    return res.status(200).send({ message: "Question added successfully!" });
  } catch (error) {
    console.log(error);
    return handleError(res, error);
  }
}

//edit a question

export async  function editQuestion(req:Request, res: Response){
  try {
    const document = await admin
      .firestore()
      .doc(`/questions/${req.params.questionID}`);
      console.log(document);
    const documentSnapshot = document.get();

    const currentUserDisplayName = res.locals.displayName;
    console.log(currentUserDisplayName);
    console.log(req.body);
    console.log(req.body[0]);
    if (!(await documentSnapshot).exists) {
      return res.status(403).send({ error: "Question not found" });
    }
    if (
      (await documentSnapshot).data().displayName !== currentUserDisplayName
    ) {
      return res.status(403).send({ error: "Unauthorized" });
    } else {
      await document.update(req.body[0]);
     /* await document.update({questionBody: req.body.questionBody,
        correctAnswer: req.body.correctAnswer,
        wrongAnswer1: req.body.wrongAnswer1,
        wrongAnswer2: req.body.wrongAnswer2,
        wrongAnswer3: req.body.wrongAnswer3,
        imageUrl: req.body.imageUrl,
        videoUrl: req.body.videoUrl,
        audioUrl: req.body.audioUrl,
        testFeld: req.body.testFeld});*/
      return res.send({ message: "Question was Added" });
    }
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
    console.log("BAMBI");
    console.log(res.locals);
    console.log(auth.auth());
    const currentUserDisplayName = res.locals.displayName;
    console.log(currentUserDisplayName);
    console.log(auth.auth().currentUser);
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

// Vielleicht besser im Frontend wegen der URL?
// handle file upload
// export async function uploadFiles(req: Request, res: Response) {
//   try {
//     console.log("In Try Block");
//     const busboy = new BusBoy({ headers: req.headers });
//     let imageFilename;
//     let filepath;
//     let mimetypeGlob;
//     // let imageURL: string = "";
//     console.log("Vor Busboy.on");
//     busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
//       console.log("In Busboy on");
//       console.log(fieldname);
//       console.log(filename);
//       console.log(mimetype);
//       // image.png
//       const imageExtension = filename.split(".")[
//         filename.split(".").length - 1
//       ];
//       imageFilename = `${Math.round(
//         Math.random() * 1000000000
//       )}.${imageExtension}`;
//       filepath = path.join(os.tmpdir(), imageFilename);
//       mimetypeGlob = mimetype;
//       file.pipe(fs.createWriteStream(filepath));
//     });
//     console.log("Vor busboy.on finish");
//     busboy.on("finish", function () {
//       console.log("in busboy.on finish");
//       admin
//         .storage()
//         .bucket()
//         .upload(filepath, {
//           resumable: false,
//           metadata: {
//             metadata: {
//               contentType: mimetypeGlob,
//               // firebaseStorageDownloadTokens: uuidv4(),
//             },
//           },
//         });
//     });
//     res.end();
//     const imageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFilename}?alt=media`;
//     return res.status(200).send(imageURL);
//   } catch (err) {
//     return handleError(res, err);
//   }
// }
