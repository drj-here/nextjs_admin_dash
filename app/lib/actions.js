'use server'

import { revalidatePath } from "next/cache"
import {User,Task} from './models'
import { connectToDB } from "./utils"
import { redirect } from "next/navigation"
import {signIn} from '../auth'
import bcrypt from 'bcrypt'
import { connect } from "mongoose"

export const addUser=async(formData)=>{
    const {username,email, password, phone, address, isAdmin, isActive}=Object.fromEntries(formData)

    try {
        connectToDB()

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=new User({
            username,
            email,
            password:hashedPassword,
            phone,
            address,
            isAdmin,
            isActive
        })

        await newUser.save()
    } catch (error) {
        console.log(error)
        throw new Error("Failed to create the user")
    }

    revalidatePath('/dashboard/users') // data for this path is refreshed and cached is not shown
    redirect('/dashboard/users')
} 

export const updateUser=async(formData)=>{
    const {id,username, email, password, phone, address, isAdmin,isActive}=Object.fromEntries(formData)

    try {
        connectToDB()

        const updateFields={
            username,
            email,
            password,
            phone,
            address,
            isActive,
            isAdmin
        }

        Object.keys(updateFields).forEach((key)=>(
            updateFields[key]==="" || undefined
        ) && delete updateFields[key])

        await User.findByIdAndUpdate(id,updateFields)
    } catch (error) {
        console.log(error)
        throw new Error("Failed to update the user!")
    }
}

export const addTask=async(formData)=>{
    const {title, desc, status}=Object.fromEntries(formData)

    try {
        connectToDB()

        const newTask=new Task({
            title,
            desc,
            status 
        })

        await newTask.save()
    } catch (error) {
        console.log(error)
        throw new Error("Failed to create the task")
    }

    revalidatePath('/dashboard/tasks')
    redirect('/dashboard/tasks')
}

export const updateTask=async(formData)=>{
    const {id,title, desc, status}=Object.fromEntries(formData)

    try {
        connectToDB()

        const updateFields={
            title,
            desc,
            status
        }

        Object.keys((key)=>
           (updateFields[key]==="" || undefined) && delete updateFields[key]
        );

        await Task.findByIdAndUpdate(id,updateFields)
    } catch (error) {
        console.log(error)
        throw new Error("Failed to update the task")
    }

    revalidatePath('/dashboard/tasks')
    redirect('/dashboard/tasks')
}

export const deleteUser=async(formData)=>{
    const {id}=Object.fromEntries(formData)

    try {
        connectToDB()
        await User.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
        throw new Error("Failed to delete the user")
    }
}

export const deleteTask=async(formData)=>{
    const {id}=Object.fromEntries(formData)

    try {
        connectToDB()
        await Task.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
        throw new Error("Failed to delete the task")
    }
}

export const authenticate=async(prevState,formData)=>{
    const {username,password}=Object.fromEntries(formData)

    try {
        await signIn("credentials",{username,password})
    } catch (error) {
        if(error.message.includes("CredentialsSignin")){
            return "Wrong credentials"
        }
        throw error;
    }
}

