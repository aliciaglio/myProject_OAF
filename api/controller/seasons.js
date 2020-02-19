var Seasons = require('../model/season');

exports.list_all_season = function(req, res){
    Seasons.getAllSeasons(function(err, season){
        
        console.log('controller')
        if (err){
            res.send(err);
            console.log('res', season);
        }
        res.send(task);
    });
};

exports.take_a_season = function(req,res){
    Seasons.getSeasonById(req.params.seasonID, function(err, season){
        if(err)
            res.send(err);
        res.json(season);
    });
}