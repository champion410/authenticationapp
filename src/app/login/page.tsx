'use client';
import Link from "next/link";
import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";




export default function LoginPage(){
  // We will be pushing to different page, so we are using useRouter()
  const router = useRouter();
  const [user, setUser] = React.useState({
    email:"",
    password:"",
  })


  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);


  // How do we want to handle the login part ?
  // We first want to use the useEffect hook 
  const onLogin = async() => {
    try{
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile")
    }catch(error:any){
      console.log("Login failed", error.message);
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0){
      setButtonDisabled(false);
    }else{
      setButtonDisabled(true);
    }
  }, [user])


  return(
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-center text-white text-2xl">{loading ? "Connecting...":"Login"}</h1>
      <hr />
      
      <label htmlFor="email">Email</label>
      <input 
        id="email"
        type="email"
        value={user.email}
        onChange={(e) => setUser({...user, email: e.target.value})}
        placeholder="Your email"
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600 text-black'
      />
      <label htmlFor="password">Password</label>
      <input 
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({...user, password: e.target.value})}
        placeholder="Your Password"
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600 text-black'
      />
      <button
        onClick={onLogin}
        disabled={buttonDisabled}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">
        Login
      </button>
      <Link href="/forgotpassword">Forgot password</Link>
      <Link href="/signup">Visit signup page</Link>
      <Link href="/">Home page</Link>
    </div>
  )
}