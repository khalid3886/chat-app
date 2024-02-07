const express=require('express')
const app=express()
const {connection}=require('./db')
const {userRouter}=require("./route/user.route")

app.use(express.json())
app.use('/users',userRouter)

app.get('/',(req,res)=>{
    res.send('home page')
})


app.listen(8080,async()=>{
    console.log('server is running')
    try{
        await connection
        console.log('connected to db')
    }
    catch(err)
    {
        console.log(err)
    }
})
