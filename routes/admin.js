const express = require('express');
const router = express.Router();

//requiring student model
let Student = require('../models/Studentm');

// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please Login first to access this page.')
    res.redirect('/login');
}


//GET routes starts here
router.get('/', (req,res)=> {
    res.render('./admin/index');
});

router.get('/dashboard', isAuthenticatedUser,(req,res)=> {
    Student.find({})
        .then(students => {
            res.render('./admin/dashboard', {students : students});
    });
    
});

router.get('/student/new', isAuthenticatedUser, async (req, res)=> {
    try {  
        res.render('./admin/newstudent');        
    } catch (error) {
        req.flash('error_msg', 'ERROR: '+error);
        res.redirect('/student/new');
    }
});

router.get('/student/search', isAuthenticatedUser, (req,res)=> {
    let userSku = req.query.rollNo;
    if(userSku) {
        Student.findOne({rollNo : userSku})
            .then(student => {
                if(!student) {
                    req.flash('error_msg', 'Student details does not exist in the database.');
                    return res.redirect('/student/search');
                }

                res.render('./admin/search', {studentData : student});
            })
            .catch(err => {
                req.flash('error_msg', 'ERROR: '+err);
                res.redirect('/student/new');
            });
    } else {
        res.render('./admin/search', {studentData : ''});
    }
});


router.get('/students/studentsData', isAuthenticatedUser, (req,res)=> {
    Student.find({})
        .then(students => {
            res.render('./admin/studentsData', {students : students});
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/dashboard');
        });
});


router.get('/students/placedStudentsData', isAuthenticatedUser, (req, res) => {
    Student.find({})
        .then(students => {
            res.render('./admin/placedstudentsData', {students : students});
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/dashboard');
        });
});

router.get('/students/unplacedStudentsData', isAuthenticatedUser, (req, res) => {
    Student.find({})
        .then(students => {
            res.render('./admin/unplacedstudentsData', {students : students});
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/dashboard');
        });
});

router.get('/students/aboutProject', isAuthenticatedUser, (req, res)=>{
    res.render('./admin/aboutProject');
});

router.get('*', (req, res)=> {
    res.render('./admin/notfound');
});


// POST routes starts here
router.post('/student/new',isAuthenticatedUser, async(req, res)=>{
    let {name, age, sapId, rollNo, email, contactno, status, companyName, companyUrl, package} = req.body;

    let newStudent = {
        name : name,
        age : age,
        sapId : sapId,
        rollNo : rollNo,
        email : email,
        contactno : contactno,
        status : status,
        companyName : companyName,
        companyUrl : companyUrl,
        package : package
    };

    Student.findOne({rollNo : rollNo})
        .then(student =>{
            if(student) {
                req.flash('error_msg', 'Student already exist in the database.');
                return res.redirect('/student/new');
            }

            Student.create(newStudent)
                .then(student => {
                    req.flash('success_msg', 'Student added successfully in the database.');
                    res.redirect('/student/new');
                })
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/student/new');
        });
});



router.post('/student/:id', isAuthenticatedUser, async(req, res)=>{
    try {
        let searchQuery = {_id : req.params.id};
        Student.findOne(searchQuery)
                .then(students => {
                    res.render('./admin/studentDetails', {students : students});
                })
            .catch(err => {
                req.flash('error_msg', 'ERROR: '+err);
                res.redirect('/students/studentsData');
            });
        } catch (error) {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/students/studentsData');
        }    
});


//DELETE routes starts here
router.delete('/delete/student/:id', isAuthenticatedUser, (req, res)=> {
    let searchQuery = {_id : req.params.id};

    Student.deleteOne(searchQuery)
        .then(student => {
            req.flash('success_msg', 'Student deleted successfully.');
            res.redirect('/students/studentsData');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/students/studentsData');
        });
});

module.exports = router;