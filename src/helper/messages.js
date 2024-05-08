module.exports = 
msg = {
        itemAlreadyExist:"يوجد عنصر مشابه",
        itemNotFound:"العنصر غير موجود",
        hasRelationCantDelete:"لايمكن حذف العنصر لارتباطه ببيانات اخرى",
        inserted: 'تمت الاضافة بنجاح',
        updated: 'تم التعديل بنجاح',
        deleted: 'تم المسح بنجاح',
        selected: 'Selected successfully',
        passwordUpdated: 'password updated successfully',
        monitorAssigned: 'user assigned as monitor successfully',
        taskAssigned: 'users assigned successfully',
        alreadyAssigned:'user already assigned to same task',
        notAssigned:'user not assigned to this task',
        noThingUpdate: 'لايوجد تغيير في المعلومات الموجوده مسبقا، لم يتم التحديث',
        noThingAdded: 'There is nothing added',
        statusChanged: 'status changed',
        notificationRead: 'notification viewed',
        notificationCleared: 'notifications cleared',
        noUserReplacement: 'You didn\'t select a resource replacment',
        

        invalidToken: {code: 1, text:'invalid token'},
        error: {code: 2, text:'حصل خطأ يرجى الاتصال بالدعم الفني'},
        
        invalidLogin: {code: 3, text:'خطا في اسم المستخدم او كلمة المرور'},
        unauthorized: {code: 4, text:'لاتمتلك صلاحية'},

        userExist: {code: 5, text:'اسم المستخدم مسجل مسبقا'},
        invalidPassword: {code: 7, text:'incorrect old password'},
        userNotFound: {code: 8, text:'لايوجد مستخدم بهذه المعلومات'},
        userDisabled:{code: 9,text: 'cannot login, user disabled ' },


       
       

        routeExist: {code: 5, text:'يوجد طريق مرتبط مسبقا بمعرف وايلون'},
        failedCreateRoute: {code: 6, text:'لاتمتلك صلاحية'},
        routeNotFound: {code: 8, text:'لايوجد طريق بهذه المعلومات'},
        routeDisabled:{code: 9,text: 'الطريق غير فعال' },

        transactionExist: {code: 5, text:'يوجد مستند مرتبط مسبقا بمعرف وايلون'},
        failedCreateTransaction: {code: 6, text:'لاتمتلك صلاحية'},
        transanctionNotFound: {code: 8, text:'لايوجد مستند بهذه المعلومات'},
        transactionDisabled:{code: 9,text: 'المستند غير فعال' },

        notificationExist: {code: 5, text:'يوجد اشعار مرتبط مسبقا بمعرف وايلون'},
        failedCreateNotification: {code: 6, text:'لاتمتلك صلاحية'},
        notificationNotFound: {code: 8, text:'لايوجد اشعار بهذه المعلومات'},
        notificationDisabled:{code: 9,text: 'الاشعار غير فعال' },
        
        depIdNotExist: {code: 10, text:'Department id not found'},
        failedCreateDep: {code: 11, text:'you don\'t have permission to create department'},
        noPermission: {code: 12, text:'لاتمتلك صلاحية'},
        failedUpdateDep: {code: 13, text:'you don\'t have permission to update department'},
        
        failedCreate: {code: 14, text:'you don\'t have permission to complete '},
        taskNotExist: {code: 15, text:'task does not existed'},
        fileNotExist:{code:16,text:'file does not existed'},
        wrongStatus: {code:17,text:'not allowed, wrong status'},
        onlyPics:{code:18,text:'only .png or .jpg files are allowed!'},
        onlyFiles:{code:19,text:'only .png, .jpg, .xlsx or .pdf files are allowed!'},
        hasSubmission:{code:20,text:'The mission has open sub mission'},
        sameStatus:{code:21,text:'The mission has already the same status '},
        noSubMission:{code:22,text:'The mission does not have a submission yet '},
        headerValuesNotFound: {code: 23, text:'Headers values not found'},
        loginOrRegister: {code: 23, text:'Error in login'},
        failedInsert: 'فشلت عملية الانشاء',
        failedUpdate: 'فشلت عملية التعديل',
        failedDelete: 'فشلت عملية المسح',
        failedSelect: 'فشلت عملية جلب البيانات',
        statusChangedButFailedSendEmail:'Status changed but Failed to send an email to the customer'
    }   