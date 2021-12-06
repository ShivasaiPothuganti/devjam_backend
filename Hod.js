import mongoose from "mongoose";
import express from "express";
import Student from "./model.js";
import { Faculty,Incharge,Hod,Gate,Event } from "./model.js";

const router = express.Router();

var hod_department;
var hod_year;

router.get("/gatepass",(req,res)=>{
    var filter = {

    }
    if(hod_year>1){
        filter = {
            marked_for_review:true,
            year:{$gte:2},
            department:hod_department
        }
    }
    else{
        filter = {
            marked_for_review:true,
            year:1,
            department:hod_department
        }  
    }
    console.log(filter);
    Gate.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    });
});

router.post("/gatepass",(req,res)=>{
    Gate.findOneAndUpdate(
        {_id:req.body.id},
        {
            status:req.body.status,
            accepted_by_hod:req.body.permitted
        },(err)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json({updated:true});
        }
    });
});

router.get("/",(req,res)=>{
    Hod.findOne({department:req.body.student_department},(err,result)=>{
        if(err){
            res.status(200).json({err:true});
        }
        else{
            res.status(200).json(result);
        }
    });
});

router.post("/Login",(req,res)=>{
    Hod.findOne({email:req.body.email},(err,result)=>{
        if(err){
            res.status(400).json({err:true});
        }
        else{
            if(result){
                if(result.password===req.body.password){                                       
                    hod_department = result.department;
                    hod_year = result.year;
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
    Hod.findOne({email:req.body.email,department:req.body.department},(err,result)=>{
        if(err){
            res.status(400).json({err:true});
        }
        else{
            if(result){
                res.status(200).json({found:true});
            }
            else{
                const new_faculty = new Hod({
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
                new_faculty.save();
                res.status(200).json({registerhod:true});
            }
        }
    })
});

router.post("/remove",(req,res)=>{
    Hod.deleteOne({email:req.body.email},(err)=>{
        if(err){
            res.status(400).json({removed:false});
        }
        else{
            res.status(200).json({removed:true});
        }
    })
});


router.get("/eventpass",(reqq,res)=>{
    
})


export default router;