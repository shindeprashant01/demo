const { json } = require("express");

class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search (){
        const keyword = this.queryStr.keyword ? {name :{
            $regex : this.queryStr.keyword ,
            $options : "i",
        }
    }
    :{};

    this.query = this.query.find({...keyword});
    return this ;
    }
 
    filter(){
        const queryCopy = {...this.queryStr};
        // removed fields which don't want to come with filter bcoz if they come then,
        // there will be confusion between what have to search and filter. 
       const removeFields =["keyword","Page","limit"];
             removeFields.forEach((key) => delete queryCopy[key]);

       // filter for price & Rating
      let queryStr = JSON.stringify(queryCopy);
      queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=> `$${key}`)
        

         this.query = this.query.find(JSON.parse(queryStr));
        
         return this;      
    }
   pagination(resultPerPage){
    const currentPage =Number (this.queryStr.page) || 1;

    const skip = resultPerPage*(currentPage-1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return  this;
   }
}


module.exports = ApiFeatures;