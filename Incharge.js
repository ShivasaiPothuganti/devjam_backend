import mongoose from "mongoose";
import express from "express";
import Student from "./model.js";
import {Faculty,Incharge,Hod,Gate,Event} from "./model.js";

/*
    {
        "name":"deepthi",
        "email":"deepthi@gmail.com",
        "password":"deepthi",
        "department":"cse"
    }
*/

var incharge ={
    email:"",
    name:"",
    year:"",
    department:""
}


const router  = express.Router();

router.get("/",(req,res)=>{
    Incharge.find({department:student_department},(err,result)=>{
        if(err){
            res.status(200).json({err:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

router.post("/gatepass",(req,res)=>{
    var filter = {};
    if(req.body.year===1){
        filter = {
            'Incharge.email':req.body.incharge_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:req.body.year,
        }
    }
    else{  
        filter = {
            'Incharge.email':req.body.incharge_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            department:req.body.incharge_department,
            year:req.body.year,
        }
    }
    Gate.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

router.post("/accept/gatepass",(req,res)=>{
    const id = req.body.id;
    var filter = {};
    if(req.body.year===1){
        filter = {
            _id:id,
            'Incharge.email':req.body.incharge_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:req.body.year,
        } 
    }
    else{
        filter = {
            _id:id,
            'Incharge.email':req.body.incharge_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            department:req.body.incharge_department,
            year:req.body.year,
        }
    }
    Gate.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else
        {
            if(result){
                Student.findOne({rollno:req.body.rollno},(err,student)=>{
                    if(err){
                        res.status(200).json({found:false});
                    }
                    else
                    {
                        if(student){    
                            Faculty.findOne({email:req.body.email},(err,faculty)=>{
                                if(err){
                                    res.status(200).json({error:false});
                                }
                                else{
                                    if(faculty){
                                        result.Incharge.name=incharge.name;
                                        result.Incharge.email=incharge.email;
                                        result.Incharge.permitted=true;
                                        result.status="accepted";

                                        student.gate_passesss+=1;
                                        faculty.gate_passesss+=1;
                                        student.save();
                                        faculty.save();
                                        result.save();
                                        res.status(200).json({updated:true});
                                    }
                                    else
                                    {
                                        res.status(200).json({found:false});
                                    }
                                }
                            });
                        }
                    }
                });  
            }
            else
            {
                res.status(200).json({found:false});
            }
        }
    })
});

router.post("/reject/gatepass",(req,res)=>{
    const id = req.body.id;
    const filter = {
        _id:id,
        'Incharge.email':incharge.email,
        'Incharge.permitted':null,
        'Faculty.permitted':null,
        marked_for_review:null,
        status:'pending',
        department:incharge.department,
        year:incharge.year,
    }
    Gate.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else
        {
            if(result){
                result.Incharge.name=incharge.name;
                result.Incharge.email=incharge.email;
                result.Incharge.permitted=false;
                result.status="rejected";
                result.save();
                res.status(200).json({updated:true});
            }
            else
            {
                res.status(200).json({found:false});
            }
        }
    })
})

router.post("/Login",(req,res)=>{
    Incharge.findOne({email:req.body.email},(err,result)=>{
        if(err){
            res.status(400).json({err:true});
        }
        else{
            if(result){
                if(result.password===req.body.password){
                    incharge = {
                        name:result.name,
                        department:result.department,
                        year:result.year,
                        email:result.email
                    }
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

router.post("/forward/hod",(req,res)=>{
    const id = req.body.id;
    const filter = {
        _id:id,
        'Incharge.email':incharge.email,
        'Incharge.permitted':null,
        'Faculty.permitted':null,
        marked_for_review:null,
        status:'pending',
        department:incharge.department,
        year:incharge.year,
    }
    Gate.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){
                result.marked_for_review = true;
                result.save();
                res.status(200).json({forward:true});
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
})

router.post("/Register",(req,res)=>{
    Incharge.findOne({email:req.body.email,department:req.body.department},(err,result)=>{
        if(err){
            res.status(400).json({err:true});
        }
        else{
            if(result){
                res.status(200).json({found:true});
            }
            else{
                const new_incharge = new Incharge({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    department:req.body.department,
                    event_passess:0,
                    year:req.body.year,
                    gate_passesss:0,
                    council_passess:0,
                    sick_passeds:0
                });
                incharge = {
                    name:req.body.name,
                    department:req.body.department,
                    year:req.body.year,
                    email:req.body.email
                }
                new_incharge.save();
                res.status(200).json({register:true});
            }
        }
    })
});

router.post("/remove",(req,res)=>{
    Incharge.deleteOne({email:req.body.email},(err)=>{
        if(err){
            res.status(400).json({removed:false});
        }
        else{
            res.status(200).json({removed:true});
        }
    })
});

export default router;
