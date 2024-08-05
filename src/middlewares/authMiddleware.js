import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const checkAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; 
    next(); 
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};

export const authorizeAdmin  = (req, res, next) =>{
  const { user } = req; 
  if (user && user.id_rol === 1) {
    return next();
  }
  return res.status(403).json({ message: 'Prohibido: Solo administradores' });
}
