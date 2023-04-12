require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = 3000;

//connecting mongoDB database
const url = process.env.DATABASE_URL
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

/*
//for development only
// mongoose.connect(url);
const db = mongoose.connection;
db.on("error", (err) => console.log(err))

db.once("open", async () => {
    console.log('Connected to the database')
    // console.log(await mongoose.connection.db.listCollections().toArray())
})
*/

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

//users route
app.use('', require('./routes/users_routes'))
app.use('', require('./routes/tracks_routes'))

app.listen(PORT, () => {
    console.log(`Server started at port http://localhost:${PORT}`)
})