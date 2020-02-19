const Summaries = require('../model/costumerSummaries');

exports.summary_byID = function(req,res){
    Summaries.getSummaryById(req.params.seasonID, req.params.costumerID, function(err, summaries){
        if(err){
            res.send(err);
            console.log('res', summaries);
        }
        res.send(summaries);
    });
}

exports.list_summariesUser = function(req,res){
    Summaries.getallUserSummary(req.params.costumerID, function(err, summaries){
        if(err){
            res.send(err);
            console.log('res', summaries);
        }
        res.send(summaries);
    });
}

exports.update_a_summary = function(req,res){
    Summaries.updateById(req.params, function(err,summaries){
        if(err){
            res.send(err);
            console.log('res', summaries);
        }
        res.json(summaries);
    })
}