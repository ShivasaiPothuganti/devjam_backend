import mongoose from "mongoose";
import express from "express";
import Student, { Leave, Other } from "./model.js";
import { Faculty,Incharge,Hod,Gate,Event } from "./model.js";

const router = express.Router();

var hod_department;
var hod_year;

/*gatepass */

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
router.post("/approve/gatepass",(req,res)=>{
    var filter = {}
    if(req.body.year===1){
        filter = {
            _id:id,
            marked_for_review:true,
            accepted_by_hod:null,
            year:1
        }
    }
    else{
        filter = {
            _id:id,
            marked_for_review:true,
            year:{$gte:2},
            department:req.body.department,
            accepted_by_hod:null
        }
    }

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
                        accepted_by_hod:null,
                        status:"pending",
                        year:1
                    }
                }
                else{
                    filter = {
                        _id:req.body.id,
                        marked_for_review:true,
                        accepted_by_hod:null,
                        status:"pending",
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
router.post("/history/gatepass",(req,res)=>{
    var filter ={};
    if(req.body.year===1){
        filter = {
           year:1,
           $or:[
               {accepted_by_hod:false},
               {accepted_by_hod:true}
           ],
           $or:[
               {status:"accepted"},
               {status:"rejected"}
           ]
        }
    }
    else{
        filter = {
            year:{$gte:2},
            $or:[
                {accepted_by_hod:false},
                {accepted_by_hod:true}
            ],
            $or:[
                {status:"accepted"},
                {status:"rejected"}
            ],
            department:req.body.department
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

/*event pass */

router.post("/approve/eventpass",(req,res)=>{
    var filter = {}
    if(req.body.year===1){
        filter = {
            _id:id,
            marked_for_review:true,
            accepted_by_hod:null,
            year:1
        }
    }
    else{
        filter = {
            _id:id,
            marked_for_review:true,
            year:{$gte:2},
            department:req.body.department,
            accepted_by_hod:null
        }
    }

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
                Event.findOneAndUpdate(filter,update,(err)=>{
                    if(err){
                        res.status(200).json({error:true});
                    }
                    else{
                        if(req.body.permitted){
                            hod.event_passess+=1;
                            student.event_passess+=1;
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
})

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

router.post("/history/eventpass",(req,res)=>{
    var filter ={};
    if(req.body.year===1){
        filter = {
           year:1,
           $or:[
               {accepted_by_hod:false},
               {accepted_by_hod:true}
           ],
           $or:[
               {status:"accepted"},
               {status:"rejected"}
           ]
        }
    }
    else{
        filter = {
            year:{$gte:2},
            $or:[
                {accepted_by_hod:false},
                {accepted_by_hod:true}
            ],
            $or:[
                {status:"accepted"},
                {status:"rejected"}
            ],
            department:req.body.department,
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

/*other pass */

router.post("/otherpass",(req,res)=>{
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
    Other.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{   
            res.status(200).json(result);
        }
    });
});

router.post("/approve/otherpass",(req,res)=>{
    const id = req.body.id;
    const permitted = req.body.permission;
    var filter = {};
    if(req.body.year===1){
        filter = {
            _id:id,
            marked_for_review:true,
            accepted_by_hod:null,
            year:1
        }
    }
    else
    {
        filter = {
            _id:id,
            marked_for_review:true,
            accepted_by_hod:null,
            year:{$gte:2},
            department:req.body.department
        }
    }
    Hod.findOne({email:req.body.email},(err,hod)=>{
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
                            Other.findOne(filter,(err,result)=>{
                                if(err){
                                    res.status(200).json({error:true});
                                }
                                else{
                                    if(result){
                                        if(permitted){
                                            result.accepted_by_hod = true;
                                            result.status = "accepted";
                                            result.save();

                                            hod.other_passess+=1;
                                            hod.save();

                                            student.other_passess+=1;

                                            student.save();
                                            res.status(200).json({permitted:true});

                                        }
                                        else{
                                            result.accepted_by_hod = false;
                                            result.status = "pending";
                                            result.save();
                                            res.status(200).json({permitted:false});
                                        }
                                    }
                                    else
                                    {
                                        res.status(200).json({found:false});
                                    }
                                }
                            })
                        }
                        else{
                            res.status(200).json({found:false});
                        }
                    }
                })
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
});


router.post("/history/otherpass",(req,res)=>{
    var filter ={};
    if(req.body.year===1){
        filter = {
           year:1,
           $or:[
               {accepted_by_hod:false},
               {accepted_by_hod:true}
           ],
           $or:[
               {status:"accepted"},
               {status:"rejected"}
           ]
        }
    }
    else{
        filter = {
            year:{$gte:2},
            $or:[
                {accepted_by_hod:false},
                {accepted_by_hod:true}
            ],
            $or:[
                {status:"accepted"},
                {status:"rejected"}
            ],
            department:req.body.department,
        }
    }
    Other.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

/* Leave pass */

router.post("/get/leavepass",(req,res)=>{
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
        }  
    }
    console.log(filter);
    Leave.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    });
})

router.post("/approve/leavepass",(req,res)=>{
    const id = req.body.id;
    const permitted = req.body.permission;
    var filter = {};
    if(req.body.year===1){
        filter = {
            _id:id,
            marked_for_review:true,
            accepted_by_hod:null,
            year:1
        }
    }
    else
    {
        filter = {
            _id:id,
            marked_for_review:true,
            accepted_by_hod:null,
            year:{$gte:2},
            department:req.body.department
        }
    }
    Hod.findOne({department:req.body.department,email:req.body.email},(err,hod)=>{
        if(err){
            res.status(400).json(({error:true}));
        }
        else{
            if(hod){
                Student.findOne({rollno:req.body.rollno},(err,student)=>{
                    if(err){
                        res.status(400).json({error:true});
                    }
                    else{
                        if(student){
                            Leave.findOne(filter,(err,leave)=>{
                                if(err){
                                    res.status(200).json({error:true});
                                }
                                else{
                                    if(leave){
                                        if(permitted){
                                            leave.accepted_by_hod = true;
                                            leave.status = "accepted";

                                            hod.leave_passess+=1;

                                            student.leave_passess+=1;

                                            hod.save();
                                            student.save();
                                            leave.save();
                                            res.status(200).json({permitted:true});
                                        }
                                        else{
                                            leave.accepted_by_hod =false;
                                            leave.status = "rejected";
                                            leave.save();
                                            res.status(200).json({permitted:false});
                                        }
                                    }
                                    else{
                                        res.status(200).json({found:false});
                                    }
                                }
                            })
                        }
                        else
                        {
                            res.status(200).json({found:false});
                        }
                    }
                })
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
});

router.post("/history/leavepass",(req,res)=>{
    var filter ={};
    if(req.body.year===1){
        filter = {
           year:1,
           $or:[
               {accepted_by_hod:false},
               {accepted_by_hod:true}
           ],
           $or:[
               {status:"accepted"},
               {status:"rejected"}
           ]
        }
    }
    else{
        filter = {
            year:{$gte:2},
            $or:[
                {accepted_by_hod:false},
                {accepted_by_hod:true}
            ],
            $or:[
                {status:"accepted"},
                {status:"rejected"}
            ],
            department:req.body.department,
        }
    }
    Leave.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})




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
                    leave_passess:0,
                    sick_passeds:0,
                    other_passess:0
                });
                0
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
});

export default router;