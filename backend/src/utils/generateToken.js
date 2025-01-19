// utils/generateToken.js
import jwt from 'jsonwebtoken';

// Function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expiry time
  });
};

export { generateToken };
