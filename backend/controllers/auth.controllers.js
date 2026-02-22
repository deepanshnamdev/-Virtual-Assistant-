import e from "express";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
export const signUp = async(req, res) => {
    try {
       const {name, email, password} = req.body;

       const existEmail= await User.findOne({email});
        if(existEmail){
            return res.status(400).json({message: "Email already exists"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

       if(!name || !email || !password){
        return res.status(400).json({message: "Please enter all fields"});
       }
       const hashPassword = await bcrypt.hash(password, 10);

       const user = await User.create({
        name,
        email,
        password: hashPassword,
       });
       const token = await genToken(user._id);
       res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
       });
       return res.status(200).json({user}); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

export const Login = async(req, res) => {
    try {
       const { email, password} = req.body;

       const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Email does not exists"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

       const token = await genToken(user._id);
       res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
       });
       return res.status(200).json({user}); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

export const Logout = async(req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message: "Logged out successfully"});
    }   
    catch (error) {
        res.status(500).json({message: error.message});
    }
}
