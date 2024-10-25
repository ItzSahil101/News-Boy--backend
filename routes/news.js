const express = require("express");
const router = express.Router();

const { fetchNews } = require("../utils/fetchUrl");
const postModel = require("../models/postModel");

router.get('/', (req,res)=>{
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${process.env.API_KEY}`
    fetchNews(url, res);
})

//top headlines

router.get('/top-headlines', (req,res)=>{
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "technology";

    let url = ` https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${process.env.API_KEY}`;
    fetchNews(url, res);
})

//for nepal
router.get('/nepal', async(req,res)=>{
    let url = `https://newsdata.io/api/1/latest?country=np&apikey=pub_56819567421c755ddd1c2fc948742985ae450`;
    let response = await fetch(url)
    let data = await response.json()
   
        res.json({
            status: 200,
            success: true,
            msg: "Sucessfully fetched the data",
            data: data.results
        })
    }
    
)

router.get('/userNews', async(req,res)=>{
    const postsData = await postModel.find();
    res.status(200).json({data: postsData})
})

module.exports = router;