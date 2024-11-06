import bcrypt from "bcryptjs-react";

export default async function HashPassword(password: string) {
  const saltRounds = 10; // You can adjust the cost factor
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
