import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    // The HTTP 403 Forbidden response status code indicates that the server 
    // understands the request but refuses to authorize it.
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // to check if the token of the req == env.里的JWT_SECRET
    req.user = verified; 
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};