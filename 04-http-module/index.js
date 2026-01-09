const http=require('http');
const fs=require('fs');
const server=http.createServer((req,res)=>{
  // console.log('new req received...',req);
  const log=`${Date.now()}: New Req Received\n`;
  fs.appendFile('./log.txt',log,(err,data)=>{})
  res.end('hello from server');
});

server.listen(3001,()=>{console.log('server started');
});