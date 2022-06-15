var privatMode = false, initial_window_size;
if(navigator.cookieEnabled){
  if(typeof localStorage === 'object') {
    try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
    } catch (e) {
        privatMode = true;
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {};
    }
  }
}
if(navigator.cookieEnabled && !privatMode){
  /** https://github.com/martinkr/jStorage - Copyright (c) 2011 Martin Krause - Dual licensed under the MIT and GPL licenses. */
  (function(a){a.storage=function(){var d={localStorage:("localStorage" in window&&window.localStorage!==null)?"localStorage":"cookie",sessionStorage:("sessionStorage" in window&&window.sessionStorage!==null)?"sessionStorage":"cookie",cookie:"cookie",data:"data",status:"status",options:"options"};var c={sType:"data"};var g=function(){if(!jQuery.jCookie){throw new Error("[jQuery.storage] missing jQuery.jCookie. Get jcookie.min.js from https://github.com/martinkr/jCookie/")}if(!JSON){throw new Error("[jQuery.storage] missing JSON parser. Get json2.js from https://github.com/douglascrockford/JSON-js and / or visit json.org ")}}();var f=function(i,j){if(typeof(i)=="object"&&!i.type){i.type=c.sType}var k=typeof(i)=="string"?i:i.type;if(k.indexOf("Storage")!==-1&&d[k]=="cookie"){i.expires=(k=="sessionStorage")?"session":365}if(j){c.sType=d[k]}return{sType:d[k],sName:i.name||null,expires:i.expires||"session",secure:i.secure?true:false,path:i.path||false,domain:i.domain||false}};var e=function(m,i){var j=f(i);var k=j.sType;switch(k){case"options":return c[m];case"status":return d[m];case"data":if(jQuery(window).data("jStorage")===undefined){return undefined}return jQuery(window).data("jStorage")[m];case"cookie":m=["jStorage_",m].join("");var l=jQuery.jCookie(m);if(l){return JSON.parse(jQuery.jCookie(m))}else{return l}case"sessionStorage":case"localStorage":return window[k].getItem(m)}return undefined};var b=function(o,k,i){var n=(k===null)?false:true;var j=f(i||{type:c.sType},n);var m=j.sType;switch(m){case"data":var l=jQuery(window).data("jStorage")||{};if(k===null){return delete (l[o])}l[o]=k;jQuery(window).data("jStorage",l);return true;case"cookie":o=["jStorage_",o].join("");if(k===null){jQuery.jCookie(o,null);return true}jQuery.jCookie(o,JSON.stringify(k),j.expires,j);return true;case"sessionStorage":case"localStorage":if(k===null){window[m].removeItem(o);return true}window[m].setItem(o,k);return true}return false};var h=function(i){var l=f(i||{type:c.sType},false);var o=l.sType;var j=0;var n,m;switch(o){case"data":m=jQuery(window).data("jStorage")||{};for(n in m){j++}break;case"cookie":_aData=document.cookie.split(";")||{};var k=_aData.length;while(k--){if(_aData[k].indexOf("jStorage_")!==-1){j++}}break;case"sessionStorage":case"localStorage":j=window[o].length;break}return j};return{getItem:function(j,i){return e(j,i)},setItem:function(k,j,i){b(k,j,i)},removeItem:function(j,i){b(j,null,i)},length:function(i){return h(i)}}}()})(jQuery);
};
// ****************************//
//  HTML5 Checks
// ****************************//
function supports_html5_localStorage(){
  if(!navigator.cookieEnabled  || privatMode) { return false; };
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  }
  catch(e) {
    return false;
  }
};
function supports_html5_sessionStorage(){
  if(!navigator.cookieEnabled || privatMode) { return false; };
  try {
    return 'sessionStorage' in window && window['sessionStorage'] !== null;
  }
  catch(e){
    return false;
  }
};


// ****************************//
//  Compare Article
// ****************************//
localStore = function (q) {
  return {
    api: q.jStorage,
    timePeriodInMilliseconds: 0,
    maxItems: 3,
    get: function (n) {
      return this.api.get(n);
    },
    reInit: function() {
      return this.api.reInit();
    },
    set: function (n, t) {
      this.api.set(n, t, {
        TTL: this.timePeriodInMilliseconds
      });
    },
    removeStore: function (n) {
      return this.api.deleteKey(n);
    },
    isLocalStorageSupported: function () {
      return supports_html5_localStorage();  
    }
  };
}(jQuery),

compareArticle = function () {
  var // storename 
      sID = 'store_comparearticle',
      
      ls = null,
      
      // leere Struktur
      listdef = {
        "product_list" : {
          "products" : []  
        }  
      },
      
      // Zeitperiode wie lange im Store gespeichert wird - 14 Tage
      tp = 12096e5,
      
      // Store erstellen
      createStore = function(store) {
        if(!store.get(sID)){
          store.set(sID, listdef);
        } 
      },
      
      // Liste bereinigen nach Datum
      clearByDate = function(store) {        
        var a, b, c,
        s = store.get(sID),
        pList, pLenght = 0;

        if(store.get(sID) != null && store.get(sID).product_list){
          pList = store.get(sID).product_list.products;
          pLenght = pList.length;  
        }
        
        if(pLenght > 0){
          
          for(a = new Date(new Date - 12096e5), b = 0; b < pLenght; b++) {
            
            if(c = pList[b], new Date(c.tsinsert) < a) {
              pList.splice(b, pLenght - b), s.product_list.products = pList, ls.set(sID, s);
              break;
            }  
          } 
        }   
      },
      
      // Alle entfernen
      deleteFullList = function(store) {
        $(document).on('click', "#deleteCompareList", function () {
          if(store) {
            store.removeStore(sID); 
          }
          compareArticle.renderList($(".mainCompareList"));
          $('.articleColumn').hide();
        });  
      },
      
      // Aktionen
      itemAction = function(store) {        
        $(document).on('click', '.clearButton', function () {
          var itemID = $(this).data('pid'),
              s = store.get(sID), pList = s.product_list.products, itemIndex, compareListItems;
          
          $.each(pList, function(index, val){
             if(val.id === parseInt(itemID)){
                itemIndex = index;
                return false;
             }
          });
          
          if(itemIndex || itemIndex === 0) {
            pList.splice(itemIndex, 1);
          }
          s.product_list.products = pList;
          ls.set(sID, s);   
                    
          $('.articleColumn.'+$(this).data('col')).hide();
          
          if($('.mainCompareList .articleColumn:visible').length === 0){
            store.removeStore(sID);
            compareListItems = 0;
            $('#compareArticleModal').modal('hide');
            $('.compareListAmount').html(compareListItems);
          } else {
            compareListItems = s.product_list.products.length;
            $('.compareListAmount').html(compareListItems);
          }     
        });  
      },
      
      // bei mehr als Limit ältesten entfernen
      removeOldest = function(store) {
        var s = store.get(sID), pList = store.get(sID).product_list.products, pLenght = pList.length;        
        if(pLenght > store.maxItems){
          pList.sort(function(a, b){
            return a.tsinsert-b.tsinsert;
          });
          
          pList.splice(0, 1);
          
          pList.sort(function(a, b){
            return b.tsinsert-a.tsinsert;
          });
          
          s.product_list.products = pList;
          ls.set(sID, s);
        }  
      };
      
      
      // Produktdaten holen
      refreshProductData = function(store) {
        var snippet, pList = store.product_list.products, surl = '/search/.json', pdata;
        
        if(store && store.product_list){
          var pTmpList = store.product_list.products;
          pTmpLenght = pTmpList.length;  
        }
        
        if(pTmpList.length < 1) {
          
        } else {
          $.each(pList, function(index, val){   
            if(index == 0) {
              surl = surl + '?filter.id.term='+val.id;  
            } else {
              surl = surl + '&filter.id.term='+val.id;
            }
          });
                    
          $.ajax({
            url: surl,
            type: 'GET',
            dataType: "json",
            async: false,
            success: function(msg){
              pdata = msg;  
            }
          });
          
          $.each(pTmpList, function(index, val){
            $.each(pdata.product_list.products, function(i, tmpval){
              if(val.id === tmpval.id) {
                tmpval.tsinsert = val.tsinsert;  
              }
            });
          });
          
          pdata.product_list.products.sort(function(a, b){
            return b.tsinsert-a.tsinsert;
          });
          
          store = pdata;          
          snippet = DT.renderSnippet ('compare_list', store);
          $('.mainCompareList').html(snippet);
        }
      };
      
  
  return {
    init: function () {
      ls = localStore;
      ls.timePeriodInMilliseconds = tp;
      ls.isLocalStorageSupported() && (createStore(ls), deleteFullList(ls), itemAction(ls));
    },
     
    updateProductsInStorage: function() {      
      if(ls.get(sID) && ls.get(sID).product_list){
        var pTmpList = ls.get(sID).product_list.products;
        pTmpLenght = pTmpList.length;  
      }
            
      $(document).on('click', '.addToCompareList', function () {
        if(!ls.get(sID)){
          createStore(ls);
        }
        var newitem, 
            listact = ls.get(sID),
            pID = product.id,
            pURL = product.url,
            pTsInsert = new Date(),
            pTsInsert = pTsInsert.getTime(),
            pgSKU = product.grouping_sku, rec,
            compareListItems = 0;
                    
        // check if product in store
        rec = $.grep(listact.product_list.products, function(e){
          if(pgSKU === undefined || e.grouping_sku === undefined) {
            return e.id === pID;  
          } else {
            return e.grouping_sku === pgSKU;  
          }
        });
                
        if(rec && rec.length > 0){}
        else {
          newitem = product;
          newitem.tsinsert = pTsInsert;
          
          listact.product_list.products.unshift(newitem);
          ls.set(sID, listact);
          removeOldest(ls);

          var snippet = DT.renderSnippet ('compare_list', ls.get(sID));
          $('.mainCompareList').html(snippet);
        }
            
        if(ls.get(sID) != null) {
          refreshProductData(ls.get(sID));  
        }
            
        $('#compareArticleModal ').appendTo($('body'));  
        $('#compareArticleModal').modal('show');
        $('#compareArticleModal').on('shown.bs.modal', function (e) {
          $('#compareArticleModal .modal-dialog').css('padding-right', '0px');
          if(localStore.get('store_comparearticle') != null && localStore.get('store_comparearticle').product_list.products.length > 0) {
            $('.noItemsMsg').hide();
            $('.mainCompareList').show();
            $('#compareArticleModal .modal-footer').show();  
          } else {
            $('.noItemsMsg').show();
            $('.mainCompareList').hide();
            $('#compareArticleModal .modal-footer').hide(); 
          }
        });
        $('#compareArticleModal').on('hidden.bs.modal', function (e) {
          if(ls.get(sID) != null) {
            compareListItems = ls.get(sID).product_list.products.length;  
          }
          $('.compareListAmount').html(compareListItems);
        });
        return false;
        
      });
      
      $(document).on('click', '.close-modal', function () {
        $('#compareArticleModal').modal('hide');
      });
      
    },
    
    clearList: function(){
      clearByDate(ls);  
    },
    
    renderList: function(cont) {
      var snippet;
      (ls.get(sID) && ls.get(sID).product_list.products.length > 0 ) && (snippet = DT.renderSnippet ('compare_list', ls.get(sID)), cont.html(snippet));
    }   
  };  
}(),

