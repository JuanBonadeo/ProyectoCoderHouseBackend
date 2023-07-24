import { Router } from "express";
import passport from "passport";
import userModel from "../models/Users.model.js";
import jwt from 'jsonwebtoken'

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    res.send({ status: "success", message: "usuario  registrado" });
  }
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    let token = jwt.sign({ email: req.body.email }, "coderSecret", {
      expiresIn: "24h",
    });
    res
      .cookie("coderCookie", token, { httpOnly: true })
      .send({ status: "success" });
  }
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

router.post("/restartPassword", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete Values" });
  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(404).send({ status: "error", error: "Not user found" });
  const newHashedPassword = createHash(password);
  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashedPassword } }
  );
  res.send({ status: "success", message: "Contraseña restaurada" });
});

export default router;
