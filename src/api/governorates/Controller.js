
var model = require('./Model')
var msg = require('../../helper/messages')
var auth = require('../../jwt/auth')
const { validateCreationDateFrom } = require('../../helper/common')

var getRes = require('../../helper/common').getResponse

function _insert(req, response) {
    auth.verify(req?.headers['jwt'], req, data => {

        if (data) {
            
                let enabled = 1
                try {

                    enabled = parseInt(req?.body?.enabled)
                    if ((enabled !== 1 && enabled !== 0)) {
                        enabled = 1
                    }

                } catch (error) {

                    enabled = 1
                }



                var item = {
                    name: req?.body?.name ? req?.body?.name : null,
                    code: req?.body?.code ? req?.body?.code : null,
                    enabled: enabled,
                }
                //check if username existed
                let viewDisabledItems = data?.role_ids?.length && data?.role_ids?.includes(56)
                model._checkCodeOrIdExisting(item?.code, null, viewDisabledItems, async existed => {
                    if (!existed) {
                        model._insert(data?.id, {
                            ...item,
                        }, result => {
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
                    else response({ status: false, data: { message: msg?.itemAlreadyExist } });
                })
            } else response({ status: false, data: { message: msg.failedInsert } })
    })
}

function _update(req, response) {
    // check autherization
    auth.verify(req?.headers['jwt'], req, data => {
        if (data) {
            // check if user has update role or user updating own data
            var haveRole = (data?.role_ids?.length && data?.role_ids?.includes(56))
                || (!(data?.role_ids?.length && data?.role_ids?.includes(56)) && req?.params.id == data.created_by_id);

            if (haveRole ) {
                let viewDisabledItems = data?.role_ids?.length && data?.role_ids?.includes(56)
                model._checkCodeOrIdExisting(null, req.params.id, viewDisabledItems, async existed => {
                    if (existed) {
                        

                        model._update(data, viewDisabledItems, {
                            ...req,
                            body:{
                                ...req?.body,
                            }
                        }, result => {
                            if (result && !result?.errorMessage) {

                                if (result.changedRows > 0) response(getRes(true, null, msg.updated))
                                else response(getRes(true, null, msg.noThingUpdate))
                            }
                            else response(getRes(false, null, result?.errorMessage?result?.errorMessage:msg.error))
                        })
                    } else response(getRes(false, null, msg.itemNotFound))
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
           
                let viewDisabledItems = data?.role_ids?.length && data?.role_ids?.includes(56)
                model._get(id, viewDisabledItems, result => {
                    response({ status: result?.status, data: result.result })
                })



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
            var code = req?.query?.code ? req?.query?.code : null
           
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
                code: code,
                enabled: enabled,
                creation_date_to: creation_date_to,
                creation_date_from: creation_date_from,
                show_list: show_list,
            }

                let viewDisabledItems = data?.role_ids?.length && data?.role_ids?.includes(56)
                model._gets(searchParam, viewDisabledItems, result => {
                    response({ status: result?.status, data: result.result })
                })

            


        }
        else if (!data) response({ status: false, data: { message: msg.invalidToken } })
        else response({ status: false, data: { message: msg.error } })
    })
}


function _delete(req, response) {
    auth.verify(req.headers['jwt'], req, data => {
        if (data) {

            if (data?.role_ids?.length && data?.role_ids?.includes(56)  ) {
                model._delete(data, req, result => {
                    if (result && result.affectedRows) response(getRes(true, { message: msg.deleted }))
                    else response(getRes(false, result))
                })
            } else response(getRes(false, msg.noPermission))
        } else response(getRes(false, msg.invalidToken))
    })
}



async function _import(request, response) {
    auth.verify(request?.headers['jwt'], request, data => {

        if (data) {
            
                model._import(data, request, result => {
                    if (result && result?.message) response(getRes(result?.success, { message: result?.message, data: result }))
                    else response(getRes(false, { message: msg.error }))
                })
          

        } else response(getRes(false, { message: msg.invalidToken }))
    })
}

function _download(req, response) {
    auth.verify(req.headers['jwt'], req, data => {
        if (data) {

            var user_id = data?.id
            var fileName = req?.query?.fileName ? req?.query?.fileName : ""

            const file_user_id = fileName?.split("user_id");
           
            const excel_file_path = __dirname + '/../../../dist/uploads/temp/excel_reports/' + fileName + '.xlsx';

            response(getRes(true, excel_file_path))
        

        } else response(getRes(false, null, msg.invalidToken))
    })
}

module.exports = {
    _insert,
    _update,
    _get,
    _gets,
    _delete,
    _import,
    _download
}
