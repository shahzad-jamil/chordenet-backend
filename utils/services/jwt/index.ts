import jwt from "jsonwebtoken";
export const getSignedJwt = (id: string) =>{
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

export const createResetToken = (id: { email: string }, time: string) =>
  jwt.sign(id, process.env.JWT_SECRET!, {
    expiresIn: time,
  });

export const verifyToken = (token: any) => {
  try {

    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
