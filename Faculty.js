import mongoose from "mongoose";
import express, { application } from "express";
import Student from "./model.js";
import { Faculty,Incharge,Hod,Gate,Event,Leave } from "./model.js";

const router  = express.Router();
var faculty_name;
var faculty_email;
var faculty_year;

/*
    {
        "reason":"testing purpose",
        "facultyname":"ravi",
        "facultyeMail":"ravi@gmail.com",
        "inchargeName":"deepthi",
        "inchargeEmail":"deepthi@gmail.com"
    }

*/


router.post("/",(req,res)=>{
    const year = req.body.year;
    const department = req.body.department;
    var filter = {};
    if(year===1){
        filter = {
            year:year,
            hod_approved:true,
        }
    }
    else{
        filter = {
            hod_approved:true,
            department:department,
            year:year
        }  
    }
    
    Faculty.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({err:true});
        }
        else{
            res.status(200).json(result);
        }
    });
});

router.post("/Login",(req,res)=>{
    Faculty.findOne({email:req.body.email},(err,result)=>{
        if(err){
            res.status(400).json({err:true});
        }
        else{
            if(result){
                if(result.password===req.body.password){
                    faculty_name = result.name;
                    faculty_email = result.email;
                    faculty_year = result.year;
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



router.post("/Register",(req,res)=>{
    Faculty.findOne({email:req.body.email},(err,result)=>{
        if(err){
            res.status(400).json({err:true});
        }
        else{
            if(result){
                res.status(200).json({found:true});
            }
            else{
                const new_faculty = new Faculty({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    department:req.body.department,
                    year:req.body.year,
                    hod_approved:false,
                    event_passess:0,
                    gate_passesss:0,
                    council_passess:0,
                    sick_passeds:0
                });
                faculty_name = req.body.name;
                faculty_email = req.body.email;
                faculty_year = req.body.year;
                new_faculty.save();
                res.status(200).json({register:true});
            }
        }
    })
});

router.post("/remove",(req,res)=>{
    Faculty.deleteOne({email:req.body.email},(err)=>{
        if(err){
            res.status(400).json({removed:false});
        }
        else{
            res.status(200).json({removed:true});
        }
    });
});

router.post("/get/gatepass",(req,res)=>{
    const filter = {
        gen_date:new Date().toDateString(),
        'Faculty.email':req.body.faculty_email,
        'Faculty.permitted':null,
        'Incharge.permitted':null,
        status:"pending",
        marked_for_review:null
    }
    console.log(filter);
    Gate.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({err:true});
        }
        else
        {
            console.log("this is result ",result);
            res.status(200).json(result);
        }
    });
});


router.post("/accept/gatepass",(req,res)=>{
    console.log("request");
    var filter = {};
    if(req.body.year===1){
        filter = {
            _id:req.body.id, 
            marked_for_review:null,
            'Faculty.email':req.body.faculty_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:1
        }
    }
    else{
        filter = {
            _id:req.body.id,
            marked_for_review:null,
            'Faculty.email':req.body.faculty_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            department:req.body.faculty_department,
            year:{$gte:2}
        }
    }
    Gate.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){ 
                Student.findOne({rollno:req.body.rollno},(err,student)=>{
                    if(err){
                        res.status(200).json({error:true});
                    }
                    else{
                        if(student){
                            Faculty.findOne({email:req.body.faculty_email},(err,faculty)=>{
                                if(err){
                                    res.status(200).json({updated:false});
                                }
                                else{
                                    if(faculty){
                                        faculty.gate_passesss+=1;

                                        result.Faculty.name = req.body.faculty_name;
                                        result.Faculty.email = req.body.faculty_email;
                                        result.Faculty.permitted=true;
                                        result.status = "accepted";
                                        
                                        student.gate_passesss = student.gate_passesss+1;

                                        faculty.save();
                                        result.save();
                                        student.save();
                                        res.status(200).json(result)
                                    }
                                    else{
                                        res.status(200).json({found_1:false});
                                    }
                                }
                            });
                        }
                        else{
                            res.status(200).json({found_2:false});
                        }
                    }
                });
            }
            else{
                res.status(200).json({found_3:false});
            }
        }
    });
})

router.post("/reject/gatepass",(req,res)=>{
    Gate.findOne({_id:req.body.id,marked_for_review:null},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){
                result.Faculty.permitted=false;
                result.Faculty.status = "rejected";
                result.Faculty.email = req.body.faculty_email;
                result.Faculty.name = req.body.faculty_name;
                result.save();
                res.status(200).json(result);
            }
            else{
                res.status(200).json({found:false});
            }
        }
    });
});

router.post("/history/gatepass",(req,res)=>{
    const filter = {
        'Faculty.email':req.body.faculty_email,
        $or:[
            {status:'accepted'},
            {status:'rejected'}
        ]
    }
    Gate.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else
        { 
            res.status(200).json(result);
        }
    });
});

router.post("/history/eventpass",(req,res)=>{
    const filter = {
        'Faculty.email':req.body.faculty_email,
        $or:[
            {status:'accepted'},
            {status:'rejected'}
        ]
    }
    Event.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})

router.post("/history/councilpass",(req,res)=>{
    const filter = {
        'Faculty.email':req.body.faculty_email,
        $or:[
            {status:'accepted'},
            {status:'rejected'}
        ]
    }
    Council.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})


router.post("/forward/hod",(req,res)=>{
    Gate.findOne({_id:req.body.id,marked_for_review:null},(err,result)=>{
        if(err){
            res.status(200).json({err:true});
        }
        else{
            if(result){
                result.marked_for_review = true;
                result.save();
                res.status(200).json({marked:true});
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
});

export default router;