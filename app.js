if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
let cors = require("cors");
let passport = require("passport");
const LocalStrategy = require("passport-local");

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))

app.use(express.urlencoded({ extended: true }));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const engine = require("ejs-mate");
app.engine("ejs", engine);

let { isLoggedIn } = require("./middlewares.js");

const dbUrl = process.env.ATLASDB_URL;
const mongoose = require("mongoose");
main().then((res) => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
    // await mongoose.connect("mongodb://127.0.0.1:27017/cma");
}

const asyncWrap = require("./utilities/asyncWrap.js");
const ExpressErr = require("./utilities/expressError.js");

let User = require("./models/user");
let Tool = require("./models/tool.js");
let Stock = require("./models/stock.js")

const session = require("express-session");
const MongoStore = require('connect-mongo');

let userRouter = require("./routes/userRouter.js");

let store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 60 * 60 * 3,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

let sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        secure: false,
    }
}
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {

    res.locals.currUser = req.user;
    next();
});


app.use(cors({
    origin: process.env.FRONTEND_URL,

    method: "GET, POST, PUT, DELETE",
    credentials: true
}))

app.use("/", userRouter);



app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/option", (req, res) => {
    res.render("option.ejs");
})

app.get("/workbench", isLoggedIn, asyncWrap(async (req, res) => {
    let toolArr = await Tool.find({});
    toolArr = toolArr.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : 1);
    console.log(toolArr);
    res.render("workbench.ejs", { toolArr });
}))

app.get("/workbench/new", isLoggedIn, (req, res) => {
    res.render("workbench/newTool.ejs");
})

app.post("/workbench/new", isLoggedIn, asyncWrap(async (req, res) => {

    let newTool = new Tool(req.body.tool);
    let saveTool = await newTool.save();
    res.redirect("/workbench");
}));

app.get("/farm", isLoggedIn, asyncWrap(async (req, res) => {
    let stockArr = await Stock.find({});
    const sortedSeeds = stockArr.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : 1);
    console.log(sortedSeeds);
    res.render("farm.ejs", { sortedSeeds });
}))

app.get("/farm/new", isLoggedIn, (req, res) => {

    res.render("farm/newSeed.ejs");
})
app.post("/farm/new", isLoggedIn, asyncWrap(async (req, res) => {
    console.log(req.body.seed);
    let newSeed=new Stock(req.body.seed);
    
    let saveSeed=await newSeed.save();
    res.redirect("/farm");
}))

app.get("/inventory", isLoggedIn, (req, res) => {
    let user=req.user;
    res.render("inventory.ejs",{user});
})

app.get("/noti",async(req,res)=>{
    let resArr=await Stock.find({});
     resArr=resArr.filter((e)=>{
        return e.quantity>e.threshold;
    })
    resArr=resArr.map((e)=>{
        return e.name;
    })
    res.json(resArr);
})

app.get("/market",isLoggedIn,(req,res)=>{
    res.render("marketPlace/index.ejs");
})

app.get("/market/buy",isLoggedIn,(req,res)=>{
    res.render("marketPlace/buy.ejs");
})


app.all("*", (req, res, next) => {
    let err = new ExpressErr(404, "Page not found");
    next(err);
})

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("app running on 3000");
})