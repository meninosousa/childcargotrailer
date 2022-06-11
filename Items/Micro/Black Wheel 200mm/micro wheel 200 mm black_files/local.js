define(['underscore','uiRegistry','mageUtils','uiEvents'],function(_,registry,utils,EventsBus){'use strict';var root='appData',localStorage,hasSupport,storage;hasSupport=(function(){var key='_storageSupported';try{localStorage=window.localStorage;localStorage.setItem(key,'true');if(localStorage.getItem(key)==='true'){localStorage.removeItem(key);return true;}
return false;}catch(e){return false;}})();if(!hasSupport){localStorage={_data:{},setItem:function(key,value){this._data[key]=value+'';},getItem:function(key){return this._data[key];},removeItem:function(key){delete this._data[key];},clear:function(){this._data={};}};}
function getRoot(){var data=localStorage.getItem(root),result={};if(!_.isNull(data)&&typeof data!='undefined'){result=JSON.parse(data);}
return result;}
function setRoot(data){localStorage.setItem(root,JSON.stringify(data));}
storage=_.extend({get:function(path){var data=getRoot();return utils.nested(data,path);},set:function(path,value){var data=getRoot();utils.nested(data,path,value);setRoot(data);},remove:function(path){var data=getRoot();utils.nestedRemove(data,path);setRoot(data);}},EventsBus);registry.set('localStorage',storage);return storage;});