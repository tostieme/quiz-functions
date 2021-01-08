import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { User } from "../entity/User";
import { connect } from "../util/connectSQL";
import { validateLoginData } from "../util/validators";
import auth from "firebase";

export async function signup(req: Request, res: Response) {
  {
    try {
      const {
        email,
        password,
        confirmPassword,
        displayName,
        name,
        surname,
        nameOfOrga,
        adressOfOrgaStreet,
        adressOfOrgaCity,
        adressOfOrgaPostalCode,
      } = req.body;
      // For matching valid email adress
      const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (
        !displayName ||
        !password ||
        !email ||
        !name ||
        !surname ||
        !nameOfOrga ||
        !adressOfOrgaCity ||
        !adressOfOrgaStreet ||
        !adressOfOrgaPostalCode
      ) {
        return res.status(400).send({ message: "Missing fields" });
      }
      if (password !== confirmPassword) {
        return res.status(400).send({ message: "Passwords are not matching " });
      }
      if (!email.match(regEx))
        return res.status(400).send({ message: "Not a valid Email adress " });

      if (!(adressOfOrgaPostalCode.toString().length === 5))
        return res
          .status(400)
          .send({ message: "Not a valid Postal-Code adress " });

      // Saves User in Authentication Tab
      const { uid } = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
      // Updated die User Rolle zu "user" - Standard
      const role = "user";
      await admin.auth().setCustomUserClaims(uid, { role });

      // Save the new User in the SQL Database
      const connection = await connect();
      const repo = connection.getRepository(User);
      const newUser = new User();
      newUser.userID = uid;
      newUser.email = email;
      newUser.role = role;
      newUser.name = name;
      newUser.surname = surname;
      newUser.nameOfOrga = nameOfOrga;
      newUser.adressOfOrgaStreet = adressOfOrgaStreet;
      newUser.adressOfOrgaCity = adressOfOrgaCity;
      newUser.adressOfOrgaPostalCode = adressOfOrgaPostalCode;
      newUser.createdAt = new Date().toISOString();

      const savedUser = await repo.save(newUser);

      return res.status(201).send(savedUser);
    } catch (error) {
      if (error.code === "auth/email-already-exists")
        return res.status(400).send({ email: "Email is already in use" });
      else return handleError(res, error);
    }
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const valid = validateLoginData(user);
    if (!valid)
      return res
        .status(400)
        .send({ message: "Email or Password must not be empty" });

    await auth.auth().signInWithEmailAndPassword(user.email, user.password);
    const idToken = await auth.auth().currentUser.getIdToken();
    return res.status(200).send(idToken);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function logout(req: Request, res: Response) {
  const user = auth.auth().currentUser;
  if (user) {
    try {
      // User is signed in
      await auth.auth().signOut();
      return res.send({ general: "Sign-out successfull!" });
    } catch (error) {
      return handleError(res, error);
    }
  } else {
    return res.status(404).send({ general: "You are not signed in!" });
  }
}

export async function getUsers(req: Request, res: Response) {
  const connection = await connect();
  const repo = connection.getRepository(User);

  const allUsers = await repo.find();
  return res.send(allUsers);
}

function handleError(res: Response, err: any) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
