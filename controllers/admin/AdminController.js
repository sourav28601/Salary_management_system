var db = require('../../db/connectiondb');
// var Employee = db.employee;
var Employee = db.employee;
var Attendance = db.attendance;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

class AdminController{

    static LoginPage = (req,res)=>{
        res.render('login');
    }
    static Dashboard = async(req,res)=>{
        
        try {
            // const{id} = req.user
            res.render('admin/dashboard');
        } catch (error) {
            console.log(error);
        }
    
    }
    static ViewDashboard = async(req,res)=>{
        
        // try {
        //     // const{id} = req.user
        //     res.render('admin/dashboard');
        // } catch (error) {
        //     console.log(error);
        // }
        try {
            // Get the total number of employees in the company
            const totalEmployees = await Employee.count();
        
            // Get the selected month and year from the query parameters or use the current month and year as default
            const selectedMonth = req.query.selectedMonth || new Date().toISOString().slice(0, 7);
            const selectedYear = req.query.selectedYear || new Date().getFullYear();
        
            // Calculate the start and end dates of the selected month
            const startDate = new Date(selectedYear, selectedMonth.slice(5) - 1, 1);
            const endDate = new Date(selectedYear, selectedMonth.slice(5), 0);
        
            // Find all employees with their attendance records within the selected month
            const allEmployees = await Employee.findAll({
              attributes: ['id', 'name', 'email'],
              include: [
                {
                  model: Attendance,
                  attributes: ['working_hours', 'attendance_status', 'date'],
                  where: {
                    date: {
                      [sequelize.Op.between]: [startDate, endDate],
                    },
                  },
                },
              ],
            });
        
            // Calculate attendance percentage for each employee
            allEmployees.forEach(employee => {
              const totalWorkingDays = endDate.getDate();
              const attendedDays = employee.Attendances.filter(
                attendance => attendance.attendance_status === 'Present'
              ).length;
              employee.attendancePercentage = (attendedDays / totalWorkingDays) * 100;
            });
        
            // Render the admin dashboard view with the necessary data
            res.render('admin/dashboard', {
              totalEmployees: totalEmployees,
              allEmployees: allEmployees,
              selectedMonth: startDate.toLocaleString('default', { month: 'long' }),
              selectedYear: selectedYear,
            });
          } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
    }

    static EmployeeDashboard = async(req,res)=>{
        try {
            const {id} = req.user;
            res.render('employee/dashboard',{id:id});
        } catch (error) {
            console.log(error);
        }
       
    }

    static AllEmployees = (req,res)=>{
        res.render('admin/allemployee');
    }
   
    static login =(req,res)=>{
        res.send('login');
    }

    static AdminLogin = async(req,res)=>{
        try{
            const{email,password}=req.body;
            // const id = req.params.id;
            // console.log(id);
            // const user = await employee.findOne({ where: { email: email } });
            const user = await Employee.findOne({where:{email:email}});
            console.log(user);
            req.session.user = user; 
            // const sessiondata = req.session.user;
            if(user!=null){
                const isMatch = await bcrypt.compare(password,user.password)
                if(isMatch){
                    const { id, role } = user;
                    // generate token
                    const token = jwt.sign({ userid:id, role: role }, 'souravrajputrjitgwalior');
                    // generate token
                    // const token = jwt.sign({ userid:user.id },'souravrajputrjitgwalior');
                    // console.log(token);
                    res.cookie('token',token);
                    if (role === 'admin') {
                        // Redirect to admin dashboard or admin-specific page
                        res.redirect('/admin/dashboard');
                      } else {
                        // Redirect to user dashboard or user-specific page
                        res.redirect('/employee/dashboard');
                      }
                }else{
                    // req.flash('error','email and password does not match')
                    res.redirect('/')
                    res.send({ status: "failed", message: "email and password does not match 🙁🙁😥" });
                }
            }else{
                // req.flash('error','you are not registered user')
                res.redirect('/')
                res.send({ status: "failed", message: "you are not registered user 😫😫😫" });
            }
        }catch(err){
            console.log(err);
        }
    }
               
}

module.exports = AdminController;