function(j) {
  j(function () {
    if(localStore.isLocalStorageSupported()) {
      var lvCont = j(".mainCompareList");
      lvCont.length >= 1 && (compareArticle.init() , compareArticle.clearList(), compareArticle.updateProductsInStorage() /*, compareArticle.renderList(lvCont)*/);
    }
  });
}(jQuery);



jQuery(document).ready(function($) {
  
  
  // ****************************//
  //  Geoip Location 
  // ****************************//  
  var redirect = function(isocode) {
    var showModal = function(site) {
      var dataObj, snippet;
      
      var shop_lang = false;
      var local_lang = false;
      
      if (DT && DT.variables && DT.variables._locale) {
        shop_lang = DT.variables._locale.toLowerCase().split('-')[0];
      }
      local_lang = window.navigator.language.toLowerCase().split('-')[0];
      
      if(shop_lang == false || local_lang == false) {
        if(localStorage.getItem('geoip_country_name_en') !=  null){
          site.name = localStorage.getItem('geoip_country_name_en'); 
        }
      } else {
        if(shop_lang != local_lang) {
          if(localStorage.getItem('geoip_country_name_en') !=  null){
            site.name = localStorage.getItem('geoip_country_name_en'); 
          }
        } else {
          if(localStorage.getItem('geoip_country_name') !=  null){
            site.name = localStorage.getItem('geoip_country_name'); 
          }
        }
      }
      
      dataObj = {
        site : site
      };
      
      try {
        snippet = DT.renderSnippet ('redirect_win', dataObj);
        $('.redwin').html(snippet);
        
        if(shop_lang == false || local_lang == false) {
          $('.asfallback').toggleClass('d-none');
        } else {
          if(shop_lang != local_lang) {
            $('.asfallback').toggleClass('d-none');
          } else {
            $('.asdefault').toggleClass('d-none');
          }
        }
                
        $('#redirectModal ').appendTo($('body'));  
        $('#redirectModal').modal('show');
        
        $('#redirectModal').on('hidden.bs.modal', function (e) {
          if(supports_html5_sessionStorage()) {
            $.storage.setItem('showed_red_win', true, 'sessionStorage');  
          } else {
            document.cookie = "showed_red_win=true; path=/";
          }
        });
      } catch(e) {
        $('.debugpix').show();
      }
      
    };
    
    var countries = {};
    
    try {
      if (DT && DT.variables && DT.variables.link_lists.countries){
        $.each(DT.variables.link_lists.countries.links,function(key,column) {
          if(column.children.length > 0) {
            $.each(column.children, function(key,continent){
              if(continent.children.length > 0) {
                $.each(continent.children, function(key,country){
                  if(country.children.length > 0) {
                    $.each(country.children, function(key,subcountry){
                      countries[subcountry._string1] = {
                        'url'  : subcountry.url,
                        'name' : subcountry.name,
                        'img'  : subcountry.featured_media.src
                      };
                    });
                  } else {
                    countries[country._string1] = {
                      'url'  : country.url,
                      'name' : country.name,
                      'img'  : country.featured_media.src
                    }; 
                  }
                });  
              }
              
            });  
          }     
        });  
      };  
    } catch(e) {
      $('.debugpix').show();
    }
    
    //test
    //console.log(isocode);
    //isocode = 'li';
    //showModal(countries[isocode]);
    if(isocode && (isocode != 'ch' && isocode != 'li')){      
      if(supports_html5_sessionStorage()) {
        if(!$.storage.getItem('showed_red_win','sessionStorage')){
          if(countries[isocode] != undefined) {
            showModal(countries[isocode]);  
          } else {
            showModal({
              'url'  : '',
              'name' : '',
              'img'  : ''
            });
          }
        }
      } else {
        if(getCookie('showed_red_win') === '') {
          if(countries[isocode] != undefined) {
            showModal(countries[isocode]);  
          } else {
            showModal({
              'url'  : '',
              'name' : '',
              'img'  : ''
            });
          }
        }
      }
    }
  };
  
  if(noBot){
    try {
      if(localStore.isLocalStorageSupported()){
        if(localStorage.getItem('geoip_country') !=  null) {
          redirect(localStorage.getItem('geoip_country'));    
        } else {
          var getisocode = geoip2.country(
            function(response){
              try {
                if (DT && DT.variables && DT.variables.shop.locale.language) {
                  var shoplang = DT.variables.shop.locale.language;
                  if(shoplang == 'it') {
                    shoplang = 'en';
                  }  
                } else {
                  var shoplang = 'de';
                };
                                
                localStorage.setItem('geoip_country', response.country.iso_code.toLowerCase());
                localStorage.setItem('geoip_country_traits', response.traits.ip_address);
                localStorage.setItem('geoip_country_name', response.country.names[shoplang]);
                localStorage.setItem('geoip_country_name_en', response.country.names['en']);
                redirect(response.country.iso_code.toLowerCase());
              } catch (e) {
                redirect('ch');  
              }
            },function(){
              redirect('ch');
            }
          );
        }
      } else {
        var getisocode = geoip2.country(
          function(response){
            redirect(response.country.iso_code.toLowerCase());
          },function(){
            redirect('ch');
          }
        );
      }
    } catch (e) {
      redirect('ch');
    }   
  };
  
  
  
  // **************************************//
  // Cookie warning
  // **************************************//
  var cookieInfoName = "showed_cookie_info";
  $('.ckClose').click(function(){
    if(supports_html5_localStorage()) {
      localStorage.setItem(cookieInfoName, "true");  
    } else {
      document.cookie = cookieInfoName + "=true; path=/";
    }
    $('.ckInfo').remove();
  });
  
  if(supports_html5_localStorage()) {
    if(localStorage.getItem(cookieInfoName) === "true"){
      $('.ckInfo').remove();
    } else {
      try {
        if($('.ckInfo').length > 0) {
          if($('.ckInfo').data('ckurl') != '' || $('.ckInfo').data('ckurl') != undefined) {
            $.ajax($('.ckInfo').data('ckurl'), {
              success: function(data) {
                var c_txt = data.content.body;
                $('.ckText').html(c_txt);
                $('.ckInfo').show();
              },
              error : function() {
                $('.ckInfo').hide();
              }
            });
          } 
        }
      } catch(e) {
        return false;
      }
    }
  } else {
    if(getCookie(cookieInfoName) !== '') {
      $('.ckInfo').remove();
    } else {
      try {
        if($('.ckInfo').length > 0) {
          if($('.ckInfo').data('ckurl') != '' || $('.ckInfo').data('ckurl') != undefined) {
            $.ajax($('.ckInfo').data('ckurl'), {
              success: function(data) {
                var c_txt = data.content.body;
                $('.ckText').html(c_txt);
                $('.ckInfo').show();
              },
              error : function() {
                $('.ckInfo').hide();
              }
            });
          } 
        }
      } catch(e) {
        return false;
      }
    }
  }
  
  
  
  // **************************************//
  // Jahr Copyright Footer
  // **************************************//
  var cy = new Date();
  if($('.cYear').length > 0) {
    $('.cYear').html(cy.getFullYear());  
  };
  
  
  
  // ****************************//
  //  Warenkorb Status
  // ****************************//
  try {
    if (DT && DT.variables && DT.variables.cart) {
      $('.basketAmount').html(DT.variables.cart.product_count); 
      if(DT.variables.cart.item_count > 0) {
        $('.basketValue').show();
        $('.basketValue').html(DT.variables.cart.after_discount_subtotal + ' '+ $('.basketValue').data('currsymb') +'');
      } else {
        $('.basketValue').hide();
      }
    };
    $('.cartLink').show();
  } catch(e) {
  };
  
  
  
  // ****************************//
  //  Login Status
  // ****************************//
  try {
    if (DT && DT.variables && DT.variables.user && DT.variables.user.logged_in) {
      $('.is_logged_in').show();
      $('.is_not_logged_in').hide();
    } else {
      $('.is_logged_in').hide();
      $('.is_not_logged_in').show();
    };
  } catch(e) {
  };
  
  $('.mobile-topbar .account-links').show();
  
  // ****************************//
  //  My Products Status
  // ****************************//
  try {
    if (DT && DT.variables && DT.variables.user && (DT.variables.user.has_individual_prices || DT.variables.user.has_individual_products)) {
      $('.my-products-link').removeClass('d-none');
    } else {
      $('.my-products-link').addClass('d-none');
    };
  } catch(e) {
  };
  
  
  
  // ****************************//
  //  Falls Localstorage erlaubt Vergleichenbutton einblenden und Status anzeigen 
  // ****************************//
  if(localStore.isLocalStorageSupported() && localStore.get('store_comparearticle') != null) {
    var compareListItems = localStore.get('store_comparearticle').product_list.products.length;
    $('.compareListAmount').html(compareListItems);
    $('.addToCompareList').show();
    $('.compareLink').css('display','inline-block');
    $('#OffcanvasNavigation .compareLink').css('display','block');  
  };
  
  
  
  // ****************************************************** //
  //  Session Storage zur Speichern der letzten Listenansicht
  // ****************************************************** //
  if($('.isListView').length > 0) {
    if(supports_html5_sessionStorage()) {
      var actListUrl = $(location).attr('href');
      $.storage.setItem('lastListUrl', actListUrl, 'sessionStorage');  
    } 
  };
  if($('.continueShopping').length > 0) {
    if(supports_html5_sessionStorage()) {
      var continueUrl = $.storage.getItem('lastListUrl','sessionStorage');
    };
    if(continueUrl != '' && continueUrl != null){
      $('.continueShopping').attr('href', continueUrl);  
    } else{
      $('.continueShopping button span').html($('.continueShopping').data('label'));
      $('.continueShopping').attr('href', 'javascript:history.back()');
    }
  };
  
  
  
  // ****************************************************** //
  //  Carousel
  // ****************************************************** //
  var images = $('#sfpSlider218').find('picture').get();
  picturefill({
    elements: images
  });
  
  // Unhide pictures
  $('#sfpSlider218').find('.rsContent').each(function(){
    $(this).removeClass('hide');
  });

  // Load slider
  var sliderHome = $('#sfpSlider218').royalSlider({
    "autoScaleSlider":false,
    "autoScaleSliderWidth":0,
    "autoScaleSliderHeight":0,
    "imageScaleMode":"none",
    "imageAlignCenter":false,
    "imageScalePadding":4,
    "controlNavigation":"bullets",
    "arrowsNav":true,
    "arrowsNavAutoHide":false,
    "arrowsNavHideOnTouch":true,
    "imgWidth":null,
    "imgHeight":null,
    "slidesSpacing":8,
    "startSlideId":0,
    "loop":true,
    "loopRewind":false,
    "randomizeSlides":false,
    "numImagesToPreload":4,
    "usePreloader":true,
    "slidesOrientation":"horizontal",
    "transitionType":"move",
    "transitionSpeed":800,
    "easeInOut":"easeInOutSine",
    "easeOut":"easeOutSine",
    "controlsInside":true,
    "navigateByClick":false,
    "sliderDrag":true,
    "sliderTouch":true,
    "keyboardNavEnabled":true,
    "fadeinLoadedSlide":false,
    "allowCSS3":true,
    "globalCaption":false,
    "addActiveClass":false,
    "minSlideOffset":10,
    "autoHeight":true,
    "slides":null,
    "thumbs":{
      "drag":true,
      "touch":true,
      "orientation":"horizontal",
      "arrows":true,
      "spacing":4,
      "arrowsAutoHide":false,
      "autoCenter":true,
      "transitionSpeed":600,
      "fitInViewport":true,
      "firstMargin":true,
      "arrowLeft":null,
      "arrowRight":null,
      "appendSpan":false
    },
    "fullscreen":{
      "enabled":false,
      "keyboardNav":true,
      "buttonFS":true,
      "nativeFS":false
    },
    "deeplinking":{
      "enable":false,
      "change":false,"prefix":""
    },
    "autoPlay":{
      "enabled":true,
      "stopAtAction":true,
      "pauseOnHover":true,"delay":4000
    },
    "video":{
      "autoHideArrows":true,
      "autoHideControlNav":false,
      "autoHideBlocks":false,
      "youTubeCode":"<iframe src=\"http:\/\/www.youtube.com\/embed\/%id%?rel=1&autoplay=1&showinfo=0\" frameborder=\"no\"><\/iframe>",
      "vimeoCode":"<iframe src=\"http:\/\/player.vimeo.com\/video\/%id%?byline=0&amp;portrait=0&amp;autoplay=1\" frameborder=\"no\" webkitAllowFullScreen mozallowfullscreen allowFullScreen><\/iframe>"
    },
    "block":{
      "fadeEffect":true,
      "moveEffect":"left",
      "moveOffset":20,
      "speed":400,
      "easing":"easeOutSine",
      "delay":200
    },
    "visibleNearby":{
      "enable":true,
      "centerArea":0.6,
      "center":true,
      "navigateByCenterClick":true,
      "breakpoint":0,
      "breakpointCenterArea":0.8
    },
    "autoHideNavigation":{
      "enabled":true
    }
  }).data('royalSlider');
  
  $('.rsOverflow').width('100%');
  
  try {
    if(sliderHome != undefined && sliderHome.numSlides == 1) {
      $('#carousel-home .rsArrow').remove();  
    }
  } catch (e){
     //console.log(e);
  }
  
  
  // ******************************************//  
  // Klick auf Warenkorb Button
  // ******************************************//
  $('.addToCartButton').click(function(){
    var form = $(this).parents('form:first'),
        amountfield = $('.amount', form),
        printfield = $('input[name="line_items[0][_string1]"]', form);
    
    amountfield.removeClass('is-invalid');  
    printfield.removeClass('is-invalid');  
    
    if(amountfield.val() == '') {
      amountfield.addClass('is-invalid');
    } else {
      var isValid = true;
      
      var minorderquantity = amountfield.data('minorderquantity');
      
      if($('input.custom-product-trigger').is(':checked') && amountfield.data('minorderquantity-print') != undefined){
        var minorderquantity = amountfield.data('minorderquantity-print');
      }
      
      if(minorderquantity != undefined && amountfield.val() < minorderquantity) {
        isValid = false;
        amountfield.addClass('is-invalid');  
        $(form.next('.minAmount')).addClass('red');
      }
      
      if($('input.custom-product-trigger').is(':checked')){
        if( printfield.val().length == 0){
          isValid = false;
          printfield.addClass('is-invalid');  
        }
      }
      
      if(isValid){
        form.submit();
      }
    }
    return false;
    
  });
  
  
  
  // ******************************************//  
  // Klick auf Warenkorb Button wenn inaktiv
  // ******************************************//
  $('.addToCartButtonInAct').click(function(){
    $('.noOrderAlert').show();
    return false;
  });
  $('.noOrderAlert a').each(function () {
    var s = '<span class="text-underline">', decoded;
    $(this).prop('innerHTML', function (_, html) {
        s += html.replace(/&amp;/g, '&').replace(/(g|j|p|q|y|Q|@|{|_|\(|\)|\[|\||\]|}|;|,|§|µ|ç|\/)/g, '</span>$1<span class="underline">');
        s += '</span>';
        $(this).html(s);
    });
  });
  
  
  
  // ****************************************************** //
  //  Warenkorbmenge ändern
  // ****************************************************** //
  $('.changeBasket').click(function(){
    var form = $(this).parents('form'), amountfield = $('.cartamount', form);
    
    if(amountfield.val() == '') {
      amountfield.addClass('is-invalid');
    } else if (amountfield.val() == '0') {
      form.submit();
    } else {
      if(amountfield.data('minorderquantity') != undefined && amountfield.val() < amountfield.data('minorderquantity')) {
        amountfield.addClass('is-invalid');
        amountfield.val($('.cartamount', form).data('tmpval'));
        $('.minAmount', form).removeClass('hidden');
      } else {
        form.submit();  
      }
    }
    return false;
  });
  
  
  
  // **********************************************//  
  // Klick auf Artikel aus Warenkorb entfernen Button
  // **********************************************//
  $('.removeFromCartButton').click(function(){
    var form = $(this).parent('.removeFromCartForm');
    form.submit();
    return false;  
  });
  
  
  
  // *************************************************************//  
  // Klick auf Warenkorbbutton wenn minordervalue unterschritten ist
  // *************************************************************//
  $('.minval_button').click(function() {
    $('#minvalModal ').appendTo($('body'));  
    $('#minvalModal').modal('show');
  });
  
  
  
  // *************************************************************//  
  // Rabattanzeige
  // *************************************************************//
  $('.discount_rate_teaser_info').click(function(){
    $('#discountRateModal ').appendTo($('body'));  
    $('#discountRateModal').modal('show');
  });
  
  
  
  // **********************************************//  
  // Klick auf Couponentfernen Button
  // **********************************************//
  $('.removeCouponFormButton').click(function(){
    var form = $('.'+$(this).data('form')+'');
    form.submit();
    return false;  
  });
  
  
    
  // *******************************//
  // Modal Fenster mit Ajax Inhalt
  // *******************************//
  $('.openContentModal').click(function(){
    var contentURL = $(this).data('url');
    
    $.ajax({
      url: contentURL+'.json',
      type: 'GET',
      dataType: "json",
      async: false,
      success: function(data){
        var snippet = DT.renderSnippet ('content_view_default', data);
        $('#contentModal .modal-body').html(snippet);
        $('#contentModal .modal-title').html(data.content.headline);  
      }
    });
    $('#contentModal ').appendTo($('body'));  
    $('#contentModal').modal('show');
    return false;
  });
  
  
  
  // *******************************//
  // Modal Fenster mit Statischem Inhalt
  // *******************************//
  $('.openStaticModal').click(function(){
    var modal_content_data = {
      "content": {
        "body":""+$(this).data('modalcontent')+""
       }
     };
    snippet = DT.renderSnippet ('content_view_default', modal_content_data);
    $('#contentModal .modal-body').html(snippet);
    $('#contentModal .modal-title').html($(this).data('modalheadline'));
    
    $('#contentModal ').appendTo($('body'));  
    $('#contentModal').modal('show');
    return false;
  });
  
  
  
  // *******************************//
  // Modal Fenster Passwort vergessen
  // *******************************//
  $('.openForgotPwdtModal').click(function(){
    if($('#forgotPwdModal .captchaEl').length > 0) {
      insertCaptchaApi();
    }
    $('.scMsg').hide();
    $('.adviceCont').show();
    $('#forgotPwdForm').show();
    
    $('#forgotPwdModal ').appendTo($('body'));  
    $('#forgotPwdModal').modal('show');
    
    $('#forgotPwdModal').on('hidden.bs.modal', function (e) {
      $('#forgotPwdForm')[0].reset();
      $('#resetpwd').button('reset');
    });
    
    return false;
  });
  
  $('#resetpwd').on("click", function() {   
    var form = $(this).parents('form:first'), formValid = validateForm(form); 
    
    if(formValid == false ) {
      // error handling
    } else {
      try {
        $(this).button('loading'); 
        
        $.ajax({
          url: form[0].action,
          type: form[0].method,
          data: $(form).serialize(),
          success: function(data) {
            $('#resetpwd').button('reset');
            
            if(data.workflow.current_step.forms.customer_email.recaptcha.recaptcha_challenge_error) {
              $('.captchaCont').addClass('is-invalid');  
            } else {
              $('.scMsg').show();
              $('.adviceCont').hide();
              $('#forgotPwdForm').hide();  
            }
          }
        });  
      } catch (e){
        //console.log(e);
      }
    }
    return false;
  });
  
  
  
  // *******************************//
  // Modal Angebot anfordern
  // *******************************//
  $('.openAskOfferModal').click(function(){
    if($('#askOfferModal .captchaEl').length > 0) {
      insertCaptchaApi();
    }
    $('.scMsg').hide();
    $('.error_msg').hide();
    
    $('#askOfferModal ').appendTo($('body'));  
    $('#askOfferModal').modal('show');
    
    $('#askOfferModal').on('hidden.bs.modal', function (e) {
      $('#offerForm')[0].reset();
      $('#offerForm .is-invalid').removeClass('is-invalid');
      $('#offerForm .submitForm').button('reset');
    });
    
    return false;
  });
  
  
  
  // *******************************//
  // Modal Artikel per Mail empfehlen
  // *******************************//
  $('.openRecArticleModal').click(function(){
    if($('#recArticleModal .captchaEl').length > 0) {
      insertCaptchaApi();
    }
    $('.scMsg').hide();
    $('.error_msg').hide();

    $('#recArticleModal ').appendTo($('body'));  
    $('#recArticleModal').modal('show');
    
    $('#recArticleModal').on('hidden.bs.modal', function (e) {
      $('#recForm')[0].reset();
      $('#recForm .is-invalid').removeClass('is-invalid');
      $('#recForm .submitForm').button('reset');
    });
    
    return false;
  });
  
  $('.send_recarticle_form').click(function() {
    var formValid = true, form = $('#recForm');
    
    $('.is-invalid', form).removeClass('is-invalid');
    formValid = validateForm(form);
    // Senden
    if(formValid) {
      $('#loadingDiv').show();      
      
      $.ajax({
        url: form[0].action,
        type: form[0].method,
        data: $(form).serialize(),
        success: function(data){
          $('#loadingDiv').hide();
          $('.error_msg').hide();
          
          if(data.errors != null) {
            if(data.errors.length > 0) {
              $('.error_msg').show();
              for (var e = 0; e < data.errors.length; e++){
                if(data.errors[e] == 'recaptcha_wrong' || data.errors[e] == 'recaptcha_missing') {
                  $('.captchaCont').addClass('is-invalid');  
                }
              }
            }
          } else {             
            $(form).hide();
            $('.scMsg').show();
          }
        }
      });
    };
    return false;  
  });
  
  
  
  // **************************************//
  // Formular absenden
  // **************************************//
  $('.submitForm, .submitOrderFinal').click(function() {
    try {      
      var form = $(this).parents('form:first'), formValid, submitButton;
      
      if($(this).hasClass('submitOrderFinal')) {
        form = $('#orderSubmitForm');
      }
      
      $('textarea.nobreaks', form).each(function(){
        //Removes all 3 types of line breaks
        var cleanTxt = $(this).val().replace(/(\r\n|\n|\r)/gm," ");
        $(this).val(cleanTxt);
      });
        
      formValid = validateForm(form);
            
      // Zustimmung
      if($(this).hasClass('sendOrderButton') || $(this).hasClass('submitOrderFinal') || $(this).hasClass('submitForm')){
        if($('#acceptNews').is(':checked')){
          $('#acceptNewsField').val(0);
          $('#consentToAdsField').val(true);
        } else {
          $('#acceptNewsField').val(1);
          $('#consentToAdsField').val(false);
        }
      };
      
      if($(this).hasClass('zip_check')) {
        $('.errMessage', $('.zip_input', form).parents('.ffield')).html($('.errMessage', $('.zip_input', form).parents('.ffield')).data('deferror'));
        
        if($('.country_select', form).val() == 'CH' || $('.country_select', form).val() == 'LI') {
          if($('.zip_input', form).val().length != 4 || isNaN($('.zip_input', form).val())) {
            formValid = false;
            $('.zip_input', form).parents('.ffield').addClass('is-invalid');
            $('.errMessage', $('.zip_input', form).parents('.ffield')).html($('.errMessage', $('.zip_input', form).parents('.ffield')).data('ziperror'));    
          }
          
          if($('.country_select', form).val() == 'LI') {
            if($('.zip_input', form).val().substr(0, 2) != '94' || isNaN($('.zip_input', form).val())) {
              formValid = false;
              $('.zip_input', form).parents('.ffield').addClass('is-invalid');
              $('.errMessage', $('.zip_input', form).parents('.ffield')).html($('.errMessage', $('.zip_input', form).parents('.ffield')).data('ziperror'));
            }
          }
        }
      }
            
      // Senden
      if(formValid) {
        if($(form).is('#orderSubmitForm')){
          submitButton = $('.submitButtonCont button', form);
          submitButtonTop = $('buttonsubmitOrderFinal');
          
          if(submitButton.prop('disabled') == true || submitButtonTop.prop('disabled') == true){
            return;
          }
        
          submitButton.prop('disabled', true);
          submitButtonTop.prop('disabled', true);
          
          setTimeout(function(){
            submitButton.prop('disabled', false);
            submitButtonTop.prop('disabled', false);
          }, 8000);
        }
        
        if(form.hasClass('ajaxForm')) {
          // Ajax Variante
          $('#loadingDiv').show();
          $.ajax({
            url: form[0].action,
            type: form[0].method,
            data: $(form).serialize(),
            success: function(data){
              $('#loadingDiv').hide();
              $('.error_msg').hide();
              
              if(data.forms.contact.errors.length > 0) {
                $('.error_msg').show();
                if(data.forms.contact.recaptcha.recaptcha_challenge_error) {
                  $('.captchaCont').addClass('is-invalid');
                }
              } else {             
                $(form).hide();
                $('.scMsg').show();
              }
            }
          });  
        } else {
          // Normale Variante
          form.submit();  
        }
      } else {
        if($(this).hasClass('sendOrderButton') || $(this).hasClass('submitOrderFinal')){
          scrollToAnchor('toMiddle');
        } else {
          scrollToAnchor('toTop');  
        }
      }
      return false;  
    } catch (e){
      return false;    
    };    
  });
  
  
  
  // **************************************//
  // Checkout Steps
  // **************************************//
  $('.arrow_box_1').not($('.arrow_box_1.current_step')).mouseover(function(){
    if($('.arrow_box_2').hasClass('current_step')) {
      $(this).addClass('w_arrow_w');    
    }  
  }).mouseout(function() {
    if($('.arrow_box_2').hasClass('current_step')) {
      $(this).removeClass('w_arrow_w');    
    }
  });
  $('.arrow_box_2').not($('.arrow_box_2.current_step')).mouseover(function(){
    $('.arrow_box_1.current_step').addClass('w_border');
    
    if($('.arrow_box_3').hasClass('current_step')) {
      $(this).addClass('w_arrow_w');    
    }  
  }).mouseout(function() {
    $('.arrow_box_1.current_step').removeClass('w_border');
    
    if($('.arrow_box_3').hasClass('current_step')) {
      $(this).removeClass('w_arrow_w');    
    }
  });
  
  $('.arrow_box_3').mouseover(function(){
    $('.arrow_box_2.current_step').addClass('w_border');  
  }).mouseout(function() {
    $('.arrow_box_2.current_step').removeClass('w_border');
  });
  
  $('.steps-step').click(function(){
    var link = $('a', $(this)).attr('href');
    if(link != ''){
      window.location.href = link; 
    }
  });
  
  
  
  // **************************************//
  // Address manager
  // **************************************//
  initCOAddressManager();
  
  
  
  // **************************************//
  // Lieferwunsch einblenden
  // **************************************//
  $('.deliverOption input').click(function(){
    var selectedOptVal = $(this).val();
    $('#paymentType input[name="_integer1"]').val(selectedOptVal);  
  });
  
  
  
  // **************************************//
  // Zahlart und Lieferwunsch absenden
  // **************************************//
  $('.submitPayment').click(function(){
    var form = $('#paymentType'), formValid = validateForm(form);
    
    // Senden
    if(formValid) {
      form.submit();
    } else {
      $('.selectPayment').addClass('red');
      $('.paymentOption span', form).addClass('red');
      scrollToAnchor('toTop');
    }
  });
  
  
  // **************************************//
  // Ändern Links
  // **************************************//
  $('.changeLink').click(function() {
    $(this).prev('form').submit();
  });
  
  
  
  // **************************************************** //
  // Coupon Form
  // **************************************************** //
  initCouponFormPerAjax();
  
  
  
  // **************************************//
  // Count max numer characters
  // **************************************//
  $('.maxnrcount').on('keyup',function(event){
    var charCount = $(this).val().length;
    $('.nrOfCharacters').text(charCount);
  }).keydown(function( event ) {
    if(event.keyCode == 13 ) {
      event.preventDefault();
    }
  });
  
  
  
  // **************************************//
  // Bestelldaten anzeigen
  // **************************************//
  $('.showOrderDetailsButton').click(function(){
    $('#orderPosContainer').show();
    $(this).hide();  
  });
  
  
  
  // **************************************//
  // Drucken
  // **************************************//
  $('.printOrder').click(function(){
    $('body').removeClass('compareModal');
    window.print();
  });
  
  
  
  // **************************************//
  // Contactform
  // **************************************//
  if($('#contactForm .captchaEl').length > 0) {
    insertCaptchaApi();
  }
  
  if($('#contactForm').length > 0){
    $('.countrySel option').each(function(){
      if($(this).val() == $('.countrySel').data('selval')) {
        $(".countrySel").val($('.countrySel').data('selval'));
      }  
    }); 
  }
  
  
  
  // ****************************//
  //  Google Map
  // ****************************//
  if($('#map_canvas').length > 0) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay; 

    function initialize() {
      var mapDimesions, mapWidth, mapHeight;
  
      mapDimesions = calcMapDimensions();
      mapWidth = mapDimesions.width;
      mapHeight = mapDimesions.height;
      
      $('#map_canvas').css('width', mapWidth);
      $('#map_canvas').css('height', mapHeight);
      
      directionsDisplay = new google.maps.DirectionsRenderer();
      var mapCanvas = document.getElementById('map_canvas');
      var markerimage =  {
        url   : $('#map_canvas').data('logourl')
      };
      var mapOptions = {
        center: new google.maps.LatLng(47.353024,  8.340519),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(mapCanvas, mapOptions);
      var utzMarker = new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        icon: markerimage
      });
      directionsDisplay.setMap(map);
    };
    
    function calcRoute(){
      var start = document.getElementById('directionsFrom').value;
      var end = document.getElementById('directionsTo').value;
      var travelMode = document.getElementById('travelMode').value;
        
      var request = {
        origin:start,
        destination:end,
        travelMode: travelMode
      };        
      directionsService.route(request, function(response, status) {        
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    }
    
    $('.calcRouteButton').click(function(){
      calcRoute(); 
    });
    
    $(window).resize(function() {
      if(document.getElementById('directionsTo').value) {
        calcRoute();  
      }
    });
    
    google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addDomListener(window, 'resize', initialize);
  }
  
  
  
  // ****************************//
  //  Clean Empty Nodes
  // ****************************//
  //clean(document.body);
  
  
  
  // ****************************//
  //  Video Handling
  // ****************************//
  if($('.videoImage').length > 0) {
    $('.videoImage').each(function(){
      var videosrc = $(this).data('videosrc'), varr, vid, vidarr, vidclean = "";
     
      if(videosrc != "") {
        varr = videosrc.split('/'); 
        vid = varr[varr.length - 1];
        vidarr = vid.split('?');
        vidclean = vidarr[0];
      }

      if(vidclean != "") {
        if($(this).data('videoplattform') == 'youtube') {
          $('.videoprev', this).attr('src', 'https://img.youtube.com/vi/'+vidclean+'/0.jpg');
        }
        if($(this).data('videoplattform') == 'vimeo') {
          $('.videoprev', this).addClass('vidmain' + vidclean);
        }         
      }      
    });
  }
  
  if($('.modalVideoLink').length > 0) {
    if($('.modalVideoLink').hasClass('sketchfab')) {
      
      $('.modalVideoLink.sketchfab').lightcase({
        iframe: {
          width: 1280,
          height: 720,
          frameborder: 0,
          scrolling:"no",
          allowfullscreen:"allowfullscreen"
        },
        onFinish: {
          corge: function () {
            var $lightbox = $('#lightcase-case'),
                $lightboxCaption = $lightbox.find('.lightcase-caption');
                //caption = lightcase.objectData.$link.parents('.csc-textpic-image').find('.csc-textpic-caption').html();
            $lightbox.addClass('3DModal');
            //$lightboxCaption.html(caption).show();
          }
        }
      });  
    } else {
      $('.modalVideoLink').lightcase({
        iframe: {
          width: 1280,
          height: 720,
          frameborder: 0
        },
        onFinish: function onFinish() {
          var $lightbox = $('#lightcase-case'),
              $lightboxCaption = $lightbox.find('.lightcase-caption'),
              caption = lightcase.objectData.$link.parents('.csc-textpic-image').find('.csc-textpic-caption').html();
          
          $lightboxCaption.html(caption).show();
        }
      });
    } 
  }
  
  
  
  // ****************************//
  //  Button Handling
  // ****************************//
  $('.btn-default.pos-right').each(function(){
    $(this).parents('p').addClass('align-right');  
  });
  $('.btn-default.pos-left').each(function(){
    $(this).parents('p').addClass('align-left');  
  });
  $('.btn-default.pos-center').each(function(){
    $(this).parents('p').addClass('align-center');  
  });
  
  
  
  // ****************************//
  //  Listitems heights
  // ****************************//
  if($('.category-list').length > 0) {
    setListeItemsHeight($('.category-list'));
  }
  
  
  
  // ****************************//
  //  Delivertime Filter
  // ****************************//
  $('#deliver_time_filter').on('change', function() {
    var varURL = $(this).val();
    if(varURL) {
      window.location = varURL;
    }
    return false;
  });
  
  
  
  // ****************************//
  //  Selectboxes with Links
  // ****************************//
  $('.select_with_links').on('change', function() {
    var varURL = $(this).val();
    if(varURL) {
      window.location = varURL;
    }
    return false;
  });
  $('.select_with_links option').on('click', function() {
    if($(this).attr('selected') == 'selected') {
      var varURL = $(this).val();
      if(varURL) {
        window.location = varURL;
      }  
    }
    return false;
  });
  
  
  
  // **************************************//
  // Filter Dropdowns
  // **************************************//
  // Klick auf GO-Button
  $('.checkListButton').click(function(){
    var filterId = $(this).data('filterid');
    
    $('.multiCheck').each(function(item){
      if($(this).data('filterid') == filterId){
        $(this).find('form').submit();
      }
    });
  });
  
  // Klick on Deliver filter
  $('.product_deliver_filter input').on('click', function() {
    var varURL = $(this).val();
    if(varURL) {
      window.location = varURL;
    }
    return false;
  });
  
  
  
  // ****************************//
  //  Collapse Divs 
  // ****************************//
  $('.list-group').on('hidden.bs.collapse', toggleIcon);
  $('.list-group').on('shown.bs.collapse', toggleIcon);
  
  $('#description_cont').on('hidden.bs.collapse', toggleText);
  $('#description_cont').on('shown.bs.collapse', toggleText);
  
  if(window.innerWidth < 1200){
    $('.collapse').removeClass('in');
    $('#description_cont').next('p').toggleClass('show_descr_btn hide_descr_btn');
    $('.list-group').find(".more-less").toggleClass('glyphicon-menu-up glyphicon-menu-down');
  }
  
  
  
  // ****************************//
  // Resize Events
  // ****************************//
  $(window).on('resize orientationchange', function(event) {
    resizeActions();
  });
  
  
  
  // ****************************//
  // Filter Dropdowns
  // ****************************//
  $('.dropdown_container').each(function(){
    $(this).on('show.bs.dropdown', function () {
      $(this).find('.more-less').toggleClass('glyphicon-menu-down glyphicon-menu-up');
    });
    $(this).on('hide.bs.dropdown', function () {
      $(this).find('.more-less').toggleClass('glyphicon-menu-up glyphicon-menu-down');
    });
    
    if($('.isActOption', $(this)).length > 0) {
      $(this).find('.more-less').toggleClass('glyphicon-menu-down glyphicon-ok');
    }
      
  });
  
  $('.toggleFilterRows').click(function(){
    if($(this).hasClass('showAllFilters')) {
      $('.product_filters .row').show();
      $(this).toggleClass('showAllFilters hideAllFilters');
      $('button', $(this)).html($(this).data('hidetext'));
    } else if ($(this).hasClass('hideAllFilters')) {
      $('.product_filters .row:nth-child(n+2)').hide();
      $(this).toggleClass('hideAllFilters showAllFilters');
      $('button', $(this)).html($(this).data('showtext'));  
    }  
  });
  
  
  
  //************************************************ //
  // Load content result count for product search query
  // *********************************************** //
  if($('.contentItemCount').length > 0) {    
    var queryString = $('.contentItemCount').data('query'); 
    var url = encodeQueryInURI('/suggest/content/?limit=0&q=' + queryString);
    
    $.get(url, function(data){
      var itemCount = data.content_list.item_count;
      $('.contentItemCount').text(itemCount);
      $('.contentlist_item_count').data('contents-count', itemCount);
      
      var element = $('.redirectToContentSearch');
      if(element.length == 1 && element.data('products-count') === 0 && itemCount > 0){
        var redirectUrl = "/search/content?q=" + queryString + "&dt_tg_st=8";
        window.location = encodeQueryInURI(redirectUrl);
      }
    });
  }
  
  
  // *******************************//
  // Load product result count for content search query
  // *******************************//
  if($('.productItemCount').length > 0){
    var queryString = $('.productItemCount').data('query'); 
    var url = encodeQueryInURI('/suggest/?limit=0&q=' + queryString);
    
    $.get(url, function(data){
      var itemCount = data.product_list.item_count;
      $('.productItemCount').text(itemCount);
      $('.productlist_item_count').data('products-count', itemCount);
    });
  }
  
  
  // *********************************** //
  // Clientseitiger Wechsel der Suchtabs
  // *********************************** //
  initClickTabEvent();
  // content search enhancements
  highlightContentSearchResults();
  fetchContentSearchItemPreview();
  insertDomainName();
  
  
  
  // ****************************//
  //  Suggest
  // ****************************//
  try {
    formSuggest.onReady();
  } catch(e) {};
  
  
  
  // ****************************//
  //  Clear Input
  // ****************************//
  $('.has-clear input[type="text"]').on('input propertychange', function() {
    var $this = $(this);
    var visible = Boolean($this.val());
    $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
  }).trigger('propertychange');
  
  $('.form-control-clear').click(function() {
    $(this).siblings('input[type="text"]').val('').trigger('propertychange').focus();
  });
  
  
  
  // ******************************************//
  // Resaler anzeigen
  // ******************************************//
  if($('#resaler_list').length > 0) {
    if($('#resaler_list').data('url') != '') {
      var list = getAjaxData($('#resaler_list').data('url'));    
      $('#resaler_list .innerList').html(list.content.body);
      $('#resaler_list .innerList').jScrollPane();  
    }
  }
  
  
  
  // ****************************//
  //  Detail Functions
  // ****************************//
  detailFunctions(document.URL, true);
  
  
  
  // **************************************//
  // Electroni Invoice Agreement
  // **************************************//
  if($('#eiafield').length > 0) {  
    $('#eiafield').val($('#eiabox_cont').value);
    
    $('#eiabox_cont').on('change', function(){
      this.value = this.checked ? 1 : 2;
      $('#eiafield').val(this.value);
    }).change();  
  }
  
  
  
  // **************************************//
  // Email vor Spam schuetzen
  // **************************************//
  spamProtection.onReady();
  
  
  
  // **************************************//
  // Initialize labels for products
  // **************************************//
  initCustomProductForm();
  
  // Content Gallery
  contentGalleryInit();
  
});



