const express = require('express');
const seasons = require("../controller/seasons");
const costumerSummaries = require("../controller/costumerSummaries");
const router = express.Router();

router.get('/seasons', function(req,res,next){
    res.send(seasons.list_all_season);
});
router.get('/seasons:id', function(req,res,next){
    res.send(seasons.take_a_season);
});
router.get('/summaries/:userID', function(req,res,next){
    res.send(costumerSummaries.list_summariesUser);
});
router.get('/summaries/:userID/:id', function(req,res,next){
    res.send(costumerSummaries.summary_byID);
});
router.put('/summariesUser/post/:id', function(req,res,next){
    res.send(costumerSummaries.update_a_summary);
});


module.exports = router;

