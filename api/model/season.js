var sql = require('./db.js');

var Seasons = function(season){
    this.seasonID = season.seasonID;
    this.seasonName = season.seasonName;
    this.startDate = season.startDate;
    this.endDate = season.endDate;
};

Seasons.getSeasonById = function (seasonID, result){
    sql.query("Select * from seasons where seasonID = ? ", seasonID, function (err, res) {
        if(err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
});
};

Seasons.getAllSeasons = function (result){
    sql.query("Select * from seasons", function (err, res) {
        if(err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
});
};