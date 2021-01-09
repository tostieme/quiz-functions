import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { User } from "../entity/User";
import { connect } from "../util/connectSQL";
import { validateLoginData } from "../util/validators";
import auth from "firebase";
import { handleError } from "../util/errorHandler";

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
      newUser.displayName = displayName;
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

// Voerst nur zu Testzwecken
export async function createAdminUser(req: Request, res: Response) {
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
      !email ||
      !password ||
      !displayName ||
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
    const role = "admin";
    await admin.auth().setCustomUserClaims(uid, { role });

    return res.status(201).send({ message: "Admin User created" });
  } catch (error) {
    if (error.code === "auth/email-already-exists")
      return res.status(400).send({ email: "Email is already in use" });
    else return handleError(res, error);
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const {
      email,
      password,
      confirmPassword,
      displayName,
      role,
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
      !email ||
      !password ||
      !displayName ||
      !role ||
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
    await admin.auth().setCustomUserClaims(uid, { role });

    // Save the new User in the SQL Database
    const connection = await connect();
    const repo = connection.getRepository(User);
    const newUser = new User();
    newUser.userID = uid;
    newUser.email = email;
    newUser.role = role;
    newUser.name = name;
    newUser.displayName = displayName;
    newUser.surname = surname;
    newUser.nameOfOrga = nameOfOrga;
    newUser.adressOfOrgaStreet = adressOfOrgaStreet;
    newUser.adressOfOrgaCity = adressOfOrgaCity;
    newUser.adressOfOrgaPostalCode = adressOfOrgaPostalCode;
    newUser.createdAt = new Date().toISOString();
    await repo.save(newUser);

    return res.status(201).send({ message: "User was created successfully" });
  } catch (err) {
    return handleError(res, err);
  }
}

// Zeigt mir alle Nutzer in der SQL Datenbank
export async function getUsers(req: Request, res: Response) {
  const connection = await connect();
  const repo = connection.getRepository(User);

  const allUsers = await repo.find();
  return res.send(allUsers);
}

export async function deleteUser(req: Request, res: Response) {
  try {
    // Lösche Nutzer aus Authentication TAB
    const { id } = req.params;
    await admin.auth().deleteUser(id);

    // Lösche Nutzer aus SQL Database
    const connection = await connect();
    const userRepo = connection.getRepository(User);
    await userRepo.delete({ userID: id });

    return res.send({ message: "User deleted successfully" });
  } catch (err) {
    return handleError(res, err);
  }
}

// nur zum aufräumen
export async function deleteUserFromDaba(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Lösche Nutzer aus SQL Database
    const connection = await connect();
    const userRepo = connection.getRepository(User);
    await userRepo.delete({ userID: id });

    return res.send({ message: "User deleted successfully" });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function promoteRole(req: Request, res: Response) {
  const { uid } = req.params;
  const role = "admin";
  await admin.auth().setCustomUserClaims(uid, { role });
}
