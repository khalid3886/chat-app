const mongoose=require('mongoose')
const msgSchema=mongoose.Schema({
    senderID:String,
    receiverID:String,
    content:String,
    time:Date
},{
    versionKey:false
})

const MsgModel=mongoose.model('message',msgSchema)

module.exports={
    MsgModel
}