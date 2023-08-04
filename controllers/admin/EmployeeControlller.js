var db = require('../../db/connectiondb');
var Admin = db.admin;
var Employee = db.employee;

class EmployeeController{


    static EmployeeAttendance = (req,res)=>{
        res.render('attendance');
    }
    
    static AddEmployee = async(req,res)=>{
        try {
            const { name, email, mobile, address, base_salary} = req.body;
            const data = new Employee({
              name: name,
              email: email,
              mobile: mobile,
              address: address,
              base_salary:base_salary,
            });
            await data.save();
            res.redirect('/admin/display-all-employee');
            // res.status(201).json({ success: true, message: "employee added successfully", data });
          } catch (err) {
            console.log(err);
          }
    }

    static DisplayAllEmployee = async(req,res)=>{
        try {
            const allemployee = await Employee.findAll();
            // console.log(allemployee);
            res.render('admin/allemployee',{allemployee:allemployee})
            // res.status(200).json({ success: true, allemployee });
          } catch (err) {
            console.log(err);
          }
    }
    
    static EditEmployee = async (req, res) => {
        try{
            const employee = await Employee.findOne({where:{id:req.params.id}})
            // console.log(result)
            // res.status(201).json({ success: true, message: "employee edit successfully", employee });
            res.render('admin/editemployee',{employee:employee})
        }catch(err) 
        {
          console.log(err)
        }
    };

    static UpdateEmployee = async (req, res) => {
        const { name, email, mobile, address, base_salary} = req.body;
        try{
            const data = await  Employee.update({
                name: name,
                email: email,
                mobile: mobile,
                address: address,
                base_salary:base_salary,
            },{where:{
                id: req.params.id,
              }})
            console.log(data) 
            return res.redirect('/admin/display-all-employee');
            // res.status(201).json({success: true,message: "Employee updated successfully",data})
        }catch(err) 
        {
         console.log(err)
        }
    };


    static DeleteEmployee = async (req, res) => {
    //    console.log(req.params.id);
        try {
            const employee = await Employee.destroy({where:{id:req.params.id}});
            return res.redirect('/admin/display-all-employee');
            // console.log(employee);
            // if (!employee) { 
            //     return res.status(500).send({ status: "unsucess", message: "Post not found" })
            // }
            // res.status(201).json({ status: "success", success: true, message: "Delete Successfully", employee })
        } catch (err) {
            console.log(err)
        }
    };
    

            
}

module.exports = EmployeeController;