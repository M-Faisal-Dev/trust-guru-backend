import jwt  from "jsonwebtoken";

const generateToken = (id)=>{
    let token = jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: "1d"});
    return token;
}

export default generateToken