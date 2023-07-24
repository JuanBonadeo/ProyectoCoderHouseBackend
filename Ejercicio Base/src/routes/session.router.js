import { Router } from "express";
import userModel from "../models/Users.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exist = await userModel.findOne({ email });

  if (exist)
    return res 
      .status(400)
      .send({ status: "error", message: "usuario ya registrado" });

  let result = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });
  res.send({ status: "success", message: "usuario  registrado" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  const user = await userModel.findOne({ email: email, password: password });
  console.log(user)
  if (!user) return res.redirect('/api/login')
  req.session.user = {
    name: user.first_name + user.last_name,
    email: user.email,
    age: user.age,
  };
  res.send({ status: "success", message: req.session.user });
});

router.post('/restartPassword',async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"Incomplete Values"});
  const user = await userModel.findOne({email});
  if(!user) return res.status(404).send({status:"error",error:"Not user found"});
  const newHashedPassword = createHash(password);
  await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});
  res.send({status:"success",message:"Contraseña restaurada"});
})

export default router