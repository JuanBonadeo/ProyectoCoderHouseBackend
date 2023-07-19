import passport from "passport";
import GithubStrategy from "passport-github2";

import { createHash, validatePassword } from "../utils.js";
import local from "passport-local";
import { userModel } from "../daos/mongodb/models/user.model.js";

const LocalStrategy = local.Strategy;

export const initializePassport = () => {
    passport.use('github', new GithubStrategy({
        clientID: "Iv1.981f963749d4db6e",
        clientSecret: "a0cb0e4a63c94e159d5dea31e9cef9277ad06de4",
        callbackURL: "http://localhost:8080/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        let user = await userModel.findOne({ email: profile.profileUrl });
        if (!user) {
            let newUser = {
            name: profile.username,
            email: profile.profileUrl ,
            age: profile.age ? profile.age : 0,
            role: "user",
            password: "",
            };
            console.log(profile._json);
            const result = await userModel.create(newUser);
            done(null, result);
        } 
        else {
            done(null, user);
        }
    }
))

passport.use('register', new LocalStrategy(
{passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
    
    const {name, email, age} = req.body;
    try{
        let user = await userModel.findOne({ email:username });
        if (user) {
            console.log("User already exists");
            return done (null,false)
        }
        const newUser = {
            name,
            email,
            age,
            password: createHash(password)
        }
        let result = await userModel.create(newUser);
        return done(null, result);
    }
    catch (error) {
        return done("Error al obtener el usuario: " + error);
    }
}
))

passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
    try{
        const user = await userModel.findOne({ email:username });
        if (!user) {
            console.log("User not found");
            return done (null,false)
        }
        if (!isValidPassword(user, password)) {
            console.log("Invalid password");
            return done (null,false)
        }
        return done(null, user);
    }
    catch (error) {
        return done("Error al obtener el usuario: " + error);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user)
})
}