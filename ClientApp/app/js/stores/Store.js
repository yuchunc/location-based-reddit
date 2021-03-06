/**
 * Store
 */

//========================================================================
//
// IMPORT

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var actions = require('../actions/ActionLib');

var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter; // 取得一個 pub/sub 廣播器

//========================================================================
//
// Public API

// 等同於 PinStore extends EventEmitter
// 從此取得廣播的能力
// 由於將來會返還 PinStore 出去，因此下面寫的會全變為 public methods
var Store = {};

// 所有 todo 資料
var arrPins = [];

// 目前選取的 todo 項目
var selectedItem = null;

/**
 * 建立 Store class，並且繼承 EventEMitter 以擁有廣播功能
 */
objectAssign( Store, EventEmitter.prototype, {

    /**
     * Public API
     * 供外界取得 store 內部資料
     */
    getPins: function(){
        return arrPins;
    },

    /**
     *
     */
    getSelectedItem: function(){
        return selectedItem;
    },

    //
    noop: function(){}
});

//========================================================================
//
// event handlers

Store.dispatchToken = AppDispatcher.register( function eventHandlers(evt){

    // evt .action 就是 view 當時廣播出來的整包物件
    // 它內含 actionType
    var action = evt.action;

    switch (action.actionType) {

        /**
         *
         */
        case AppConstants.APP_LOAD:

            arrPins = action.items;

            console.log( 'Store 收到資料: ', arrPins );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.APP_CREATE:

            arrPins.push( action.item );

            console.log( 'Store 新增: ', arrPins );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.APP_REMOVE:

            arrPins = arrPins.filter( function(item){
                return item != action.item;
            })

            console.log( 'Store 刪完: ', arrPins );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.APP_UPDATE:

            console.log( 'Store 更新: ', arrPins );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        /**
         *
         */
        case AppConstants.APP_SELECT:

            console.log( 'Store 選取: ', action.item );

            // 選取同樣的 item 就不用處理下去了
            if( selectedItem != action.item ){
                selectedItem = action.item;
                Store.emit( AppConstants.CHANGE_EVENT );
            }


            break;



        default:
            //
    }

})

//
module.exports = Store;
