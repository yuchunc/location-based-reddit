/**
 *
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Promise = require('es6-promise').Promise;

// 就是個單純的 hash table
// 因此下面所有指令皆可視為 Action static method
var ActionLib = {

    /**
     * ok
     *
     * app 啟動後，第一次載入資料
     */
    load: function(){

        $.ajax('http://localhost:3000/api/pins/',
        {

            type:"GET",

            //
            success: function(data, status, jqxhr){

                // console.log( 'xhr 取回資料: ', data );

                AppDispatcher.handleViewAction({

                    // type 是為了方便將來所有 Store 內部判斷是否要處理這個 action
                    actionType: AppConstants.APP_LOAD,

                    // 這裏是真正要傳出去的值
                    items: data
                });

            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr錯誤: ', xhr.responseText );
                action.revoke(item.id);
            }

        })
    },

    /**
     * create
     */
    createPin: function( item ) {

        // 1. 廣播給 store 知道去 optimistic 更新 view
        AppDispatcher.handleViewAction({

            // type 是為了方便將來所有 Store 內部判斷是否要處理這個 action
            actionType: AppConstants.APP_CREATE,

            // 這裏是真正要傳出去的值
            item: item
        });


        $.ajax('http://localhost:3000/api/pins/',
        {

            type:"POST",

            data: item,

            //
            success: function(data, status, jqxhr){

                // console.log( '新增資料結果: ', data, ' >item = ', item );

                // 將 server 生成的 uid 更新到早先建立的物件，之後資料才會一致
                item.id = data.id;
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },

    /**
     *
     */
    selectPin: function( item ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.APP_SELECT,
            item: item
        });

    },

    /**
     *
     */
    removePin: function( item ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.APP_REMOVE,
            item: item
        });

        $.ajax('http://localhost:3000/api/pins/' + item.uid,
        {

            type:"DELETE",

            //
            success: function(data, status, jqxhr){
                console.log( '刪除資料結果: ', data );
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },

    /**
     *
     */
    updatePin: function( item ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.APP_UPDATE,
            item: item
        });

        $.ajax('http://localhost:3000/api/pins/',
        {

            type:"PUT",

            data: item,

            //
            success: function(data, status, jqxhr){

                // console.log( '編輯資料結果: ', data );

                // 將 server 生成的 uid 更新到早先建立的物件，之後資料才會一致
                item.id = data.id;
            },

            //
            error: function( xhr, status, errText ){
                console.log( 'xhr 錯誤: ', xhr.responseText );
            }

        })

    },

    // dummy
    noop: function(){}
};

module.exports = ActionLib;
