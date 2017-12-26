var mongoose = require('mongoose');

var TeacherRestController = function(TeacherModel) {
    /**
     * http://localhost:9016/teachers/echo/:msg     GET
     * http://localhost:9016/teachers/echo/hohoho   GET
     * 
       curl -i http://localhost:9016/teachers/echo/hohoho
     * @param {*} req 
     * @param {*} res 
     */
    var echoMsg = function(req, res) {
        res.status(200);
        res.send("echo REST GET returned input msg:" + req.params.msg);
    };

    /**
     * 
     * @param {*} req Request
     * @param {*} res Response
     */
    var find = function(req, res) {
        TeacherModel.find(function(error, teachers) {
            if (error) {
                res.status(500);
                res.send("Internal server error");
            } else {
                res.status(200);
                res.send(teachers);
            }
        });
    };

    /**
     * > db.teachers.find()
     * http://localhost:9016/teachers/:id                                GET
     * http://localhost:9016/api/v1/teachers/:id                         GET
     * http://localhost:9016/fdu/api/v1/teachers/:id                         GET
     * @param {*} req 
     * @param {*} res 
     */
    var findById = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found teacher for id:" + req.params.id);
                } else {
                    res.status(200);
                    res.send(teacher);
                }
            });
        } else {
            res.status(400);
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of GET request. req.params.id:" + req.params.id);
        }
    };

    /**
     * @param {*} request 
     * @param {*} response 
     */
    var save = function(request, response) {
        var teacher = new TeacherModel(request.body);
        console.log("--> LOOK request: %s", request);
        console.log("--> LOOK JSON.stringify(request.body): %s", JSON.stringify(request.body));
        console.log("--> LOOK request.body: %s", request.body);
        console.log("--> LOOK teacher: %s", teacher);
        teacher.save(function(error) {
            if (error) {
                response.status(500);
                response.send("Save failed");
            } else {
                response.status(201);
                response.send(teacher);
            }
        });
    };

    /**
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdateFullyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found teacher for id:" + req.params.id);
                } else {
                    console.log("req.body.updatedOn: %s", req.body.updatedOn);
                    teacher.teacherId = req.body.teacherId;
                    teacher.name = req.body.name;
                    teacher.lastname = req.body.lastname;
                    teacher.title = req.body.title;
                    teacher.age = req.body.age;
                    teacher.isFullTime = req.body.isFullTime;
                    teacher.updatedOn = req.body.updatedOn;

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201);
                            res.send(teacher);
                        }
                    });
                }
            });
        } else {
            res.status(400);
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PUT request. req.params.id:" + req.params.id);
        }
    };

    /**
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdatePartiallyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    if (req.body._id) {
                        delete req.body._id;
                    }
                    for (var attrName in req.body) {
                        teacher[attrName] = req.body[attrName];
                    }

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201);
                            res.send(teacher);
                        }
                    })
                }
            });
        } else {
            res.status(400);
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PATCH request. req.params.id:" + req.params.id);
        }
    };

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdThenRemove = function(req, res) {
        try {
            console.log("findByIdThenRemove req.params.id:%s", req.params.id);
            if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {

                console.log(" again findByIdThenRemove req.params.id:%s", req.params.id);
                TeacherModel.findById(req.params.id, function(error, teacher) {
                    if (error) {
                        console.log("findByIdThenRemove error:" + error);
                        res.status(404);
                        res.send("Not found teacher for id:" + req.params.id);
                    } else {
                        teacher.remove(function(error) {
                            if (error) {
                                res.status(500);
                                res.send("Remove failed");
                            } else {
                                res.status(204);
                                res.send(teacher);
                            }
                        })
                    }
                });
            } else {
                res.status(400);
                res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request. req.params.id:" + req.params.id);
            }

        } catch (e) {
            res.status(500);
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request may be not a valid ObjectId value. req.params.id:" + req.params.id);
        }
    };

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdInBodyThenRemove = function(req, res) {
        console.log("findByIdInBodyThenRemove req.body._id:%s", req.body._id);
        if (req.body && req.body._id && mongoose.Types.ObjectId.isValid(req.body._id)) {
            TeacherModel.findById(req.body._id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found Teacher for id:" + req.body._id);
                } else {
                    console.log("LAGA%sLUGA", error);
                    teacher.remove(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Remove failed");
                        } else {
                            res.status(204);
                            res.send(teacher);
                        }
                    })
                }
            });

        } else {
            res.status(400);
            res.send("Check inputs of request. InCorrect inputs. Expected _id in body of DELETE request");
        }
    };

    return {
        echoMsg: echoMsg,
        find: find,
        findById: findById,
        save: save,
        findByIdUpdateFullyThenSave: findByIdUpdateFullyThenSave,
        findByIdUpdatePartiallyThenSave: findByIdUpdatePartiallyThenSave,
        findByIdThenRemove: findByIdThenRemove,
        findByIdInBodyThenRemove: findByIdInBodyThenRemove
    }
};

module.exports = TeacherRestController;