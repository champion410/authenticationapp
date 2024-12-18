import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import {NextRequest, NextResponse} from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';


connect();

// The way how we define a syntax of handling a POST request because data is coming to us 
export async function POST(request: NextRequest){
  try{
    // How to grab data from the body ? Here we await a bit
    const reqBody = await request.json();
    // There are a lot of data coming in, so let's extract all the variable coming in. We do a bit of destructuring.
    // We know that from the front end we get the next fields
    const {username, email, password} = reqBody;
    console.log(reqBody);

    //Check if user already exists
    const user = await User.findOne({email});
    if (user){
      return NextResponse.json({error: "User already exists"}, {status: 400})
    }

    //Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //Now we want to save a user in the database, so we have to save it accordingly
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    //Let's save it into the database
    const savedUser = await newUser.save();
    console.log(savedUser);


    //Send verification email
    await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

    //Now let's return a response
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    })

  }catch(error: any){
    return NextResponse.json({error: error.message}, {status: 500})
  }
}