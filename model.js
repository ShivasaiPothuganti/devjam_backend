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
    council_passess:Number,
    sick_passes:Number
});

const faculty = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    department:String,
    year:Number,
    event_passess:Number,
    gate_passesss:Number,
    council_passess:Number,
    sick_passeds:Number
});

const incharge = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    department:String,
    event_passes:Number,
    year:Number,
    gate_passesss:Number,
    council_passess:Number,
    sick_passes:Number
});

const hod = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    department:String,
    event_passes:Number,
    gate_passesss:Number,
    council_passess:Number,
    sick_passes:Number,
    year:Number
});

const gate_passess = mongoose.Schema({
    student_rollno:String,
    reason:String,
    gen_date:String,
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
});

const Event_pass = mongoose.Schema({
    student_rollno:String,
    faculty_id:String,
    incharge_id:String,
    reason:String,
    gen_date:String,
    poster:String,
    event_name:String,
    place:String,
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
    end_date:String,
    letter:String,
});


const Student = new mongoose.model('student',student);
const Faculty = new mongoose.model('faculty',faculty);
const Incharge = new mongoose.model('incharge',incharge);
const Hod = new mongoose.model('hod',hod);
const Gate = new mongoose.model('gate_passess',gate_passess);
const Event = new mongoose.model('event_passess',Event_pass);

export default Student;
export {Faculty,Incharge,Hod,Gate,Event};