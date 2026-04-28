const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Blog = require("../models/blog");

const getBlogById = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) return res.redirect("/home");
    res.render("blog", { user, blog });
  } catch (err) {
    console.error(err);
    res.redirect("/home");
  }
};


const getLoggedInUser = async (req) => {
  try {
    const token = req.cookies.token;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return await User.findById(decoded.id);

  } catch (error) {
    return null;
  }
};

const homePageHandler = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);

    const blogs = await Blog.find()
      .populate("createdBy")
      .sort({ createdAt: -1 });

    res.render("home", {
      user,
      blogs
    });

  } catch (error) {
    console.log(error);

    res.render("home", {
      user: null,
      blogs: []
    });
  }
};
const addBlogGetHandler = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);

    res.render("addBlog", { user });

  } catch (error) {
    console.log(error);
    res.redirect("/home");
  }
};

const addBlogPostHandler = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);

    const { title, body } = req.body;

    if (!title || !body) {
      return res.render("addBlog", {
        user,
        error: "Title and body are required"
      });
    }

   const blog= await Blog.create({
      title,
      body,
      coveredImageURL: req.file ? req.file.filename : "",
      createdBy: user._id
    });

    return res.redirect("/home");

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getBlogById,
  homePageHandler,
  addBlogGetHandler,
  addBlogPostHandler
};
