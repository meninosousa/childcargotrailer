// ************************************************************************* //
// Geoip API nur laden wenn kein Bot und kein Localstore Eintrag existiert   //
// ************************************************************************* //
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
};

if(!/bot|googlebot|crawler|spider|robot|slurp|teoma|facebookexternalhit|unwindfetchor|butterfly|urlresolver|crawling/i.test(navigator.userAgent)) {
  var noBot = true;
  
  if(supports_html5_storage() && localStorage.getItem('geoip_country') === null) {
    var url1 = 'js.maxmind.com', url2 = 'js/apis/geoip2/v2.1/geoip2.js';
    document.write("<script src='//"+url1+"/"+url2+"' type='text/javascript'><\/script>");  
  }
} else {
  var noBot = false;
};