// **************************************//
// ****** Email vor Spam schuetzen ******//
// **************************************//
var spamProtection = {
  onReady: function() {
    var madtext = $('a.request').data('u_target') + '@' + $('a.request').data('u_host');
    $('span.mad').text(madtext);
    $('a.request').click(spamProtection.onClick);
  },
  onClick : function() {
    var href = $(this).attr('href');
    $(this).attr('href', href.replace('#', 'mailto:' + $('a.request').data('u_target') + '@' + $('a.request').data('u_host')));
  }
};



// ****************************//
//  Detail Functions
// ****************************//
function detailFunctions(url, initial) {
  
  // ******************************************//  
  // Detailbild
  // ******************************************//
  $('.detImage').show();
  if(window.innerWidth > 768) {
    $('.zoomSpan').each(function(){
      $(this).zoom({
        url: $('img', this).data('url'),
        on: 'mouseover'
      });  
    });
  }
  $('.more_images a').click(function(){
    $('#main_image_carousel.carousel').carousel($(this).data('slideindex'));  
  });
  $('#main_image_carousel .item').click(function() {
    openGallery($(this));
  }); 
  
  
  
  // *******************************//
  // Artikel vergleichen
  // *******************************//
  $('.openCompareModal').click(function(){
    if(localStore.get('store_comparearticle') != null) {
      refreshProductData(localStore.get('store_comparearticle'));
      compareListItems = localStore.get('store_comparearticle').product_list.products.length;
    }
    
    $('#compareArticleModal ').appendTo($('body'));  
    $('#compareArticleModal').modal('show');
    $('#compareArticleModal').on('shown.bs.modal', function (e) {
      var snippet = DT.renderSnippet ('compare_list', localStore.get('store_comparearticle'));
      $('.mainCompareList').html(snippet);
      $('#compareArticleModal .modal-dialog').css('padding-right', '0px');
      
      if(localStore.get('store_comparearticle') != null && localStore.get('store_comparearticle').product_list.products.length > 0) {
        $('.noItemsMsg').hide();
        $('.mainCompareList').show();
        $('#compareArticleModal .modal-footer').show();  
      } else {
        $('.noItemsMsg').show();
        $('.mainCompareList').hide();
        $('#compareArticleModal .modal-footer').hide();
      }
    });
    $('#compareArticleModal').on('hidden.bs.modal', function (e) {
      //$('.compareListAmount').html(compareListItems);
    });
    return false;  
  });
  
  $('.close-modal').click(function(){
    $('#compareArticleModal').modal('hide');
  });
  
  $('.print-compare-list').click(function(){
    $('body').addClass('compareModal');
    window.print();
  });
  
  $('.printOrder').click(function(){
    $('body').removeClass('compareModal');
    window.print();
  });
  
  var loadCurrentData = false;
  
  if(DT && DT.variables.user && (DT.variables.user.has_individual_prices || DT.variables.user.current_stock_mode !== "none" )){
    loadCurrentData = true;
  }
  
  // Custom prices for product details
  if($('.detailContainer').length > 0 && loadCurrentData) {
    var productId = $('.detailContainer').data('id');
    
    $.get(window.location.pathname + '.current', function(data) {
      if(data && data.products) { 
        
        $(data.products).each(function(index, product){
          
          if(product.id == productId){
            
            if(product.has_individual_price === true){
              var rendered = DT.renderSnippet('price_row_individual', {'price' : product});
              $('.price-row').html(rendered);

              $('.priceTier').addClass('oldAmounts text-decoration-line-through d-none');

              if(product.price_tiers && product.price_tiers.length > 0) {
                if($('.amounts').length > 0) {
                  for(var i=0; i<product.price_tiers.length; i++){
                    var rendered = DT.renderSnippet('price_tier', {'tiers': product.price_tiers[i], 'has_individual_price': true});
                    $(rendered).insertAfter('.priceTier:last');
                  }
                  // Ueberschrift "Ihre Staffel"
                  // $("<div class='red ml-3'>"+$('.amounts').data('amounts')+":</div>").insertAfter('.priceTier.oldAmounts:last');
                } else {
                  var rendered = DT.renderSnippet('price_tiers', {});
                  $('.priceTiersContainer').append(rendered);

                  for(var i=0; i<product.price_tiers.length; i++){
                    var rendered = DT.renderSnippet('price_tier', {'tiers': product.price_tiers[i], 'has_individual_price': true});
                    $(rendered).insertBefore('.priceTiersContainer tbody tr:last');
                  }
                  // Ueberschrift "Ihre Staffel"
                  //$("<div class='red ml-3'>"+$('.amounts').data('amounts')+":</div>").insertBefore('.priceTier:first');
                }
              }
            }
            
            if(product.stock){
              var rendered = DT.renderSnippet('article_stock', {'product': product});
              $('.live-stock-container').html(rendered);
            }
            
          }
          
        });
        
      }
    });
  }
  
  // Custom prices for product list
  if($('.listContainer').length > 0 && loadCurrentData) {
    var queryPart = window.location.search || "";
    $.get(window.location.pathname + '.current' + queryPart, function(data){
      if(data && data.products){
        
        $(data.products).each(function(index, product){
          
          if(product.has_individual_price === true){
            // Find the element with the product id
            var productElement = $(".productlist-item[data-id='" + product.id + "']");

            if(productElement.length){
              var rendered = DT.renderSnippet('product_list_price', {'price' : product});
              productElement.find('.listprice').html(rendered);
              
              rendered = DT.renderSnippet('product_list_discount', {'price' : product});
              productElement.find('.discountWrapper').html(rendered); 
            }
          }
        }); // end each
      }
    }); // end get
  }
     
}  



