const express=require('express');
const app=express();
const PORT=8000;
// MIDDLEWARE which runs for all req , res 
app.use((req,res,next)=>{
  req.body={name:"sarfaraz"};
  console.log('MIDDLEWARE 1 RUNNING.....');
  console.log('MIDDLEWARE 1 COMPLETED ITS EXECUTION:)');
  next();
})
// route and its handler function (middleware system) :
app.get('/api/users/:id',(req,res,next)=>{
  console.log(`Received Req for the id : ${req.params.id}`);
  //DB QUERY
  res.send('USERDATA : SARFARAZ')
  next();
})

app.get('/api/users/',(req,res,next)=>{
  res.send('THIS IS LIST OF ALL USERS');
})

app.listen(PORT,(err)=>{
  if(err)console.log('Unable to start server');
  else console.log(`Server running successfully on PORT ${PORT},http://localhost:${PORT}`);
})

// FOR MORE REFER https://expressjs.com/en/guide/using-middleware.html#middleware.built-in