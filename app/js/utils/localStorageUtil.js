define([ 'jQuery'], function ($) {

    function getLocalStorageToObject(key,localStorageProvider){
        var myData = localStorageProvider[key];
        if(myData){
            return $.parseJSON(myData);
        }else{
            return {count:0};
        }
    }

    return {
        getLocalStorageToObject:getLocalStorageToObject
    }
})
