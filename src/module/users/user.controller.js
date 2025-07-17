const { connection } = require("../../config/db");

const addNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "name, email and password are required",
    });
  }

  
  try {
    const query = `INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *`;

    const values = [name, email, password];
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
