const mongoose = require("mongoose");

mongoose.set('strictQuery',true);
const connectDatabaase =()=>{
mongoose.connect(process.env.DB_URI).then((data)=>{
    console.log(`Mongodb connected with server ${data.connection.host}`)
})                                              /*  didn't write catch because we already have the 
                                               unhandles promise Rejection in SERVER FILE OF JS */
}

module.exports = connectDatabaase;