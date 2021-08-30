const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.TOKEN_SECRET;

module.exports = (req, res, next) => {
  console.log("checking authorization");
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userData = decoded;
    console.log("user authorized");
    next();
  } catch (error) {
    console.log("unauthorized access");
    console.log(error);
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
