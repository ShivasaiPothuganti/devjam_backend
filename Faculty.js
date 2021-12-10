import mongoose from "mongoose";
import express, { application } from "express";
import Student, { Other, Sick } from "./model.js";
import { Faculty,Incharge,Hod,Gate,Event,Leave } from "./model.js";

const router  = express.Router();
var faculty_name;
var faculty_email;
var faculty_year;


    const testing =  {
        "reason":"testing purpose",
        "facultyname":"ravi",
        "facultyeMail":"ravi@gmail.com",
        "inchargeName":"deepthi",
        "inchargeEmail":"deepthi@gmail.com"
    }




router.post("/getfaculty",(req,res)=>{
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



router.post("/getfaculty/sickpass",(req,res)=>{
    var filter = {};

    if(req.body.year===1){
        filter = {
            gender:req.body.student_gender,
            hod_approved:true,
            year:1
        } 
    }
    else
    {
        filter = {
            gender:req.body.student_gender,
            hod_approved:true,
            department:req.body.department,
            year:{$gte:2}    
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
})

router.post("/get/sickpass",(req,res)=>{
    const filter = {
        'Faculty.email':req.body.email,
        permitted:null,
        status:"pending",
        gen_date:new Date().toDateString,
    }
    Sick.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else
        {
            res.status(200).json(result);
        }
    })
});

router.post("/get/leave",(req,res)=>{
    var filter = {};
    if(req.body.year===1){
        filter = {
            end_date:{$gte:req.body.date},
            'Faculty.email':req.body.faculty_email,
            'Faculty.permitted':null,
            'Incharge.permitted':null,
            marked_for_review:null,
            accepted_by_hod:null,
            status:"pending",
            year:1
        }
    }
    else{
        filter = {
            end_date:{$gte:req.body.date},
            'Faculty.email':req.body.faculty_email,
            'Faculty.permitted':null,
            'Incharge.permitted':null,
            marked_for_review:null,
            accepted_by_hod:null,
            status:"pending",
            year:{$gte:2},
            department:req.body.department
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

router.post("/accept/sickpass",(req,res)=>{
    const filter = {
        _id:req.body.id,
        
    }
    Faculty.findOne({email:req.body.email},(err,faculty)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            Sick.findOne(filter,(err,sickpass)=>{
                if(err){
                    res.status(200).json({error:true});
                }
                else
                {
                    sickpass.Faculty.permitted = true
                    sickpass.status = "accepted"
                    faculty.sick_passeds+=1;

                    sickpass.save();
                    faculty.save();
                    res.status(200).json({updated:true});
                }
            })
        }
    })
});

router.post("/reject/sickpass",(req,res)=>{
    const filter = {
        _id:req.body.id
    }
    Sick.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            result.Faculty.permitted= false;
            result.status = "rejected";
            result.save();
            res.status(200).json({updated:true});
        }
    })
});

router.post("/get/otherpass",(req,res)=>{
    const year = req.body.year;
    var filter={};
    if(year===1){
        filter = {
            gen_date:new Date().toDateString(),
            'Faculty.email':req.body.faculty_email,
            'Faculty.permitted':null,
            'Incharge.permitted':null,
            year:1,
            status:"pending"
        }
    }
    else{
        filter = {
            gen_date:new Date().toDateString(),
            'Faculty.email':req.body.faculty_email,
            'Faculty.permitted':null,
            'Incharge.permitted':null,
            year:{$gte:2},
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
    Faculty.findOne({email:req.body.email},(err,faculty)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(faculty){
                Student.findOne({student_rollno:req.body.student_rollno},(err,student)=>{
                    if(err){
                        res.status(200).json({error:true});
                    }
                    else{
                        Other.findOne({_id:id},(err,result)=>{
                            if(err){
                                res.status(200).json({error:true});
                            }
                            else
                            {
                                result.Faculty.permitted = true;
                                result.Faculty.status = "accepted";
                                
                                student.other_passess+=1;

                                faculty.other_passess+=1;

                                result.save();
                                student.save();
                                faculty.save();
                                res.status(200).json({updated:true});
                            }
                        })
                    }
                })
            }
            else{
                res.status(200).json({faculty_found:false});
            }
        }
    })
});

router.post("/reject/otherpass",(req,res)=>{
    const id = req.body.id;
    Other.findOne({_id:id},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){

                result.Faculty.permitted = false;
                result.status = "rejected";
                result.save();
                res.status(200).json({rejected:true});
            }
            else{
                res.status(200).json({passfound:false});
            }
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
                    gender:req.body.gender,
                    event_passess:0,
                    gate_passesss:0,
                    leave_passess:0,
                    sick_passeds:0,
                    other_passess:0,
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
            res.status(400).json({error:true});
        }
        else
        {
            console.log("this is result ",result);
            res.status(200).json(result);
        }
    });
});


router.post("/get/eventPass",(req,res)=>{
    const filter = {
        end_date : new Date().toDateString(),
        'Faculty.email':req.body.faculty_email,
        'Faculty.permitted':null,
        'Incharge.permitted':null,
        status:"pending",
        marked_for_review:null,
        status:"pending"
    }
    Event.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else
        {
            res.status(200).json(result);
        }
    })
})

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

router.post("/history/leavepass",(req,res)=>{
    const filter = {
        'Faculty.email':req.body.faculty_email,
        $or:[
            {status:'accepted'},
            {status:'rejected'}
        ]
    }
    Leave.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
});

router.post("/history/otherpass",(req,res)=>{
    const filter = {
        'Faculty.email':req.body.faculty_email,
        $or:[
            {'Faculty.permitted':true},
            {'Faculty.permitted':false},
        ],
        $or:[
            {status:'accepted'},
            {status:'rejected'}
        ]
    }
    Other.find(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    })
})


router.post("/forward/hod/gate",(req,res)=>{
    var filter = {};
    const id = req.body.id;
    if(req.body.year===1){
        filter = {
            _id:id,
            'Faculty.email':req.body.faculty,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:req.body.year
        }
    }
    else{
        filter = {
            _id:id,
            'Faculty.email':req.body.faculty,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            department:req.body.department,
            year:{$gte:2}
        }
    }
    Gate.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({err:true});
        }
        else{
            if(result){
                result.sent_by = result.Faculty.name;
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

router.post("/forward/hod/otherpass",(req,res)=>{
    var filter = {};
    if(req.body.year===1){
        filter = {
            _id:req.body.id,
            'Faculty.email':req.body.faculty,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            year:req.body.year, 
        }
    }
    else{
        filter = {
            _id:req.body.id,
            'Faculty.email':req.body.faculty,
            'Incharge.permitted':null,
            'Faculty.permitted':null,
            marked_for_review:null,
            status:'pending',
            department:req.body.department,
            year:{$gte:2},
        }
    }
    Other.findOne(filter,(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            if(result){
                result.marked_for_review = true;
                result.sent_by = result.Faculty.name;
                result.save();
            }
            else
            {
                res.status(200).json({found:false});
            }
        }
    })
     
})


router.get("/statistics",(req,res)=>{
    Faculty.find({},(err,result)=>{
        if(err){
            res.status(200).json({error:true});
        }
        else{
            res.status(200).json(result);
        }
    });
});


export default router;