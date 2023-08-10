module.exports = techno =>(req,res,next)=>{

  Promise.resolve(techno(req,res,next)).catch(next);
};