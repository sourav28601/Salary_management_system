const db = require('../../db/connectiondb');
var Leave =  db.leave;

class LeaveControlller {
    static AddLeave = async(req,res)=>{
        try {
            const{employee_id,date,reason}=req.body;
            const data = new Leave({
                employee_id:employee_id,
                date:date,
                reason:reason
            })
            await data.save();
            res.redirect('/employee/dashboard');
        } catch (err) {
            console.log(err);
        }
    }

    static LeavePage = async(req,res)=>{
        try {
            // const {id} = req.user;
            res.render('employee/viewleaves');
        } catch (error) {
            console.log(error);
        }
    }
    static ViewLeave = async(req,res)=>{
        try {
            // const {id} = req.user;
            res.render('employee/viewleaves');
        } catch (error) {
            console.log(error);
        }
    }
} 


module.exports = LeaveControlller;