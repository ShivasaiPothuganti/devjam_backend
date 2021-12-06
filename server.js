import mongoose from "mongoose";
import cors from "cors";
import bodyParser from 'body-parser';
import express from "express";
import hod from "./Hod.js";
import faculty from "./Faculty.js";
import incharge from "./Incharge.js";

/*
    {
        "incharge":"deepthi",
        "reason":"neek enduku",
        "facultyname":"ravikumar",
        "facultyMail":"ravikumar@gmail.com",
        "inchargeName":"deepthi",
        "inchargeEmail":"deepthi@gmail.com"
    } 
*/

/*Model imports*/
import Student from "./model.js";
import { Faculty,Hod,Incharge,Gate,Event } from "./model.js";

/*app config */
const app = express();
const port = 5000||process.env.PORT;
app.use(bodyParser.urlencoded({extended:1}));
app.use(bodyParser.json());
app.use(cors());

/*routing setup */
app.use("/hod",hod);
app.use("/faculty",faculty);
app.use("/incharge",incharge);

/*global variables */
var student_department;
var student_rollno;
var student_year;

/*mongodb setup */
const mongoodb_connection_url = "mongodb+srv://shivasai:top10devjam@cluster0.t2vkl.mongodb.net/permitUS?retryWrites=true&w=majority";
mongoose.connect(mongoodb_connection_url,(err)=>{
    if(err){
        console.log("connection failed");
    }
    else{
        console.log("connected successfully");
    }
});


app.post("/studentLogin",(req,res)=>{
    const rollno = req.body.rollno;
    const password = req.body.password;
    Student.findOne({rollno:rollno},(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else
        {
            if(result){
                if(result.password===password){
                    student_rollno = rollno;
                    student_department = result.department;
                    student_year = result.year;
                    res.status(200).json({login:true});
                }
                else{
                    res.status(200).json({login:false});
                }
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
});


app.post("/studentRegister",(req,res)=>{
    Student.findOne({rollno:req.body.rollno},(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            if(result){
                res.status(200).json({registered:false});
            }
            else
            {
                const student_save_data = new Student({
                    name:req.body.name,
                    rollno:req.body.rollno,
                    email : req.body.rollno+"@cmrcet.ac.in",
                    password : req.body.password,
                    department:req.body.department,
                    gender:req.body.gender,
                    year:req.body.year,
                    event_passess:0,
                    gate_passesss:0,
                    council_passess:0,
                    sick_passes:0
                });
                student_save_data.save();
                student_rollno = student_save_data.rollno;
                student_department = student_save_data.department;
                student_year = student_save_data.year;
                res.status(200).json({registered:true});
            }
        }
    })
})


app.post("/GatePass",(req,res)=>{
    const new_gatepass = Gate({
        student_rollno:student_rollno,
        reason:req.body.reason,
        gen_date:new Date().toDateString(),
        Faculty:{
            name:req.body.facultyname,
            email:req.body.facultyMail,
            permitted:null
        },
        Incharge:{
            name:req.body.inchargeName,
            email:req.body.inchargeEmail,
            permitted:null
        },
        year:student_year,
        accepted_by_hod:null,
        marked_for_review:null,
        status:"pending",
    });
    new_gatepass.save();
    res.status(200).json({added:true});
});



app.get("/",(req,res)=>{
    res.send("<h1>I am up and running</h1>");
});

app.listen(port,(err)=>{
    if(err){
        console.log("server is not running");
    }
    else
    {
        console.log("server is up and running on port "+port);
    }
});