import { User } from "./models";
import { connectToDB } from "./utils";

export const fetchUsers=async(q,page)=>{
    const regex=new RegExp(q,'i')

    const ITEMS_PER_PAGE=2;

    try {
        connectToDB()
        const count=await User.find({username:{$regex:regex}}).count()
        const users=await User.find({username:{$regex:regex}})
              .limit(ITEMS_PER_PAGE)
              .skip(ITEMS_PER_PAGE*(page-1))
        return {count,users}
    } catch (error) {
        console.log(error)
            throw new Error("Failed to fetch the users!")
    }
}

export const fetchUser=async(id)=>{
    try {
        connectToDB()
        const user=await User.findById(id)
        return user;
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch the user!")
    }
}

export const fetchTasks=async(q,page)=>{
    const regex=new RegExp(q,'i')

    const ITEMS_PER_PAGE=2;

    try {
        connectToDB()
        const count=await Task.find({title:{$regex:regex}}).count()
        const tasks=await Task.find({title:{$regex:regex}})
              .limit(ITEMS_PER_PAGE)
              .skip(ITEMS_PER_PAGE*(page-1))
        return {count,tasks}
    } catch (error) {
        console.log(error)
            throw new Error("Failed to fetch the tasks!")
    }
}

export const fetchTask=async(id)=>{
    try {
        connectToDB()
        const task=await Task.findById(id)
        return task;
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch the task!")
    }
}

