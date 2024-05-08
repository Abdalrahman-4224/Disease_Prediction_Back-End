
var model = require('./Model')
var msg = require('../../helper/messages')
var auth = require('../../jwt/auth')
const { validateCreationDateFrom } = require('../../helper/common')

var getRes = require('../../helper/common').getResponse

function _insert(req, response) {

    var user = {
        username: req?.body?.username,
        password: req?.body?.password,
        name: req?.body?.name
    }
    //check if username existed
    model._checkUsernameOrIdExisting(user?.username, null, existed => {
        if (!existed) {

            model._insert(1, user, result => {
                if (result?.insertId > 0) response({
                    status: true,
                    data: {
                        message: msg?.inserted,
                        id: result?.insertId > 0 ? result?.insertId : 0
                    }
                });
                else response({ status: false, data: { message: msg.error } });
            })

        }
        else response({ status: false, data: { message: msg.userExist } });
    })

}

function _update(req, response) {
    // check autherization
    auth.verify(req?.headers['jwt'], req, data => {
        if (data) {
            // check if user has update role or user updating own data
            var haveRole = (data?.role_ids?.length && data?.role_ids?.includes(56))
                || (!(data?.role_ids?.length && data?.role_ids?.includes(56)) && req?.params.id == data.id);

            if (haveRole) {
                let viewDisabledItems = data?.role_ids?.length && data?.role_ids?.includes(56)
                model._checkUsernameOrIdExisting(null, req.params.id, existed => {
                    if (existed) {
                        model._update(data, viewDisabledItems, req, result => {
                            if (result) {

                                if (result.changedRows > 0) response(getRes(true, null, msg.updated))
                                else response(getRes(true, null, msg.noThingUpdate))
                            }
                            else response(getRes(false, null, msg.error))
                        })
                    } else response(getRes(false, null, msg.userNotFound))
                })
            }
            else response(getRes(false, null, msg.unauthorized))
        } else response({ status: false, data: { message: msg.invalidToken } })
    })
}


function _get(req, response) {

    auth.verify(req.headers['jwt'], req, data => {

        if (data) {
            var id = req?.params?.id
            if (id > 0) {

                model._get(id, viewDisabledUsers, result => {
                    if (data?.role_ids?.length && data?.role_ids?.includes(56) || data?.id == id) {
                        response({ status: result?.status, data: result.result })
                    }
                    else {
                        response(getRes(false, null, msg.unauthorized))
                    }
                })
            }
            else response({ status: false, data: { message: msg.error } })




        }
        else if (!data) response({ status: false, data: { message: msg.invalidToken } })
        else response({ status: false, data: { message: msg.error } })
    })
}

function _gets(req, response) {
    auth.verify(req.headers['jwt'], req, data => {
        if (data) {

            var page = req?.query?.page ? req?.query?.page : 0
            var page_size = req?.query?.page_size ? req?.query?.page_size : 0
            var name = req?.query?.name ? req?.query?.name : null
            
            var phone = req?.query?.phone ? req?.query?.phone : null

            var creation_date_from = req?.query?.creation_date_from && validateCreationDateFrom(req?.query?.creation_date_from) ? req?.query?.creation_date_from + ' 00:00:00' : null
            var creation_date_to = req?.query?.creation_date_to && validateCreationDateFrom(req?.query?.creation_date_to) ? req?.query?.creation_date_to + ' 23:59:59' : null
            var enabled = null
            const checkEnabled = parseInt(req?.query?.enabled);
            if (checkEnabled === 1 || checkEnabled === 0) {
                enabled = checkEnabled
            }

            var show_list = null
            const checkShowList = parseInt(req?.query?.show_list);
            if (checkShowList === 1 || checkShowList === 0) {
                show_list = checkShowList
            }
            const searchParam = {
                page: page,
                page_size: page_size,
                name: name,
                phone: phone,

                enabled: enabled,
                creation_date_to: creation_date_to,
                creation_date_from: creation_date_from,
                show_list: show_list
            }

            if (data?.role_ids?.length && data?.role_ids?.includes(56)) {
                let viewDisabledUsers = data?.role_ids?.length && data?.role_ids?.includes(56)
                model._gets(searchParam, viewDisabledUsers, result => {
                    response({ status: result?.status, data: result.result })
                })

            }
            else response(getRes(false, null, msg.unauthorized))


        }
        else if (!data) response({ status: false, data: { message: msg.invalidToken } })
        else response({ status: false, data: { message: msg.error } })
    })
}


function _delete(req, response) {
    auth.verify(req.headers['jwt'], req, data => {
        if (data) {

            if (data?.role_ids?.length && data?.role_ids?.includes(56)) {
                model._delete(data, req, result => {
                    if (result && result.affectedRows) response(getRes(true, { message: msg.deleted }))
                    else response(getRes(false, result))
                })
            } else response(getRes(false, msg.noPermission))
        } else response(getRes(false, msg.invalidToken))
    })
}

function _updateRoles(req, response) {
    // check autherization
    auth.verify(req?.headers['jwt'], req, data => {
        if (data) {
            // check if user has update role or user updating own data
            var haveRole = (data?.role_ids?.length && data?.role_ids?.includes(56))
            if (haveRole) {
                let viewDisabledItems = data?.role_ids?.length && data?.role_ids?.includes(56)
                model._checkUsernameOrIdExisting(null, req?.params?.id, existed => {
                    if (existed) {
                        model._updateRoles(data, viewDisabledItems, req, result => {
                            if (result) {

                                if (result?.changedRows > 0) response(getRes(true, null, msg.updated))
                                else response(getRes(true, null, msg.noThingUpdate))
                            }
                            else response(getRes(false, null, msg.error))
                        })
                    } else response(getRes(false, null, msg.userNotFound))
                })
            }
            else response(getRes(false, null, msg.unauthorized))
        } else response({ status: false, data: { message: msg.invalidToken } })
    })
}


module.exports = {
    _insert,
    _update,
    _get,
    _gets,
    _delete,
    _updateRoles
}
