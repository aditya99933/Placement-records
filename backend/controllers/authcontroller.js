const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    if (email !== process.env.ADMIN_EMAIL) return res.status(401).json({ error: "Invalid email" });

    // ADMIN_PASSWORD should be a hashed password
    const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login };

