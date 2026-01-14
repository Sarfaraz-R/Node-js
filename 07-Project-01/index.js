const express=require('express');
const users=require('./MOCK_DATA.json');
const fs=require('fs');
const app=express();
/**
When I require('express'), a function is returned.
When I call that function, an Express application object is returned, which we store in app and use to create and manage the server.
 */
const PORT=8080;
app.use(express.urlencoded({ extended: true }));
// middle ware
app.get('/',(req,res)=>{
  res.send('This is home page...');
})
                                   //GET REQ TO LIST USERS
app.get('/api/users',(req,res)=>{
  res.send(users);
})
                                   //GET REQ TO GET AN USER INFO
// When an API is dynamic in nature, the variables in the API are represented using :
app.route('/api/users/:id').get((req,res)=>{
  const id=Number(req.params.id);
  const user=users.find(u=>u.id===id);
  if(!user) res.send(`Unable to find user with id ${id}`);
  res.send(user);
 
})
                                    //POST REQ TO ADD A USER
app.post('/api/users',(req,res)=>{
  const user=req.body;
  users.push({id:users.length+1,first_name:`${user.first_name}`,last_name:`${user.last_name}`,email:`${user.email}`,gender:`${user.gender}`,job_title:`${user.job_title}`});
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users, null, 2),()=>{});//JSON.stringify(value, replacer, space)
                                 //JavaScript object into a readable JSON string
  res.send('SuccessFully added user and user id is :'+ `${users.length}`);
});

                                   //PATCH REQ TO EDIT A USER

app.patch('/api/users/:id',(req,res)=>{
   const id = Number(req.params.id);
   const user=users.find(u=>u.id===id);
   const index=users.indexOf(user);
   if(index==-1)return res.status(400).send('No User Found With id :'+id);
   const newInfo=req.body;

   users[index]={
    ...users[index],
    ...newInfo
   }
  
   fs.writeFile(
    './MOCK_DATA.json',
    JSON.stringify(users, null, 2),
    (err)=>{
      if(err)return res.status(500).send('Error while writing into file')
      return res.status(200).send('User Update SuccessFull');
    },
   
  );
})

//                             DELETE USER WITH ID 
app.delete('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id);
    const index=users.findIndex((u)=>{return u.id===id});
    if(index===-1)return res.status(400).send(`No User Found With id :${id}`);
    users.splice(index,1);
    fs.writeFile(
      './MOCK_DATA.json',
      JSON.stringify(users, null, 2),
      (err)=>{
        if(err)return res.status(500).send('Error while writing into file')
        return res.status(200).send('User Deleted SuccessFully');
      }
    )
})


app.listen(PORT,()=>{`server listening on port : ${PORT} , http://localhost:${PORT}`});

