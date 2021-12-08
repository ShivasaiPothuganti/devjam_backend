import mongoose from "mongoose";
import express from "express";
import Student from "./model.js";
import { Faculty,Incharge,Hod,Gate,Event } from "./model.js";

const router = express.Router();

var hod_department;
var hod_year;

router.post("/gatepass",(req,res)=>{
    var filter = {}
    if(req.body.hod_year>1){
        filter = {
            accepted_by_hod:null,
            marked_for_review:true,
            year:{$gte:2},
            department:hod_department
        }
    }
    else{
        filter = {
            accepted_by_hod:null,
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

router.post("/eventpass",(req,res)=>{
    var filter = {};
    if(req.body.hod_year>1){
        filter = {
            accepted_by_hod:null,
            marked_for_review:true,
            year:{$gte:2},
            department:hod_department
        }
    }
    else{
        filter = {
            accepted_by_hod:null,
            marked_for_review:true,
            year:1,
            department:hod_department
        }  
    }
    Event.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

router.post("/getfaculty",(req,res)=>{
    var filter ={};
    if(req.body.hod_year===1){
        filter = {
            year:req.body.hod_year,
        }
    }
    else{
        filter = {
            year:{$gte:2},
            department:req.body.department
        }
    }
    Faculty.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    });
});

router.post("/approve/faculty",(req,res)=>{
    const id = req.body.id;
    const permission = req.body.permitted;
    Faculty.findOne({_id:id},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){
               result.hod_approved = permission;
               result.save(); 
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
})

router.post("/gatepass",(req,res)=>{
    Hod.findOne(
        {
        email:req.body.hod_email,
        department:req.body.department
        },(err,hod)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(hod){
                Student.findOne({rollno:req.body.rollno},(err,student)=>{
                    if(err){
                        res.status(200).json({error:true});
                    }
                    else{
                        if(student){
                            var filter = {};
                if(req.body.year===1){
                    filter = {
                        _id:req.body.id,
                        marked_for_review:true,
                        year:1
                    }
                }
                else{
                    filter = {
                        _id:req.body.id,
                        marked_for_review:true,
                        department:req.body.department,
                        year:{$gte:2}
                    }
                }
                var update = {

                }
                if(req.body.permitted===true){
                    update = {
                        accepted_by_hod:true,
                        status:"accepted"
                    }
                }
                else{
                    update = {
                        accepted_by_hod:false,
                        status:"rejected"
                    }
                }
                Gate.findOneAndUpdate(filter,update,(err)=>{
                    if(err){
                        res.status(200).json({error:true});
                    }
                    else{
                        if(req.body.permitted){
                            hod.gate_passesss+=1;
                            student.gate_passesss+=1;
                            student.save();
                            hod.save();
                        }
                        res.status(200).json({updated:true});
                    }
                })
                        }
                        else{
                            res.status(200).json({student_found:false});
                        }
                    }
                })
            }
            else{
                res.status(200).json({hod_found:false});
            }
        }
    });
});

router.get("/",(req,res)=>{
    var filter = {};
    if(req.body.year===1){
        filter = {
            year:req.body.year,
        }
    }
    else{
        filter ={
            year:{$gte:2},
            department:req.body.student_department
        }
    }
    Hod.findOne(filter,(err,result)=>{
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
    });
});

router.get("/statistics",(req,res)=>{
    Hod.find({},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})


export default router;