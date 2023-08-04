const express = require('express');
const router = express.Router();


const AdminController = require('../controllers/admin/AdminController');
const EmployeeController = require('../controllers/admin/EmployeeControlller');
const AttendanceController = require('../controllers/employee/AttendanceController');
const SalaryController = require('../controllers/admin/SalaryController');
const LeaveController = require('../controllers/employee/LeaveController');
const checkUserAuth = require('../middleware/auth');

// FrontController
// router.get('/login',FrontController.login);

// AdminController
router.get('/',AdminController.LoginPage);
router.post('/admin-login',checkUserAuth,AdminController.AdminLogin);
router.get('/admin/dashboard',checkUserAuth,AdminController.Dashboard);
router.get('/employee/dashboard',checkUserAuth,AdminController.EmployeeDashboard);
router.get('/all-employees',AdminController.AllEmployees);

// EmployeeController
router.get('/attendance',EmployeeController.EmployeeAttendance)
router.post('/admin/add-employee',EmployeeController.AddEmployee);
router.get('/admin/display-all-employee',EmployeeController.DisplayAllEmployee);
router.get('/admin/edit-employee/:id',EmployeeController.EditEmployee);
router.post('/admin/update-employee/:id',EmployeeController.UpdateEmployee);
router.get('/admin/delete-employee/:id',EmployeeController.DeleteEmployee);
// router.get('/employee/viewattendance',EmployeeController,ViewAttendance);

// AttendanceController
router.post('/add-attendance',AttendanceController.AddAttendance)
router.get('/employee/attendance',AttendanceController.AttendancePage);
router.get('/employee/viewattendance/:employee_id',AttendanceController.ViewAttendance);
// router.get('/admin/monthly-attendance',AttendanceController.MonthlyAttendance);
router.get('/admin/monthly-attendance',AttendanceController.AttendancePercentage);
// router.get('/admin/attendance-filter',AttendanceController.AttendanceFilter);


// router.get('/employee/viewattendance',AttendanceController.ViewAttendance);
// router.get('/employee/viewleave',AttendanceController.ViewLeave);


// LeaveController
router.post('/add-leave',LeaveController.AddLeave);
router.get('/employee/leaves',LeaveController.LeavePage);
router.get('/employee/viewleaves/:id',LeaveController.ViewLeave);

// salaryController
router.post('/add-salary',SalaryController.AddSalary);
router.get('/mail',SalaryController.SendMail);
router.get('/realmail',SalaryController.RealMail);
// router.get('/csalary',SalaryController.scheduleCronJob);



// router.get('/login',FrontController.login)




module.exports = router;