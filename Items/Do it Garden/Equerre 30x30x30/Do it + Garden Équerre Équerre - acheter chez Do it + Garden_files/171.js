(window.webpackJsonp=window.webpackJsonp||[]).push([[171],{769:function(e,t,r){"use strict";r.r(t);var s=r(1),n=r.n(s),a=r(5),o=r(23);class c extends s.PureComponent{constructor(){super(...arguments),this._replaceJSC=e=>e?e.replace(/<jsc/g,"<script").replace(/<\/jsc/g,"</script").replace(/jscload/g,"onload"):"",this._getHeadRef=e=>{this.$headRef=e},this._getBodyRef=e=>{this.$bodyRef=e}}_copyAttributes(e,t){const r=Array.prototype.slice.call(e.attributes);let s=r.pop();for(;s;)t.setAttribute(s.nodeName,s.nodeValue),s=r.pop();t.innerText=e.innerText}_readScriptTags(e){if(e){const t=e.getElementsByTagName("script");for(const r of Array.from(t)){const t=e.removeChild(r),s=document.createElement("script");this._copyAttributes(t,s),e.appendChild(s)}}}componentDidMount(){this.props.csr&&(this._readScriptTags(this.$headRef),this._readScriptTags(this.$bodyRef))}render(){const{content:e,contentHead:t,forwardedRef:r}=this.props;return e?n.a.createElement("div",{ref:r},n.a.createElement("span",{ref:this._getBodyRef,dangerouslySetInnerHTML:{__html:this._replaceJSC(t)}}),n.a.createElement("span",{ref:this._getHeadRef,dangerouslySetInnerHTML:{__html:this._replaceJSC(e)}})):null}}const i=Object(s.forwardRef)(((e,t)=>n.a.createElement(c,Object.assign({forwardedRef:t},e))));i.displayName="CMSSourceComponent",t.default=Object(a.connect)((e=>({csr:Object(o.d)(e)})))(i)}}]);