// ****************************//
//  Zoom Gallery
// ****************************//
function openGallery(el) {
  var pswpElement = document.querySelectorAll('.pswp')[0];
  var items = [], item;
  var actSlide = $('#main_image_carousel .item.active').data('index');
  
  $('#main_image_carousel .item').each(function() {
    item = {
      src: $('.sliderimg', $(this)).data('url'),
      w: $('.sliderimg', $(this)).data('slideimgw'),
      h: $('.sliderimg', $(this)).data('slideimgh')
    };
    items.push(item);
  });

  var options = {
    index: actSlide,
    maxSpreadZoom: 4, 
    closeOnScroll : false,
    closeOnVerticalDrag : false,
    preload : [1,1]
  };
  
  // Initializes and opens PhotoSwipe
  var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
  
  gallery.listen('close', function() {
    var actSlide = gallery.getCurrentIndex();
    $('.carousel').carousel(actSlide);
  });
}



// ****************************//
//  Suggest
// ****************************//
var formSuggest = {
  onReady: function() {
    initial_window_size = window.innerWidth;
    
    formSuggest.desktopSuggest();
    formSuggest.mobileSuggest();
    formSuggest.innerSuggest();
  },
  desktopSuggest: function() {
    try {
      new oss.controller.Suggest({  
        url               : '/suggest/.json',
        searchField       : '#searchbox',
        searchInput       : '#searchbox input',
        template          : LJSR.snippets.search_suggest,
        templateCompile   : function(template){return '';},
        templateRender    : function(compiledTemplate, data){
            return DT.renderSnippet('search_suggest', data);
        },
        params : {
          limit : 0 /* Keine Produktvorschlaege */
        },
        beforeSuggestShowed : function(data, additionalData){
          
          $('#suggest').width($('#searchbox').width());
          
          initial_window_size = window.innerWidth;
          
          if(additionalData && additionalData.content_list){
            data.content_list = additionalData.content_list;
          }
          
          var productsFound = !_.isEmpty(data.product_list) && !_.isEmpty(data.product_list.products);
          var contentsFound = !_.isEmpty(data.content_list) && !_.isEmpty(data.content_list.contents); 
                  
          if( !productsFound  && !contentsFound){
            if(_.isEmpty(data.suggestions.search_terms)){
              return false;
            }
          }        
          return true;
        },
        minChars : 3
      });
    } catch (e) {}
  },
  mobileSuggest: function() {
    try {
      new oss.controller.Suggest({  
        url               : '/suggest/.json',
        searchField       : '#searchbox_mobile',
        searchInput       : '#searchbox_mobile input',
        template          : LJSR.snippets.search_suggest,
        templateCompile   : function(template){return '';},
        templateRender    : function(compiledTemplate, data){
            return DT.renderSnippet('search_suggest', data);
        },
        params : {
          limit : 0 /* Keine Produktvorschlaege */
        },
        beforeSuggestShowed : function(data, additionalData){
          
          initial_window_size = window.innerWidth;
          
          if(additionalData && additionalData.content_list){
            data.content_list = additionalData.content_list;
          }
          
          var productsFound = !_.isEmpty(data.product_list) && !_.isEmpty(data.product_list.products);
          var contentsFound = !_.isEmpty(data.content_list) && !_.isEmpty(data.content_list.contents); 
                  
          if( !productsFound  && !contentsFound){
            if(_.isEmpty(data.suggestions.search_terms)){
              return false;
            }
          }        
          return true;
        },
        minChars : 3
      });
    } catch (e) {}
  },
  innerSuggest: function() {
    try {
      new oss.controller.Suggest({  
        url               : '/suggest/.json',
        searchField       : '#searchbox_inner',
        searchInput       : '#searchbox_inner input',
        template          : LJSR.snippets.search_suggest,
        templateCompile   : function(template){return '';},
        templateRender    : function(compiledTemplate, data){
            return DT.renderSnippet('search_suggest', data);
        },
        params : {
          limit : 0 /* Keine Produktvorschlaege */
        },
        beforeSuggestShowed : function(data, additionalData){
          
          initial_window_size = window.innerWidth;
          
          if(additionalData && additionalData.content_list){
            data.content_list = additionalData.content_list;
          }
          
          var productsFound = !_.isEmpty(data.product_list) && !_.isEmpty(data.product_list.products);
          var contentsFound = !_.isEmpty(data.content_list) && !_.isEmpty(data.content_list.contents); 
                  
          if( !productsFound  && !contentsFound){
            if(_.isEmpty(data.suggestions.search_terms)){
              return false;
            }
          }        
          return true;
        },
        minChars : 3
      });
    } catch (e) {}
  }
};



