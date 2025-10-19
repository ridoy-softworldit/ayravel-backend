import jwt,{ JwtPayload, SignOptions } from 'jsonwebtoken';




const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions)
  

  return token
}


const verifyToken = (token: string, secret: string) => {
  const verifyToken = jwt.verify(token, secret)

  return verifyToken
}


export {generateToken, verifyToken}