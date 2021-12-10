import mongoose from "mongoose";

const student = mongoose.Schema({
    name:String,
    rollno:String,
    email:String,
    password:String,
    year:Number,
    gender:String,
    department:String,
    event_passess:Number,
    gate_passesss:Number,
    leave_passess:Number,
    sick_passes:Number,
    other_passess:Number
});

const faculty = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    department:String,
    year:Number,
    event_passess:Number,
    hod_approved:Boolean,
    gate_passesss:Number,
    gender:String,
    leave_passess:Number,
    sick_passeds:Number,
    other_passess:Number
});

const incharge = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    department:String,
    event_passes:Number,
    year:Number,
    gate_passesss:Number,
    leave_passess:Number,
    sick_passes:Number,
    other_passess:Number
});

const hod = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    department:String,
    event_passes:Number,
    gate_passesss:Number,
    leave_passess:Number,
    sick_passes:Number,
    other_passess:Number,
    year:Number
});

const gate_passess = mongoose.Schema({
    student_rollno:String,
    reason:String,
    gen_date:Date,
    Faculty:{
        name:String,
        email:String,
        permitted:Boolean
    },
    Incharge:{
        name:String,
        email:String,
        permitted:Boolean
    },
    accepted_by_hod:Boolean,
    year:Number,
    marked_for_review:Boolean,
    sent_by:String,
    department:String,
    status:String,
});

const Event_pass = mongoose.Schema({
    student_rollno:String,
    gen_date:Date,
    poster:String,
    event_name:String,
    venue:String,
    Faculty:{
        name:String,
        email:String,
        permitted:Boolean
    },
    Incharge:{
        name:String,
        email:String,
        permitted:Boolean
    },
    accepted_by_hod:Boolean,
    marked_for_review:Boolean,
    start_date : String,
    sent_by:String,
    end_date:String,
    status:String
});

const sick_pass = mongoose.Schema({
    student_rollno:String,
    gender:String,
    reason:String,
    gen_date:Date,
    Faculty:{
        name:String,
        email:String,
        permitted:Boolean 
    },
    year:Number,
    department:String,
    status:String
})

const Student = new mongoose.model('student',student);
const Faculty = new mongoose.model('faculty',faculty);
const Incharge = new mongoose.model('incharge',incharge);
const Hod = new mongoose.model('hod',hod);
const Gate = new mongoose.model('gate_passess',gate_passess);
const Event = new mongoose.model('event_passess',Event_pass);
const Leave = new mongoose.model('leave',new mongoose.Schema({
    student_rollno:String,
    subject:String,
    body:String,
    gen_date:Date,
    start_date:Date,
    end_date:Date,
    Faculty:{
        name:String,
        email:String,
        permitted:Boolean
    },
    Incharge:{
        name:String,
        email:String,
        permitted:Boolean
    },
    accepted_by_hod:Boolean,
    year:Number,
    marked_for_review:Boolean,
    department:String,
    status:String,
    sent_by:String  
}));
const Other = new mongoose.model('other',new mongoose.Schema({
    student_rollno:String,
    reason:String,
    title:String,
    gen_date:Date,
    Faculty:{
        name:String,
        email:String,
        permitted:Boolean
    },
    Incharge:{
        name:String,
        email:String,
        permitted:Boolean
    },
    accepted_by_hod:Boolean,
    year:Number,
    marked_for_review:Boolean,
    department:String,
    status:String,
    sent_by:String
}));

const Sick = new mongoose.model('sick',sick_pass);

export default Student;
export {Faculty,Incharge,Hod,Gate,Event,Leave,Other,Sick};