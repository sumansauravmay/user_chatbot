const crypto = require("crypto");
const { connection } = require("../../../config/db");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic field validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Check if user exists
    const userQuery = `SELECT * FROM "user" WHERE email = $1`;
    const userResult = await connection.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = userResult.rows[0];

    // Compare password (plain here; in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to DB (optional: set expiration)
    const updateOtpQuery = `UPDATE "user" SET otp = $1 WHERE email = $2`;
    await connection.query(updateOtpQuery, [otp, email]);

    // Send OTP (log for now, or integrate nodemailer/SMS)
    console.log(`Generated OTP for ${email}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      email: email,
      otp: otp,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  loginUser,
};
