//----------------------------------------------------------------------------------------
//  Licence
//----------------------------------------------------------------------------------------
//  orbiz Search Server Library v2
//  (c) 2012-2015 by orbiz Software GmbH. All Rights Reserved.
//  http://www.orbiz.com
//
//   Dependencies:
//    ------------------------------------------------------------------------------------
//     Backbone.js 0.5.3
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone
//    ------------------------------------------------------------------------------------
//     I18n.js cf02183cd1 
//     (c) 2011 Nando Vieira
//     I18n.js is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/fnando/i18n-js
//    ------------------------------------------------------------------------------------
//     JQuery GetURLParam 2.1
//     Copyright (c) 2006-2007 Mathias Bank (http://www.mathias-bank.de)
//     Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
//     and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
//    ------------------------------------------------------------------------------------
//     Underscore.js 1.2.3
//     (c) 2009-2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore
//    ------------------------------------------------------------------------------------
//     Json2.js
//     http://www.JSON.org/json2.js
//     2011-10-19
//     Public Domain.
//     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//     See http://www.JSON.org/js.html
//    ------------------------------------------------------------------------------------
//     log4javascript
//     (c) 2009 Tim Down.
//     Licensed under the Apache License, Version 2.0 (the "License");
//     you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.
//    ------------------------------------------------------------------------------------
//     sprintf() for JavaScript 0.6
//     Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
//     All rights reserved.
//     
//     Redistribution and use in source and binary forms, with or without
//     modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//     * Neither the name of sprintf() for JavaScript nor the
//     names of its contributors may be used to endorse or promote products
//     derived from this software without specific prior written permission.
//     
//     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
//     ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
//     WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//     DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
//     DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
//     (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
//     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
//     ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//    ------------------------------------------------------------------------------------
(function(){
var root=this;
var previousUnderscore=root._;
var breaker={};
var ArrayProto=Array.prototype,ObjProto=Object.prototype,FuncProto=Function.prototype;
var slice=ArrayProto.slice,
concat=ArrayProto.concat,
unshift=ArrayProto.unshift,
toString=ObjProto.toString,
hasOwnProperty=ObjProto.hasOwnProperty;
var
nativeForEach=ArrayProto.forEach,
nativeMap=ArrayProto.map,
nativeReduce=ArrayProto.reduce,
nativeReduceRight=ArrayProto.reduceRight,
nativeFilter=ArrayProto.filter,
nativeEvery=ArrayProto.every,
nativeSome=ArrayProto.some,
nativeIndexOf=ArrayProto.indexOf,
nativeLastIndexOf=ArrayProto.lastIndexOf,
nativeIsArray=Array.isArray,
nativeKeys=Object.keys,
nativeBind=FuncProto.bind;
var _=function(obj){return new wrapper(obj);};
if(typeof exports!=='undefined'){
if(typeof module!=='undefined'&&module.exports){
exports=module.exports=_;
}
exports._=_;
}else if(typeof define==='function'&&define.amd){
define('underscore',function(){
return _;
});
}else{
root['_']=_;
}
_.VERSION='1.2.3';
var each=_.each=_.forEach=function(obj,iterator,context){
if(obj==null)return;
if(nativeForEach&&obj.forEach===nativeForEach){
obj.forEach(iterator,context);
}else if(obj.length===+obj.length){
for(var i=0,l=obj.length;i<l;i++){
if(i in obj&&iterator.call(context,obj[i],i,obj)===breaker)return;
}
}else{
for(var key in obj){
if(hasOwnProperty.call(obj,key)){
if(iterator.call(context,obj[key],key,obj)===breaker)return;
}
}
}
};
_.map=function(obj,iterator,context){
var results=[];
if(obj==null)return results;
if(nativeMap&&obj.map===nativeMap)return obj.map(iterator,context);
each(obj,function(value,index,list){
results[results.length]=iterator.call(context,value,index,list);
});
return results;
};
_.reduce=_.foldl=_.inject=function(obj,iterator,memo,context){
var initial=arguments.length>2;
if(obj==null)obj=[];
if(nativeReduce&&obj.reduce===nativeReduce){
if(context)iterator=_.bind(iterator,context);
return initial?obj.reduce(iterator,memo):obj.reduce(iterator);
}
each(obj,function(value,index,list){
if(!initial){
memo=value;
initial=true;
}else{
memo=iterator.call(context,memo,value,index,list);
}
});
if(!initial)throw new TypeError('Reduce of empty array with no initial value');
return memo;
};
_.reduceRight=_.foldr=function(obj,iterator,memo,context){
var initial=arguments.length>2;
if(obj==null)obj=[];
if(nativeReduceRight&&obj.reduceRight===nativeReduceRight){
if(context)iterator=_.bind(iterator,context);
return initial?obj.reduceRight(iterator,memo):obj.reduceRight(iterator);
}
var reversed=_.toArray(obj).reverse();
if(context&&!initial)iterator=_.bind(iterator,context);
return initial?_.reduce(reversed,iterator,memo,context):_.reduce(reversed,iterator);
};
_.find=_.detect=function(obj,iterator,context){
var result;
any(obj,function(value,index,list){
if(iterator.call(context,value,index,list)){
result=value;
return true;
}
});
return result;
};
_.filter=_.select=function(obj,iterator,context){
var results=[];
if(obj==null)return results;
if(nativeFilter&&obj.filter===nativeFilter)return obj.filter(iterator,context);
each(obj,function(value,index,list){
if(iterator.call(context,value,index,list))results[results.length]=value;
});
return results;
};
_.reject=function(obj,iterator,context){
var results=[];
if(obj==null)return results;
each(obj,function(value,index,list){
if(!iterator.call(context,value,index,list))results[results.length]=value;
});
return results;
};
_.every=_.all=function(obj,iterator,context){
var result=true;
if(obj==null)return result;
if(nativeEvery&&obj.every===nativeEvery)return obj.every(iterator,context);
each(obj,function(value,index,list){
if(!(result=result&&iterator.call(context,value,index,list)))return breaker;
});
return result;
};
var any=_.some=_.any=function(obj,iterator,context){
iterator||(iterator=_.identity);
var result=false;
if(obj==null)return result;
if(nativeSome&&obj.some===nativeSome)return obj.some(iterator,context);
each(obj,function(value,index,list){
if(result||(result=iterator.call(context,value,index,list)))return breaker;
});
return!!result;
};
_.include=_.contains=function(obj,target){
var found=false;
if(obj==null)return found;
if(nativeIndexOf&&obj.indexOf===nativeIndexOf)return obj.indexOf(target)!=-1;
found=any(obj,function(value){
return value===target;
});
return found;
};
_.invoke=function(obj,method){
var args=slice.call(arguments,2);
return _.map(obj,function(value){
return(method.call?method||value:value[method]).apply(value,args);
});
};
_.pluck=function(obj,key){
return _.map(obj,function(value){return value[key];});
};
_.max=function(obj,iterator,context){
if(!iterator&&_.isArray(obj))return Math.max.apply(Math,obj);
if(!iterator&&_.isEmpty(obj))return-Infinity;
var result={computed:-Infinity};
each(obj,function(value,index,list){
var computed=iterator?iterator.call(context,value,index,list):value;
computed>=result.computed&&(result={value:value,computed:computed});
});
return result.value;
};
_.min=function(obj,iterator,context){
if(!iterator&&_.isArray(obj))return Math.min.apply(Math,obj);
if(!iterator&&_.isEmpty(obj))return Infinity;
var result={computed:Infinity};
each(obj,function(value,index,list){
var computed=iterator?iterator.call(context,value,index,list):value;
computed<result.computed&&(result={value:value,computed:computed});
});
return result.value;
};
_.shuffle=function(obj){
var shuffled=[],rand;
each(obj,function(value,index,list){
if(index==0){
shuffled[0]=value;
}else{
rand=Math.floor(Math.random()*(index+1));
shuffled[index]=shuffled[rand];
shuffled[rand]=value;
}
});
return shuffled;
};
_.sortBy=function(obj,iterator,context){
return _.pluck(_.map(obj,function(value,index,list){
return{
value:value,
criteria:iterator.call(context,value,index,list)
};
}).sort(function(left,right){
var a=left.criteria,b=right.criteria;
return a<b?-1:a>b?1:0;
}),'value');
};
_.groupBy=function(obj,val){
var result={};
var iterator=_.isFunction(val)?val:function(obj){return obj[val];};
each(obj,function(value,index){
var key=iterator(value,index);
(result[key]||(result[key]=[])).push(value);
});
return result;
};
_.sortedIndex=function(array,obj,iterator){
iterator||(iterator=_.identity);
var low=0,high=array.length;
while(low<high){
var mid=(low+high)>>1;
iterator(array[mid])<iterator(obj)?low=mid+1:high=mid;
}
return low;
};
_.toArray=function(iterable){
if(!iterable)return[];
if(iterable.toArray)return iterable.toArray();
if(_.isArray(iterable))return slice.call(iterable);
if(_.isArguments(iterable))return slice.call(iterable);
return _.values(iterable);
};
_.size=function(obj){
return _.toArray(obj).length;
};
_.first=_.head=function(array,n,guard){
return(n!=null)&&!guard?slice.call(array,0,n):array[0];
};
_.initial=function(array,n,guard){
return slice.call(array,0,array.length-((n==null)||guard?1:n));
};
_.last=function(array,n,guard){
if((n!=null)&&!guard){
return slice.call(array,Math.max(array.length-n,0));
}else{
return array[array.length-1];
}
};
_.rest=_.tail=function(array,index,guard){
return slice.call(array,(index==null)||guard?1:index);
};
_.compact=function(array){
return _.filter(array,function(value){return!!value;});
};
_.flatten=function(array,shallow){
return _.reduce(array,function(memo,value){
if(_.isArray(value))return memo.concat(shallow?value:_.flatten(value));
memo[memo.length]=value;
return memo;
},[]);
};
_.without=function(array){
return _.difference(array,slice.call(arguments,1));
};
_.uniq=_.unique=function(array,isSorted,iterator){
var initial=iterator?_.map(array,iterator):array;
var result=[];
_.reduce(initial,function(memo,el,i){
if(0==i||(isSorted===true?_.last(memo)!=el:!_.include(memo,el))){
memo[memo.length]=el;
result[result.length]=array[i];
}
return memo;
},[]);
return result;
};
_.union=function(){
return _.uniq(_.flatten(arguments,true));
};
_.intersection=_.intersect=function(array){
var rest=slice.call(arguments,1);
return _.filter(_.uniq(array),function(item){
return _.every(rest,function(other){
return _.indexOf(other,item)>=0;
});
});
};
_.difference=function(array){
var rest=_.flatten(slice.call(arguments,1));
return _.filter(array,function(value){return!_.include(rest,value);});
};
_.zip=function(){
var args=slice.call(arguments);
var length=_.max(_.pluck(args,'length'));
var results=new Array(length);
for(var i=0;i<length;i++)results[i]=_.pluck(args,""+i);
return results;
};
_.indexOf=function(array,item,isSorted){
if(array==null)return-1;
var i,l;
if(isSorted){
i=_.sortedIndex(array,item);
return array[i]===item?i:-1;
}
if(nativeIndexOf&&array.indexOf===nativeIndexOf)return array.indexOf(item);
for(i=0,l=array.length;i<l;i++)if(i in array&&array[i]===item)return i;
return-1;
};
_.lastIndexOf=function(array,item){
if(array==null)return-1;
if(nativeLastIndexOf&&array.lastIndexOf===nativeLastIndexOf)return array.lastIndexOf(item);
var i=array.length;
while(i--)if(i in array&&array[i]===item)return i;
return-1;
};
_.range=function(start,stop,step){
if(arguments.length<=1){
stop=start||0;
start=0;
}
step=arguments[2]||1;
var len=Math.max(Math.ceil((stop-start)/step),0);
var idx=0;
var range=new Array(len);
while(idx<len){
range[idx++]=start;
start+=step;
}
return range;
};
var ctor=function(){};
_.bind=function bind(func,context){
var bound,args;
if(func.bind===nativeBind&&nativeBind)return nativeBind.apply(func,slice.call(arguments,1));
if(!_.isFunction(func))throw new TypeError;
args=slice.call(arguments,2);
return bound=function(){
if(!(this instanceof bound))return func.apply(context,args.concat(slice.call(arguments)));
ctor.prototype=func.prototype;
var self=new ctor;
var result=func.apply(self,args.concat(slice.call(arguments)));
if(Object(result)===result)return result;
return self;
};
};
_.bindAll=function(obj){
var funcs=slice.call(arguments,1);
if(funcs.length==0)funcs=_.functions(obj);
each(funcs,function(f){obj[f]=_.bind(obj[f],obj);});
return obj;
};
_.memoize=function(func,hasher){
var memo={};
hasher||(hasher=_.identity);
return function(){
var key=hasher.apply(this,arguments);
return hasOwnProperty.call(memo,key)?memo[key]:(memo[key]=func.apply(this,arguments));
};
};
_.delay=function(func,wait){
var args=slice.call(arguments,2);
return setTimeout(function(){return func.apply(func,args);},wait);
};
_.defer=function(func){
return _.delay.apply(_,[func,1].concat(slice.call(arguments,1)));
};
_.throttle=function(func,wait){
var context,args,timeout,throttling,more;
var whenDone=_.debounce(function(){more=throttling=false;},wait);
return function(){
context=this;args=arguments;
var later=function(){
timeout=null;
if(more)func.apply(context,args);
whenDone();
};
if(!timeout)timeout=setTimeout(later,wait);
if(throttling){
more=true;
}else{
func.apply(context,args);
}
whenDone();
throttling=true;
};
};
_.debounce=function(func,wait){
var timeout;
return function(){
var context=this,args=arguments;
var later=function(){
timeout=null;
func.apply(context,args);
};
clearTimeout(timeout);
timeout=setTimeout(later,wait);
};
};
_.once=function(func){
var ran=false,memo;
return function(){
if(ran)return memo;
ran=true;
return memo=func.apply(this,arguments);
};
};
_.wrap=function(func,wrapper){
return function(){
var args=concat.apply([func],arguments);
return wrapper.apply(this,args);
};
};
_.compose=function(){
var funcs=arguments;
return function(){
var args=arguments;
for(var i=funcs.length-1;i>=0;i--){
args=[funcs[i].apply(this,args)];
}
return args[0];
};
};
_.after=function(times,func){
if(times<=0)return func();
return function(){
if(--times<1){return func.apply(this,arguments);}
};
};
_.keys=nativeKeys||function(obj){
if(obj!==Object(obj))throw new TypeError('Invalid object');
var keys=[];
for(var key in obj)if(hasOwnProperty.call(obj,key))keys[keys.length]=key;
return keys;
};
_.values=function(obj){
return _.map(obj,_.identity);
};
_.functions=_.methods=function(obj){
var names=[];
for(var key in obj){
if(_.isFunction(obj[key]))names.push(key);
}
return names.sort();
};
_.extend=function(obj){
each(slice.call(arguments,1),function(source){
for(var prop in source){
if(source[prop]!==void 0)obj[prop]=source[prop];
}
});
return obj;
};
_.defaults=function(obj){
each(slice.call(arguments,1),function(source){
for(var prop in source){
if(obj[prop]==null)obj[prop]=source[prop];
}
});
return obj;
};
_.clone=function(obj){
if(!_.isObject(obj))return obj;
return _.isArray(obj)?obj.slice():_.extend({},obj);
};
_.tap=function(obj,interceptor){
interceptor(obj);
return obj;
};
function eq(a,b,stack){
if(a===b)return a!==0||1/a==1/b;
if(a==null||b==null)return a===b;
if(a._chain)a=a._wrapped;
if(b._chain)b=b._wrapped;
if(a.isEqual&&_.isFunction(a.isEqual))return a.isEqual(b);
if(b.isEqual&&_.isFunction(b.isEqual))return b.isEqual(a);
var className=toString.call(a);
if(className!=toString.call(b))return false;
switch(className){
case'[object String]':
return a==String(b);
case'[object Number]':
return a!=+a?b!=+b:(a==0?1/a==1/b:a==+b);
case'[object Date]':
case'[object Boolean]':
return+a==+b;
case'[object RegExp]':
return a.source==b.source&&
a.global==b.global&&
a.multiline==b.multiline&&
a.ignoreCase==b.ignoreCase;
}
if(typeof a!='object'||typeof b!='object')return false;
var length=stack.length;
while(length--){
if(stack[length]==a)return true;
}
stack.push(a);
var size=0,result=true;
if(className=='[object Array]'){
size=a.length;
result=size==b.length;
if(result){
while(size--){
if(!(result=size in a==size in b&&eq(a[size],b[size],stack)))break;
}
}
}else{
if('constructor'in a!='constructor'in b||a.constructor!=b.constructor)return false;
for(var key in a){
if(hasOwnProperty.call(a,key)){
size++;
if(!(result=hasOwnProperty.call(b,key)&&eq(a[key],b[key],stack)))break;
}
}
if(result){
for(key in b){
if(hasOwnProperty.call(b,key)&&!(size--))break;
}
result=!size;
}
}
stack.pop();
return result;
}
_.isEqual=function(a,b){
return eq(a,b,[]);
};
_.isEmpty=function(obj){
if(_.isArray(obj)||_.isString(obj))return obj.length===0;
for(var key in obj)if(hasOwnProperty.call(obj,key))return false;
return true;
};
_.isElement=function(obj){
return!!(obj&&obj.nodeType==1);
};
_.isArray=nativeIsArray||function(obj){
return toString.call(obj)=='[object Array]';
};
_.isObject=function(obj){
return obj===Object(obj);
};
_.isArguments=function(obj){
return toString.call(obj)=='[object Arguments]';
};
if(!_.isArguments(arguments)){
_.isArguments=function(obj){
return!!(obj&&hasOwnProperty.call(obj,'callee'));
};
}
_.isFunction=function(obj){
return toString.call(obj)=='[object Function]';
};
_.isString=function(obj){
return toString.call(obj)=='[object String]';
};
_.isNumber=function(obj){
return toString.call(obj)=='[object Number]';
};
_.isNaN=function(obj){
return obj!==obj;
};
_.isBoolean=function(obj){
return obj===true||obj===false||toString.call(obj)=='[object Boolean]';
};
_.isDate=function(obj){
return toString.call(obj)=='[object Date]';
};
_.isRegExp=function(obj){
return toString.call(obj)=='[object RegExp]';
};
_.isNull=function(obj){
return obj===null;
};
_.isUndefined=function(obj){
return obj===void 0;
};
_.noConflict=function(){
root._=previousUnderscore;
return this;
};
_.identity=function(value){
return value;
};
_.times=function(n,iterator,context){
for(var i=0;i<n;i++)iterator.call(context,i);
};
_.escape=function(string){
return(''+string).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;');
};
_.mixin=function(obj){
each(_.functions(obj),function(name){
addToWrapper(name,_[name]=obj[name]);
});
};
var idCounter=0;
_.uniqueId=function(prefix){
var id=idCounter++;
return prefix?prefix+id:id;
};
_.templateSettings={
evaluate:/<%([\s\S]+?)%>/g,
interpolate:/<%=([\s\S]+?)%>/g,
escape:/<%-([\s\S]+?)%>/g
};
_.template=function(str,data){
var c=_.templateSettings;
var tmpl='var __p=[],print=function(){__p.push.apply(__p,arguments);};'+
'with(obj||{}){__p.push(\''+
str.replace(/\\/g,'\\\\')
.replace(/'/g,"\\'")
.replace(c.escape,function(match,code){
return"',_.escape("+code.replace(/\\'/g,"'")+"),'";
})
.replace(c.interpolate,function(match,code){
return"',"+code.replace(/\\'/g,"'")+",'";
})
.replace(c.evaluate||null,function(match,code){
return"');"+code.replace(/\\'/g,"'")
.replace(/[\r\n\t]/g,' ')+";__p.push('";
})
.replace(/\r/g,'\\r')
.replace(/\n/g,'\\n')
.replace(/\t/g,'\\t')
+"');}return __p.join('');";
var func=new Function('obj','_',tmpl);
if(data)return func(data,_);
return function(data){
return func.call(this,data,_);
};
};
var wrapper=function(obj){this._wrapped=obj;};
_.prototype=wrapper.prototype;
var result=function(obj,chain){
return chain?_(obj).chain():obj;
};
var addToWrapper=function(name,func){
wrapper.prototype[name]=function(){
var args=slice.call(arguments);
unshift.call(args,this._wrapped);
return result(func.apply(_,args),this._chain);
};
};
_.mixin(_);
each(['pop','push','reverse','shift','sort','splice','unshift'],function(name){
var method=ArrayProto[name];
wrapper.prototype[name]=function(){
method.apply(this._wrapped,arguments);
return result(this._wrapped,this._chain);
};
});
each(['concat','join','slice'],function(name){
var method=ArrayProto[name];
wrapper.prototype[name]=function(){
return result(method.apply(this._wrapped,arguments),this._chain);
};
});
wrapper.prototype.chain=function(){
this._chain=true;
return this;
};
wrapper.prototype.value=function(){
return this._wrapped;
};
}).call(this);
(function(){
var root=this;
var previousBackbone=root.Backbone;
var Backbone;
if(typeof exports!=='undefined'){
Backbone=exports;
}else{
Backbone=root.Backbone={};
}
Backbone.VERSION='0.5.3';
var _=root._;
if(!_&&(typeof require!=='undefined'))_=require('underscore')._;
var $=root.jQuery||root.Zepto;
Backbone.noConflict=function(){
root.Backbone=previousBackbone;
return this;
};
Backbone.emulateHTTP=false;
Backbone.emulateJSON=false;
Backbone.Events={
bind:function(ev,callback,context){
var calls=this._callbacks||(this._callbacks={});
var list=calls[ev]||(calls[ev]=[]);
list.push([callback,context]);
return this;
},
unbind:function(ev,callback){
var calls;
if(!ev){
this._callbacks={};
}else if(calls=this._callbacks){
if(!callback){
calls[ev]=[];
}else{
var list=calls[ev];
if(!list)return this;
for(var i=0,l=list.length;i<l;i++){
if(list[i]&&callback===list[i][0]){
list[i]=null;
break;
}
}
}
}
return this;
},
trigger:function(eventName){
var list,calls,ev,callback,args;
var both=2;
if(!(calls=this._callbacks))return this;
while(both--){
ev=both?eventName:'all';
if(list=calls[ev]){
for(var i=0,l=list.length;i<l;i++){
if(!(callback=list[i])){
list.splice(i,1);i--;l--;
}else{
args=both?Array.prototype.slice.call(arguments,1):arguments;
callback[0].apply(callback[1]||this,args);
}
}
}
}
return this;
}
};
Backbone.Model=function(attributes,options){
var defaults;
attributes||(attributes={});
if(defaults=this.defaults){
if(_.isFunction(defaults))defaults=defaults.call(this);
attributes=_.extend({},defaults,attributes);
}
this.attributes={};
this._escapedAttributes={};
this.cid=_.uniqueId('c');
this.set(attributes,{silent:true});
this._changed=false;
this._previousAttributes=_.clone(this.attributes);
if(options&&options.collection)this.collection=options.collection;
this.initialize(attributes,options);
};
_.extend(Backbone.Model.prototype,Backbone.Events,{
_previousAttributes:null,
_changed:false,
idAttribute:'id',
initialize:function(){},
toJSON:function(){
return _.clone(this.attributes);
},
get:function(attr){
return this.attributes[attr];
},
escape:function(attr){
var html;
if(html=this._escapedAttributes[attr])return html;
var val=this.attributes[attr];
return this._escapedAttributes[attr]=escapeHTML(val==null?'':''+val);
},
has:function(attr){
return this.attributes[attr]!=null;
},
set:function(attrs,options){
options||(options={});
if(!attrs)return this;
if(attrs.attributes)attrs=attrs.attributes;
var now=this.attributes,escaped=this._escapedAttributes;
if(!options.silent&&this.validate&&!this._performValidation(attrs,options))return false;
if(this.idAttribute in attrs)this.id=attrs[this.idAttribute];
var alreadyChanging=this._changing;
this._changing=true;
for(var attr in attrs){
var val=attrs[attr];
if(!_.isEqual(now[attr],val)){
now[attr]=val;
delete escaped[attr];
this._changed=true;
if(!options.silent)this.trigger('change:'+attr,this,val,options);
}
}
if(!alreadyChanging&&!options.silent&&this._changed)this.change(options);
this._changing=false;
return this;
},
unset:function(attr,options){
if(!(attr in this.attributes))return this;
options||(options={});
var value=this.attributes[attr];
var validObj={};
validObj[attr]=void 0;
if(!options.silent&&this.validate&&!this._performValidation(validObj,options))return false;
delete this.attributes[attr];
delete this._escapedAttributes[attr];
if(attr==this.idAttribute)delete this.id;
this._changed=true;
if(!options.silent){
this.trigger('change:'+attr,this,void 0,options);
this.change(options);
}
return this;
},
clear:function(options){
options||(options={});
var attr;
var old=this.attributes;
var validObj={};
for(attr in old)validObj[attr]=void 0;
if(!options.silent&&this.validate&&!this._performValidation(validObj,options))return false;
this.attributes={};
this._escapedAttributes={};
this._changed=true;
if(!options.silent){
for(attr in old){
this.trigger('change:'+attr,this,void 0,options);
}
this.change(options);
}
return this;
},
fetch:function(options){
options||(options={});
var model=this;
var success=options.success;
options.success=function(resp,status,xhr){
if(!model.set(model.parse(resp,xhr),options))return false;
if(success)success(model,resp);
};
options.error=wrapError(options.error,model,options);
return(this.sync||Backbone.sync).call(this,'read',this,options);
},
save:function(attrs,options){
options||(options={});
if(attrs&&!this.set(attrs,options))return false;
var model=this;
var success=options.success;
options.success=function(resp,status,xhr){
if(!model.set(model.parse(resp,xhr),options))return false;
if(success)success(model,resp,xhr);
};
options.error=wrapError(options.error,model,options);
var method=this.isNew()?'create':'update';
return(this.sync||Backbone.sync).call(this,method,this,options);
},
destroy:function(options){
options||(options={});
if(this.isNew())return this.trigger('destroy',this,this.collection,options);
var model=this;
var success=options.success;
options.success=function(resp){
model.trigger('destroy',model,model.collection,options);
if(success)success(model,resp);
};
options.error=wrapError(options.error,model,options);
return(this.sync||Backbone.sync).call(this,'delete',this,options);
},
url:function(){
var base=getUrl(this.collection)||this.urlRoot||urlError();
if(this.isNew())return base;
return base+(base.charAt(base.length-1)=='/'?'':'/')+encodeURIComponent(this.id);
},
parse:function(resp,xhr){
return resp;
},
clone:function(){
return new this.constructor(this);
},
isNew:function(){
return this.id==null;
},
change:function(options){
this.trigger('change',this,options);
this._previousAttributes=_.clone(this.attributes);
this._changed=false;
},
hasChanged:function(attr){
if(attr)return this._previousAttributes[attr]!=this.attributes[attr];
return this._changed;
},
changedAttributes:function(now){
now||(now=this.attributes);
var old=this._previousAttributes;
var changed=false;
for(var attr in now){
if(!_.isEqual(old[attr],now[attr])){
changed=changed||{};
changed[attr]=now[attr];
}
}
return changed;
},
previous:function(attr){
if(!attr||!this._previousAttributes)return null;
return this._previousAttributes[attr];
},
previousAttributes:function(){
return _.clone(this._previousAttributes);
},
_performValidation:function(attrs,options){
var error=this.validate(attrs);
if(error){
if(options.error){
options.error(this,error,options);
}else{
this.trigger('error',this,error,options);
}
return false;
}
return true;
}
});
Backbone.Collection=function(models,options){
options||(options={});
if(options.comparator)this.comparator=options.comparator;
_.bindAll(this,'_onModelEvent','_removeReference');
this._reset();
if(models)this.reset(models,{silent:true});
this.initialize.apply(this,arguments);
};
_.extend(Backbone.Collection.prototype,Backbone.Events,{
model:Backbone.Model,
initialize:function(){},
toJSON:function(){
return this.map(function(model){return model.toJSON();});
},
add:function(models,options){
if(_.isArray(models)){
for(var i=0,l=models.length;i<l;i++){
this._add(models[i],options);
}
}else{
this._add(models,options);
}
return this;
},
remove:function(models,options){
if(_.isArray(models)){
for(var i=0,l=models.length;i<l;i++){
this._remove(models[i],options);
}
}else{
this._remove(models,options);
}
return this;
},
get:function(id){
if(id==null)return null;
return this._byId[id.id!=null?id.id:id];
},
getByCid:function(cid){
return cid&&this._byCid[cid.cid||cid];
},
at:function(index){
return this.models[index];
},
sort:function(options){
options||(options={});
if(!this.comparator)throw new Error('Cannot sort a set without a comparator');
this.models=this.sortBy(this.comparator);
if(!options.silent)this.trigger('reset',this,options);
return this;
},
pluck:function(attr){
return _.map(this.models,function(model){return model.get(attr);});
},
reset:function(models,options){
models||(models=[]);
options||(options={});
this.each(this._removeReference);
this._reset();
this.add(models,{silent:true});
if(!options.silent)this.trigger('reset',this,options);
return this;
},
fetch:function(options){
options||(options={});
var collection=this;
var success=options.success;
options.success=function(resp,status,xhr){
collection[options.add?'add':'reset'](collection.parse(resp,xhr),options);
if(success)success(collection,resp);
};
options.error=wrapError(options.error,collection,options);
return(this.sync||Backbone.sync).call(this,'read',this,options);
},
create:function(model,options){
var coll=this;
options||(options={});
model=this._prepareModel(model,options);
if(!model)return false;
var success=options.success;
options.success=function(nextModel,resp,xhr){
coll.add(nextModel,options);
if(success)success(nextModel,resp,xhr);
};
model.save(null,options);
return model;
},
parse:function(resp,xhr){
return resp;
},
chain:function(){
return _(this.models).chain();
},
_reset:function(options){
this.length=0;
this.models=[];
this._byId={};
this._byCid={};
},
_prepareModel:function(model,options){
if(!(model instanceof Backbone.Model)){
var attrs=model;
model=new this.model(attrs,{collection:this});
if(model.validate&&!model._performValidation(attrs,options))model=false;
}else if(!model.collection){
model.collection=this;
}
return model;
},
_add:function(model,options){
options||(options={});
model=this._prepareModel(model,options);
if(!model)return false;
var already=this.getByCid(model);
if(already)throw new Error(["Can't add the same model to a set twice",already.id]);
this._byId[model.id]=model;
this._byCid[model.cid]=model;
var index=options.at!=null?options.at:
this.comparator?this.sortedIndex(model,this.comparator):
this.length;
this.models.splice(index,0,model);
model.bind('all',this._onModelEvent);
this.length++;
if(!options.silent)model.trigger('add',model,this,options);
return model;
},
_remove:function(model,options){
options||(options={});
model=this.getByCid(model)||this.get(model);
if(!model)return null;
delete this._byId[model.id];
delete this._byCid[model.cid];
this.models.splice(this.indexOf(model),1);
this.length--;
if(!options.silent)model.trigger('remove',model,this,options);
this._removeReference(model);
return model;
},
_removeReference:function(model){
if(this==model.collection){
delete model.collection;
}
model.unbind('all',this._onModelEvent);
},
_onModelEvent:function(ev,model,collection,options){
if((ev=='add'||ev=='remove')&&collection!=this)return;
if(ev=='destroy'){
this._remove(model,options);
}
if(model&&ev==='change:'+model.idAttribute){
delete this._byId[model.previous(model.idAttribute)];
this._byId[model.id]=model;
}
this.trigger.apply(this,arguments);
}
});
var methods=['forEach','each','map','reduce','reduceRight','find','detect',
'filter','select','reject','every','all','some','any','include',
'contains','invoke','max','min','sortBy','sortedIndex','toArray','size',
'first','rest','last','without','indexOf','lastIndexOf','isEmpty','groupBy'];
_.each(methods,function(method){
Backbone.Collection.prototype[method]=function(){
return _[method].apply(_,[this.models].concat(_.toArray(arguments)));
};
});
Backbone.Router=function(options){
options||(options={});
if(options.routes)this.routes=options.routes;
this._bindRoutes();
this.initialize.apply(this,arguments);
};
var namedParam=/:([\w\d]+)/g;
var splatParam=/\*([\w\d]+)/g;
var escapeRegExp=/[-[\]{}()+?.,\\^$|#\s]/g;
_.extend(Backbone.Router.prototype,Backbone.Events,{
initialize:function(){},
route:function(route,name,callback){
Backbone.history||(Backbone.history=new Backbone.History);
if(!_.isRegExp(route))route=this._routeToRegExp(route);
Backbone.history.route(route,_.bind(function(fragment){
var args=this._extractParameters(route,fragment);
callback.apply(this,args);
this.trigger.apply(this,['route:'+name].concat(args));
},this));
},
navigate:function(fragment,triggerRoute){
Backbone.history.navigate(fragment,triggerRoute);
},
_bindRoutes:function(){
if(!this.routes)return;
var routes=[];
for(var route in this.routes){
routes.unshift([route,this.routes[route]]);
}
for(var i=0,l=routes.length;i<l;i++){
this.route(routes[i][0],routes[i][1],this[routes[i][1]]);
}
},
_routeToRegExp:function(route){
route=route.replace(escapeRegExp,"\\$&")
.replace(namedParam,"([^\/]*)")
.replace(splatParam,"(.*?)");
return new RegExp('^'+route+'$');
},
_extractParameters:function(route,fragment){
return route.exec(fragment).slice(1);
}
});
Backbone.History=function(){
this.handlers=[];
_.bindAll(this,'checkUrl');
};
var hashStrip=/^#*/;
var isExplorer=/msie [\w.]+/;
var historyStarted=false;
_.extend(Backbone.History.prototype,{
interval:50,
getFragment:function(fragment,forcePushState){
if(fragment==null){
if(this._hasPushState||forcePushState){
fragment=window.location.pathname;
var search=window.location.search;
if(search)fragment+=search;
if(fragment.indexOf(this.options.root)==0)fragment=fragment.substr(this.options.root.length);
}else{
fragment=window.location.hash;
}
}
return decodeURIComponent(fragment.replace(hashStrip,''));
},
start:function(options){
if(historyStarted)throw new Error("Backbone.history has already been started");
this.options=_.extend({},{root:'/'},this.options,options);
this._wantsPushState=!!this.options.pushState;
this._hasPushState=!!(this.options.pushState&&window.history&&window.history.pushState);
var fragment=this.getFragment();
var docMode=document.documentMode;
var oldIE=(isExplorer.exec(navigator.userAgent.toLowerCase())&&(!docMode||docMode<=7));
if(oldIE){
this.iframe=$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
this.navigate(fragment);
}
if(this._hasPushState){
$(window).bind('popstate',this.checkUrl);
}else if('onhashchange'in window&&!oldIE){
$(window).bind('hashchange',this.checkUrl);
}else{
setInterval(this.checkUrl,this.interval);
}
this.fragment=fragment;
historyStarted=true;
var loc=window.location;
var atRoot=loc.pathname==this.options.root;
if(this._wantsPushState&&!this._hasPushState&&!atRoot){
this.fragment=this.getFragment(null,true);
window.location.replace(this.options.root+'#'+this.fragment);
return true;
}else if(this._wantsPushState&&this._hasPushState&&atRoot&&loc.hash){
this.fragment=loc.hash.replace(hashStrip,'');
window.history.replaceState({},document.title,loc.protocol+'//'+loc.host+this.options.root+this.fragment);
}
if(!this.options.silent){
return this.loadUrl();
}
},
route:function(route,callback){
this.handlers.unshift({route:route,callback:callback});
},
checkUrl:function(e){
var current=this.getFragment();
if(current==this.fragment&&this.iframe)current=this.getFragment(this.iframe.location.hash);
if(current==this.fragment||current==decodeURIComponent(this.fragment))return false;
if(this.iframe)this.navigate(current);
this.loadUrl()||this.loadUrl(window.location.hash);
},
loadUrl:function(fragmentOverride){
var fragment=this.fragment=this.getFragment(fragmentOverride);
var matched=_.any(this.handlers,function(handler){
if(handler.route.test(fragment)){
handler.callback(fragment);
return true;
}
});
return matched;
},
navigate:function(fragment,triggerRoute){
var frag=(fragment||'').replace(hashStrip,'');
if(this.fragment==frag||this.fragment==decodeURIComponent(frag))return;
if(this._hasPushState){
var loc=window.location;
if(frag.indexOf(this.options.root)!=0)frag=this.options.root+frag;
this.fragment=frag;
window.history.pushState({},document.title,loc.protocol+'//'+loc.host+frag);
}else{
window.location.hash=this.fragment=frag;
if(this.iframe&&(frag!=this.getFragment(this.iframe.location.hash))){
this.iframe.document.open().close();
this.iframe.location.hash=frag;
}
}
if(triggerRoute)this.loadUrl(fragment);
}
});
Backbone.View=function(options){
this.cid=_.uniqueId('view');
this._configure(options||{});
this._ensureElement();
this.delegateEvents();
this.initialize.apply(this,arguments);
};
var selectorDelegate=function(selector){
return $(selector,this.el);
};
var eventSplitter=/^(\S+)\s*(.*)$/;
var viewOptions=['model','collection','el','id','attributes','className','tagName'];
_.extend(Backbone.View.prototype,Backbone.Events,{
tagName:'div',
$:selectorDelegate,
initialize:function(){},
render:function(){
return this;
},
remove:function(){
$(this.el).remove();
return this;
},
make:function(tagName,attributes,content){
var el=document.createElement(tagName);
if(attributes)$(el).attr(attributes);
if(content)$(el).html(content);
return el;
},
delegateEvents:function(events){
if(!(events||(events=this.events)))return;
if(_.isFunction(events))events=events.call(this);
$(this.el).unbind('.delegateEvents'+this.cid);
for(var key in events){
var method=this[events[key]];
if(!method)throw new Error('Event "'+events[key]+'" does not exist');
var match=key.match(eventSplitter);
var eventName=match[1],selector=match[2];
method=_.bind(method,this);
eventName+='.delegateEvents'+this.cid;
if(selector===''){
$(this.el).bind(eventName,method);
}else{
$(this.el).delegate(selector,eventName,method);
}
}
},
_configure:function(options){
if(this.options)options=_.extend({},this.options,options);
for(var i=0,l=viewOptions.length;i<l;i++){
var attr=viewOptions[i];
if(options[attr])this[attr]=options[attr];
}
this.options=options;
},
_ensureElement:function(){
if(!this.el){
var attrs=this.attributes||{};
if(this.id)attrs.id=this.id;
if(this.className)attrs['class']=this.className;
this.el=this.make(this.tagName,attrs);
}else if(_.isString(this.el)){
this.el=$(this.el).get(0);
}
}
});
var extend=function(protoProps,classProps){
var child=inherits(this,protoProps,classProps);
child.extend=this.extend;
return child;
};
Backbone.Model.extend=Backbone.Collection.extend=
Backbone.Router.extend=Backbone.View.extend=extend;
var methodMap={
'create':'POST',
'update':'PUT',
'delete':'DELETE',
'read':'GET'
};
Backbone.sync=function(method,model,options){
var type=methodMap[method];
var params=_.extend({
type:type,
dataType:'json'
},options);
if(!params.url){
params.url=getUrl(model)||urlError();
}
if(!params.data&&model&&(method=='create'||method=='update')){
params.contentType='application/json';
params.data=JSON.stringify(model.toJSON());
}
if(Backbone.emulateJSON){
params.contentType='application/x-www-form-urlencoded';
params.data=params.data?{model:params.data}:{};
}
if(Backbone.emulateHTTP){
if(type==='PUT'||type==='DELETE'){
if(Backbone.emulateJSON)params.data._method=type;
params.type='POST';
params.beforeSend=function(xhr){
xhr.setRequestHeader('X-HTTP-Method-Override',type);
};
}
}
if(params.type!=='GET'&&!Backbone.emulateJSON){
params.processData=false;
}
return $.ajax(params);
};
var ctor=function(){};
var inherits=function(parent,protoProps,staticProps){
var child;
if(protoProps&&protoProps.hasOwnProperty('constructor')){
child=protoProps.constructor;
}else{
child=function(){return parent.apply(this,arguments);};
}
_.extend(child,parent);
ctor.prototype=parent.prototype;
child.prototype=new ctor();
if(protoProps)_.extend(child.prototype,protoProps);
if(staticProps)_.extend(child,staticProps);
child.prototype.constructor=child;
child.__super__=parent.prototype;
return child;
};
var getUrl=function(object){
if(!(object&&object.url))return null;
return _.isFunction(object.url)?object.url():object.url;
};
var urlError=function(){
throw new Error('A "url" property or function must be specified');
};
var wrapError=function(onError,model,options){
return function(resp){
if(onError){
onError(model,resp,options);
}else{
model.trigger('error',model,resp,options);
}
};
};
var escapeHTML=function(string){
return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;');
};
}).call(this);
(function(){
var queryStringParam=/^\?(.*)/;
var namedParam=/:([\w\d]+)/g;
var splatParam=/\*([\w\d]+)/g;
var escapeRegExp=/[-[\]{}()+?.,\\^$|#\s]/g;
var queryStrip=/(\?.*)$/;
var fragmentStrip=/^([^\?]*)/;
Backbone.Router.arrayValueSplit='|';
var _getFragment=Backbone.History.prototype.getFragment;
_.extend(Backbone.History.prototype,{
getFragment:function(fragment,forcePushState,excludeQueryString){
fragment=_getFragment.apply(this,arguments);
if(excludeQueryString){
fragment=fragment.replace(queryStrip,'');
}
return fragment;
},
getQueryParameters:function(fragment,forcePushState){
fragment=_getFragment.apply(this,arguments);
var queryString=fragment.replace(fragmentStrip,'');
var match=queryString.match(queryStringParam);
if(match){
queryString=match[1];
var rtn={};
iterateQueryString(queryString,function(name,value){
if(!rtn[name]){
rtn[name]=value;
}else if(_.isString(rtn[name])){
rtn[name]=[rtn[name],value];
}else{
rtn[name].push(value);
}
});
return rtn;
}else{
return{};
}
}
});
_.extend(Backbone.Router.prototype,{
initialize:function(options){
this.encodedSplatParts=options&&options.encodedSplatParts;
},
getFragment:function(fragment,forcePushState,excludeQueryString){
fragment=_getFragment.apply(this,arguments);
if(excludeQueryString){
fragment=fragment.replace(queryStrip,'');
}
return fragment;
},
_routeToRegExp:function(route){
var splatMatch=(splatParam.exec(route)||{index:-1});
var namedMatch=(namedParam.exec(route)||{index:-1});
route=route.replace(escapeRegExp,"\\$&")
.replace(namedParam,"([^\/?]*)")
.replace(splatParam,"([^\?]*)");
route+='([\?]{1}.*)?';
var rtn=new RegExp('^'+route+'$');
if(splatMatch.index>=0){
if(namedMatch>=0){
rtn.splatMatch=splatMatch.index-namedMatch.index;
}else{
rtn.splatMatch=-1;
}
}
return rtn;
},
_extractParameters:function(route,fragment){
var params=route.exec(fragment).slice(1);
var match=params.length&&params[params.length-1]&&params[params.length-1].match(queryStringParam);
if(match){
var queryString=match[1];
var data={};
if(queryString){
var self=this;
iterateQueryString(queryString,function(name,value){
self._setParamValue(name,value,data);
});
}
params[params.length-1]=data;
}
var length=params.length;
if(route.splatMatch&&this.encodedSplatParts){
if(route.splatMatch<0){
return params;
}else{
length=length-1;
}
}
for(var i=0;i<length;i++){
if(_.isString(params[i])){
params[i]=decodeURIComponent(params[i]);
}
}
return params;
},
_setParamValue:function(key,value,data){
var parts=key.split('.');
var _data=data;
for(var i=0;i<parts.length;i++){
var part=parts[i];
if(i===parts.length-1){
_data[part]=this._decodeParamValue(value,_data[part]);
}else{
_data=_data[part]=_data[part]||{};
}
}
},
_decodeParamValue:function(value,currentValue){
var splitChar=Backbone.Router.arrayValueSplit;
if(value.indexOf(splitChar)>=0){
var values=value.split(splitChar);
for(var i=values.length-1;i>=0;i--){
if(!values[i]){
values.splice(i,1);
}else{
values[i]=decodeURIComponent(values[i]);
}
}
return values;
}
if(!currentValue){
return decodeURIComponent(value);
}else if(_.isArray(currentValue)){
currentValue.push(value);
return currentValue;
}else{
return[currentValue,value];
}
},
toFragment:function(route,queryParameters){
if(queryParameters){
if(!_.isString(queryParameters)){
queryParameters=this._toQueryString(queryParameters);
}
if(queryParameters){
route+='?'+queryParameters;
}
}
return route;
},
_toQueryString:function(val,namePrefix){
var splitChar=Backbone.Router.arrayValueSplit;
function encodeSplit(val){return val.replace(splitChar,encodeURIComponent(splitChar));}
if(!val)return'';
namePrefix=namePrefix||'';
var rtn='';
for(var name in val){
var _val=val[name];
if(_.isString(_val)||_.isNumber(_val)||_.isBoolean(_val)||_.isDate(_val)){
_val=this._toQueryParam(_val);
if(_.isBoolean(_val)||_val){
rtn+=(rtn?'&':'')+this._toQueryParamName(name,namePrefix)+'='+encodeSplit(encodeURIComponent(_val));
}
}else if(_.isArray(_val)){
var str='';
for(var i in _val){
var param=this._toQueryParam(_val[i]);
if(_.isBoolean(param)||param){
str+=splitChar+encodeSplit(param);
}
}
if(str){
rtn+=(rtn?'&':'')+this._toQueryParamName(name,namePrefix)+'='+str;
}
}else{
var result=this._toQueryString(_val,this._toQueryParamName(name,namePrefix,true));
if(result){
rtn+=(rtn?'&':'')+result;
}
}
}
return rtn;
},
_toQueryParamName:function(name,prefix,isPrefix){
return(prefix+name+(isPrefix?'.':''));
},
_toQueryParam:function(param){
if(_.isNull(param)||_.isUndefined(param)){
return null;
}
if(_.isDate(param)){
return param.getDate().getTime();
}
return param;
}
});
function iterateQueryString(queryString,callback){
var keyValues=queryString.split('&');
_.each(keyValues,function(keyValue){
var arr=keyValue.split('=');
if(arr.length>1&&arr[1]){
callback(arr[0],arr[1]);
}
});
}
})();
var JSON;
if(!JSON){
JSON={};
}
(function(){
'use strict';
function f(n){
return n<10?'0'+n:n;
}
if(typeof Date.prototype.toJSON!=='function'){
Date.prototype.toJSON=function(key){
return isFinite(this.valueOf())
?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z'
:null;
};
String.prototype.toJSON=
Number.prototype.toJSON=
Boolean.prototype.toJSON=function(key){
return this.valueOf();
};
}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
gap,
indent,
meta={
'\b':'\\b',
'\t':'\\t',
'\n':'\\n',
'\f':'\\f',
'\r':'\\r',
'"':'\\"',
'\\':'\\\\'
},
rep;
function quote(string){
escapable.lastIndex=0;
return escapable.test(string)?'"'+string.replace(escapable,function(a){
var c=meta[a];
return typeof c==='string'
?c
:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);
})+'"':'"'+string+'"';
}
function str(key,holder){
var i,
k,
v,
length,
mind=gap,
partial,
value=holder[key];
if(value&&typeof value==='object'&&
typeof value.toJSON==='function'){
value=value.toJSON(key);
}
if(typeof rep==='function'){
value=rep.call(holder,key,value);
}
switch(typeof value){
case'string':
return quote(value);
case'number':
return isFinite(value)?String(value):'null';
case'boolean':
case'null':
return String(value);
case'object':
if(!value){
return'null';
}
gap+=indent;
partial=[];
if(Object.prototype.toString.apply(value)==='[object Array]'){
length=value.length;
for(i=0;i<length;i+=1){
partial[i]=str(i,value)||'null';
}
v=partial.length===0
?'[]'
:gap
?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']'
:'['+partial.join(',')+']';
gap=mind;
return v;
}
if(rep&&typeof rep==='object'){
length=rep.length;
for(i=0;i<length;i+=1){
if(typeof rep[i]==='string'){
k=rep[i];
v=str(k,value);
if(v){
partial.push(quote(k)+(gap?': ':':')+v);
}
}
}
}else{
for(k in value){
if(Object.prototype.hasOwnProperty.call(value,k)){
v=str(k,value);
if(v){
partial.push(quote(k)+(gap?': ':':')+v);
}
}
}
}
v=partial.length===0
?'{}'
:gap
?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}'
:'{'+partial.join(',')+'}';
gap=mind;
return v;
}
}
if(typeof JSON.stringify!=='function'){
JSON.stringify=function(value,replacer,space){
var i;
gap='';
indent='';
if(typeof space==='number'){
for(i=0;i<space;i+=1){
indent+=' ';
}
}else if(typeof space==='string'){
indent=space;
}
rep=replacer;
if(replacer&&typeof replacer!=='function'&&
(typeof replacer!=='object'||
typeof replacer.length!=='number')){
throw new Error('JSON.stringify');
}
return str('',{'':value});
};
}
if(typeof JSON.parse!=='function'){
JSON.parse=function(text,reviver){
var j;
function walk(holder,key){
var k,v,value=holder[key];
if(value&&typeof value==='object'){
for(k in value){
if(Object.prototype.hasOwnProperty.call(value,k)){
v=walk(value,k);
if(v!==undefined){
value[k]=v;
}else{
delete value[k];
}
}
}
}
return reviver.call(holder,key,value);
}
text=String(text);
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']')
.replace(/(?:^|:|,)(?:\s*\[)+/g,''))){
j=eval('('+text+')');
return typeof reviver==='function'
?walk({'':j},'')
:j;
}
throw new SyntaxError('JSON.parse');
};
}
}());
var oss={};
oss.logging=false;
oss.model={};
oss.model.query={};
oss.model.searchresult={};
oss.view={};
oss.controller={};
oss.router={};
oss.user={};
oss.controller.Controller=Backbone.View.extend({
getSearchPath:function(url,id,index,jsonp,key){
var _url=url||oss.user.url;
var _id=id||oss.user.id;
var _key=key||oss.user.key;
var _jsonp=jsonp==true?".jsonp":"";
return _url+'/users/'+_id+'/index/'+index+'/documents/search'+_jsonp+'?key='+_key;
},
getLogger:function(){
if(oss.logging){
return log4javascript.getDefaultLogger();
}else{
return log4javascript.getNullLogger();
}
}
});
oss.view.View=Backbone.View.extend({
initialize:function(options){
this.compileTemplate=options.compileTemplate||function(){throw'compileTemplate() not implemented'}
this.renderTemplate=options.renderTemplate||function(){throw'renderTemplate() not implemented'}
},
compileTemplate:null,
renderTemplate:null
});
oss.controller.Suggest=oss.controller.Controller.extend({
initialize:function(options){
options=options||{};
this.searchField=$(options.searchField)||$('#search');
this.searchInput=$(options.searchInput)||$('#search input');
this.boxId=options.boxId||"#suggest";
this.target=options.target||null;
this.minChars=options.minChars||2;
this.template=options.template||'';
this.params=options.params||{};
this.jsonp=options.jsonp||false;
this.templateCompile=options.templateCompile||null;
this.templateRender=options.templateRender||null;
this.beforeRequest=options.beforeRequest||null;
this.beforeSuggestShowed=options.beforeSuggestShowed||null;
this.beforeFormSubmit=options.beforeFormSubmit||null;
this.appendAdditionalData=options.appendAdditionalData||null;
this.arrowUpDownEnabled=true;
if(options.arrowUpDownEnabled!=undefined){
this.arrowUpDownEnabled=options.arrowUpDownEnabled;
}
this.query=new oss.model.Query(this.params);
this.requestPending=false;
this.doSubmitOnNextRequest=false;
this.searchResult=new oss.model.SearchResult(null,{
query:this.query
});
if(options.url){
this.searchResult.url=options.url;
}else{
this.searchResult.url=this.getSearchPath(options.url,options.userId,options.index,this.jsonp,options.key);
}
this.view=new oss.view.SuggestWindow({
model:this.searchResult,
template:this.template,
field:this.searchField,
boxId:this.boxId,
compileTemplate:this.templateCompile,
renderTemplate:this.templateRender,
beforeSuggestShowed:this.beforeSuggestShowed,
appendAdditionalData:this.appendAdditionalData
});
this.enable();
},
enable:function(){
var form=this.searchInput.parents('form:first');
if(this.target){
form.attr('action',this.target);
}
this.searchInput.attr("autocomplete","off");
if(this.target){
this.searchInput.attr('name','q');
}
if(this.arrowUpDownEnabled){
this.searchInput.keyup($.proxy(function(event){
this.fieldKeyPressed(event,this.searchInput);
},this));
}
this.searchInput.on('input',$.proxy(function(event){
this.fieldChanged(event,this.searchInput);
},this));
this.lastSearchInputVal=this.searchInput.val();
this.searchInput.on('propertychange',$.proxy(function(event){
if(this.searchInput.val()!=this.lastSearchInputVal){
this.lastSearchInputVal=this.searchInput.val();
this.fieldChanged(event,this.searchInput);
}
},this));
this.searchInput.focusout($.proxy(function(event){
this.fieldFocusOut(event,this.view);
},this));
var form=this.searchInput.parents('form:first');
form.submit($.proxy(function(event){
return this.fieldEnterPressed(this.searchInput,event);
},this));
},
submitForm:function(){
var form=this.searchInput.parents('form:first');
$(form).submit();
},
fieldKeyPressed:function(event,field){
if(event.keyCode=='13'){
}
else if(event.keyCode=='40'){
var item=$("#suggest ul li.suggest_hover_js");
if(item.length==0){
$("#suggest ul:first li:first-child").toggleClass("suggest_hover_js");
}else{
item.toggleClass("suggest_hover_js");
if(item.next().length==0){
$(item.closest("ul").nextAll("ul:first").find("li:first-child").toggleClass("suggest_hover_js"));
}else{
$(item.next()).toggleClass("suggest_hover_js");
}
}
}
else if(event.keyCode=='38'){
var item=$("#suggest ul li.suggest_hover_js");
if(item.length==0){
$("#suggest ul:last li:last-child").toggleClass("suggest_hover_js");
}else{
item.toggleClass("suggest_hover_js");
if(item.prev().length==0){
$(item.closest("ul").prevAll("ul:first").find("li:last-child").toggleClass("suggest_hover_js"));
}else{
$(item.prev()).toggleClass("suggest_hover_js");
}
}
}
},
fieldChanged:function(event,field){
var text=field.val();
if(text==null||text==""||text.length<this.minChars){
this.searchResult.clear();
return;
}
this.query.set({'q':text});
if(this.beforeRequest){
var doRequest=this.beforeRequest(text,this.query);
if(!doRequest){
return;
}
}
this.requestPending=true;
var _this=this;
this.searchResult.fetch({
'success':function(){
_this.requestPending=false;
if(_this.doSubmitOnNextRequest){
_this.submitForm();
}
},
'error':function(){
_this.requestPending=false;
},
'beforeSend':function(){
_this.requestPending=true;
}
});
},
fieldFocusOut:function(event,view){
view.remove();
},
fieldEnterPressed:function(field,event){
var link="";
var item=$("#suggest ul li.suggest_hover_js a");
if(item.length!=0){
link=item.attr('href');
window.location.href=link;
return false;
}else{
if(this.paramsAsFragment){
window.location.href=this.customSearchPath+"#search/"+this.suggestField.val();
return false;
}else{
if(this.requestPending){
this.doSubmitOnNextRequest=true;
return false;
}
if(this.beforeFormSubmit){
return this.beforeFormSubmit(field.parents('form:first'),field.val(),event);
}
return true;
}
}
}
});
oss.view.SuggestWindow=oss.view.View.extend({
template:null,
controller:null,
boxId:null,
events:{
"click .suggestItem":"itemClicked"
},
initialize:function(options){
oss.view.View.prototype.initialize.call(this,options);
this.model.bind('change',this.render,this);
this.model.bind('destroy',this.remove,this);
this.controller=options.controller;
this.field=options.field;
this.template=this.compileTemplate(options.template);
this.boxId=options.boxId;
this.appendAdditionalData=options.appendAdditionalData;
this.beforeSuggestShowed=options.beforeSuggestShowed||function(data){
return!((_.isEmpty(data.product_list)||_.isEmpty(data.product_list.products))&&
(_.isEmpty(data.content_list)||_.isEmpty(data.content_list.contents)))
};
},
render:function(){
if($(this.boxId).length){
$(this.boxId).remove();
}
if(this.appendAdditionalData){
var requestUrl=this.appendAdditionalData(this.model.attributes);
var _this=this;
$.ajax({url:requestUrl,success:function(data){_this.finalizeRender(data);}});
}else{
this.finalizeRender();
}
},
finalizeRender:function(additionalData){
if(_.isEmpty(this.model.attributes)||!this.beforeSuggestShowed(this.model.attributes,additionalData)){
return false;
}
var rendered=this.renderTemplate(this.template,this.model.attributes);
$(rendered).appendTo($('body'));
$(this.boxId).data('parentid',$(this.field).attr('id'));
var pos=$(this.field).offset();
var height=$(this.field).height();
$(this.boxId).css({"left":pos.left+"px","top":(pos.top+height)+"px"});
if($(this.field).data('responsive') == true) {
$(this.boxId).css({"left":"0px", "width":"100%"});  
}
if($(this.field).data('dynwidth') == true) {
$(this.boxId).css({"width":$(this.field).width()+"px"});  
}

$(this.boxId).show();
$(this.boxId+' a.suggestItem').click($.proxy(this.itemClicked,this));
return this;
},
itemClicked:function(event){
var data=$(event.target).data();
if(this.controller&&this.controller.itemClicked){
this.controller.itemClicked(data);
}
return false;
},
remove:function(){
if($(this.boxId).length){
_.delay(removeElement,400,this.boxId);
}
}
});
function removeElement(selector){
$(selector).remove();
}
oss.model.Query=Backbone.Model.extend({
});
oss.model.SearchResult=Backbone.Model.extend({
defaults:function(){
},
initialize:function(model,options){
this.query=options.query;
},
lastRequest:null,
sync:function(method,model,options){
if(this.lastRequest!=null){
this.lastRequest.abort();
}
if(this.url.indexOf('jsonp')==-1){
this.lastRequest=$.ajax({
type:'GET',
url:this.url,
data:this.query.attributes,
dataType:"json",
timeout:5000,
success:options.success,
error:options.error,
beforeSend:options.beforeSend
});
return this.lastRequest;
}else{
return $.ajax({
url:this.url,
data:this.query.attributes,
dataType:"jsonp",
jsonp:"callback",
timeout:5000,
scriptCharset:"utf-8",
success:options.success,
error:options.error
});
}
}
});
