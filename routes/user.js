var express = require("express");
var route = express.Router();
var exe = require("../connection");
var url = require("url")


route.get("/",async function(req,res){
    var sql = `SELECT * FROM programs ORDER BY created_at DESC  LIMIT 3`;
    var data = await exe(sql);
     var obj = {"program":data}
    res.render("user/index.ejs",obj)
})

route.get("/about",function(req,res){
    res.render("user/about.ejs")
})

route.get("/program",async function(req,res){
   var sql = `SELECT * FROM programs ORDER BY created_at DESC`;
    var data = await exe(sql);
    var obj = {"program":data}
    res.render("user/program.ejs",obj)
})
route.get("/volunteer",function(req,res){
    res.render("user/volunteer.ejs")
})

route.post("/save_volunteer",async function(req,res){
  var d = req.body;
var sql = `INSERT INTO volunteer
(volunteer_name,volunteer_email,volunteer_mobile,volunteer_intrest,volunteer_avalability,volunteer_experience,volunteer_why)
VALUES
('${d.volunteer_name}','${d.volunteer_email}','${d.volunteer_mobile}','${d.volunteer_intrest}','${d.volunteer_avalability}','${d.volunteer_experience}','${d.volunteer_why}')` 
var data = await exe(sql);
// res.send(data); 
res.redirect("/volunteer")
})


route.get("/donate",async function(req,res){
    res.render("user/donate.ejs")
})

route.post("/save_donar_info",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO donar_information(donar_name,donar_email,donar_mobile,donation_for,donation_type,prize)
    VALUES
    ('${d.donar_name}','${d.donar_email}','${d.donar_mobile}','${d.donation_for}','${d.donation_type}','${d.prize}')`
    var data = await exe(sql);
    res.redirect("/donate")
    // res.send(data);
})

route.get("/event",async function(req,res){
    var sql = `SELECT * FROM upcoming_event ORDER BY event_date ASC`;
    var sql1 = `SELECT * FROM past_event ORDER BY program_date DESC`;
    let data = await exe(sql);
    var data1 = await exe(sql1);
    var obj = {"upcoming_event":data, "past_event":data1}
    res.render("user/event.ejs",obj)
})

route.get("/contact",function(req,res){
    res.render("user/contact.ejs")
})

route.post("/save_contact",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO message(name,email,mobile,subject,message)
    VALUES
    ('${d.name}','${d.email}','${d.mobile}','${d.subject}','${d.message}')`;
    var data = await exe(sql);
    // res.send(data)
    res.redirect("/contact")
})

module.exports = route;