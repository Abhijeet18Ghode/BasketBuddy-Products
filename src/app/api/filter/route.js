class APIFilters {
  constructor(query, queryStr = {}) { // Default to an empty object if queryStr is undefined
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    console.log("Query String:", this.queryStr); // Check if `queryStr` is correctly passed
  
    const keyword = this.queryStr.keyword
      ? {
          title: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
  
    console.log("Search Keyword:", keyword);
  
    this.query = this.query.find({ ...keyword });
    return this;
  }
  
  
    filter() {
      const queryCopy = { ...this.queryStr };
  
      const removeFields = ["keyword", "page"];
      removeFields.forEach((el) => delete queryCopy[el]);
  
      let output = {};
      let prop = "";
  
      for (let key in queryCopy) {
        if (!key.match(/\b(gt|gte|lt|lte)/)) {
          output[key] = queryCopy[key];
        } else {
          prop = key.split("[")[0];
  
          let operator = key.match(/\[(.*)\]/)[1];
  
          if (!output[prop]) {
            output[prop] = {};
          }
  
          output[prop][`$${operator}`] = queryCopy[key];
        }
      }
      // { price: { $gte: 100, $lte: 1000 } }
  
      this.query = this.query.find(output);
      return this;
    }
  
    pagination(resPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
      const skip = resPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resPerPage).skip(skip);
      return this;
    }
  }
  
  export default APIFilters;