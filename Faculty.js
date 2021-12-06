import mongoose from "mongoose";
import express from "express";
import Student from "./model.js";
import { Faculty,Incharge,Hod,Gate,Event } from "./model.js";

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
            year:year
        }
    }
    else{
        filter = {
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
    })
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
    Gate.findOne({_id:req.body.id,marked_for_review:null},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){
                result.Faculty.name = faculty_name;
                result.Faculty.email = faculty_email;
                result.Faculty.permitted=true;
                result.status = "accepted";
                result.save();
                console.log(result);
                res.status(200).json(result);
            }
            else{
                res.status(200).json({found:false});
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
                result.save();
                res.status(200).json(result);
            }
            else{
                res.status(200).json({found:false});
            }
        }
    });
});

router.post("/history/pass",(req,res)=>{
    var error = false;
    var final_result = [];
    const filter = {
        'Faculty.email':req.body.faculty_email,
        $or:[
            {status:'accepted'},
            {status:'rejected'}
        ]
    }
    Gate.find(filter,(err,result)=>{
        if(err){
            error = true;
        }
        else
        { 
            final_result.push(result);  
        }
    });
    Event.find(filter,(err,result)=>{
        if(err){
           error= true;
        }
        else
        {
            final_result.push(result);
        }
    });
    if(error){
        res.status(200).json({error:true});
    }
    else{
        res.status(200).json(final_result);
    }

});



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