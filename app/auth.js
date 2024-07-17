import { User } from "./lib/models";
import { connectToDB } from "./lib/utils";
import bcrypt from 'bcrypt';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {authConfig} from './authConfig';

const login=async(credentials)=>{
    try {
        connectToDB()
        const user=await User.findOne({username:credentials.username})

        if(!user || !user.isAdmin) throw new Error("Wrong credentials") 

        const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)

        if(!isPasswordCorrect) throw new Error("Wrong credentials")

        return user;
    } catch (error) {
        console.log(error)
        throw new Error("Failed to login!")
    }
}

export const {signIn, signOut, auth}=NextAuth({
    ...authConfig,
    providers:[
        CredentialsProvider({
            async authorize(credentials){
                try {
                    const user=await login(credentials)
                } catch (error) {
                    return null;
                }
            }
        })
    ],

    callbacks:{
        async jwt({token, user}){
            if(user){
                token.username=user.username
                token.img=user.img
            }
            return user;
        },
        async session({session,token}){
            if(token){
                session.user.username=token.username;
                session.user.img=token.img;
            }
            return session;
        }
    }
})