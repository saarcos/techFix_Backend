import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const checkAuth = async (req, res) => {
  const token = req.cookies.access_token;
  console.log(req.cookies.access_token)
  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ isAuthenticated: true, user });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};