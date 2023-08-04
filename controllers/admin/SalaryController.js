var db = require("../../db/connectiondb");
const moment = require("moment");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../../env");
var Admin = db.admin;
var Salary = db.salary;
var Employee = db.employee;
var Attendance = db.attendance;
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  console.log("Cron job started for salary calculation...");
  await SalaryController.calculateSalaries();
  console.log("Cron job completed.");
});

class SalaryController {
  static AddSalary = async (req, res) => {
    try {
      const {
        employee_id,
        month,
        year,
        total_working_days,
        total_leaves_taken,
        overtime,
      } = req.body;
      const existingSalary = await Salary.findOne({
        where: {
          employee_id,
          month,
          year,
        },
      });
      if (existingSalary) {
        return res.send(
          '<script>alert("Salary already processed for this selected month"); window.history.back();</script>'
        );
      } else {
        const salary = new Salary({
          employee_id: employee_id,
          month: month,
          year: year,
          total_working_days: total_working_days,
          total_leaves_taken: total_leaves_taken,
          overtime: overtime,
        });
        await salary.save();
        const employee = await Employee.findByPk(employee_id);
        console.log(employee);
        const perDaySalary = employee.base_salary / salary.total_working_days;
        console.log("per day : ", perDaySalary);
        console.log(salary.total_working_days);
        console.log(salary.total_leaves_taken);
        console.log(salary.overtime / 8);
        const totalSalary =
          perDaySalary *
          (salary.total_working_days -
            salary.total_leaves_taken +
            salary.overtime / 8);
        console.log("total salary : ", totalSalary);
        await salary.update({
          total_salary_made: totalSalary,
          is_salary_calculated: 1,
        });
        //  return res.send(
        //   '<script>alert("Salary added successfully"); window.location.href = "/add-salary";</script>'
        //  );
        res.redirect("/admin/dashboard");
        // res.status(201).json({ success: true, message: "employee added successfully", data });
      }
    } catch (err) {
      console.log(err);
    }
  };

