define(['jquery','Magento_Customer/js/model/authentication-popup','Magento_Customer/js/customer-data','Magento_Ui/js/modal/alert','Magento_Ui/js/modal/confirm','underscore','jquery-ui-modules/widget','mage/decorate','mage/collapsible','mage/cookies'],function($,authenticationPopup,customerData,alert,confirm,_){'use strict';$.widget('mage.sidebar',{options:{isRecursive:true,minicart:{maxItemsVisible:3}},scrollHeight:0,shoppingCartUrl:window.checkout.shoppingCartUrl,_create:function(){this._initContent();},update:function(){$(this.options.targetElement).trigger('contentUpdated');this._calcHeight();},_initContent:function(){var self=this,events={};this.element.decorate('list',this.options.isRecursive);events['click '+this.options.button.close]=function(event){event.stopPropagation();$(self.options.targetElement).dropdownDialog('close');};events['click '+this.options.button.checkout]=$.proxy(function(){var cart=customerData.get('cart'),customer=customerData.get('customer'),element=$(this.options.button.checkout);if(!customer().firstname&&cart().isGuestCheckoutAllowed===false){$.cookie('login_redirect',this.options.url.checkout);if(this.options.url.isRedirectRequired){element.prop('disabled',true);location.href=this.options.url.loginUrl;}else{authenticationPopup.showModal();}
return false;}
element.prop('disabled',true);location.href=this.options.url.checkout;},this);events['click '+this.options.button.remove]=function(event){event.stopPropagation();confirm({content:self.options.confirmMessage,actions:{confirm:function(){self._removeItem($(event.currentTarget));},always:function(e){e.stopImmediatePropagation();}}});};events['keyup '+this.options.item.qty]=function(event){self._showItemButton($(event.target));};events['change '+this.options.item.qty]=function(event){self._showItemButton($(event.target));};events['click '+this.options.item.button]=function(event){event.stopPropagation();self._updateItemQty($(event.currentTarget));};events['focusout '+this.options.item.qty]=function(event){self._validateQty($(event.currentTarget));};this._on(this.element,events);this._calcHeight();},_showItemButton:function(elem){var itemId=elem.data('cart-item'),itemQty=elem.data('item-qty');if(this._isValidQty(itemQty,elem.val())){$('#update-cart-item-'+itemId).fadeIn(300);}else if(elem.val()==0){this._hideItemButton(elem);}else{this._hideItemButton(elem);}},_isValidQty:function(origin,changed){return origin!=changed&&changed.length>0&&changed-0==changed&&changed-0>0;},_validateQty:function(elem){var itemQty=elem.data('item-qty');if(!this._isValidQty(itemQty,elem.val())){elem.val(itemQty);}},_hideItemButton:function(elem){var itemId=elem.data('cart-item');$('#update-cart-item-'+itemId).fadeOut(300);},_updateItemQty:function(elem){var itemId=elem.data('cart-item');this._ajax(this.options.url.update,{'item_id':itemId,'item_qty':$('#cart-item-'+itemId+'-qty').val()},elem,this._updateItemQtyAfter);},_updateItemQtyAfter:function(elem){var productData=this._getProductById(Number(elem.data('cart-item')));if(!_.isUndefined(productData)){$(document).trigger('ajax:updateCartItemQty');if(window.location.href===this.shoppingCartUrl){window.location.reload(false);}}
this._hideItemButton(elem);},_removeItem:function(elem){var itemId=elem.data('cart-item');this._ajax(this.options.url.remove,{'item_id':itemId},elem,this._removeItemAfter);},_removeItemAfter:function(elem){var productData=this._getProductById(Number(elem.data('cart-item')));if(!_.isUndefined(productData)){$(document).trigger('ajax:removeFromCart',{productIds:[productData['product_id']],productInfo:[{'id':productData['product_id']}]});if(window.location.href.indexOf(this.shoppingCartUrl)===0){window.location.reload();}}},_getProductById:function(productId){return _.find(customerData.get('cart')().items,function(item){return productId===Number(item['item_id']);});},_ajax:function(url,data,elem,callback){$.extend(data,{'form_key':$.mage.cookies.get('form_key')});$.ajax({url:url,data:data,type:'post',dataType:'json',context:this,beforeSend:function(){elem.attr('disabled','disabled');},complete:function(){elem.attr('disabled',null);}}).done(function(response){var msg;if(response.success){callback.call(this,elem,response);}else{msg=response['error_message'];if(msg){alert({content:msg});}}}).fail(function(error){console.log(JSON.stringify(error));});},_calcHeight:function(){var self=this,height=0,counter=this.options.minicart.maxItemsVisible,target=$(this.options.minicart.list),outerHeight;self.scrollHeight=0;target.children().each(function(){if($(this).find('.options').length>0){$(this).collapsible();}
outerHeight=$(this).outerHeight(true);if(counter-->0){height+=outerHeight;}
self.scrollHeight+=outerHeight;});target.parent().height(height);}});return $.mage.sidebar;});