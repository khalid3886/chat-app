const express=require('express')
const userRouter=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const{userModel}=require('../model/user.model')

userRouter.post('/signup',async(req,res)=>{
    const {email,pass,name}=req.body
    try{
        const hash=await bcrypt.hash(pass,5)
        const user=new userModel({email,pass:hash})
        await user.save()
        res.status(200).json({msg:'user has been registered'})
    }
    catch(err)
    {
        res.status(400).json({error:err})
    } 
})

userRouter.post('/login',async(req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await userModel({email})
        if(email)
        {
            bcrypt.compare(user.pass,pass,(err,result)=>{
                if(err)
                {
                    res.status(200).json({msg:'wrong credentials'})
                }else{
                    const access_token=jwt.sign({userID:user._id,userEmail:email},'khalid',{expiresIn:60*60*24})
                    //store it in redis
                    res.status(200).json({msg:'login successfull',access_token})
                }
            })
        }else{
            res.status(200).json({msg:'sign up please'})
        }
    }
    catch(err)
    {
        res.status(400).json({error:err})
    }
})

userRouter.get('/logout',async(req,res)=>{
    try{
        //remove token from redis
    }
    catch(err)
    {
        res.status(400).json({msg:'logout successfull'})
    }
})


userRouter.get('/:email',async(req,res)=>{
    const email=req.params.email
    try{
        const user=await userModel({email})
        res.status(200).json(user)
    }
    catch(err)
    {
        res.status(400).json({error:err})
    }
})

module.exports={
    userRouter
}