// *********************************** //
// Clientseitiger Wechsel der Suchtabs
// *********************************** //
function initClickTabEvent() {
  $('.searchTab').click(function() {
    loadSearchData($(this));
    return false;
  });
}

function loadSearchData(tab) {
  var url = encodeQueryInURI(tab.data('url'));
  var realUrl = url.replace('.json',''); 
  var snippet = tab.data('snippet');
  var trackingParam = tab.data('tracking');
  
  if(trackingParam){
    url = url + '&' + trackingParam;
    $('.searchTab').data('tracking', ''); // only track once
  }
  
  // Falls bereits aktiv, dann abbrechen
  if(tab.hasClass('activeSearchTab')){
    return false;
  }

  // JSON-Daten abrufen
  $.ajax(url, {  
    
    success: function(data){
      // Variablen setzen, die sonst ueber search.liquid
      // bzw. content_search gesetzt werden
      data.isSearchStart = true;
      data.isSearchList = true;
      data.isProductList = true;
      
      var itemList = data.product_list || data.content_list;
      
      if(itemList.search_term){
        data.query_string = itemList.search_term;
      }
      
      // Neue URL setzen, falls Browser erlaubt
      if(history.pushState){
        history.pushState({}, '', realUrl);
      }
      
      // Snippet rendern und Inhalt auf Webseite ersetzen
      var rendered = DT.renderSnippet(snippet, data);
      $('.contentContainer').replaceWith(rendered);
      
      fetchContentSearchItemPreview();
      highlightContentSearchResults();
      insertDomainName();
      initClickTabEvent();
      //initResetFilterHandler();
      //startLazyImageLoading();
      
      if($('.productItemCount').length > 0){
        $('.productItemCount').text($('.productlist_item_count').data('products-count'));
      }
      if($('.contentItemCount').length > 0){
        $('.contentItemCount').text($('.contentlist_item_count').data('contents-count'));
      }
      
      $('.list-group').on('hidden.bs.collapse', toggleIcon);
      $('.list-group').on('shown.bs.collapse', toggleIcon);
      
      $('.dropdown_container').each(function(){
        $(this).on('show.bs.dropdown', function () {
          $(this).find('.more-less').toggleClass('glyphicon-menu-down glyphicon-menu-up');
        });
        $(this).on('hide.bs.dropdown', function () {
          $(this).find('.more-less').toggleClass('glyphicon-menu-up glyphicon-menu-down');
        });
        
        if($('.isActOption', $(this)).length > 0) {
          $(this).find('.more-less').toggleClass('glyphicon-menu-down glyphicon-ok');
        }
          
      });
      
      $('.toggleFilterRows').click(function(){
        if($(this).hasClass('showAllFilters')) {
          $('.product_filters .row').show();
          $(this).toggleClass('showAllFilters hideAllFilters');
          $('button', $(this)).html($(this).data('hidetext'));
        } else if ($(this).hasClass('hideAllFilters')) {
          $('.product_filters .row:nth-child(n+2)').hide();
          $(this).toggleClass('hideAllFilters showAllFilters');
          $('button', $(this)).html($(this).data('showtext'));  
        }  
      });
    },
  
    error : function(){
      window.location.href = realUrl;
    }
  });
}



