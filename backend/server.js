const app = require("./app");
const dotenv = require("dotenv");
const connectDatabaase = require('./config/database');

//Handling Uncaught exception  -- for any miswritten by developer

process.on("uncaughtException", (err)=>{
    console.log(`Error :${err.message}`);
    console.log(`shutting down server due to uncaught exception`);
    process.exit(1);

})

//configuration
dotenv.config({path:"backend/config/config.env"});


//database connection
connectDatabaase();

const server =app.listen(process.env.PORT , ()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
});


//unhandles Promise Rejection -- for any promise written by mistake by developer
process.on("unhandledRejection",(err) =>{
    console.log(`Error : ${err.message}`);
    console.log(`shutting down the server due to unhandled promise Rejection`)
    server.close(()=>{
        process.exit(1);

    });
});