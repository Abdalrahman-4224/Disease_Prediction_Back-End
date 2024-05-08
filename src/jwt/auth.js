const jwt = require('jsonwebtoken');

const key = "disease_prediction_application";
const expiresIn = '24h';
const userModel = require('../api/users/Model')
var executeQuery = require('../helper/common').executeQuery

exports.verify = async (token, req, callback) => {
    
        console.log("with token");
        try {
            var data = jwt.verify(token, key).data
            if (data)
                checkDataTokenValidation(data, result => {
                    if (result) callback(data)
                    else callback(null)
                })
            else callback(data);
        } catch {
            callback(null);
        }
    

};

exports.decomposeToken = (token) => {
    var data = jwt.verify(token, key).data
    return data
}

exports.generate = (data, NoExpire) => {
    let expiryValue = {
        expiresIn: expiresIn
    }
    if (NoExpire) {
        expiryValue = {}
    }

    return jwt.sign({
        data: data
    },
        key,
        expiryValue
    );
};

function checkDataTokenValidation(data, callback) {
    var sql = `select enabled from users where id=${data?.id} and deleted_at is null`
    executeQuery(sql, 'checkDataTokenValidation', result => {
        if (result && result.length > 0 && result[0].enabled) callback(true)
        else callback(false)
    })
}
