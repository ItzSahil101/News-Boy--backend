const axios = require("axios");

// Helper function for API requests
async function fetchNews(url, res) {
      axios.get(url).then((response)=>{
            console.log(url, response)
        if(response.data.totalResults > 0){
            res.json({
                status: 200,
                success: true,
                msg: "Sucessfully fetched the data",
                data: response.data
            })
        }else{
            res.json({
                status: 200,
                success: true,
                msg: "No more results to shows"
            })
        }
      })
      .catch((err)=>{
            console.log(err)
        res.json({
            status: 500,
            success: false,
            msg: "Failed to fetch data from API",
            error: err.message
        })
      })
  }

  module.exports.fetchNews = fetchNews;
