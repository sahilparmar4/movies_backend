import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/User";

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const admin = await User.findOne({ role: 'admin' }).select('+password').exec();
		if (!admin) {
			return res.status(500).json({ message: 'Admin user is not set up. Please run seeder.' });
		}

		if (admin.email !== email) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const passHash = (admin as any).password as string;
		const match = await bcrypt.compare(password, passHash);
		if (!match) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const payload = {
			id: admin._id,
			email: admin.email,
			role: admin.role || 'admin',
		};

		const secret = process.env.JWT_SECRET || 'change_this_secret';
		const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

		const token = jwt.sign(payload, secret, { expiresIn });

		await User.findByIdAndUpdate(admin._id, { token }, { new: true });

		return res.json({ status: 200, message: 'Admin login successful', data: { email: admin?.email, token } });
	} catch (err) {
		console.error('Auth login error:', err);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;

		if (!userId) {
			return res.status(400).json({ message: "User not authenticated" });
		}

		await User.findByIdAndUpdate(userId, { $unset: { token: null } });

		return res.json({
			status: 200,
			message: "Logout successful",
		});
	} catch (err) {
		console.error("Logout error:", err);
		return res.status(500).json({ message: "Server error during logout" });
	}
};