// ****************************//
// Resize Events
// ****************************//
function resizeActions() {
  if(window.innerWidth < 1200){
    if($('#categories_list_ontop').is(':visible')) {
      $('#categories_list_ontop').collapse('hide');
    }
    if($('#categories_list_onleft').is(':visible')) {
      $('#categories_list_onleft').collapse('hide');
    }
    if($('#description_cont').is(':visible')) {
      $('#description_cont').collapse('hide');
    }
  } else {
    if($('#categories_list_ontop').is(':visible') == false) {
      $('#categories_list_ontop').collapse('show');
    }
    if($('#categories_list_onleft').is(':visible') == false) {
      $('#categories_list_onleft').collapse('show');
    }
    if($('#description_cont').is(':visible') == false) {
      $('#description_cont').collapse('show');
    }
  }
  
  setListeItemsHeight($('.category-list'));
  
  if($('#suggest').length > 0) {
    var suggest_pos = $('#'+$('#suggest').data('parentid')).offset();
    var suggest_height = $('#'+$('#suggest').data('parentid')).height();  
    $('#suggest').css({"left":suggest_pos.left+"px","top":(suggest_pos.top+suggest_height)+"px"});
    
    if($('#suggest').data('parentid') == "searchbox_inner") {
      var suggest_width = $('#'+$('#suggest').data('parentid')).width();
      $('#suggest').css({"width":suggest_width+"px"});
    }
  }
  
  if($('#suggest').data('parentid') != "searchbox_inner") {  
    if(initial_window_size >= 992 && window.innerWidth < 992) {
      $('#suggest').remove();
    }
    if(initial_window_size < 992 && window.innerWidth > 992) {
      $('#suggest').remove();
    }
  }
  
  // Comparmodal schliessen
  if(window.innerWidth < 990) {
    $('#compareArticleModal').modal('hide');    
  }
}



// ****************************//
//  Collapse Divs 
// ****************************//
function toggleIcon(e) {
  $(e.target).prev('.card-header').find(".more-less").toggleClass('glyphicon-menu-up glyphicon-menu-down');
}

function toggleText(e) {
  $(e.target).next('p').toggleClass('hide_descr_btn show_descr_btn');
}



// ****************************//
//  Listitems heights
// ****************************//
function setListeItemsHeight(list) {
  if(list.length > 0) {
    var itemsHeightArray = [], itemsHeadlineHeightArray = [], maxHeight = 0, maxHeadlineHeight = 0, elArray = [], count = 0, itemsPerRow = 0, isLastRow = false, countfact = 4, rowcount = 1, i = 0, isLastElement;
    
    if(window.innerWidth < 1200 ) {
      countfact = 3;
    }
    if(window.innerWidth > 1200 ) {
      countfact = 4;
    }
    
    $('.category-list-item').removeClass (function (index, className) {
      return (className.match (/\brow_\S+/g) || []).join(' ');
    });
    
    if($('.category-list-item').parent().is('div.items_wrap')){
      $('.category-list-item').unwrap();
    }
    
    $('.category-list-item').each(function(index) {
      i = i + 1;      
      isLastElement = index == $('.category-list-item').length -1;
      
      $(this).addClass('row_' + rowcount);
      
      if(i == countfact || isLastElement) {
        $('.row_' + rowcount).wrapAll( "<div class='row mb-20 items_wrap' />");
        rowcount = rowcount + 1;
        i = 0;
      } 
    });
         
    $('.category-list-item', list).css('height', 'auto');
    $('.category-list-item-headline', list).css('height', 'auto');
    
    if(window.innerWidth < 769 ) {
      $('.row', list).css('height', 'auto');
      $('.category-list-item-headline', list).css('height', 'auto');
    } else {
      $('.row', list).each(function() {
        
        itemsPerRow = $('.category-list-item', $(this)).length;

        $('.category-list-item', $(this)).each(function(){
          itemsHeadlineHeightArray[count] = $('.category-list-item-headline', $(this)).height();
          
          elArray[count] = $(this);          
          count = count + 1;
          
          if(count == itemsPerRow) {
            isLastRow = true;
          }
                            
          if(count == countfact || (itemsPerRow < countfact && isLastRow)) {
            count = 0;
            maxHeight = Math.max.apply(null,itemsHeightArray);
            maxHeadlineHeight =  Math.max.apply(null,itemsHeadlineHeightArray);
                        
            for(var e = 0; e < elArray.length; e++) {
              //$(elArray[e]).height(maxHeight);
              $('.category-list-item-headline', elArray[e]).height(maxHeadlineHeight); 
            }
            itemsHeadlineHeightArray = [], elArray = [], maxHeadlineHeight = 0, isLastRow = false;
          }
          
        });
                
      });
    }
  }  
}



