import jwt from 'jsonwebtoken';

interface DecodedToken {
  workerId: string;
}

export const getWorkerIdFromToken = (request: Request): string | null => {
  const authHeader = request.headers.get('authorization');
  console.log('Authorization Header:', authHeader); // Debugging log

  if (!authHeader) {
    console.error('Authorization header is missing.');
    return null;
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) {
    console.error('Token is missing in Authorization header.');
    return null;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log('Decoded Token:', decodedToken); // Debugging log
    return decodedToken.workerId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
