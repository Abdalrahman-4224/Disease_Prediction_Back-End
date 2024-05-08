var auth = require('../../jwt/auth');
var msg = require('../../helper/messages')
var executeQuery = require('../../helper/common').executeQuery
const bcrypt = require('bcrypt')

function createToken(req, response) {

    const username = req.body.username;
    const password = req.body.password;

    var sql = 'select * from users where username = "' + username + '" ';

    executeQuery(sql, 'createToken', result => {
        
        if (result.length > 0) {

            bcrypt.compare(password, result[0].password, async function (err, _result) {
                
                if (_result) {
                    if (result[0].enabled == 1) {
                        const NoExpire = true
                        let sqlUserRole = "SELECT role_id FROM `role_user` WHERE `user_id` = " + result[0].id + ""
                        let resultRoles = await new Promise((resolve) => {
                            executeQuery(sqlUserRole, 'getUserRoles', (e) => { resolve(e); });
                        })
                        var roles_id = [], task_type_id = []
                        if (resultRoles && resultRoles.length > 0) {
                            resultRoles.forEach(role => {
                                roles_id.push(role.role_id)
                            });
                        }
                        const _token = auth.generate({
                            id: result[0].id,
                            name: result[0].name,
                            username: result[0].username,
                            role_ids: roles_id
                        }, NoExpire)


                        sql = `update users set last_login_date=now() where username='${username}' and deleted_at is null and enabled=1`
                        executeQuery(sql, 'login', res => {

                            response({
                                status: true,
                                data: {
                                    id: result[0].id,
                                    username: result[0].username,
                                    role_ids: roles_id,
                                    roles: roles_id,
                                    token: _token

                                }
                            })

                        })

                    }
                    else response({ status: false, data: msg.userDisabled });
                }
                else response({ status: false, data: msg.invalidPassword });
            })
        } else response({ status: false, data: msg.invalidLogin });
    })
}

function checkToken(req, response) {
    var token = req.body.token
    auth.verify(token, req, res => {
    })
    response({ status: true })
}

module.exports = { createToken, checkToken }
