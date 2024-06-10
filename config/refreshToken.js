import jwt  from "jsonwebtoken";

const generateRefreshToken = (id)=>{
    let token = jwt.sign({id}, "secret_key", {expiresIn: "3d"});
    return token;
}

export default generateRefreshToken;