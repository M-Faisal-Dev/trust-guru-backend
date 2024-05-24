import jwt  from "jsonwebtoken";

const generateRefreshToken = (id)=>{
    let token = jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: "3d"});
    return token;
}

export default generateRefreshToken;