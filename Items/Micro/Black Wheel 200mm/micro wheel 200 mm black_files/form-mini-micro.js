define(['jquery','mage/translate'],function($){return function(quickSearch){$.widget('smileEs.quickSearch',quickSearch,{options:{searchActiveClass:'search-active',},_onPropertyChange:_.debounce(function(){var searchField=this.element,clonePosition={position:'absolute',},value=this.element.val();this.submitBtn.disabled=this._isEmpty(value);if(value.length>=parseInt(this.options.minSearchLength,10)){this.searchForm.addClass('processing');this.currentRequest=$.ajax({method:'GET',url:this.options.url,data:{q:value},beforeSend:function(){if(this.currentRequest!==null){this.currentRequest.abort();}}.bind(this),success:$.proxy(function(data){$('body').addClass(this.options.searchActiveClass);var self=this;var lastElement=false;var content=this._getResultWrapper();var sectionDropdown=this._getSectionHeader();var form=this.searchForm;var isProductInResults=false;var noResultsIconHtml='<svg class="cs-autocomplete__no-results-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#d9d9d9" d="M508.5 481.6l-129-129c-2.3-2.3-5.3-3.5-8.5-3.5h-10.3C395 312 416 262.5 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c54.5 0 104-21 141.1-55.2V371c0 3.2 1.3 6.2 3.5 8.5l129 129c4.7 4.7 12.3 4.7 17 0l9.9-9.9c4.7-4.7 4.7-12.3 0-17zM208 384c-97.3 0-176-78.7-176-176S110.7 32 208 32s176 78.7 176 176-78.7 176-176 176z"></path></svg>';if(!data.length){content.addClass('no-results');content.append('<div class="cs-autocomplete__no-results">'+
noResultsIconHtml+'<span class="cs-autocomplete__no-results-msg">'+
$.mage.__("We can't find any results matching the selection.")+'</span></div>');}
$.each(data,function(index,element){if(!lastElement||(lastElement&&lastElement.type!==element.type)){sectionDropdown=this._getSectionHeader(element.type,data);}
var elementHtml=this._renderItem(element,index);if(element.type==='product'){isProductInResults=true;sectionDropdown.find('.cs-autocomplete__grid').append(elementHtml);if(!sectionDropdown.find('.cs-autocomplete__more').length){sectionDropdown.append('<div class="cs-autocomplete__more"><span class="cs-autocomplete__more-button" role="button"><span class="cs-autocomplete__more-button-span">'+
$.mage.__('See all results')+'</span></span></div>');}}else{sectionDropdown.append(elementHtml);}
if(!lastElement||(lastElement&&lastElement.type!==element.type)){content.append(sectionDropdown);}
lastElement=element;}.bind(this));this.responseList.indexList=this.autoComplete.html(content).css(clonePosition).show().find(this.options.responseFieldElements+':visible, .cs-grid-layout__brick:visible');this._resetResponseList(false);this.element.removeAttr('aria-activedescendant');if(this.responseList.indexList.length){this._updateAriaHasPopup(true);}else{this._updateAriaHasPopup(false);}
if(!isProductInResults&&data.length>0){content.append('<div class="autocomplete-list product"><p class="autocomplete-list-title title-product">'+
$.mage.__('Products')+'</p><div class="cs-autocomplete__no-products">'+
noResultsIconHtml+'<span class="cs-autocomplete__no-results-msg">'+
$.mage.__("We can't find products matching the selection.")+'</span></div></div>');}
if(isProductInResults||content.find('.autocomplete-list.product').length){content.find('.autocomplete-list.product').prependTo(content);}
this.responseList.indexList.on('click',function(e){self.responseList.selected=$(this);if(self.responseList.selected.attr('href')){window.location.href=self.responseList.selected.attr('href');e.stopPropagation();return false;}
self.searchForm.trigger('submit');}).on('mouseenter mouseleave',function(e){self.responseList.indexList.removeClass(self.options.selectClass);$(this).addClass(self.options.selectClass);self.responseList.selected=$(e.target);self.element.attr('aria-activedescendant',$(e.target).attr('id'));}).on('mouseout',function(){if(!self._getLastElement()&&self._getLastElement().hasClass(self.options.selectClass)){$(this).removeClass(self.options.selectClass);self._resetResponseList(false);}});$('.cs-autocomplete__more-button').off('click').on('click',function(){$('.cs-header-search__button').trigger('click');});},this),complete:$.proxy(function(){this.searchForm.removeClass('processing');$('body').addClass(this.options.searchActiveClass);},this),});}else{this._resetResponseList(true);this.autoComplete.hide();this._updateAriaHasPopup(false);this.element.removeAttr('aria-activedescendant');}},250),_updateAriaHasPopup:function(show){this._super(show);if(show===true){$('body').addClass(this.options.searchActiveClass);}else{$('body').removeClass(this.options.searchActiveClass);}},_resetResponseList:function(all){this._super(all);if(all===true){$('body').removeClass(this.options.searchActiveClass);}},_getSectionHeader:function(type,data){var title='';var header=$('<dl role="listbox" class="autocomplete-list '+
type+'"></dl>');if(type==='product'){header=$('<div class="autocomplete-list '+
type+'"><ol class="cs-autocomplete__grid"></ol></div>');}
if(type!==undefined){title=this._getSectionTitle(type,data);header.prepend(title);}
return header;},_getSectionTitle:function(type,data){var title='';if(this.titleRenderers&&this.titleRenderers[type]){if(type==='product'){title=$('<p class="autocomplete-list-title title-'+
type+'">'+
this.titleRenderers[type].render(data)+'</p>');}else{title=$('<dt role="listbox" class="autocomplete-list-title title-'+
type+'">'+
this.titleRenderers[type].render(data)+'</dt>');}}else if(this.options.templates&&this.options.templates[type].title){if(type==='product'){title=$('<p class="autocomplete-list-title title-'+
type+'">'+
this.options.templates[type].title+'</p>');}else{title=$('<dt role="listbox" class="autocomplete-list-title title-'+
type+'">'+
this.options.templates[type].title+'</dt>');}}
return title;},_getNextElement:function(){var nextElement=this.responseList.selected.next('li');if(nextElement.length===0){nextElement=this.responseList.selected.parent('.autocomplete-list').next('.autocomplete-list-title').find('[role="option"]').first();}
return nextElement;},_getPrevElement:function(){var prevElement=this.responseList.selected.prev('li');this.responseList.selected.removeClass(this.options.selectClass);if(prevElement.length===0){prevElement=this.responseList.selected.parent('.autocomplete-list').prev('.autocomplete-list-title').find('li').last();}
return prevElement;},});return $.smileEs.quickSearch;};});