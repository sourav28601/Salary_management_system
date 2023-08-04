const { Sequelize,DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('esm', 'root', '', {
    host: 'localhost',
    logging:false,
    dialect:'mysql'
});

try{
    sequelize.authenticate();
    console.log('connection has been established successfully.');
}catch(error){
    console.error('unable to connect to the database:',error);
}

const db ={}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.user = require('../models/user')(sequelize,DataTypes,Model);
db.employee = require('../models/employee')(sequelize,DataTypes,Model);
db.salary = require('../models/salaries')(sequelize,DataTypes,Model);
db.attendance = require('../models/attendance')(sequelize,DataTypes,Model);
db.leave = require('../models/leave')(sequelize,DataTypes,Model);


// employee to attendance One-To-Many realtionship
db.employee.hasMany(db.attendance,{foreignKey:'employee_id'});
db.attendance.belongsTo(db.employee,{foreignKey:'employee_id'});

// // user to leave One-To-Many realtionship
db.employee.hasMany(db.leave,{foreignKey:'employee_id'});
db.leave.belongsTo(db.employee,{foreignKey:'employee_id'});

// // employee to salary One-To-One realtionship
db.employee.hasOne(db.salary,{foreignKey:'employee_id'});
db.salary.belongsTo(db.employee,{foreignKey:'employee_id'});
// db.attendance.belongsTo(db.user,{foreignKey:'user_id'});

// db.sequelize.sync({force:false});
// sequelize.sync({force:false});
module.exports = db;


