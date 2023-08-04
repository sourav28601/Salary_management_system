var db  = require('../db/connectiondb');
var Employee = db.employee;
// const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");


var checkUserAuth = async (req, res, next) => {
    // const { token }  = req.cookies;
    //  console.log(token);
    try{
      // const token = req.cookies.jwt;
      // console.log(token);
      const { token }  = req.cookies;
      // console.log(token);
      if(!token){
        // console.log('not get token');
          res.redirect('/')
      }else{
      const verifyuser = jwt.verify(token,'souravrajputrjitgwalior')
      // console.log(verifyuser);
      const user = await Employee.findOne({where:{id:verifyuser.userid}}) 
      req.user = user
      // console.log(user);      
      next();
      }
  }catch(err){
      console.log(err);
  } 

}

module.exports = checkUserAuth;