// ****************************//
// Form-Validation START
// ****************************//
function validateForm(form) {
  var valid = true,
    birthday_day = '',
    birthday_month = '',
    birthdate_year = '';

  // alle Markierungen resetten.
  $('.is-invalid').removeClass('is-invalid'); 
  
  $(form).find(":input").each(function(){
    var validInput = true;
    var input = $(this);

    if(input.val() === ""){
      if (input.attr('required')){
        validInput = false;        
      } else {
        // darf leer sein, da required=false
      }
    } else {
      // ---
      // Bestimmte Felder müssen wir von ungültigen Werten bereinigen
      // bevor wir sie an den Server schicken und bevor wir sie validieren.
      // ---
      var filter_telephone = input.attr('filter_telephone');
      if (filter_telephone){
        var clean_value = input.val();        
        // Nur bekannte Sonderzeichen entfernen ("/", "-", Leerzeichen, "()", "+")
        clean_value = clean_value.replace(/[\/\-\ \(\)\+]/g, '');
        input.val(clean_value);        
      }
      
      var validate_numeric = input.attr('validate_numeric');
      if (validate_numeric){
        // Sicherstellen dass wir nur Zahlen haben, falls das Feld nicht leer ist.
        if (input.val() !== ''){
          var isnum = /^\d+$/.test(input.val());
          if (isnum == false){
            validInput = false;
          }
        }
      }      
      
      // ---      
      // Jetzt kommen wir zur normalen Validierung von maxlength, minlength, pattern, required.
      // ---      
      
      var clean_value = input.val();      
      var maxlength = input.attr('maxlength');
      if (maxlength){
        if(clean_value.length > maxlength){
          validInput = false;
        }
      }
      
      var minlength = input.attr('minlength');
      if (minlength){
        if(clean_value.length < minlength){
          validInput = false;
        }
      }
      
      var pattern = input.attr('pattern');
      if(pattern){
        if(!new RegExp(pattern).test(clean_value)){
          validInput = false;
        }
      }
    }
    
    var name = input.attr('name');    
    
    // Passwort wiederholen check
    if(input.hasClass('pw_repeat') && input.attr('type') == 'password'){
      var originField = $(form).find('input.pw_repeat_origin');
      if(originField.length == 1 && $(originField).val() != clean_value){
        validInput = false;
      }
    }
    
    // ---
    // Typspezifische Validierung
    // (select, radio, text, textarea, checkbox, button)
    // ---    
    var inputType;
    if (input[0].tagName == "INPUT"){
      inputType = $(input[0]).attr("type").toLowerCase();
    } else {
      inputType = input[0].tagName.toLowerCase();
    }
        
    if (inputType == 'email'){
      // Sicherstellen dass wir eine Email haben, falls das Feld nicht leer ist.      
      if (input.val() !== ''){      
        validInput = checkEmail(input.val());
      }
    } else if (inputType == 'radio'){
      // search all radiobuttons with this name, and find out if one of them is checked;
      var checked = false;
      var radio_required = false;
      $(form).find(":input[name='" + name + "']").each(function(){
        var radio = $(this);
        if (radio[0].checked){
          checked = true;
        } 
        if (radio[0].required){
          radio_required = true;
        }
      });
      if (radio_required){
        if (checked == false){
          validInput = false;
        }
      } else {
        validInput = true;
      }
    } else if (inputType == 'checkbox'){
      var checked = input[0].checked;
      var required = input[0].required;
      if (typeof required == 'undefined' || required == false){
        validInput = true;        
      } else {
        if (checked == true){
          validInput = true;
        } else {
          validInput = false;
        }        
      }      
    } else if (inputType == 'select'){
      var required = input[0].required;
      var isInvalid = $(input[0].options[input[0].selectedIndex]).data('invalid') == true;
      
      if (typeof required == 'undefined' || required == false){
        validInput = true;        
      } else {
        if (isInvalid){
          validInput = false;
        } else {
          validInput = true;
        }        
      }      
    } else if (inputType == 'textarea') {
      var required = input[0].required;      
      if($(input[0]).val() === ""){
        if(required){
          validInput = false;        
        } else {
          // darf leer sein, da required=false
        }
      }
    }
    
    // ---
    // Birthdate-Felder zusammentragen und verarbeiten (falls vorhanden).
    // ---    
    if (name == 'birthday_day'){
      birthday_day = input.val();
    } else if (name == 'birthday_month'){
      birthday_month = input.val();
    } else if (name == 'birthdate_year'){
      birthdate_year = input.val();
    }    
    if(birthday_day != '' && birthday_month != '' && birthdate_year != '') {
      var birthdateField = $(form).find(":input[id=birthdate]");
      insertDate(birthday_day, birthday_month, birthdate_year, birthdateField, 'yyyy-mm-dd');  
    }
    
    var novalidate = input.parents('.novalidate')[0];
    if (novalidate){
      // some inputs are always valid :-P
      validInput = true;
    }    
    
    var id = input.attr('id');       
    if (id == 'reset_shipping'){      
      var shippingHiddenField = $(form).find(":input[id=use_shipping_hidden]");
      var shippingChecked = input[0].checked;
      shippingChecked = !shippingChecked;
      shippingHiddenField.val(shippingChecked);
    } 
    
    
    // ---
    // Finish
    // ---    
    if (validInput == false){
      input.addClass('is-invalid');
      input.parents('.ffield:first').addClass('is-invalid');      
      valid = false;
    }
  });  
  
  return valid;  
}  
// ****************************//
// Form-Validation END
// ****************************//



// ******************************************//
// Emailadresse prüfen
// ******************************************// 
function checkEmail(address) {
  var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
  return pattern.test(address);
};



// ******************************************** //
// Bind address manager events in checkout
// ******************************************** //
function initCOAddressManager() {
  // Event for the click on the edit icon. The address form should be showed
  $('.address_select_item .action .edit').on('click', function(){
    var addressDiv= $(this).closest('.address_select_item');
    resetAddressSelection();
    // Edit selected
    addressDiv.find('.address').hide();
    addressDiv.find('.action').hide();
    addressDiv.find('.address_form_container').show();
    addressDiv.find('.edit_label').css('display','inline-block');
    addressDiv.find('.radio_box input').prop('checked', true);
  });
  
  // Event for the click on the shipping address delete icon.
  $('.address_select_item.shipping .action .delete').on('click', function(){
    var address_ID = $(this).closest('.address_select_item').data('addressid');
    
    $('#deleteAddressModal ').appendTo($('body'));  
    $('#deleteAddressModal').modal('show');
    
    $('#deleteAddressModal').on('shown.bs.modal', function (e) {
      $('.deleteaddress-yes-button').data('addressid', address_ID);
    });
  });
  
  // Event for the click on the billing address delete icon.
  $('.address_select_item.billing .action .delete').on('click', function(){
    var address_ID = $(this).closest('.address_select_item').data('addressid');
    
    $('#deleteAddressModal ').appendTo($('body'));  
    $('#deleteAddressModal').modal('show');
    
    $('#deleteAddressModal').on('shown.bs.modal', function (e) {
      $('.deleteaddress-yes-button').data('addressid', address_ID);
    });
  });
  
  // Event for the click on the delete address confirm button.
  $('.deleteaddress-yes-button').on('click', function() {
    var button = $(this);
    $.post('/customer/addresses/delete/', {'address': {'id':  $(this).data('addressid')}}, function(){
      location.reload();
    });  
  });
  
  // Event for the click on the collapse icon for a new address.
  $('.address_select_item.new_address .collapse_cont').on('click', function(){
    resetAddressSelection();
    $(this).closest('.new_address').find('.radio_box input').prop('checked', false);
  });
  
  // Event for the click on the collapse icon for a existing address.
  $('.address_select_item.existing_address .collapse_cont').on('click', function(){
    resetAddressSelection();
    $(this).closest('.existing_address').find('.continueContainer').show();
  });
  
  // Event for the click on the radio button of an address.
  $('.address_select_item .radio_box input, .address_select_item .address, .noShippingAdrUseLabel').not($('.address_select_item.new_address .radio_box input, .address_select_item.new_address .address')).on('click', function(){
    resetAddressSelection();
    $(this).closest('.address_select_item').find('.addressForm').submit();
  });
  
  // Event for the click on the radio button of the new address item. The form should be showed
  /*
  $('.address_select_item.new_address .radio_box input').on('click', function() {
    var parentCont = $(this).parents('.address_select_item');
    resetAddressSelection();
    $('.new_address').find('.radio_box input').not($(this)).prop('checked', false);
    $('.address_form_container', parentCont).show();
  });
  */
  
  // Event for the click the new address item label.
  $('.newAddressLabel input').on('click', function(){
    var parentCont = $(this).parents('.address_select_item');
    var parentCol = $(parentCont).parents('div.allAddressess'); 
    
    $('.radio_box input', $('.address_select_item.new_address')).prop('checked', false);

    if($('.address_form_container', parentCont).is(':visible')) {
      $('.radio_box input', parentCont).prop('checked', false);
      $('.address_form_container', parentCont).hide();
    } else {
      resetAddressSelection();
      $('.radio_box input', parentCol).not($('.radio_box input', parentCont)).prop('checked', false);
      $('.radio_box input', parentCont).prop('checked', true);
      $('.address_form_container', parentCont).show();
    }
  });
  
  // Event for the click on the continue button. The form should be submitted
  $('.address_select_item .continueContainer .button').on('click', function(){
    $(this).closest('.address_select_item').find('.addressForm').submit();
  });
  
  // Handle deselection of the is_default checkbox as a explicit form field
  $('input.toggle_checkbox').on('change', function(){
    var escapedSelector= this.name.replace(/(:|\.|\[|\])/g,'\\$1');
    if(this.checked){
      $(this).siblings('input').attr("disabled", true);
    }else{
      $(this).siblings('input').removeAttr('disabled');
    }
  });
  
  // Event for the click on the show all Addressess icon
  $('.showAddressContainer').on('click', function(){
    var parentCont = $(this).parents('.innerAddressStep');

    $('.actAddress, .allAddressess', parentCont).toggle();
    if($('.allAddressess', parentCont).is(':visible')) {
      $('.aDown', parentCont).hide();
      $('.aUp', parentCont).show();
    } else {
      $('.aDown', parentCont).show();
      $('.aUp', parentCont).hide();
    }
  });
  
}

