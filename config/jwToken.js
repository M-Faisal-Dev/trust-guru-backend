import jwt  from "jsonwebtoken";

const generateToken = (id)=>{
    let token = jwt.sign({id}, "secret_key", {expiresIn: "1d"});
    return token;
}

export default generateToken