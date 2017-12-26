var express = require('express');

var TeacherModel = require('../model/teacherModel');
var teacherRestController = require('../controller/teacherRestController')(TeacherModel);

var teacherRestRouter = express.Router();

teacherRestRouter.route('')
    .get(teacherRestController.find)
    .post(teacherRestController.save)
    .delete(teacherRestController.findByIdInBodyThenRemove);

teacherRestRouter.route('/:id')
    .get(teacherRestController.findById)
    .put(teacherRestController.findByIdUpdateFullyThenSave)
    .patch(teacherRestController.findByIdUpdatePartiallyThenSave)
    .delete(teacherRestController.findByIdThenRemove);

teacherRestRouter.route('/echo/:msg')
    .get(teacherRestController.echoMsg)

module.exports = teacherRestRouter;