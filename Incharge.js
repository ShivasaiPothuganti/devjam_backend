import mongoose from "mongoose";
import express from "express";
import Student, { Leave, Other } from "./model.js";
import {Faculty,Incharge,Hod,Gate,Event} from "./model.js";

const router  = express.Router();
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
                    leave_passess:0,
                    sick_passeds:0,
                    other_passess:0,
                });
                new_incharge.save();
                res.status(200).json({register:true});
            }
        }
    })
});

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
/*gatepass */
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

router.post("/forward/hod/gate",(req,res)=>{
    const id = req.body.id;
    const year = req.body.year;
    var filter = {};
    if(year===1){
        filter = {
            _id:id,
            'Incharge.email':req.body.email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:1,
        }
    }
    else{
        filter = {
            _id:id,
            'Incharge.email':req.body.email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            department:req.body.department,
            year:{$gte:2},
        }
    }
    Gate.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){
                result.marked_for_review = true;
                result.sent_by = result.Incharge.name;
                result.save();
                res.status(200).json({forward:true});
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
});

router.post("/history/gatepass",(req,res)=>{
    const filter = {
        'Incharge.email': req.body.name,
        $or:[
            {'Incharge.permitted':true},
            {'Incharge.permitted':false}, 
        ],
        $or:[
            {status:"accepted"},
            {status:"rejected"}
        ]
    }
    Gate.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    });
});

/*otherpass */

