const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js")

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/easystay");
}
main().then((res)=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})

const initDB = async ()=>{
  await  Listing.deleteMany({});
  initData.data= initData.data.map((obj)=>({
       ...obj,
       owner:'67fb5eaf991182e5479b3f5c'
    }))
    await Listing.insertMany(initData.data);
    console.log("data was intilized");
}

initDB();