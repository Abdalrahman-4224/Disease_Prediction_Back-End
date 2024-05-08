var executeQuery = require('./common').executeQuery
// var log4js = require('../config/logger')

// var errorLogs = log4js.getLogger('errors'),
// debugLogs = log4js.getLogger('debugs')
var logs,roles

function getLogType(callback){
    var sql = `select log_type_id as id,type from log_type where deleted_at is null`
    if(logs) callback(logs)
    else  
        executeQuery(sql,'getLogType',result=>{
            var i=0
            logs={}
            for(const logType of result){
                var key = logType.type;
                logs[key] = logType.id;
                i++
                if(i>=result.length) callback(logs)
            }
        })
 }

 function getRoles(callback){
    var sql = `select * from roles`
    if(roles) callback(roles)
    else  
        executeQuery(sql,'getLogType',result=>{
            var i=0
            roles={}
            for(const role of result){
                var key = role.role_id;
                roles[key] = role.name;
                i++
                if(i>=result.length) callback(roles)
            }
        })
 }


module.exports = {getLogType,getRoles}