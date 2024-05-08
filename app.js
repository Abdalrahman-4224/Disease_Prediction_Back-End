const cors = require("cors");

require('dotenv').config();

const app = require("./src/config/setup");

const loginRoutes = require("./src/api/login/Routes");
const usersRoutes = require("./src/api/users/Routes");

const governoratesRoutes = require("./src/api/governorates/Routes");
const doctorsRoutes = require("./src/api/doctors/Routes");
const flastRoutes = require("./src/api/flask/Routes")

const home = require("./src/helper/home");

// getting static files
app.use(cors());
// getting static files
app.use("/login", loginRoutes);
app.use("/users", usersRoutes);
app.use("/doctors", doctorsRoutes)
app.use("/governorates", governoratesRoutes)
app.use("/flask",flastRoutes)
app.use("/", home);

module.exports = app;
