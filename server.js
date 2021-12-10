import mongoose from "mongoose";
import cors from "cors";
import bodyParser from 'body-parser';
import express from "express";
import hod from "./Hod.js";
import faculty from "./Faculty.js";
import incharge from "./Incharge.js";

/*Model imports*/
import Student, { Leave, Other } from "./model.js";
import { Faculty,Hod,Incharge,Gate,Event,Sick } from "./model.js";

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
                    leave_passess:0,
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
        student_rollno:req.body.rollno,
        reason:req.body.reason,
        gen_date:new Date().toDateString(),
        Faculty:{
            name:req.body.faculty_name,
            email:req.body.faculty_mail,
            permitted:null
        },
        Incharge:{
            name:req.body.incharge_name,
            email:req.body.incharge_email,
            permitted:null
        },
        year:student_year,
        accepted_by_hod:null,
        marked_for_review:null,
        sent_by:null,
        status:"pending",
        department:req.body.department
    });
    new_gatepass.save();
    res.status(200).json({added:true});
});

app.post("/eventPass",(req,res)=>{
    const new_pass = Event({
        student_rollno:req.body.rollno,
        gen_date:new Date().toDateString(),
        poster:req.body.poster,
        event_name:req.body.event_name,
        venue:req.body.venue,
        Faculty:{
            name:req.body.faculty_name,
            email:req.body.faculty_email,
            permitted:null,
        },
        Incharge:{
            name:req.body.incharge_name,
            email:req.body.incharge_email,
            permitted:null
        },
        accepted_by_hod:null,
        marked_for_review:null,
        start_date:req.body.start_date,
        end_date:req.body.end_date,
        sent_by:null,
    });
    console.log(new_pass);
    new_pass.save();
});

app.post("/sickpass",(req,res)=>{
    const sick_pass = new Sick({
        student_rollno:req.body.student_rollno,
        gender:req.body.gender,
        reason:req.body.reason,
        gen_date:new Date().toDateString(),
        Faculty:{
            name:req.body.faculty_name,
            email:req.body.faculty_email,
            permitted:null 
        },
        year:req.body.year,
        department:req.body.department,
        status:"pending",
        sent_by:null
    });
    sick_pass.save();
    res.status(200).json({saved:true});
});

app.post("/otherpass",(req,res)=>{
    const otherpass = new Other({
        student_rollno:req.body.rollno,
        title:req.body.title,
        reason:req.body.reason,
        gen_date:new Date().toDateString(),
        Faculty:{
            name:req.body.faculty_name,
            email:req.body.faculty_email,
            permitted:null
        },
        Incharge:{
            name:req.body.incharge_name,
            email:req.body.incharge_email,
            permitted:null
        },
        accepted_by_hod:null,
        year:req.body.year,
        marked_for_review:null,
        department:req.body.department,
        status:"pending",
        sent_by:null
    });
    otherpass.save();
    res.status(200).json({saved:true});
});

app.post("/leave",(req,res)=>{
    const new_leave = new Leave({
        student_roll:req.body.rollno,
        subject:req.body.subject,
        body:req.body.letter_body,
        gen_date:new Date().toDateString(),
        start_date:req.body.start_date(),
        end_date:req.body.end_date(),
        Faculty:{
            name:req.body.faculty_name,
            email:req.body.faculty_email,
            permitted:null
        },
        Incharge:{
            name:req.body.incharge_name,
            email:req.body.incharge_email,
            permitted:null
        },
        accepted_by_hod:null,
        year:req.body.year,
        marked_for_review:null,
        department:req.body.department,
        status:"pending",
        sent_by:null
    });
    new_leave.save();
    res.status(200).json({added:true});
});

app.post("/get/gatepass",(req,ree)=>{
    Gate.find({student_rollno:req.body.roll,gen_date:new Date().toDateString()},(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

app.post("/get/eventpass",(req,res)=>{
    Event.find(
        {student_rollno:req.body.rollno,
        end_date:{$gte:new Date().toDateString()}}
    ,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
           res.status(200).json(result);  
        }
    })
});

app.post("/get/leavepass",(req,res)=>{
    Leave.find({student_rollno:req.body.rollno,end_date:{$gte:new Date().toDateString()}},(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

app.post("/get/sickpass",(req,res)=>{
    Sick.find({student_rollno:req.body.rollno,gen_date:new Date().toDateString()},(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else
        {
            res.status(200).json(result);
        }
    })
});

app.post("/get/otherpass",(req,res)=>{
    Other.find({student_rollno:req.body.rollno},(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

app.post("/history/gatepass",(req,res)=>{
    const filter = {
        student_rollno:req.body.rollno,
        $or:[
            {'Faculty.permitted':true},
            {'Faculty.permitted':false},
            {'Incharge.permitted':true},
            {'Incharge.permitted':false},
            {accepted_by_hod:true},
            {accepted_by_hod:false}
        ],
    }
    Gate.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
    
});

app.post("/history/eventpass",(req,res)=>{
    const filter = {
        student_rollno:req.body.rollno,
        $or:[
            {'Faculty.permitted':true},
            {'Faculty.permitted':false},
            {'Incharge.permitted':true},
            {'Incharge.permitted':false},
            {accepted_by_hod:true},
            {accepted_by_hod:false}
        ],
    }
    Event.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    }) 
});

app.post("/history/leavepass",(req,res)=>{
    const filter = {
        student_rollno:req.body.rollno,
        $or:[
            {'Faculty.permitted':true},
            {'Faculty.permitted':false},
            {'Incharge.permitted':true},
            {'Incharge.permitted':false},
            {accepted_by_hod:true},
            {accepted_by_hod:false}
        ],
    }
    Leave.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})
app.post("/history/otherpass",(req,res)=>{
    const filter = {
        student_rollno:req.body.rollno,
        $or:[
            {'Faculty.permitted':true},
            {'Faculty.permitted':false},
            {'Incharge.permitted':true},
            {'Incharge.permitted':false},
            {accepted_by_hod:true},
            {accepted_by_hod:false}
        ],
    }
    Other.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})
app.post("/history/sickpass",(req,res)=>{
    const filter = {
        student_rollno:req.body.rollno,
        $or:[
            {'Faculty.permitted':true},
            {'Faculty.permitted':false},
            {'Incharge.permitted':true},
            {'Incharge.permitted':false},
            {accepted_by_hod:true},
            {accepted_by_hod:false}
        ],
    }
    Sick.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
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