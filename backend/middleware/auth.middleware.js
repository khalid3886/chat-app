const jwt=require('jsonwebtoken')
const auth=async(req,res,next)=>{
const token=req.header.authorization?.split(" ")[1]
try{
///check this token in redis for logout
const decoded=jwt.verify(token,'khalid')
if(decoded)
{
    next()
}else{
    res.status(200).json({msg:'you are not authorised, login please'})
}
}
catch(err)
{
    res.status(400).json({error:err})
}
}