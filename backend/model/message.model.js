const mongoose=require('mongoose')
const msgSchema=mongoose.Schema({
    senderemail:String,
    receiveremail:String,
    msg:String,
    time:String
},{
    versionKey:false
})

const MsgModel=mongoose.model('message',msgSchema)

module.exports={
    MsgModel
}