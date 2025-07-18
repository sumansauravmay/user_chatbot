const dns = require("dns");
const { connection } = require("../../../config/db");

// Regex for validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactNumberRegex = /^\d{10}$/;

const checkEmailDomain = (email) => {
  return new Promise((resolve, reject) => {
    const domain = email.split("@")[1];
    dns.resolve(domain, "MX", (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return resolve(false);
      }
      return resolve(true);
    });
  });
};

const addNewUser = async (req, res) => {
  const { name, email, password, contactnumber } = req.body;

  // Basic empty field check
  if (!name || !email || !password || !contactnumber) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Validate password
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    });
  }

  // Validate email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  // Validate contact number
  if (!contactNumberRegex.test(contactnumber)) {
    return res.status(400).json({
      success: false,
      message: "Contact number must be exactly 10 digits.",
    });
  }

  // Validate email domain exists
  const isDomainValid = await checkEmailDomain(email);
  if (!isDomainValid) {
    return res.status(400).json({
      success: false,
      message: "Email domain does not exist.",
    });
  }

  try {
    const checkQuery = `SELECT * FROM "user" WHERE email = $1`;
    const checkResult = await connection.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This email already exists",
      });
    }

    const query = `INSERT INTO "user" (name, email, password, contactnumber) VALUES ($1, $2, $3, $4) RETURNING *`;

    const values = [name, email, password, contactnumber];
    const result = await connection.query(query, values);

    return res.status(201).json({
      success: true,
      message: "User added successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addNewUser,
};
