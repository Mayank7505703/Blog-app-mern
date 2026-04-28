const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body || {};

    if (!username || !email || !password) {
      return res.render("signup", { error: "All fields are required." });
    }

    if (username.length < 3) {
      return res.render("signup", { error: "Username must be at least 3 characters." });
    }

    if (password.length < 8) {
      return res.render("signup", { error: "Password must be at least 8 characters." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("signup", { error: "Please enter a valid email address." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.render("signup", { error: "An account with this email already exists." });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const profileImageURL = req.file ? req.file.filename : '/images/image.png';

    await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPass,
      profileImageURL,
      role: role === 'admin' ? 'admin' : 'user'
    });

    return res.redirect("/user/signin?registered=1");

  } catch (err) {
    console.error("Signup error:", err);
    return res.render("signup", { error: "Something went wrong. Please try again." });
  }
};

const signinHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("signin", { error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.render("signin", { error: "No account found with that email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("signin", { error: "Incorrect password. Please try again." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.redirect("/home");

  } catch (err) {
    console.error("Signin error:", err);
    return res.render("signin", { error: "Something went wrong. Please try again." });
  }
};

const logoutHandler = (req, res) => {
  res.clearCookie("token");
  return res.redirect("/home");
};

module.exports = { signupHandler, signinHandler, logoutHandler };
