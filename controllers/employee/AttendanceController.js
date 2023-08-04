const db = require("../../db/connectiondb");
const { Op } = require("sequelize");
var Attendance = db.attendance;
var Employee = db.employee;
var User = db.User;
var sequelize = db.sequelize;

class AttendanceControlller {
  static AddAttendance = async (req, res) => {
    try {
      const { employee_id, date, working_hours, attendance_status } = req.body;
      const data = new Attendance({
        employee_id: employee_id,
        date: date,
        working_hours: working_hours,
        attendance_status,
        attendance_status,
      });
      await data.save();
      res.redirect("/employee/dashboard");
    } catch (err) {
      console.log(err);
    }
  };
  static AttendancePage = async (req, res) => {
    try {
      // const {id} = req.user;
      res.render("employee/viewattendance");
    } catch (error) {
      console.log(error);
    }
  };

  static ViewAttendance = async (req, res) => {
    try {
      // const allattendance = await Attendance.findOne({where:{id:req.params.id}});
      const allattendance = await Attendance.findAll({
        where: {
          employee_id: req.params.employee_id,
        },
        attributes: ["date", "working_hours", "attendance_status"],
        include: [
          {
            model: Employee,
            attributes: ["name", "email"],
          },
        ],
      });
      // Calculate attendance count
      let attendanceCount = 0;
      for (const attendance of allattendance) {
        if (attendance.attendance_status === "Present") {
          attendanceCount++;
        }
      }
      console.log(attendanceCount);
      res.render("employee/viewattendance", {
        allattendance: allattendance,
        attendanceCount: attendanceCount,
      });
      // res.status(200).json({ success: true, allattendance});
    } catch (err) {
      console.log(err);
    }
  };

  //   static AttendancePercentage = async(req,res)=>{
  //     try {
  //         // const allattendance = await Attendance.findOne({where:{id:req.params.id}});
  //         const allattendance = await Attendance.findAll({
  //             attributes:['date','working_hours','attendance_status'],
  //             include:[{
  //                model:Employee,
  //                attributes:['name','email'],
  //             }
  //         ]});
  //         // Calculate attendance count
  //         let attendanceCount = 0;
  //         for (const attendance of allattendance) {
  //           if (attendance.attendance_status === 'Present') {
  //             attendanceCount++;
  //           }
  //         }
  //         console.log(attendanceCount);
  //         res.render('admin/monthlyattendance',{allattendance:allattendance,attendanceCount: attendanceCount})
  //         // res.status(200).json({ success: true, allattendance});
  //       } catch (err) {
  //         console.log(err);
  //       }
  // }

  // Controller method
  // static AttendancePercentage = async (req, res) => {
  //   try {
  //     const allattendance = await Attendance.findAll({
  //       attributes: ["date", "working_hours", "attendance_status"],
  //       include: [
  //         {
  //           model: Employee,
  //           attributes: ["id", "name", "email"],
  //         },
  //       ],
  //     });

  //     const employeeAttendanceMap = new Map(); // To store attendance details for each employee
  //     // console.log(employeeAttendanceMap);
  //     const employeeAttendanceCountMap = new Map(); // To store the attendance count for each employee
  //     // console.log(employeeAttendanceCountMap);

  //     // Group attendance by employee
  //     for (const attendance of allattendance) {
  //       const employeeId = attendance.employee.id;
  //       // console.log(employeeId);
  //       if (!employeeAttendanceMap.has(employeeId)) {
  //         employeeAttendanceMap.set(employeeId, []);
  //         employeeAttendanceCountMap.set(employeeId, 0);
  //       }
  //       employeeAttendanceMap.get(employeeId).push(attendance);
  //       if (attendance.attendance_status === "Present") {
  //         employeeAttendanceCountMap.set(
  //           employeeId,
  //           employeeAttendanceCountMap.get(employeeId) + 1
  //         );
  //       }
  //     }
  //     //  res.status(200).json({ success: true, allattendance});
  //     // console.log(employeeAttendanceMap);
  //     // console.log(employeeAttendanceCountMap);
  //     res.render("admin/monthlyattendance",{
  //       allattendance: employeeAttendanceMap,
  //       attendanceCountMap: employeeAttendanceCountMap,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  static AttendancePercentage = async (req, res) => {
    try {
      const startDate = req.query.startDate; // Get the start date from the query parameters
      // console.log(startDate);
      const endDate = req.query.endDate; // Get the end date from the query parameters
      // console.log(endDate);
      const allattendance = await Attendance.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate], // Use Op.between to filter records between the start and end dates
          },
        },
        attributes: ["date", "working_hours", "attendance_status"],
        include: [
          {
            model: Employee,
            attributes: ["id", "name", "email"],
          },
        ],
      });

      const employeeAttendanceMap = new Map(); // To store attendance details for each employee
      //     // console.log(employeeAttendanceMap);
      const employeeAttendanceCountMap = new Map(); // To store the attendance count for each employee
      // console.log(employeeAttendanceCountMap);

      // Group attendance by employee
      for (const attendance of allattendance) {
        const employeeId = attendance.employee.id;
        // console.log(employeeId);
        if (!employeeAttendanceMap.has(employeeId)) {
          employeeAttendanceMap.set(employeeId, []);
          employeeAttendanceCountMap.set(employeeId, 0);
        }
        employeeAttendanceMap.get(employeeId).push(attendance);
        if (attendance.attendance_status === "Present") {
          employeeAttendanceCountMap.set(
            employeeId,
            employeeAttendanceCountMap.get(employeeId) + 1
          );
        }
      }

      res.render("admin/monthlyattendance", {
        allattendance: employeeAttendanceMap,
        attendanceCountMap: employeeAttendanceCountMap,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // static MonthlyAttendance = async(req,res)=>{
  //     try {
  //         // const {id} = req.user;
  //         res.render('admin/monthlyattendance');
  //     } catch (error) {
  //         console.log(error);
  //     }
  // }

  static AttendanceFilter = async (req, res) => {
    try {
      // Get the total number of employees in the company
      const totalEmployees = await Employee.count();
      console.log(totalEmployees);

      // Get the selected month and year from the query parameters or use the current month and year as default
      const selectedMonth =
        req.query.selectedMonth || new Date().toISOString().slice(0, 7);
      const selectedYear = req.query.selectedYear || new Date().getFullYear();
      console.log(selectedMonth);
      console.log(selectedYear);
      // Calculate the start and end dates of the selected month
      const startDate = new Date(selectedYear, selectedMonth.slice(5) - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth.slice(5), 0);

      console.log(startDate);
      console.log(endDate);

      // Find all employees with their attendance records within the selected month
      const allEmployees = await Employee.findAll({
        attributes: ["id", "name", "email"],
        include: [
          {
            model: Attendance,
            attributes: ["working_hours", "attendance_status", "date"],
            where: {
              date: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      });

      console.log(allEmployees);
      res.status(200).json({ success: true, allEmployees });

      // // Calculate attendance percentage for each employee
      // allEmployees.forEach(employee => {
      //   const totalWorkingDays = endDate.getDate();
      //   const attendedDays = employee.Attendances.filter(
      //     attendance => attendance.attendance_status === 'Present'
      //   ).length;
      //   employee.attendancePercentage = (attendedDays / totalWorkingDays) * 100;
      // });

      // // Render the admin dashboard view with the necessary data
      // res.render('admin_dashboard', {
      //   totalEmployees: totalEmployees,
      //   allEmployees: allEmployees,
      //   selectedMonth: startDate.toLocaleString('default', { month: 'long' }),
      //   selectedYear: selectedYear,
      // });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  };
}

module.exports = AttendanceControlller;
