const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ======================================================
// REGISTER USER (CLIENT)
// ======================================================
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, contact, birthday, address } = req.body;

        if (!fullName || !email || !password || !contact) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            full_name: fullName,
            email,
            password: hashedPassword,
            role: "client",   // ✅ FIXED ROLE
            contact,
            birthday: birthday || null,
            address: address || null,
            disabled: false
        });

        return res.json({
            success: true,
            message: "Account created!",
            user: {
                id: newUser.id,
                full_name: newUser.full_name,
                email: newUser.email,
                contact: newUser.contact,
                birthday: newUser.birthday,
                address: newUser.address,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

// ======================================================
// LOGIN (FOR ALL ROLES)
// ======================================================
exports.login = async (req, res) => {
    try {
        const email = req.body.email?.trim() || "";
        const password = req.body.password?.trim() || "";

        const user = await User.findByEmail(email);
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        // FIX: check the correct role name
        if (user.role === "client" && user.disabled) {
            return res.status(403).json({ error: "Your account has been disabled. Contact admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            "secret123",
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                contact: user.contact,
                birthday: user.birthday,
                address: user.address,
                role: user.role
            },
            token
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

// ======================================================
// GET USER BY ID
// ======================================================
exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);

    } catch (err) {
        console.error("GET USER ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ======================================================
// UPDATE USER ACCOUNT
// ======================================================
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { full_name, contact, birthday, address, password } = req.body;

        if (!full_name || !contact || !birthday || !address) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const updateFields = {
            full_name,
            contact,
            birthday,
            address
        };

        if (password && password.trim().length >= 8) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.update(userId, updateFields);

        if (!updatedUser) {
            return res.status(400).json({ error: "User update failed." });
        }

        res.json({
            success: true,
            message: "Account updated successfully!",
            user: updatedUser
        });

    } catch (err) {
        console.error("UPDATE USER ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
