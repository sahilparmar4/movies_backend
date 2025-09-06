import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const adminEmail = process.env.ADMIN_EMAIL;
		const adminPassword = process.env.ADMIN_PASSWORD;

		if (!adminEmail || !adminPassword) {
			return res.status(500).json({ message: "Admin credentials are not configured on server" });
		}

		if (email !== adminEmail || password !== adminPassword) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const payload = {
			email: adminEmail,
			role: "admin",
		};

		const secret = process.env.JWT_SECRET || "change_this_secret";
		const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

		const token = jwt.sign(payload, secret, { expiresIn });

		return res.json({ status: 200, message: "Admin login successful", data: { token } });
	} catch (err) {
		console.error("Auth login error:", err);
		return res.status(500).json({ message: "Server error", error: err });
	}
};