import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import {NextRequest, NextResponse} from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest){

  try{
    const reqBody = await request.json();
    const {email, password} = reqBody;
    console.log(reqBody);

    //We check if the user exists or not
    const user = await User.findOne({email});
    if(!user){
      return NextResponse.json({error: "User does not exist"}, {status: 400})
    }

    //We check it the password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if(!validPassword){
      return NextResponse.json({error: "Invalid password"}, {status: 400});
    }

    //We create the token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }

    // We create the token, the token is created but it is not set to the user's cookie
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
    
    // For setting the tokn in the user's cookie let's create nextresponse, we just create it now, we are not sending it for now
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    })

    response.cookies.set("token", token, {
      httpOnly: true,
    })

    return response;

  }catch(error: any){
    return NextResponse.json({error: error.message}, {status: 500})
  }
}