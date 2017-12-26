var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacherModel = new Schema({
    teacherId: { type: String, index: true, unique: true },
    name: String,
    lastname: { type: String, trim: true, lowercase: true },
    title: { type: String, trim: true, lowercase: true, enum: ['professor', 'adjunct'] },
    age: { type: Number, required: true, min: 10, max: 1000 },
    isFullTime: { type: Boolean, default: true },
    updatedOn: { type: Date, default: Date.now }
});

// NOTE_2 ilker, create model  
module.exports = mongoose.model("Teacher", teacherModel);