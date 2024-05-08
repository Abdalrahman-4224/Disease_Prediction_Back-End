var activity = require('../../helper/activitiesMsg')
var executeQuery = require('../../helper/common').executeQuery
var getDateTime = require('../../helper/common').getDateTime
const bcrypt = require('bcrypt')
const saltRounds = 10

const messages = require('../../helper/messages')


function check(id, existed) {
    var sql = `select id from users where deleted_at is NULL and id = ${id} `
    executeQuery(sql, 'check', result => {
        if (result.length > 0) existed(true);
        else existed(false)
    })
}

function _insert(creator_id, userDetails, callback) {
    try {
        //throw TypeError;
        bcrypt.hash(userDetails.password, saltRounds).then(function (hashedPassword) {

            let userDetailsWIthOutPassword = {
                ...userDetails,
                password: ""
            }
            var sql = `insert into users (username, password, name,  created_at, created_by_id) 
                values ("${userDetails?.username}", "${hashedPassword}", "${userDetails?.name}",  "${getDateTime()}",${creator_id});
                `

            executeQuery(sql, 'insertUser', async result => {
                if (result?.insertId > 0) {
                    let userRolesResult = await new Promise((resolve) => {
                        
                            let userRoleSQL = `INSERT INTO role_user
                        (id, user_id, role_id) 
                        VALUES 
                        (NULL,  ${result?.insertId}, 56);`
                            executeQuery(userRoleSQL, 'insertUserRoles', (e) => { resolve(e); });
                        

                    })

                   
                }

                callback(result)
            })
        })
    } catch (error) {
        callback(false)
    }
}

async function _update(data, viewDisabledItems, req, callback) {


    let itemWithOldData = null
    if (req?.params?.id) {
        const itemWithOldDataResult = await new Promise((resolve) => {
            _get(req?.params?.id, viewDisabledItems, (e) => { resolve(e); });
        });
        if (itemWithOldDataResult?.status) {
            itemWithOldData = itemWithOldDataResult?.result
        }
        else {
            callback(false)
        }
    }
    else {
        callback(false)
    }

    let password = null

    var sql = `update users set `

    var activityNote = ""
    var name = ""
    if (req?.body?.name?.length > 0 && (itemWithOldData?.name != req?.body?.name)) {
        name = req?.body?.name
        activityNote += ` تم تغيير الاسم من ${itemWithOldData?.name} الى ${name}`
        sql += ` name = '${name?.replace(/'/g, "")}' ,`
    }
    var phone = ""
    if (req?.body?.phone?.length > 0 && (itemWithOldData?.phone != req?.body?.phone)) {
        phone = req?.body?.phone
        activityNote += ` تم تغيير الهاتف من ${itemWithOldData?.phone} الى ${phone}`
        sql += ` phone = '${phone?.replace(/'/g, "")}' ,`
    }
    try {
        const enabled = parseInt(req?.body?.enabled);
        if ((enabled === 1 || enabled === 0) && (parseInt(itemWithOldData?.enabled) != enabled)) {

            activityNote += ` تم تغيير الحالة  من ${itemWithOldData?.enabled} الى ${enabled}`
            sql += ` enabled = ${enabled} ,`
        }
    } catch (error) {
        console.log("error in update user", error);
    }

    if (req?.body?.password) {
        password = bcrypt.hashSync(req?.body?.password, saltRounds)
        if (password) {
            activityNote += " تم تغيير كلمة المرور "

            sql += ` password= '${password}',`
        }

    }
    if (activityNote == "") {
        callback({ changedRows: 0 })
        return;
    }

    sql += ` updated_by_id=${data?.id}, updated_at="${getDateTime()}" where id=${req?.params?.id}`
    executeQuery(sql, 'updateUserDetails', async result => {
        if (result?.changedRows > 0) {
            
        }
        callback(result)
    })
}

function _checkUsernameOrIdExisting(username, id, existed) {
    var sql
    if (username) sql = `select username from users where username = "${username}" `
    else sql = `select id from users where id = ${id} `
    executeQuery(sql, 'checkUsernameOrIdExisting', result => {
        if (result.length > 0) existed(true);
        else existed(false)
    })
}

