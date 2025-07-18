const { connection } = require("../../../config/db");

const addNewUser = async (req, res) => {
  const { name, email, password, contactnumber } = req.body;

  if (!name || !email || !password || !contactnumber) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  
  try {
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