router.post("/get/otherpass",(req,res)=>{
    const year = req.body.year;
    var filter={};
    if(year===1){
        filter = {
            gen_date:new Date().toDateString(),
            'Faculty.permitted':null,
            'Incharge.email':req.body.faculty_email,
            'Incharge.permitted':null,
            year:1,
            status:"pending"
        }
    }
    else{
        filter = {
            gen_date:new Date().toDateString(),
            'Incharge.email':req.body.faculty_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            year:req.body.year,
            department:req.body.department,
            status:"pending"
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

router.post("/accept/otherpass",(req,res)=>{
    const id = req.body.id;
    Incharge.findOne({email:req.body.email},(err,incharge)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(incharge){
                Student.findOne({student_rollno:req.body.student_rollno},(err,student)=>{
                    if(err){
                        res.status(200).json({error:true});
                    }
                    else{
                        if(student){
                            Other.findOne({_id:id},(err,result)=>{
                                if(err){
                                    res.status(200).json({error:true});
                                }
                                else{
                                    if(result){
                                        result.Incharge.permitted = true;
                                        result.Faculty.status = "accepted";

                                        student.other_passess+=1;

                                        incharge.other_passess+=1;

                                        result.save();
                                        student.save();
                                        faculty.save();

                                        res.status(200).json({updated:true});
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
            else
            {
                res.status(200).json({incahrge_found:false});
            }
        }
    })
});

router.post("/reject/otherpass",(req,res)=>{
    const id = body.req.id;
    Other.findOne({_id:id},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else
        {
            if(result){
                result.Incharge.permitted = false;
                result.status = "rejected";
                result.save();
                rse.status(200).json({rejected:true});
            }
            else{
                res.status(200).json({passfound:false});
            }
        }
    })
});

router.post("/forward/hod/otherpass",(re,res)=>{
    var filter = {};
    const id = req.body.id;
    if(req.body.year===1){
        filter = {
            _id:id,
            'Incharge.email':req.body.email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:1, 
        }
    }
    else{
        filter = {
            _id:id,
            'Incharge.email':req.body.email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:req.body.year,
        }
    }
    Other.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){
                result.marked_for_review = true;
                result.sent_by = result.Incharge.name;
                result.save();
                res.status(200).json({forwarded:true});
            }
            else{
                res.status(200).json({pass_found:false});
            }
        }
    })

});

router.post("/history/otherpass",(req,res)=>{
    const filter = {
        'Faculty.emai': req.body.name,
        $or:[
            {'Faculty.permitted':true},
            {'Faculty.permitted':false}, 
        ],
        $or:[
            {status:"accepted"},
            {status:"rejected"}
        ]
    }
    Other.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

/*leave pass */


router.post("/get/leave",(req,res)=>{
    var filter={};
    if(year===1){
        filter = {
            gen_date:new Date().toDateString(),
            'Faculty.permitted':null,
            'Incharge.email':req.body.faculty_email,
            'Incharge.permitted':null,
            year:1,
            status:"pending"
        }
    }
    else{
        filter = {
            gen_date:new Date().toDateString(),
            'Incharge.email':req.body.faculty_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            year:req.body.year,
            department:req.body.department,
            status:"pending"
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
router.post("/approve/leavepass",(req,res)=>{
    const id = req.body.id;
    const permitted = req.body.permission;
    Incharge({email:req.body.email},(err,incharge)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            if(incharge){
                Student.findOne({rollno:req.body.student},(err,student)=>{
                    if(err){
                        res.status(400).json({error:true});
                    }
                    else{
                        if(student){
                            Leave({_id:id},(err,result)=>{
                                if(err){
                                    res.status(400).json({error:true});
                                }
                                else{
                                    if(result){
                                        if(permitted){
                                            result.Incharge.permitted = true;
                                            result.status = "accepted";

                                            student.leave_passess+=1;

                                            incharge.leave_passess+=1;

                                            result.save();
                                            student.save();
                                            incharge.save();
                                            res.status(200).json({permitted:true});
                                        }
                                        else{
                                            result.Incharge.permitted = false;
                                            result.status = "rejected";

                                            result.save();
                                            res.status(200).json({permitted:false});
                                        }
                                    }
                                    else{
                                        res.status(200).json({found:true});
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

router.post("/forward/hod/leave",(req,res)=>{
    const id = req.body.id;
    Leave.findOne({_id:id},(err,leave)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            if(leave){
                leave.marked_for_review = true;
                leave.sent_by =req.body.inacharge_name;
                leave.save();
            }
            else{
                res.status(200).json({found:false});
            }
        }
    })
});

router.post("/history/leave",(req,res)=>{
    const filter = {
        'Incharge.email': req.body.name,
        $or:[
            {'Incharge.permitted':true},
            {'Incharge.permitted':false}, 
        ],
        $or:[
            {status:"accepted"},
            {status:"rejected"}
        ]
    }
    Leave.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    });   
})

/*Event pass */
router.post("/get/eventpass",(req,res)=>{
    var filter={};
    if(year===1){
        filter = {
            gen_date:new Date().toDateString(),
            'Faculty.permitted':null,
            'Incharge.email':req.body.faculty_email,
            'Incharge.permitted':null,
            year:1,
            status:"pending"
        }
    }
    else{
        filter = {
            gen_date:new Date().toDateString(),
            'Incharge.email':req.body.faculty_email,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            year:req.body.year,
            department:req.body.department,
            status:"pending"
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

router.post("/approve/leave",(req,res)=>{
    const id = req.body.id;
    const permitted = req.body.permitted;
    Incharge.findOne({email:req.body.email},(err,incharge)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            if(incharge){
                Student.fidnOne({rollno:req.body.rollno},(err,student)=>{
                    if(err){
                        res.status(400).json({error:true});
                    }
                    else{
                        if(student){
                            Event.findOne({_id:id},(err,result)=>{
                                if(err){
                                    res.status(400).json({error:true});
                                }
                                else{
                                    if(result){
                                        if(permitted){
                                            result.Incharge.permitted = true;
                                            result.status = "accepted";

                                            student.event_passess+=1;

                                            incharge.event_passess+=1;

                                            result.save();
                                            student.save();
                                            incharge.save();
                                            res.status(200).json({permitted:true});
                                        }
                                        else{
                                            result.Incharge.permitted = false;
                                            result.status = "rejected";
                                            result.save();
                                            res.status(200).json({permitted:false});
                                        }
                                    }
                                    else{
                                        res.status(200).json({passfound:false});
                                    }
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
                res.status(200).json({found:false});
            }
        }
    })
});

router.post("/forward/hod",(req,res)=>{
    const id = req.body.id;
    Event.findOne({_id:id},(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            result.marked_for_review = true;
            result.sent_by = result.Incharge.name,
            result.save();
            res.status(200).json({marked:true})
        }   
    })
});

router.post("/history/eventpass",(req,res)=>{
    const filter = {
        'Incharge.email':req.body.incharge_email,
        $or:[
            {'Incharge.permitted':true},
            {'Incharge.permitted':false},
        ],
        $or:[
            {status:'accepted'},
            {status:'rejected'}
        ]
    }
    Event.find(filter,(err,result)=>{
        if(err){
            res.status(400).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})

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

router.get("/statistics",(req,res)=>{
    Incharge.find({},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})

export default router;