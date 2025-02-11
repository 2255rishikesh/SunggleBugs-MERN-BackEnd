const express = require('express');
const db  = require('../utils/mongoDBConnection');
const router = express.Router();

router.post('/register',async (req, res) => {
    try {
        const { email, name, confromPassword, password } = req?.body;
      if (!email || !name || !password || !confromPassword ) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const userExist = await  db.get().collection('users').findOne({email});
      if(userExist){
        return res.status(400).json({ message: 'user alredy exist please login' });
      }
      await db.get().collection('users').insertOne({ email, name, confromPassword, password,role:"user" })

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

router.post('/login',async (req, res) => {
 try {
  const{email,password}=req?.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const userExist = await  db.get().collection('users').findOne({email});
  if(!userExist){
    return res.status(400).json({ message: 'user alredy exist please signup' });
  }
  const userValidate = await  db.get().collection('users').findOne({email,password});
  if(!userValidate){
    return res.status(400).json({ message: 'invalid credential' });
  }
  delete userValidate.password
  res.status(201).json({ message: 'User login successfull',user:userValidate });

 } catch (error) {
  console.error('Error login user:', error.message);
      res.status(500).json({ message: 'Internal server error' });
  
 }
});

module.exports = router;