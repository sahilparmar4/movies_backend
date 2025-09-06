import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Simple JWT-based authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Authorization token missing or malformed' });
	}

	const token = authHeader.split(' ')[1];
	const secret = process.env.JWT_SECRET || 'change_this_secret';
	try {
		const payload = jwt.verify(token, secret) as any;
		// attach to request — use `as any` to avoid TS errors without global types
		(req as any).user = payload;
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

// Authorization middleware to allow only admin users
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
	const user = (req as any).user;
	if (!user) return res.status(401).json({ message: 'Not authenticated' });
	if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: admin only' });
	return next();
};

export default { authenticate, authorizeAdmin };
