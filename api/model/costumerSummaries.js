var sql = require ('./db.js');

var CostumerSummaries = function(costumerSum){
    this.costumerID = costumerSum.costumerID;
    this.seasonID = costumerSum.seasonID;
    this.totalRepaid = costumerSum.totalRepaid;
    this.totalCredit = costumerSum.totalCredit;
};

CostumerSummaries.getSummaryById = function(seasonID, costumerID, result){
    sql.query("Select * from costumersummaries where seasonID = ? AND costumerID = ?", [seasonID, costumerID], function (err, res){
        if(err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
}

CostumerSummaries.getallUserSummary = function(userID, result){
    sql.query("Select * from costumersummaries where costumerID = ? WHERE totalRepaid != totalCredit ORDER BY seasonID ASC", costumerID, function (err, res){
        if(err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
}

CostumerSummaries.updateById = function(summary, result){
    sql.query("UPDATE costumersummaries SET totalRepaid = ? WHERE seasonID = ? AND costumerID = ?", [summary.totalRepaid, summary.seasonID, summary.costumerID], function (err, res) {
        if(err){
            console.log("error: ", err);
            result(null, err);
        }else{
            result(null, res);
        }
    });
};