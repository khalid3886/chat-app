const express=require('express')
const cors=require('cors')
const app=express()
const {connection}=require('./db')
const {userRouter}=require("./route/user.route")
const{Server}=require('socket.io')
const http=require('http')
const httpserver=http.createServer(app)
const {transports,format}=require('winston')
const expressWinston=require('express-winston')
const {redis}=require('./controller/redis.controller')
const {MsgModel}=require('./model/message.model')

app.use(express.json())
app.use(cors())
app.use('/users',userRouter)
app.use(expressWinston.logger({
    transports:[
        // new transports.Console({
        //     json:true,
        //     colorize:true,
        //     level:"error"
        // })
        new transports.File({
            json:true,
            level:"warn",
            filename:"warninglogs.log"
        })
    ],
    format: format.combine(
        format.colorize(),
        format.json(),
        format.prettyPrint()
    ),
    msg: "HTTP {{req.method}} {{req.url}}",
    statusLevels:true
}))

app.get('/', (req, res) => {
    res.send('home page')
});

httpserver.listen(8080,async()=>{
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

const wss=new Server(httpserver)
let connected_user=0;
wss.on('connection',(socket)=>{
    connected_user++;
    socket.on('user-email',async(email)=>{
        await redis.setex(`${email}_socketid`, 86400, socket.id);
        console.log(`${email} id is - ${socket.id}`)
    })
    console.log('user is connected')
    socket.emit('active-user',connected_user)
    socket.on('updated-avatar',(email)=>{
        socket.broadcast.emit('updated-avatar-to-all',email)
    })
    socket.on('xyz',(name)=>{
        socket.broadcast.emit('new-user',(name))
    })
    socket.on('private_message', async (data) => {
        const { senderemail, receiveremail, msg } = data;
        let time = new Date().toString().slice(16, 24);
        const message = new MsgModel({ senderemail, receiveremail, msg, time });
        try {
            await message.save();
            const recipientId = await redis.get(`${receiveremail}_socketid`);
            console.log(`recipient id is ${recipientId}`)
            console.log('id is-${}')
            if (recipientId) {
                socket.to(recipientId).emit('receive_private_message', data);
            } else {
                console.log(`Recipient ID not found for ${receiveremail}`);
            }
        } catch (error) {
            console.error('Error saving message to MongoDB:', error);
        }
    });
    
    socket.on('send-message',(obj)=>{
        socket.broadcast.emit('broadcast-msg',obj)
    })
    socket.on('disconnect',()=>{
        connected_user--;
        socket.broadcast.emit('active-user',connected_user)
        console.log('user is disconnected')
    })
})