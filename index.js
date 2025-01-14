const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const connect_db = require("./connect_db");
const User_Model = require("./schema_&_model");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

// Connection to database
connect_db();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session middleware for flash messages
app.use(
    session({
        secret: "yourSecretKey", // Replace with a strong, unique secret
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());

// Middleware to make flash messages accessible globally
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("success")[0];
    res.locals.errorMessage = req.flash("error")[0];
    next();
});

// Routes
// Root Route
app.get("/", (req, res) => {
    res.send("I am a lord who wants to get the feast for web");
});

// Home Route: Display all users
app.get("/home", async (req, res) => {
    try {
        const users = await User_Model.find();
        res.render("home.ejs", { users });
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).send("Error fetching users");
    }
});

// Show user details route
app.get("/show/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_Model.findById(id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        res.render("show.ejs", { user });
    } catch (err) {
        console.error("Error fetching user:", err.message);
        req.flash("error", "Failed to fetch user details.");
        res.redirect("/home");
    }
});

// Show create user form
app.get("/create_user", (req, res) => {
    res.render("create.ejs"); // Render the 'create.ejs' form
});

// Create user route (POST)
app.post("/create_user", async (req, res) => {
    try {
        const { name, email, age, image } = req.body;

        const newUser = new User_Model({
            name,
            email,
            age,
            image,
        });

        await newUser.save();
        req.flash("success", "User is created successfully!");
        res.redirect("/home"); // Redirect to home after creation
    } catch (err) {
        console.error("Error creating user:", err.message);
        req.flash("error", "Failed to create user.");
        res.redirect("/home");
    }
});

// Render update form (GET request)
app.get("/update_user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_Model.findById(id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        res.render("update.ejs", { user });
    } catch (err) {
        console.error("Error fetching user for update:", err.message);
        req.flash("error", "Failed to fetch user for update.");
        res.redirect("/home");
    }
});

// Update user route (PUT request)
app.put("/update_user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, image } = req.body;

        // Find and update the user
        const updatedUser = await User_Model.findByIdAndUpdate(
            id,
            { name, email, age, image },
            { new: true }
        );

        if (!updatedUser) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        req.flash("success", "User updated successfully!");
        res.redirect(`/show/${updatedUser._id}`);
    } catch (err) {
        console.error("Error updating user:", err.message);
        req.flash("error", "Failed to update user.");
        res.redirect("/home");
    }
});

// Delete user route
app.delete("/delete_user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User_Model.findByIdAndDelete(id);

        if (!deletedUser) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        req.flash("success", "User deleted successfully!");
        res.redirect("/home");
    } catch (err) {
        console.error("Error deleting user:", err.message);
        req.flash("error", "Failed to delete user.");
        res.redirect("/home");
    }
});

//Founder
app.get('/about',async (req,res) => {
        res.render('about.ejs');
});

// Universal GET route for unmatched routes
app.get("*", (req, res) => {
    res.status(404).render("universal.ejs");
});

// Listen on the port
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