function _get(id, viewDisabledUsers, callback) {
    const columns = '*'
    var sql = `SELECT ${columns} from users  where deleted_at is null  and id = ${id}`
    if (!viewDisabledUsers) sql += ` and enabled= 1`


    executeQuery(sql, 'getUser', result => {
        if (result?.length > 0) {

            const userId = result[0]?.id
            var sqlRoles = `SELECT role_id FROM role_user WHERE user_id= ${userId} `

            executeQuery(sqlRoles, 'getUserRoles', resultRoles => {
                let user = {
                    ...result[0],
                    roles: []
                }
                if (resultRoles?.length > 0) {
                    user = {
                        ...user,
                        roles: (resultRoles?.length && resultRoles[0]) ? resultRoles?.map(role => role?.role_id) : []
                    }

                }
                callback({
                    status: true, result: user
                })
            })
        }
        else {
            callback({ status: false, result: messages.itemNotFound })
        }

    })
}

async function _gets(searchParam, viewDisabledUsers, callback) {
    let columns = ` 
    users.id, 
    users.username, 
    users.name, 
    users.enabled, 
    users.email, 
    users.phone, 
    users.birthdate, 
    users.image_path, 
    users.last_login_date, 
    users.created_by_id, 
    users.created_at, 
    users.updated_by_id, 
    users.updated_at, 
    users.deleted_by_id, 
    users.deleted_at,
    
    DATE_FORMAT(users.last_login_date, '%Y-%m-%d %H:%i:%s') AS formatted_last_login_date
    `
    const checkShowList = parseInt(searchParam?.show_list);
    if (checkShowList === 1) {
        columns = '`id`,   `name`  '
    }
    var sql = `SELECT ${columns} from users  `
    var sqlFilters = ` where deleted_at is null `
    if (!viewDisabledUsers) sqlFilters += ` and enabled= 1`

    if (searchParam?.name) {
        sqlFilters += ` and name LIKE '%${searchParam?.name}%' `
    }
    
    if (searchParam?.phone) {
        sqlFilters += ` and phone LIKE '%${searchParam?.phone}%' `
    }
  
    const checkEnabled = parseInt(searchParam?.enabled);
    if (checkEnabled === 1 || checkEnabled === 0) {
        sqlFilters += ` and enabled = ${checkEnabled} `
    }
   



    if (searchParam?.creation_date_from) {
        sqlFilters += ` and created_at >=  '${searchParam?.creation_date_from}' `
    }
    if (searchParam?.creation_date_to) {
        sqlFilters += ` and created_at <=  '${searchParam?.creation_date_to}' `
    }

    let total_records = 0
    if (searchParam?.page && searchParam?.page_size) {

        let resultTotal = await new Promise((resolve) => {
            executeQuery("select count(*) as total_records FROM users " + sqlFilters, 'check', (e) => { resolve(e); });
        })
        if (resultTotal && resultTotal.length > 0 && resultTotal[0]?.total_records) {
            total_records = resultTotal[0]?.total_records
        }
        sqlFilters += ' ORDER BY `created_at` DESC LIMIT ' + ((searchParam?.page - 1) * searchParam?.page_size) + ',' + searchParam?.page_size
    }
    sql += sqlFilters

    executeQuery(sql, 'getUsers', async result => {
        if (result) {
            if (searchParam?.page && searchParam?.page_size) {
                let users = []
                for (let i = 0; i < result?.length; i++) {
                    let user = {
                        ...result[i],
                        roles: []
                    }
                    const userId = user?.id
                    var sqlRoles = `SELECT role_id FROM role_user WHERE user_id= ${userId} `
                    let resultRoles = await new Promise((resolve) => {
                        executeQuery(sqlRoles, 'getUserRoles', (e) => { resolve(e); });
                    })
                    if (resultRoles?.length > 0) {
                        user = {
                            ...user,
                            roles: resultRoles?.map(role => role?.role_id)
                        }
                    }
                    else {
                        user = {
                            ...user,
                            roles: []
                        }
                    }

                  
                  
                    users?.push(user)

                }
                callback({ status: true, result: { total_records: total_records, data: users } })
            }
            else {
                callback({ status: true, result: result })
            }

        }
        else {
            callback({ status: false, result: messages.itemNotFound })
        }

    })
}

