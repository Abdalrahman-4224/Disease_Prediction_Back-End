var executeQuery = require('../../helper/common').executeQuery
var getDateTime = require('../../helper/common').getDateTime

const messages = require('../../helper/messages')
const { readExcel } = require('../../helper/common')
const { mysqlConnection } = require('../../config/db');

function check(id, existed) {
    var sql = `select id from doctors where deleted_at is NULL and id = ${id} `
    executeQuery(sql, 'check', result => {
        if (result.length > 0) existed(true);
        else existed(false)
    })
}

function _insert(creator_id, recordData, callback) {
    try {


        var sql = `INSERT INTO doctors ( name, code, enabled, created_at, created_by_id)
                values ("${recordData?.name}", ${recordData?.code ? "'" + recordData?.code + "'" : 'null'},${recordData?.enabled}, "${getDateTime()}",${creator_id});
                `

        executeQuery(sql, 'insertItem', async result => {

            if (result?.insertId > 0) {

            }

            callback(result)
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



    var sql = `update doctors set `

    var activityNote = ""
    var name = ""
    if (req?.body?.name?.length > 0 && (itemWithOldData?.name != req?.body?.name)) {
        name = req?.body?.name
        activityNote += ` تم تغيير الاسم من ${itemWithOldData?.name} الى ${name}`
        sql += ` name = '${name?.replace(/'/g, "")}' ,`
    }
    var code = ""
    if (req?.body?.code?.length > 0 && (itemWithOldData?.code != req?.body?.code)) {
        const codeExistInAnotherRecord = await new Promise((resolve) => {
            _checkCodeOrIdExisting(req?.body?.code, null, viewDisabledItems, (e) => { resolve(e); });
        })
        if (codeExistInAnotherRecord) {
            callback({ errorMessage: "Code exists in another record" })
            return;
        }

        code = req?.body?.code
        activityNote += ` تم تغيير الكود من ${itemWithOldData?.code} الى ${code}`
        sql += ` code = '${code?.replace(/'/g, "")}' ,`
    }


    try {
        const enabled = parseInt(req?.body?.enabled);
        if ((enabled === 1 || enabled === 0) && (parseInt(itemWithOldData?.enabled) != enabled)) {

            activityNote += ` تم تغيير حالة التفعيل  من ${itemWithOldData?.enabled} الى ${enabled}`
            sql += ` enabled = ${enabled} ,`
        }
    } catch (error) {
        console.log("error in update doctor", error);
    }


    if (activityNote == "") {
        callback({ errorMessage: "Nothing changed compared to the existing data" })
        return;
    }

    sql += ` updated_by_id=${data?.id}, updated_at="${getDateTime()}" where id=${req?.params?.id}`
    executeQuery(sql, 'updateDoctor', async result => {

        if (result?.changedRows > 0) {

            callback(result)
        }
        else {
            callback(false)
        }



    })
}



function _checkCodeOrIdExisting(code, id, viewDisabledItems, existed) {
    var sql
    if (code) sql = `select code from doctors where code = "${code}" `
    else sql = `select id from doctors where id = ${id} `
    if (!viewDisabledItems) sql += ` and enabled= 1`
    sql += ` and deleted_at IS NULL`
    executeQuery(sql, 'checkCodeOrIdExisting', result => {
        if (result.length > 0) existed(true);
        else existed(false)
    })
}



function _get(id, viewDisabledItems, callback) {
    const columns = '`id`, `name`, `code`,`enabled`, `created_by_id`, `created_at`, `deleted_at`, `deleted_by_id`, `updated_at`, `updated_by_id` '
    var sql = `SELECT ${columns} from doctors  where deleted_at is null  and id = ${id}`
    if (!viewDisabledItems) sql += ` and enabled= 1`

    executeQuery(sql, 'getDoctor', result => {
        if (result?.length > 0) {
            callback({ status: true, result: result[0] })
        }
        else {
            callback({ status: false, result: messages.itemNotFound })
        }

    })
}
async function _gets(searchParam, viewDisabledItems, callback) {
    let columns = '*'
    const checkShowList = parseInt(searchParam?.show_list);
    if (checkShowList === 1) {
        columns = 'id,  name, code '
    }
    var sql = `SELECT ${columns} from doctors  `
    var sqlFilters = ` where doctors.deleted_at is null  `
    if (!viewDisabledItems) sqlFilters += ` and doctors.enabled= 1`

    if (searchParam?.name) {
        sqlFilters += ` and doctors.name LIKE '%${searchParam?.name}%' `
    }
    if (searchParam?.code) {
        sqlFilters += ` and doctors.code LIKE '%${searchParam?.code}%' `
    }

    const checkEnabled = parseInt(searchParam?.enabled);
    if (checkEnabled === 1 || checkEnabled === 0) {
        sqlFilters += ` and doctors.enabled = ${checkEnabled} `
    }



    if (searchParam?.creation_date_from) {
        sqlFilters += ` and doctors.created_at >=  '${searchParam?.creation_date_from}' `
    }
    if (searchParam?.creation_date_to) {
        sqlFilters += ` and doctors.created_at <=  '${searchParam?.creation_date_to}' `
    }

    let total_records = 0
    if (searchParam?.page && searchParam?.page_size) {

        let resultTotal = await new Promise((resolve) => {
            executeQuery("SELECT count(*) as total_records from doctors  " + sqlFilters, 'check', (e) => { resolve(e); });
        })
        if (resultTotal && resultTotal.length > 0 && resultTotal[0]?.total_records) {
            total_records = resultTotal[0]?.total_records
        }


        sqlFilters += ' ORDER BY doctors.`created_at` DESC LIMIT ' + ((searchParam?.page - 1) * searchParam?.page_size) + ',' + searchParam?.page_size
    }
    sql += sqlFilters


    executeQuery(sql, 'getDoctor', result => {
        if (result) {
            if (searchParam?.page && searchParam?.page_size) {
                callback({ status: true, result: { total_records: total_records, data: result } })
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


            var sql = `update doctors set deleted_at = "${getDateTime()}", deleted_by_id = "${data?.id}" where id= ${id}`
            executeQuery(sql, 'delete', async result => {

                callback(result)
            })
        } else callback(messages.itemNotFound)//'id not existed')
    })
}


const _import = async (data, req, callback) => {

    var user_id = data?.id,
        files = req?.files
    if (files?.length == 0) {
        callback({ status: false, message: "الملف غير موجود" })
        return
    }

    const excelFile = files[0]

    const filePath = excelFile.path;
    const dataToImport = [];
    let header = null;

    try {


        const dataToImport = await readExcel(filePath);

        let hasError = false;
        let importResult = []

        let insertQuery = `INSERT INTO doctors(
            name, 
            code, 
            enabled,
            created_at,
            created_by_id
            ) 
        VALUES`
        for (let index = 1; index < dataToImport?.length; index++) {

            const row = dataToImport[index];

            let query = `SELECT 
                id from doctors where name = '${row[0]}' or code = '${row[1]}'
            `

            let resultExistAllData = await new Promise((resolve) => {
                executeQuery(query, 'check', (e) => { resolve(e); });
            })
            if (resultExistAllData && resultExistAllData.length > 0 && resultExistAllData[0]) {

                let message = "";
                if (resultExistAllData[0].id > 0) {
                    message += `${index + 1} - البيانات موجوده مسبقا `;
                    hasError = true;

                }

                if (hasError) {
                    importResult.push({

                        name: row[0],
                        code: row[1],
                        note: message
                    })
                    continue;
                }
            }

            const insertQueryRow = `(
                    ${row[0] ? mysqlConnection.escape(row[0]) : 'null'},
                    ${row[1] ? mysqlConnection.escape(row[1]) : 'null'},
                    
                    1, 
                    "${getDateTime()}",
                    ${user_id})
                    `
            insertQuery += insertQueryRow
            if (index == dataToImport?.length - 1) {
                insertQuery += `; `
            }
            else {
                insertQuery += `, `
            }
            importResult.push({

                name: row[0],
                code: row[1],
                note: ''
            })



        }


        let errorInInsert = false
        if (!hasError) {
            let resultbulkInsert = await new Promise((resolve) => {
                executeQuery(insertQuery, 'bulkInsert', (e) => { resolve(e); });
            })


            if (!(resultbulkInsert && resultbulkInsert?.affectedRows == (dataToImport?.length - 1))) {

                importResult = importResult.map(item => ({
                    ...item,
                    note: 'لايوجد خلل في صيغة البيانات لكن حصل خطا في حفظ البيانات',
                }));
                errorInInsert = true
            }

        }

        let response = {

            message: errorInInsert ? "لايوجد خطا في البيانات لكن حصل خطا في حفظ البيانات" : (hasError ? "يوجد خطا في البيانات الرجاء التحقق من التقرير" : "تم حفظ البيانات"),
            success: !errorInInsert && !hasError,
        };
        callback(response);
        return;


    }
    catch (e) {
        callback({
            result: null,
            message: e?.message,
            success: false,
        });
    }

}


module.exports = {
    _insert,
    _update,
    _checkCodeOrIdExisting,
    _delete,
    _get,
    _gets,
    _import

}