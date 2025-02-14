// lib/authUtils.ts
import jwt from 'jsonwebtoken';

/**
 * Extracts the worker ID from the JWT token in the request headers.
 * @param request - The incoming request object.
 * @returns The worker ID if the token is valid, otherwise null.
 */
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
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('Decoded Token:', decodedToken); // Debugging log
    return decodedToken.workerId; // Assuming the token includes a `workerId` field
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};