  static getTotalWorkingDays = (year, month) => {
    const daysInMonth = moment(`${year}-${month}`, "YYYY-M").daysInMonth();
    let totalWorkingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${year}-${month}-${day}`, "YYYY-M-D");
      // Check if the day is not Sunday (isoWeekday() returns 7 for Sunday)
      if (date.isoWeekday() !== 7) {
        totalWorkingDays++;
      }
    }

    return totalWorkingDays;
  };

  static calculateSalaries = async () => {
    try {
      // Get the current month and year
      const currentDate = moment();
      // console.log(currentDate);
      const currentMonth = currentDate.month() + 1; // Months are zero-based (0-11), so we add 1.
      // console.log(currentMonth);
      const currentYear = currentDate.year();
      // console.log(currentYear);

      // Get the last month and year
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      // console.log(lastMonth);
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      // console.log(lastYear);

      // Fetch all employees
      const employees = await Employee.findAll();

      for (const employee of employees) {
        // console.log(employee.id);
        // const { id, base_salary } = employee;

        const existingSalary = await Salary.findOne({
          where: {
            employee_id:employee.id,
          },
        });

        // console.log(existingSalary); // Add this line to see the existing salary data for each employee

        if (existingSalary) {
          console.log(
            `Salary already processed for ${employee.name} - ${lastMonth}/${lastYear}`
          );
          // continue; // Skip to the next employee
        }

        // Fetch attendance data for the previous month for the current employee
        const attendanceData = await Attendance.findAll({
          where: {
            employee_id:employee.id,
          },
        });
        console.log("attendanceData : ", attendanceData);

        // Calculate total_working_days and total_leaves_taken
        let total_leaves_taken = 0;

        for (const attendance of attendanceData) {
          if (attendance.attendance_status === "Absent") {
            total_leaves_taken++;
          }
        }

        console.log("leaves : ", total_leaves_taken);

        // Calculate the total working days for the last month (except Sundays)
        const total_working_days = SalaryController.getTotalWorkingDays(lastYear,lastMonth);
        console.log(total_working_days);

        // Calculate total_working_days, total_leaves_taken, and overtime
        // (You'll need to implement the calculations based on your actual data)

        // Calculate the salary for the previous month
        // (Assuming you have the 'base_salary' field in the Employee model)

        const perDaySalary = employee.base_salary / total_working_days;
        console.log(perDaySalary);
        const totalSalary = perDaySalary * (total_working_days - total_leaves_taken);
        console.log(totalSalary);

        // Create a new salary entry for the previous month
        await Salary.create({
          employee_id: employee.id,
          month: lastMonth,
          year: lastYear,
          total_working_days: total_working_days,
          total_leaves_taken: total_leaves_taken,
          total_salary_made: totalSalary,
          is_salary_calculated: 1,
        });
      // Send Salary Processed Email to the employee
        const subject = `Salary Details for ${lastMonth}/${lastYear}`;
        // const body ={
        //   text: `Your salary for the month of ${lastMonth}/${lastYear} is ${totalSalary}.`,
        //   html: `<p>Your salary for the month of ${lastMonth}/${lastYear} is ${totalSalary}.</p>`,
        // };

       const body = {
            name: "HackerKernel Team Member",
            intro: "Your salary for this month has been processed successfully!",
            table: {
              data: [
                {
                  Month_Working_Days:total_working_days,
                  Leaves: total_leaves_taken,
                  Salary_Calculated: totalSalary,
                },
              ],
            },
        }
        // Send Salary Processed Email to the employee
        SalaryController.RealMail(employee.email, subject, body);
       
        console.log(
          `Salary calculated and processed for ${employee.name} - ${lastMonth}/${lastYear}`
        );
      }
    } catch (err) {
      console.error("Error in salary calculation:", err);
    }
  };

  // This method will schedule the cron job to run on the second day of each month.
  // static scheduleCronJob() {
  //   cron.schedule("* * * * *", async () => {
  //     console.log("Cron job started for salary calculation...");
  //     await SalaryController.calculateSalaries();
  //     console.log("Cron job completed.");
  //   });
  // }

  // send mail from testing account
  static SendMail = async (req, res) => {
    try {
      res.send("hello server");
      const testAccount = await nodemailer.createTestAccount();
      console.log(testAccount);
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "romaine.boyle@ethereal.email",
          pass: "GuQSjjY7kSdWjA75nB",
        },
      });
      // console.log(transporter);

      // const transporter = await nodemailer.createTransport({
      //   host: "smtp.forwardemail.net",
      //   port: 587,
      //   secure:true,
      //   auth: {
      //     user: 'souravrajput7975@gmail.com',
      //     pass: '789@Sourav'
      // },
      // });
      let info = await transporter.sendMail({
        from: '"Sourav Rajput 👻" <souravr@gmail.com>', // sender address
        to: "souravrajput7975@gmail.com,gaurav@gmail.com",
        subject: "Hello Sourav✔", // Subject line
        text: "How are you", // plain text body
        html: "<b>Hi Sourav</b>", // html body
      });
      // console.log(info);
      console.log("Message sent: %s", info.messageId);
      res.json(info);
    } catch (error) {
      console.log(error);
    }
  };

  // send mail from real gmail account
  static RealMail = async (to, subject, body) => {
    try {
      let config = {
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      };
      // const testAccount = await nodemailer.createTestAccount();
      // console.log(testAccount);
      let transporter = nodemailer.createTransport(config);

      let MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "Mailgen",
          link: "https://mailgen.js/",
        },
      });

      let response = {
         body:body,
        // body: {
        //   name: "Hi HackerKernel Team Member",
        //   intro: "Your salary for this month has been processed successfully!",
        //   table: {
        //     data: [
        //       {
        //         Your_Working_Days: "24",
        //         Leaves: "2",
        //         Salary_Calculated: "$1000",
        //       },
        //     ],
        //   },
        // },
        outro: "lOOking Forward to do more business",
      };
      // console.log(transporter);
      let mail = MailGenerator.generate(response);

      let message = {
        from: EMAIL,
        // to: "souravrajput7975@gmail.com, 0902ee191040@rjit.ac.in",
        to: to,
        // subject: "This Month Salary Processed", // Subject line
        subject: subject, // Subject line
        html: mail, // html body
      };
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("Body:", body);
      transporter
        .sendMail(message)
        .then(() => {
          console.log(`Email sent to ${to}`);
          // return res.status(201).json({
          //   msg: "you should receive an email",
          // });
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });
      // res.status(201).json('send mail successfully....!');
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = SalaryController;
