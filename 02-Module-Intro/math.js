function add(a, b) {
  return a + b;
}

function sub(a,b){
  return b-a;
}
// module.exports = add; --> return as method itself not as object 
// module.exports=sub; --> overrides add fn

module.exports={
   add,sub
}

