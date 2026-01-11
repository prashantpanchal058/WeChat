const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://prashantpanchal058_db_user:pWKSsslkwtew2XVL@cluster0.vzkusa2.mongodb.net/weChat?appName=Cluster0";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    .then(()=>console.log("database is connected."));
}

module.exports = connectToMongo;