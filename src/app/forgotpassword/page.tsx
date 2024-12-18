"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from './signup.module.css';

export default function forgotPasswordPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: ""
    })
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async () => {
        try {
            const response = await axios.post("/api/users/forgotpassword", user);
            console.log("Reset success", response.data);
            router.push("/login");
            
        } catch (error:any) {
            console.log("Reset failed", error.message);
            
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0) {
        } else {
        }
    }, [user]);


    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-t from-gray-800 to-gray-300">
        <h1>Forgot Password Page</h1>
        <hr />
        <label htmlFor="email">To reset your password, enter your email</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="Enter your email"
            />
            <button
            onClick={onSubmit}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">Reset Password</button>
            <Link href="/signup">SignUp</Link>
            <Link href="/">Home page</Link>

        </div>
    )
}