const url=require('url');
const fs=require('fs');
const http=require('http');



// const port =3000;
// const server=http.createServer((req,res)=>{
//   if (req.url === '/favicon.ico') {
//   res.end();
//   return;
// }
//    fs.appendFile('./log.txt',`${Date.now()}: received Request ${req.url}\n`,(err)=>{if(err)console.log('error: ',err);
//    });
//    const parsedUrl=url.parse(req.url,true);
   
//    console.log('Parsed url is : ',parsedUrl);
   
//    showResponse(parsedUrl.pathname,res,parsedUrl.query);
   
//    console.log(parsedUrl);
   
// });

// server.listen(port,()=>console.log(`server started successfully on url http://localhost:${port}`));

// const showResponse = (curUrl,res,query)=>{
//    switch(curUrl){
//      case '/': res.end("this is home page...");
//      break;
//      case '/about': res.end("this is about page...");
     
//      console.log(query.username);
//      break;
//      case '/contact-us': res.end("this is contact us page...");
//      break;
//      default:res.end('404 not found');
//    }
// }



const express=require('express');

const app=express();

app.get('/',(req,res)=>{
  return res.send("This is home page");
})

app.get("/about",(req,res)=>{
  return res.send(`This is about page heyyyyy : ${req.query.name}`);
})

// const server=http.createServer(app);// app acts as a handler function here simplify's the use of switch

// server.listen(8080,()=>{'server is running on port 8080 , http://localhost:8080'});


app.listen(8080,()=>{`server running on link http://localhost:8080`});