// Reset all address manager modifications
function resetAddressSelection(){
  var allOptions = $('.address_select_item');
  
  allOptions.find('.address').show();
  allOptions.find('.action').show();
  allOptions.find('.address_form_container').hide();
  allOptions.find('.edit_label').hide();
  allOptions.find('.continueContainer').hide();
}



// ********************************//
// Captcha
// ********************************//
function initRecaptcha() {
  var captchaEl = $('.captchaEl'), captchaKey = captchaEl.data('capchakey');
  
  if($('.captchaEl').length > 1) {
    $('.captchaEl').each(function(el) {
      captchaEl = $(this);
      captchaKey = captchaEl.data('capchakey');
      showRecaptcha(captchaKey, captchaEl.attr('id'));  
    });
  } else {
    showRecaptcha(captchaKey, captchaEl.attr('id'));
  }
}
function insertCaptchaApi() {
  var script = document.createElement('script');
  
  if (DT && DT.variables && DT.variables.shop.locale.language) {
    var lang = DT.variables.shop.locale.language;  
  } else {
    var lang = 'de';
  };
  
  script.src = "//www.google.com/recaptcha/api.js?onload=initRecaptcha&render=explicit&hl="+lang;
  script.setAttribute('async', '');
  script.setAttribute('defer', '');
  document.getElementsByTagName('head')[0].appendChild(script);
}

var captcha_widget_id_1 = -1;
var captcha_widget_id_2 = -1;

function showRecaptcha(pubkey, element) {
  if(element == 'askoffer_form_captcha' || element == 'rec_form_captcha' ) {
    if(element == 'askoffer_form_captcha') {
      if (captcha_widget_id_1 !== -1) {
        grecaptcha.reset(captcha_widget_id_1);
      } else {
        captcha_widget_id_1 = grecaptcha.render(element, {
          'sitekey' : pubkey
        });
      }
    }
    
    if(element == 'rec_form_captcha') {
      if (captcha_widget_id_2 !== -1) {
        grecaptcha.reset(captcha_widget_id_2);
      } else {
        captcha_widget_id_2 = grecaptcha.render(element, {
          'sitekey' : pubkey
        });
      }
    }  
  } else {
    if (captcha_widget_id_1 !== -1) {
      grecaptcha.reset(captcha_widget_id_1);
    } else {
      captcha_widget_id_1 = grecaptcha.render(element, {
        'sitekey' : pubkey
      });
    }
  }
}



// ******************************************//
// Anchor Scroll
// ******************************************//  
function scrollToAnchor(aid) {
  var aTag = $("a[name='"+ aid +"']");
  
  if(aid == "toMiddle") {
    $('html,body').animate({scrollTop: aTag.offset().top - 105},'slow');
  } else {
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
  }
}



// ******************************************//
// Update Coupon on Confirm
// ******************************************//
function initCouponFormPerAjax(){
  $(".confirmStep form.coupon_remove_line").bind('submit', function (e) {    
    jQuery.ajax({
        type: "POST",
        url: e.target.action + '.json',
        data: { 
            "coupon_code" : "" 
        },   
        success: function (result) {
            location.reload();
        }    
    });   
    
    e.preventDefault();
    return false;
  });  
  
  $(".confirmStep form.add_coupon").bind('submit', function (e) {
    var couponCode = $(this).find('input').val();
    
    jQuery.ajax({
        type: "POST",
        url: e.target.action + '.json',
        data: { 
          "coupon_code" : couponCode
        },   
        success: function (result) {
          if(result.cart.coupon_error) {
            var snippet = DT.renderSnippet ('coupon_error', result);
            $('.coupon_error').html(snippet);
            $('form.add_coupon input').val('');  
          } else {
            location.reload();
          }
        }    
    });   
    
    e.preventDefault();
    return false;
  });  
}



// **************************************//
// Heidelpay Form
// **************************************//
$('#heidelpay_form').submit();



// **************** //
// Google Maps
// **************** //
function calcMapDimensions() {
  var mapWidth = window.innerWidth, mapHeight, mapDimesions;
  mapWidth = Math.round($('.map_cont').width());
  
  if(window.innerHeight < window.innerWidth) {
    mapHeight = Math.round(mapWidth / 2);
  } else {
    mapHeight = Math.round(mapWidth);
  }  
  
  mapWidth = mapWidth+'px';
  mapHeight = mapHeight+'px';  
  
  mapDimesions = {
    width  : mapWidth,
    height : mapHeight
  };
  return mapDimesions;
};




// ****************************//
//  Clean Empty Nodes
// ****************************//
function clean(node)
{
  for(var n = 0; n < node.childNodes.length; n ++)
  {
    var child = node.childNodes[n];
    if
    (
      child.nodeType === 8 
      || 
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    )
    {
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1)
    {
      clean(child);
    }
  }
}




// ******************************************//
// Encodes the query string of an url
// for IE <=9
// ******************************************//
function encodeQueryInURI(url){
  var a = document.createElement('a');
  a.href = url;
  
  var queryPart = a.search;
  
  if(queryPart == ""){
    return url;
  }
  
  var originalQueryString = getQueryString(url);
  var resultQueryString = getQueryString(queryPart);
  
  if(originalQueryString !== resultQueryString){
    // automatische encodierung fand bereits statt
  }else{
    resultQueryString = encodeURIComponent(resultQueryString);
  }
    
  return url.replace('q='+originalQueryString, 'q=' + resultQueryString);
}

function getQueryString(url){
  
  var indexOfQueryStringStart = url.indexOf('q=');
  
  if(indexOfQueryStringStart == -1){
    return "";
  }
  indexOfQueryStringStart += 2; // for 'q='
  
  var indexOfQueryStringEnd = url.indexOf('&', indexOfQueryStringStart);
  var queryStringLength = 0;
  
  if(indexOfQueryStringEnd == -1){
    queryStringLength = url.length;
  }else{
    queryStringLength = indexOfQueryStringEnd - indexOfQueryStringStart;
  }
  
  return url.substr(indexOfQueryStringStart, queryStringLength);
}



// ****************************//
// Highlight content search results
// ***************************//
function highlightContentSearchResults(){
  
  $('span.matchFragment').each(function(){
      var element = $(this);
      
      var query = element.data('query');
      
      if(!query){
        query = $('.searchTabs').data('query-string');
      }
      
      queryTerms = query.split(' ');
      
      var config = {
        element: 'span',
        className: 'highlight'
      };
      
      var stemmer = new Stemmer({
        'customStemmings' : {
          'paletten' : 'palette'
        }
      });
      
      for(var i=0; i<queryTerms.length; i++){
        var term = queryTerms[i]; 
        element.highlight(term, config);
        element.highlight(stemmer.stemm(term), config);
      }
  });
}



// ****************************//
// Fetch product and content list for preview in content search
// ***************************//

function fetchContentSearchItemPreview(){
  $('.fetch_url').each(function(){
    
    var element = $(this);
    var url = encodeQueryInURI(element.data('url'));
    var snippet = element.data('snippet');
    
    $.get(url, function(data) {
      var rendered = DT.renderSnippet(snippet, data);
      element.replaceWith(rendered);
      highlightContentSearchResults();
    });
  });
}



// ****************************//
//  Domain-Namen einfuegen
// ****************************//
function insertDomainName(){
  $('.insertDomain').each(function(){
    $(this).text(document.domain);
  });
}



// ****************************//
//  Iframe Dimensions Calculation
// ****************************//
function calcIframeWidth() {
  var viewportWidth = $(window).width(), tmpWidth, iframeW;
  
  if(window.innerHeight > window.innerWidth){
    //portrait
    tmpWidth = Math.round((viewportWidth * 10) / 100);
  }
  if(window.innerWidth > window.innerHeight){
    //landscape
    tmpWidth = Math.round((viewportWidth * 10) / 100);
  }
  
  iframeW = viewportWidth - tmpWidth;
  if (iframeW > 900) {
    iframeW = 900;
  }
  return iframeW;
}
function calcIframeHeight() {
  var viewportHeight = $(window).height(), tmpHeight, iframeH;
  
  if(window.innerHeight > window.innerWidth){
    //portrait
    tmpHeight = Math.round((viewportHeight * 50) / 100);
  }
  if(window.innerWidth > window.innerHeight){
    //landscape
    tmpHeight = Math.round((viewportHeight * 20) / 100);
  }
  
  iframeH = viewportHeight - tmpHeight;
  if (iframeH > 480) {
    iframeH = 480;
  }
  return iframeH;
}



// **************************************//
  // Initialize labels for products
  // **************************************//
function initCustomProductForm(){
 $('input.custom-product-trigger').click(function(){
   var amountfield = $('form .amount');
   
   $('#custom-product-box.collapse').collapse();
   
   if($(this).is(':checked')){
     $('div.custom-product-box').show();
     $('.minAmount.print').show();
     $('.minAmount.no-print').hide();
     $('form.addToCartForm').attr('action','/cart/append/');
     $('form.addToCartForm .custom-product-box input').prop('disabled', false);
     
     var minorderquantity = amountfield.data('minorderquantity-print');
     if(minorderquantity != undefined){
       $('input[name="line_item[item_quantity]"]').val(minorderquantity);
       $('input[name="line_item[_integer4]"]').val(minorderquantity);
     }
   }else{
     $('div.custom-product-box').hide();
     $('.minAmount.print').hide();
     $('.minAmount.no-print').show();
     $('form.addToCartForm').attr('action','/cart/add/');
     $('form.addToCartForm .custom-product-box input').prop('disabled', true);
     
     var minorderquantity = amountfield.data('minorderquantity');
     if(minorderquantity != undefined){
       $('input[name="line_item[item_quantity]"]').val(minorderquantity);
       $('input[name="line_item[_integer4]"]').val(minorderquantity);
     }
   }
 });
}



// ******************************************//
// Content Detail Gallery in Modal
// ******************************************//
function contentGalleryInit() {
  $('.openGal').click(function() {
    openContentGallery($(this));
  });
}



// ****************************//
//  Zoom Gallery on Content Detail
// ****************************//
function openContentGallery(el) {
  var pswpElement = document.querySelectorAll('.pswp')[0];
  var items = [], item, galid=el.data('galid');
    
  $('.content-gallery-img', $('#'+galid)).each(function() {
    if($(this).hasClass('isvideo')) {
      item = {
        html: '<div class="wrapper"><div class="video-wrapper"><img src="'+$(this).data('loadingimg')+'" class="galleryVideoLoader d-none"><iframe class="pswp__video" src="'+$(this).data('src')+'" width="'+$(this).data('slideimgw')+'" height="'+$(this).data('slideimgh')+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div>',
        title: $(this).data('title')
      };
    } else {
      item = {
        src: $(this).data('url'),
        w: $(this).data('slideimgw'),
        h: $(this).data('slideimgh'),
        title: $(this).attr('title')
      };
    }
    
    items.push(item);
  });

  var options = {
    index: 0,
    maxSpreadZoom: 4, 
    closeOnScroll : false,
    closeOnVerticalDrag : false,
    bgOpacity : 0.95,
    preload : [1,1],
    mainClass : 'cms_gallery'
  };
  
  // Initializes and opens PhotoSwipe
  var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
  
  gallery.listen('close', function() {
    var actSlide = gallery.getCurrentIndex();
    $('.carousel').carousel(actSlide);
  });
}