function _delete(data, req, callback) {
    var id = req?.params?.id
    check(id, async existed => {
        if (existed) {

            let sqlCheck = "SELECT id FROM transactions  WHERE `created_by_id` = " + id + " limit 1"
            let result = await new Promise((resolve) => {
                executeQuery(sqlCheck, 'check', (e) => { resolve(e); });
            })

            if (result?.length > 0) {

                callback(messages.hasRelationCantDelete)//'Cannot be deleted because it has related transactions')
                return
            }

            var sql = `update users set deleted_at = "${getDateTime()}", deleted_by_id = "${data?.id}" where id= ${id}`
            executeQuery(sql, 'delete', async result => {
                
                callback(result)
            })
        } else callback(messages.itemNotFound)//'id not existed')
    })
}

function _getByUsername(username, viewDisabledUsers, callback) {
    var sql = `SELECT a.*,a.last_login_date AS last_login from users a  where a.deleted_at is null  and a.username = '${username}' `
    if (!viewDisabledUsers) sql += ` and enabled= 1`

    executeQuery(sql, 'getUserByUsername', result => {
        if (result?.length > 0) {
            const userId = result[0]?.id
            var sqlRoles = `SELECT role_id FROM role_user WHERE user_id= ${userId} `

            executeQuery(sqlRoles, 'getUserRoles', resultRoles => {
                let user = {
                    ...result[0],
                    roles: []
                }
                if (resultRoles?.length > 0) {
                    user = {
                        ...user,
                        roles: (resultRoles?.length && resultRoles[0]) ? resultRoles?.map(role => role?.role_id) : []
                    }

                }
                callback({
                    status: true, result: user
                })
            })

        }
        else {
            callback({ status: false, result: messages.itemNotFound })
            return
        }
    })
}




async function _updateRoles(data, viewDisabledItems, req, callback) {


    let itemWithOldData = null
    if (!req?.body?.role_ids?.length > 0) {
        console.log("no roles sent");
        callback(false)
        return
    }
    if (req?.params?.id) {
        let sqlOldRoles = "SELECT `role_id` FROM `role_user` WHERE `user_id`=" + req?.params?.id
        const itemWithOldDataResult = await new Promise((resolve) => {
            executeQuery(sqlOldRoles, 'updateUserDetails', (e) => { resolve(e); });
        });

        if (itemWithOldDataResult) {
            itemWithOldData = itemWithOldDataResult?.length ? itemWithOldDataResult?.map(item => item?.role_id) : []
        }
        else {
            console.log("error in selecting user");
            callback(false)
            return
        }
    }
    else {
        console.log("error : no user id sent");
        callback(false)
        return
    }

    if (itemWithOldData?.length > 0) {
        let sqlDeleteRoles = "DELETE FROM `role_user` WHERE `user_id`=" + req?.params?.id
        const deleteRolesResult = await new Promise((resolve) => {
            executeQuery(sqlDeleteRoles, 'updateUserDetails', (e) => { resolve(e); });
        });
        if (!(deleteRolesResult && (deleteRolesResult?.changedRows > 0 || deleteRolesResult?.affectedRows > 0))) {
            console.log("error in deleting old roles");
            callback(false)
            return
        }
    }

    let sql = " INSERT INTO `role_user`(`user_id`, `role_id`) VALUES "
    for (let i = 0; i < req?.body?.role_ids?.length; i++) {
        const roleId = req?.body?.role_ids[i];
        sql += `(${req?.params?.id},${roleId})`
        if (i < req?.body?.role_ids?.length - 1) {
            sql += ","
        }
        else {
            sql += ";"
        }

    }
    let activityNote = ` تم تعديل الصلاحيات من ${JSON.stringify(itemWithOldData)} الى ${JSON.stringify(req?.role_ids)}`
    executeQuery(sql, 'updateUserRole', async result => {
        console.log(result);
        if (result?.insertId > 0) {
            
            callback({ changedRows: 1 })
        }
        else {
            callback(false)
        }


    })
}

const _updateLastLogin = async (id) => {

    let sql = `update users set last_login_date=now() where id=${id}`

    let result = await new Promise((resolve) => {
        executeQuery(sql, 'updateUserDetails', (e) => { resolve(e); });
    });

    if (result?.changedRows > 0) {
        return true
    }
    else {
        return false;
    }

}

module.exports = {
    _insert,
    _update,
    _checkUsernameOrIdExisting,
    _delete,
    _get,
    _gets,
    _getByUsername,
    _updateRoles,
    _updateLastLogin
}