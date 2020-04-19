!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){n(6),n(7),e.exports=n(8)},function(e,t,n){(function(t){!function(n){function r(e,t){return function(){e.apply(t,arguments)}}function i(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],l(e,r(a,this),r(s,this))}function o(e){var t=this;return null===this._state?void this._deferreds.push(e):void f(function(){var n=t._state?e.onFulfilled:e.onRejected;if(null===n)return void(t._state?e.resolve:e.reject)(t._value);var r;try{r=n(t._value)}catch(i){return void e.reject(i)}e.resolve(r)})}function a(e){try{if(e===this)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void l(r(t,e),r(a,this),r(s,this))}this._state=!0,this._value=e,c.call(this)}catch(n){s.call(this,n)}}function s(e){this._state=!1,this._value=e,c.call(this)}function c(){for(var e=0,t=this._deferreds.length;t>e;e++)o.call(this,this._deferreds[e]);this._deferreds=null}function u(e,t,n,r){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=r}function l(e,t,n){var r=!1;try{e(function(e){r||(r=!0,t(e))},function(e){r||(r=!0,n(e))})}catch(i){if(r)return;r=!0,n(i)}}var f="function"==typeof t&&t||function(e){setTimeout(e,1)},d=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)};i.prototype["catch"]=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var n=this;return new i(function(r,i){o.call(n,new u(e,t,r,i))})},i.all=function(){var e=Array.prototype.slice.call(1===arguments.length&&d(arguments[0])?arguments[0]:arguments);return new i(function(t,n){function r(o,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(e){r(o,e)},n)}e[o]=a,0===--i&&t(e)}catch(c){n(c)}}if(0===e.length)return t([]);for(var i=e.length,o=0;o<e.length;o++)r(o,e[o])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(e){return new i(function(t,n){n(e)})},i.race=function(e){return new i(function(t,n){for(var r=0,i=e.length;i>r;r++)e[r].then(t,n)})},i._setImmediateFn=function(e){f=e},i.prototype.always=function(e){var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){throw n})})},"undefined"!=typeof e&&e.exports?e.exports=i:n.Promise||(n.Promise=i)}(this)}).call(t,n(2).setImmediate)},function(e,t,n){(function(e,r){function i(e,t){this._id=e,this._clearFn=t}var o=n(3).nextTick,a=Function.prototype.apply,s=Array.prototype.slice,c={},u=0;t.setTimeout=function(){return new i(a.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new i(a.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},t.setImmediate="function"==typeof e?e:function(e){var n=u++,r=arguments.length<2?!1:s.call(arguments,1);return c[n]=!0,o(function(){c[n]&&(r?e.apply(null,r):e.call(null),t.clearImmediate(n))}),n},t.clearImmediate="function"==typeof r?r:function(e){delete c[e]}}).call(t,n(2).setImmediate,n(2).clearImmediate)},function(e,t){function n(){u=!1,a.length?c=a.concat(c):l=-1,c.length&&r()}function r(){if(!u){var e=setTimeout(n);u=!0;for(var t=c.length;t;){for(a=c,c=[];++l<t;)a&&a[l].run();l=-1,t=c.length}a=null,u=!1,clearTimeout(e)}}function i(e,t){this.fun=e,this.array=t}function o(){}var a,s=e.exports={},c=[],u=!1,l=-1;s.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new i(e,t)),1!==c.length||u||setTimeout(r,0)},i.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=o,s.addListener=o,s.once=o,s.off=o,s.removeListener=o,s.removeAllListeners=o,s.emit=o,s.binding=function(e){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(e,t){function n(){var e=~navigator.userAgent.indexOf("Android")&&~navigator.vendor.indexOf("Google")&&!~navigator.userAgent.indexOf("Chrome");return e&&navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop()<=534||/MQQBrowser/g.test(navigator.userAgent)}var r=function(){try{return new Blob,!0}catch(e){return!1}}()?window.Blob:function(e,t){var n=new(window.BlobBuilder||window.WebKitBlobBuilder||window.MSBlobBuilder||window.MozBlobBuilder);return e.forEach(function(e){n.append(e)}),n.getBlob(t?t.type:void 0)},i=function(){var e=0;return function(){var t=this,n=[],i=Array(21).join("-")+(+new Date*(1e16*Math.random())).toString(36),o=XMLHttpRequest.prototype.send;this.getParts=function(){return n.toString()},this.append=function(e,t,r){n.push("--"+i+'\r\nContent-Disposition: form-data; name="'+e+'"'),t instanceof Blob?(n.push('; filename="'+(r||"blob")+'"\r\nContent-Type: '+t.type+"\r\n\r\n"),n.push(t)):n.push("\r\n\r\n"+t),n.push("\r\n")},e++,XMLHttpRequest.prototype.send=function(a){var s,c,u=this;a===t?(n.push("--"+i+"--\r\n"),c=new r(n),s=new FileReader,s.onload=function(){o.call(u,s.result)},s.onerror=function(e){throw e},s.readAsArrayBuffer(c),this.setRequestHeader("Content-Type","multipart/form-data; boundary="+i),e--,0==e&&(XMLHttpRequest.prototype.send=o)):o.call(this,a)}}}();e.exports={Blob:r,FormData:n()?i:FormData}},function(e,t,n){var r,i;(function(){function n(e){return!!e.exifdata}function o(e,t){t=t||e.match(/^data\:([^\;]+)\;base64,/im)[1]||"",e=e.replace(/^data\:([^\;]+)\;base64,/gim,"");for(var n=atob(e),r=n.length,i=new ArrayBuffer(r),o=new Uint8Array(i),a=0;r>a;a++)o[a]=n.charCodeAt(a);return i}function a(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="blob",n.onload=function(e){200!=this.status&&0!==this.status||t(this.response)},n.send()}function s(e,t){function n(n){var r=c(n),i=u(n);e.exifdata=r||{},e.iptcdata=i||{},t&&t.call(e)}if(e.src)if(/^data\:/i.test(e.src)){var r=o(e.src);n(r)}else if(/^blob\:/i.test(e.src)){var i=new FileReader;i.onload=function(e){n(e.target.result)},a(e.src,function(e){i.readAsArrayBuffer(e)})}else{var s=new XMLHttpRequest;s.onload=function(){200==this.status||0===this.status?n(s.response):t(new Error("Could not load image")),s=null},s.open("GET",e.src,!0),s.responseType="arraybuffer",s.send(null)}else if(window.FileReader&&(e instanceof window.Blob||e instanceof window.File)){var i=new FileReader;i.onload=function(e){p&&console.log("Got file of length "+e.target.result.byteLength),n(e.target.result)},i.readAsArrayBuffer(e)}}function c(e){var t=new DataView(e);if(p&&console.log("Got file of length "+e.byteLength),255!=t.getUint8(0)||216!=t.getUint8(1))return p&&console.log("Not a valid JPEG"),!1;for(var n,r=2,i=e.byteLength;i>r;){if(255!=t.getUint8(r))return p&&console.log("Not a valid marker at offset "+r+", found: "+t.getUint8(r)),!1;if(n=t.getUint8(r+1),p&&console.log(n),225==n)return p&&console.log("Found 0xFFE1 marker"),g(t,r+4,t.getUint16(r+2)-2);r+=2+t.getUint16(r+2)}}function u(e){var t=new DataView(e);if(p&&console.log("Got file of length "+e.byteLength),255!=t.getUint8(0)||216!=t.getUint8(1))return p&&console.log("Not a valid JPEG"),!1;for(var n=2,r=e.byteLength,i=function(e,t){return 56===e.getUint8(t)&&66===e.getUint8(t+1)&&73===e.getUint8(t+2)&&77===e.getUint8(t+3)&&4===e.getUint8(t+4)&&4===e.getUint8(t+5)};r>n;){if(i(t,n)){var o=t.getUint8(n+7);o%2!==0&&(o+=1),0===o&&(o=4);var a=n+8+o,s=t.getUint16(n+6+o);return l(e,a,s)}n++}}function l(e,t,n){for(var r,i,o,a,s,c=new DataView(e),u={},l=t;t+n>l;)28===c.getUint8(l)&&2===c.getUint8(l+1)&&(a=c.getUint8(l+2),a in S&&(o=c.getInt16(l+3),s=o+5,i=S[a],r=h(c,l+5,o),u.hasOwnProperty(i)?u[i]instanceof Array?u[i].push(r):u[i]=[u[i],r]:u[i]=r)),l++;return u}function f(e,t,n,r,i){var o,a,s,c=e.getUint16(n,!i),u={};for(s=0;c>s;s++)o=n+12*s+2,a=r[e.getUint16(o,!i)],!a&&p&&console.log("Unknown tag: "+e.getUint16(o,!i)),u[a]=d(e,o,t,n,i);return u}function d(e,t,n,r,i){var o,a,s,c,u,l,f=e.getUint16(t+2,!i),d=e.getUint32(t+4,!i),g=e.getUint32(t+8,!i)+n;switch(f){case 1:case 7:if(1==d)return e.getUint8(t+8,!i);for(o=d>4?g:t+8,a=[],c=0;d>c;c++)a[c]=e.getUint8(o+c);return a;case 2:return o=d>4?g:t+8,h(e,o,d-1);case 3:if(1==d)return e.getUint16(t+8,!i);for(o=d>2?g:t+8,a=[],c=0;d>c;c++)a[c]=e.getUint16(o+2*c,!i);return a;case 4:if(1==d)return e.getUint32(t+8,!i);for(a=[],c=0;d>c;c++)a[c]=e.getUint32(g+4*c,!i);return a;case 5:if(1==d)return u=e.getUint32(g,!i),l=e.getUint32(g+4,!i),s=new Number(u/l),s.numerator=u,s.denominator=l,s;for(a=[],c=0;d>c;c++)u=e.getUint32(g+8*c,!i),l=e.getUint32(g+4+8*c,!i),a[c]=new Number(u/l),a[c].numerator=u,a[c].denominator=l;return a;case 9:if(1==d)return e.getInt32(t+8,!i);for(a=[],c=0;d>c;c++)a[c]=e.getInt32(g+4*c,!i);return a;case 10:if(1==d)return e.getInt32(g,!i)/e.getInt32(g+4,!i);for(a=[],c=0;d>c;c++)a[c]=e.getInt32(g+8*c,!i)/e.getInt32(g+4+8*c,!i);return a}}function h(e,t,n){var r,i="";for(r=t;t+n>r;r++)i+=String.fromCharCode(e.getUint8(r));return i}function g(e,t){if("Exif"!=h(e,t,4))return p&&console.log("Not valid EXIF data! "+h(e,t,4)),!1;var n,r,i,o,a,s=t+6;if(18761==e.getUint16(s))n=!1;else{if(19789!=e.getUint16(s))return p&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;n=!0}if(42!=e.getUint16(s+2,!n))return p&&console.log("Not valid TIFF data! (no 0x002A)"),!1;var c=e.getUint32(s+4,!n);if(8>c)return p&&console.log("Not valid TIFF data! (First offset less than 8)",e.getUint32(s+4,!n)),!1;if(r=f(e,s,s+c,v,n),r.ExifIFDPointer){o=f(e,s,s+r.ExifIFDPointer,w,n);for(i in o){switch(i){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":o[i]=b[i][o[i]];break;case"ExifVersion":case"FlashpixVersion":o[i]=String.fromCharCode(o[i][0],o[i][1],o[i][2],o[i][3]);break;case"ComponentsConfiguration":o[i]=b.Components[o[i][0]]+b.Components[o[i][1]]+b.Components[o[i][2]]+b.Components[o[i][3]]}r[i]=o[i]}}if(r.GPSInfoIFDPointer){a=f(e,s,s+r.GPSInfoIFDPointer,y,n);for(i in a){switch(i){case"GPSVersionID":a[i]=a[i][0]+"."+a[i][1]+"."+a[i][2]+"."+a[i][3]}r[i]=a[i]}}return r}var p=!1,m=function(e){return e instanceof m?e:this instanceof m?void(this.EXIFwrapped=e):new m(e)};"undefined"!=typeof e&&e.exports&&(t=e.exports=m),t.EXIF=m;var w=m.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},v=m.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},y=m.GPSTags={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},b=m.StringValues={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}},S={120:"caption",110:"credit",25:"keywords",55:"dateCreated",80:"byline",85:"bylineTitle",122:"captionWriter",105:"headline",116:"copyright",15:"category"};m.getData=function(e,t){return(e instanceof Image||e instanceof HTMLImageElement)&&!e.complete?!1:(n(e)?t&&t.call(e):s(e,t),!0)},m.getTag=function(e,t){return n(e)?e.exifdata[t]:void 0},m.getAllTags=function(e){if(!n(e))return{};var t,r=e.exifdata,i={};for(t in r)r.hasOwnProperty(t)&&(i[t]=r[t]);return i},m.pretty=function(e){if(!n(e))return"";var t,r=e.exifdata,i="";for(t in r)r.hasOwnProperty(t)&&(i+="object"==typeof r[t]?r[t]instanceof Number?t+" : "+r[t]+" ["+r[t].numerator+"/"+r[t].denominator+"]\r\n":t+" : ["+r[t].length+" values]\r\n":t+" : "+r[t]+"\r\n");return i},m.readFromBinaryFile=function(e){return c(e)},r=[],i=function(){return m}.apply(t,r),!(void 0!==i&&(e.exports=i))}).call(this)},function(e,t,n){var r,i;!function(){function n(e){var t=e.naturalWidth,n=e.naturalHeight;if(t*n>1048576){var r=document.createElement("canvas");r.width=r.height=1;var i=r.getContext("2d");return i.drawImage(e,-t+1,0),0===i.getImageData(0,0,1,1).data[3]}return!1}function o(e,t,n){var r=document.createElement("canvas");r.width=1,r.height=n;var i=r.getContext("2d");i.drawImage(e,0,0);for(var o=i.getImageData(0,0,1,n).data,a=0,s=n,c=n;c>a;){var u=o[4*(c-1)+3];0===u?s=c:a=c,c=s+a>>1}var l=c/n;return 0===l?1:l}function a(e,t,n){var r=document.createElement("canvas");return s(e,r,t,n),r.toDataURL("image/jpeg",t.quality||.8)}function s(e,t,r,i){var a=e.naturalWidth,s=e.naturalHeight,u=r.width,l=r.height,f=t.getContext("2d");f.save(),c(t,f,u,l,r.orientation);var d=n(e);d&&(a/=2,s/=2);var h=1024,g=document.createElement("canvas");g.width=g.height=h;for(var p=g.getContext("2d"),m=i?o(e,a,s):1,w=Math.ceil(h*u/a),v=Math.ceil(h*l/s/m),y=0,b=0;s>y;){for(var S=0,I=0;a>S;)p.clearRect(0,0,h,h),p.drawImage(e,-S,-y),f.drawImage(g,0,0,h,h,I,b,w,v),S+=h,I+=w;y+=h,b+=v}f.restore(),g=p=null}function c(e,t,n,r,i){switch(i){case 5:case 6:case 7:case 8:e.width=r,e.height=n;break;default:e.width=n,e.height=r}switch(i){case 2:t.translate(n,0),t.scale(-1,1);break;case 3:t.translate(n,r),t.rotate(Math.PI);break;case 4:t.translate(0,r),t.scale(1,-1);break;case 5:t.rotate(.5*Math.PI),t.scale(1,-1);break;case 6:t.rotate(.5*Math.PI),t.translate(0,-r);break;case 7:t.rotate(.5*Math.PI),t.translate(n,-r),t.scale(-1,1);break;case 8:t.rotate(-.5*Math.PI),t.translate(-n,0)}}function u(e){if(window.Blob&&e instanceof Blob){var t=new Image,n=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null;if(!n)throw Error("No createObjectURL function found to create blob url");t.src=n.createObjectURL(e),this.blob=e,e=t}if(!e.naturalWidth&&!e.naturalHeight){var r=this;e.onload=function(){var e=r.imageLoadListeners;if(e){r.imageLoadListeners=null;for(var t=0,n=e.length;n>t;t++)e[t]()}},this.imageLoadListeners=[]}this.srcImage=e}u.prototype.render=function(e,t,n){if(this.imageLoadListeners){var r=this;return void this.imageLoadListeners.push(function(){r.render(e,t,n)})}t=t||{};var i=this.srcImage,o=i.src,c=o.length,u=i.naturalWidth,l=i.naturalHeight,f=t.width,d=t.height,h=t.maxWidth,g=t.maxHeight,p=this.blob&&"image/jpeg"===this.blob.type||0===o.indexOf("data:image/jpeg")||o.indexOf(".jpg")===c-4||o.indexOf(".jpeg")===c-5;f&&!d?d=l*f/u<<0:d&&!f?f=u*d/l<<0:(f=u,d=l),h&&f>h&&(f=h,d=l*f/u<<0),g&&d>g&&(d=g,f=u*d/l<<0);var m={width:f,height:d};for(var w in t)m[w]=t[w];var v=e.tagName.toLowerCase();"img"===v?e.src=a(this.srcImage,m,p):"canvas"===v&&s(this.srcImage,e,m,p),"function"==typeof this.onrender&&this.onrender(e),n&&n()},r=[],i=function(){return u}.apply(t,r),!(void 0!==i&&(e.exports=i))}()},function(e,t){function n(e){function t(e){for(var t=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],n=0;64>n;n++){var r=F((t[n]*e+50)/100);1>r?r=1:r>255&&(r=255),x[N[n]]=r}for(var i=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],o=0;64>o;o++){var a=F((i[o]*e+50)/100);1>a?a=1:a>255&&(a=255),D[N[o]]=a}for(var s=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],c=0,u=0;8>u;u++)for(var l=0;8>l;l++)U[c]=1/(x[N[c]]*s[u]*s[l]*8),C[c]=1/(D[N[c]]*s[u]*s[l]*8),c++}function n(e,t){for(var n=0,r=0,i=new Array,o=1;16>=o;o++){for(var a=1;a<=e[o];a++)i[t[r]]=[],i[t[r]][0]=n,i[t[r]][1]=o,r++,n++;n*=2}return i}function r(){y=n(W,H),b=n(V,X),S=n(z,q),I=n(Q,Y)}function i(){for(var e=1,t=2,n=1;15>=n;n++){for(var r=e;t>r;r++)A[32767+r]=n,T[32767+r]=[],T[32767+r][1]=n,T[32767+r][0]=r;for(var i=-(t-1);-e>=i;i++)A[32767+i]=n,T[32767+i]=[],T[32767+i][1]=n,T[32767+i][0]=t-1+i;e<<=1,t<<=1}}function o(){for(var e=0;256>e;e++)k[e]=19595*e,k[e+256>>0]=38470*e,k[e+512>>0]=7471*e+32768,k[e+768>>0]=-11059*e,k[e+1024>>0]=-21709*e,k[e+1280>>0]=32768*e+8421375,k[e+1536>>0]=-27439*e,k[e+1792>>0]=-5329*e}function a(e){for(var t=e[0],n=e[1]-1;n>=0;)t&1<<n&&(G|=1<<O),n--,O--,0>O&&(255==G?(s(255),s(0)):s(G),O=7,G=0)}function s(e){M.push(j[e])}function c(e){s(e>>8&255),s(255&e)}function u(e,t){var n,r,i,o,a,s,c,u,l,f=0;const d=8,h=64;for(l=0;d>l;++l){n=e[f],r=e[f+1],i=e[f+2],o=e[f+3],a=e[f+4],s=e[f+5],c=e[f+6],u=e[f+7];var g=n+u,p=n-u,m=r+c,w=r-c,v=i+s,y=i-s,b=o+a,S=o-a,I=g+b,P=g-b,F=m+v,x=m-v;e[f]=I+F,e[f+4]=I-F;var D=.707106781*(x+P);e[f+2]=P+D,e[f+6]=P-D,I=S+y,F=y+w,x=w+p;var U=.382683433*(I-x),C=.5411961*I+U,T=1.306562965*x+U,A=.707106781*F,R=p+A,M=p-A;e[f+5]=M+C,e[f+3]=M-C,e[f+1]=R+T,e[f+7]=R-T,f+=8}for(f=0,l=0;d>l;++l){n=e[f],r=e[f+8],i=e[f+16],o=e[f+24],a=e[f+32],s=e[f+40],c=e[f+48],u=e[f+56];var G=n+u,O=n-u,_=r+c,B=r-c,E=i+s,j=i-s,k=o+a,N=o-a,W=G+k,H=G-k,z=_+E,q=_-E;e[f]=W+z,e[f+32]=W-z;var V=.707106781*(q+H);e[f+16]=H+V,e[f+48]=H-V,W=N+j,z=j+B,q=B+O;var X=.382683433*(W-q),Q=.5411961*W+X,Y=1.306562965*q+X,K=.707106781*z,J=O+K,Z=O-K;e[f+40]=Z+Q,e[f+24]=Z-Q,e[f+8]=J+Y,e[f+56]=J-Y,f++}var $;for(l=0;h>l;++l)$=e[l]*t[l],L[l]=$>0?$+.5|0:$-.5|0;return L}function l(){c(65504),c(16),s(74),s(70),s(73),s(70),s(0),s(1),s(1),s(0),c(1),c(1),s(0),s(0)}function f(e,t){c(65472),c(17),s(8),c(t),c(e),s(3),s(1),s(17),s(0),s(2),s(17),s(1),s(3),s(17),s(1)}function d(){c(65499),c(132),s(0);for(var e=0;64>e;e++)s(x[e]);s(1);for(var t=0;64>t;t++)s(D[t])}function h(){c(65476),c(418),s(0);for(var e=0;16>e;e++)s(W[e+1]);for(var t=0;11>=t;t++)s(H[t]);s(16);for(var n=0;16>n;n++)s(z[n+1]);for(var r=0;161>=r;r++)s(q[r]);s(1);for(var i=0;16>i;i++)s(V[i+1]);for(var o=0;11>=o;o++)s(X[o]);s(17);for(var a=0;16>a;a++)s(Q[a+1]);for(var u=0;161>=u;u++)s(Y[u])}function g(){c(65498),c(12),s(3),s(1),s(0),s(2),s(17),s(3),s(17),s(0),s(63),s(0)}function p(e,t,n,r,i){var o,s=i[0],c=i[240];const l=16,f=63,d=64;for(var h=u(e,t),g=0;d>g;++g)R[N[g]]=h[g];var p=R[0]-n;n=R[0],0==p?a(r[0]):(o=32767+p,a(r[A[o]]),a(T[o]));for(var m=63;m>0&&0==R[m];m--);if(0==m)return a(s),n;for(var w,v=1;m>=v;){for(var y=v;0==R[v]&&m>=v;++v);var b=v-y;if(b>=l){w=b>>4;for(var S=1;w>=S;++S)a(c);b=15&b}o=32767+R[v],a(i[(b<<4)+A[o]]),a(T[o]),v++}return m!=f&&a(s),n}function m(){for(var e=String.fromCharCode,t=0;256>t;t++)j[t]=e(t)}function w(e){if(0>=e&&(e=1),e>100&&(e=100),P!=e){var n=0;n=50>e?Math.floor(5e3/e):Math.floor(200-2*e),t(n),P=e}}function v(){var t=(new Date).getTime();e||(e=50),m(),r(),i(),o(),w(e);(new Date).getTime()-t}var y,b,S,I,P,F=(Math.round,Math.floor),x=new Array(64),D=new Array(64),U=new Array(64),C=new Array(64),T=new Array(65535),A=new Array(65535),L=new Array(64),R=new Array(64),M=[],G=0,O=7,_=new Array(64),B=new Array(64),E=new Array(64),j=new Array(256),k=new Array(2048),N=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],W=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],H=[0,1,2,3,4,5,6,7,8,9,10,11],z=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],q=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],V=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],X=[0,1,2,3,4,5,6,7,8,9,10,11],Q=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],Y=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];this.encode=function(e,t,n){var r=(new Date).getTime();t&&w(t),M=new Array,G=0,O=7,c(65496),l(),d(),f(e.width,e.height),h(),g();var i=0,o=0,s=0;G=0,O=7,this.encode.displayName="_encode_";for(var u,m,v,P,F,x,D,T,A,L=e.data,R=e.width,j=e.height,N=4*R,W=0;j>W;){for(u=0;N>u;){for(F=N*W+u,x=F,D=-1,T=0,A=0;64>A;A++)T=A>>3,D=4*(7&A),x=F+T*N+D,W+T>=j&&(x-=N*(W+1+T-j)),u+D>=N&&(x-=u+D-N+4),m=L[x++],v=L[x++],P=L[x++],_[A]=(k[m]+k[v+256>>0]+k[P+512>>0]>>16)-128,B[A]=(k[m+768>>0]+k[v+1024>>0]+k[P+1280>>0]>>16)-128,E[A]=(k[m+1280>>0]+k[v+1536>>0]+k[P+1792>>0]>>16)-128;i=p(_,U,i,y,S),o=p(B,C,o,b,I),s=p(E,C,s,b,I),u+=32}W+=8}if(O>=0){var H=[];H[1]=O+1,H[0]=(1<<O+1)-1,a(H)}if(c(65497),n){for(var z=M.length,q=new Uint8Array(z),V=0;z>V;V++)q[V]=M[V].charCodeAt();M=[];(new Date).getTime()-r;return q}var X="data:image/jpeg;base64,"+btoa(M.join(""));M=[];(new Date).getTime()-r;return X},v()}e.exports=n},function(e,t,n){function r(e,t){var n=this;if(!e)throw new Error("没有收到图片，可能的解决方案：https://github.com/think2011/localResizeIMG/issues/7");t=t||{},n.defaults={width:null,height:null,fieldName:"file",quality:.7},n.file=e;for(var r in t)t.hasOwnProperty(r)&&(n.defaults[r]=t[r]);return this.init()}function i(e){var t=null;return t=e?[].filter.call(document.scripts,function(t){return-1!==t.src.indexOf(e)})[0]:document.scripts[document.scripts.length-1],t?t.src.substr(0,t.src.lastIndexOf("/")):null}function o(e){var t;t=e.split(",")[0].indexOf("base64")>=0?atob(e.split(",")[1]):unescape(e.split(",")[1]);for(var n=e.split(",")[0].split(":")[1].split(";")[0],r=new Uint8Array(t.length),i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return new s.Blob([r.buffer],{type:n})}n.p=i("lrz")+"/",window.URL=window.URL||window.webkitURL;var a=n(1),s=n(4),c=n(5),u=function(e){var t=/OS (\d)_.* like Mac OS X/g.exec(e),n=/Android (\d.*?);/g.exec(e)||/Android\/(\d.*?) /g.exec(e);return{oldIOS:t?+t.pop()<8:!1,oldAndroid:n?+n.pop().substr(0,3)<4.5:!1,iOS:/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(e),android:/Android/g.test(e),mQQBrowser:/MQQBrowser/g.test(e)}}(navigator.userAgent);r.prototype.init=function(){var e=this,t=e.file,n="string"==typeof t,r=/^data:/.test(t),i=new Image,c=document.createElement("canvas"),u=n?t:URL.createObjectURL(t);if(e.img=i,e.blob=u,e.canvas=c,n?e.fileName=r?"base64.jpg":t.split("/").pop():e.fileName=t.name,!document.createElement("canvas").getContext)throw new Error("浏览器不支持canvas");return new a(function(n,a){i.onerror=function(){throw new Error("加载图片文件失败")},i.onload=function(){e._getBase64().then(function(e){return e.length<10&&a("生成base64失败"),e}).then(function(r){var i=null;"object"==typeof e.file&&r.length>e.file.size?(i=new FormData,t=e.file):(i=new s.FormData,t=o(r)),i.append(e.defaults.fieldName,t,e.fileName.replace(/\..+/g,".jpg")),n({formData:i,fileLen:+t.size,base64:r,base64Len:r.length,origin:e.file,file:t});for(var a in e)e.hasOwnProperty(a)&&(e[a]=null);URL.revokeObjectURL(e.blob)})},!r&&(i.crossOrigin="*"),i.src=u})},r.prototype._getBase64=function(){var e=this,t=e.img,n=e.file,r=e.canvas;return new a(function(i){try{c.getData("object"==typeof n?n:t,function(){e.orientation=c.getTag(this,"Orientation"),e.resize=e._getResize(),e.ctx=r.getContext("2d"),r.width=e.resize.width,r.height=e.resize.height,e.ctx.fillStyle="#fff",e.ctx.fillRect(0,0,r.width,r.height),u.oldIOS?e._createBase64ForOldIOS().then(i):e._createBase64().then(i)})}catch(o){throw new Error(o)}})},r.prototype._createBase64ForOldIOS=function(){var e=this,t=e.img,r=e.canvas,i=e.defaults,o=e.orientation;return new a(function(e){!function(){var a=[n(6)];(function(n){var a=new n(t);"5678".indexOf(o)>-1?a.render(r,{width:r.height,height:r.width,orientation:o}):a.render(r,{width:r.width,height:r.height,orientation:o}),e(r.toDataURL("image/jpeg",i.quality))}).apply(null,a)}()})},r.prototype._createBase64=function(){var e=this,t=e.resize,r=e.img,i=e.canvas,o=e.ctx,s=e.defaults,c=e.orientation;switch(c){case 3:o.rotate(180*Math.PI/180),o.drawImage(r,-t.width,-t.height,t.width,t.height);break;case 6:o.rotate(90*Math.PI/180),o.drawImage(r,0,-t.width,t.height,t.width);break;case 8:o.rotate(270*Math.PI/180),o.drawImage(r,-t.height,0,t.height,t.width);break;case 2:o.translate(t.width,0),o.scale(-1,1),o.drawImage(r,0,0,t.width,t.height);break;case 4:o.translate(t.width,0),o.scale(-1,1),o.rotate(180*Math.PI/180),o.drawImage(r,-t.width,-t.height,t.width,t.height);break;case 5:o.translate(t.width,0),o.scale(-1,1),o.rotate(90*Math.PI/180),o.drawImage(r,0,-t.width,t.height,t.width);break;case 7:o.translate(t.width,0),o.scale(-1,1),o.rotate(270*Math.PI/180),o.drawImage(r,-t.height,0,t.height,t.width);break;default:o.drawImage(r,0,0,t.width,t.height)}return new a(function(e){u.oldAndroid||u.mQQBrowser||!navigator.userAgent?!function(){var t=[n(7)];(function(t){var n=new t,r=o.getImageData(0,0,i.width,i.height);e(n.encode(r,100*s.quality))}).apply(null,t)}():e(i.toDataURL("image/jpeg",s.quality))})},r.prototype._getResize=function(){var e=this,t=e.img,n=e.defaults,r=n.width,i=n.height,o=e.orientation,a={width:t.width,height:t.height};if("5678".indexOf(o)>-1&&(a.width=t.height,a.height=t.width),a.width<r||a.height<i)return a;var s=a.width/a.height;for(r&&i?s>=r/i?a.width>r&&(a.width=r,a.height=Math.ceil(r/s)):a.height>i&&(a.height=i,a.width=Math.ceil(i*s)):r?r<a.width&&(a.width=r,a.height=Math.ceil(r/s)):i&&i<a.height&&(a.width=Math.ceil(i*s),a.height=i);a.width>=3264||a.height>=2448;)a.width*=.8,a.height*=.8;return a},window.lrz=function(e,t){return new r(e,t)},window.lrz.version="4.9.36",e.exports=window.lrz}])});
//# sourceMappingURL=lrz.all.bundle.js.mapck) {
	        var http          = new XMLHttpRequest();
	        http.open("GET", url, true);
	        http.responseType = "blob";
	        http.onload       = function (e) {
	            if (this.status == 200 || this.status === 0) {
	                callback(this.response);
	            }
	        };
	        http.send();
	    }

	    function getImageData (img, callback) {
	        function handleBinaryFile (binFile) {
	            var data     = findEXIFinJPEG(binFile);
	            var iptcdata = findIPTCinJPEG(binFile);
	            img.exifdata = data || {};
	            img.iptcdata = iptcdata || {};
	            if (callback) {
	                callback.call(img);
	            }
	        }

	        if (img.src) {
	            if (/^data\:/i.test(img.src)) { // Data URI
	                var arrayBuffer = base64ToArrayBuffer(img.src);
	                handleBinaryFile(arrayBuffer);

	            } else if (/^blob\:/i.test(img.src)) { // Object URL
	                var fileReader    = new FileReader();
	                fileReader.onload = function (e) {
	                    handleBinaryFile(e.target.result);
	                };
	                objectURLToBlob(img.src, function (blob) {
	                    fileReader.readAsArrayBuffer(blob);
	                });
	            } else {
	                var http          = new XMLHttpRequest();
	                http.onload       = function () {
	                    if (this.status == 200 || this.status === 0) {
	                        handleBinaryFile(http.response);
	                    } else {
	                        callback(new Error("Could not load image"));
	                    }
	                    http = null;
	                };
	                http.open("GET", img.src, true);
	                http.responseType = "arraybuffer";
	                http.send(null);
	            }
	        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
	            var fileReader    = new FileReader();
	            fileReader.onload = function (e) {
	                if (debug) console.log("Got file of length " + e.target.result.byteLength);
	                handleBinaryFile(e.target.result);
	            };

	            fileReader.readAsArrayBuffer(img);
	        }
	    }

	    function findEXIFinJPEG (file) {
	        var dataView = new DataView(file);

	        if (debug) console.log("Got file of length " + file.byteLength);
	        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
	            if (debug) console.log("Not a valid JPEG");
	            return false; // not a valid jpeg
	        }

	        var offset = 2,
	            length = file.byteLength,
	            marker;

	        while (offset < length) {
	            if (dataView.getUint8(offset) != 0xFF) {
	                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
	                return false; // not a valid marker, something is wrong
	            }

	            marker = dataView.getUint8(offset + 1);
	            if (debug) console.log(marker);

	            // we could implement handling for other markers here,
	            // but we're only looking for 0xFFE1 for EXIF data

	            if (marker == 225) {
	                if (debug) console.log("Found 0xFFE1 marker");

	                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

	                // offset += 2 + file.getShortAt(offset+2, true);

	            } else {
	                offset += 2 + dataView.getUint16(offset + 2);
	            }

	        }

	    }

	    function findIPTCinJPEG (file) {
	        var dataView = new DataView(file);

	        if (debug) console.log("Got file of length " + file.byteLength);
	        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
	            if (debug) console.log("Not a valid JPEG");
	            return false; // not a valid jpeg
	        }

	        var offset = 2,
	            length = file.byteLength;


	        var isFieldSegmentStart = function (dataView, offset) {
	            return (
	                dataView.getUint8(offset) === 0x38 &&
	                dataView.getUint8(offset + 1) === 0x42 &&
	                dataView.getUint8(offset + 2) === 0x49 &&
	                dataView.getUint8(offset + 3) === 0x4D &&
	                dataView.getUint8(offset + 4) === 0x04 &&
	                dataView.getUint8(offset + 5) === 0x04
	            );
	        };

	        while (offset < length) {

	            if (isFieldSegmentStart(dataView, offset)) {

	                // Get the length of the name header (which is padded to an even number of bytes)
	                var nameHeaderLength = dataView.getUint8(offset + 7);
	                if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
	                // Check for pre photoshop 6 format
	                if (nameHeaderLength === 0) {
	                    // Always 4
	                    nameHeaderLength = 4;
	                }

	                var startOffset   = offset + 8 + nameHeaderLength;
	                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

	                return readIPTCData(file, startOffset, sectionLength);

	                break;

	            }


	            // Not the marker, continue searching
	            offset++;

	        }

	    }

	    var IptcFieldMap = {
	        0x78: 'caption',
	        0x6E: 'credit',
	        0x19: 'keywords',
	        0x37: 'dateCreated',
	        0x50: 'byline',
	        0x55: 'bylineTitle',
	        0x7A: 'captionWriter',
	        0x69: 'headline',
	        0x74: 'copyright',
	        0x0F: 'category'
	    };

	    function readIPTCData (file, startOffset, sectionLength) {
	        var dataView        = new DataView(file);
	        var data            = {};
	        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
	        var segmentStartPos = startOffset;
	        while (segmentStartPos < startOffset + sectionLength) {
	            if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
	                segmentType = dataView.getUint8(segmentStartPos + 2);
	                if (segmentType in IptcFieldMap) {
	                    dataSize    = dataView.getInt16(segmentStartPos + 3);
	                    segmentSize = dataSize + 5;
	                    fieldName   = IptcFieldMap[segmentType];
	                    fieldValue  = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
	                    // Check if we already stored a value with this name
	                    if (data.hasOwnProperty(fieldName)) {
	                        // Value already stored with this name, create multivalue field
	                        if (data[fieldName] instanceof Array) {
	                            data[fieldName].push(fieldValue);
	                        }
	                        else {
	                            data[fieldName] = [data[fieldName], fieldValue];
	                        }
	                    }
	                    else {
	                        data[fieldName] = fieldValue;
	                    }
	                }

	            }
	            segmentStartPos++;
	        }
	        return data;
	    }


	    function readTags (file, tiffStart, dirStart, strings, bigEnd) {
	        var entries = file.getUint16(dirStart, !bigEnd),
	            tags    = {},
	            entryOffset, tag,
	            i;

	        for (i = 0; i < entries; i++) {
	            entryOffset = dirStart + i * 12 + 2;
	            tag         = strings[file.getUint16(entryOffset, !bigEnd)];
	            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
	            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
	        }
	        return tags;
	    }


	    function readTagValue (file, entryOffset, tiffStart, dirStart, bigEnd) {
	        var type        = file.getUint16(entryOffset + 2, !bigEnd),
	            numValues   = file.getUint32(entryOffset + 4, !bigEnd),
	            valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
	            offset,
	            vals, val, n,
	            numerator, denominator;

	        switch (type) {
	            case 1: // byte, 8-bit unsigned int
	            case 7: // undefined, 8-bit byte, value depending on field
	                if (numValues == 1) {
	                    return file.getUint8(entryOffset + 8, !bigEnd);
	                } else {
	                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
	                    vals   = [];
	                    for (n = 0; n < numValues; n++) {
	                        vals[n] = file.getUint8(offset + n);
	                    }
	                    return vals;
	                }

	            case 2: // ascii, 8-bit byte
	                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
	                return getStringFromDB(file, offset, numValues - 1);

	            case 3: // short, 16 bit int
	                if (numValues == 1) {
	                    return file.getUint16(entryOffset + 8, !bigEnd);
	                } else {
	                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
	                    vals   = [];
	                    for (n = 0; n < numValues; n++) {
	                        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 4: // long, 32 bit int
	                if (numValues == 1) {
	                    return file.getUint32(entryOffset + 8, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n = 0; n < numValues; n++) {
	                        vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 5:    // rational = two long values, first is numerator, second is denominator
	                if (numValues == 1) {
	                    numerator       = file.getUint32(valueOffset, !bigEnd);
	                    denominator     = file.getUint32(valueOffset + 4, !bigEnd);
	                    val             = new Number(numerator / denominator);
	                    val.numerator   = numerator;
	                    val.denominator = denominator;
	                    return val;
	                } else {
	                    vals = [];
	                    for (n = 0; n < numValues; n++) {
	                        numerator           = file.getUint32(valueOffset + 8 * n, !bigEnd);
	                        denominator         = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
	                        vals[n]             = new Number(numerator / denominator);
	                        vals[n].numerator   = numerator;
	                        vals[n].denominator = denominator;
	                    }
	                    return vals;
	                }

	            case 9: // slong, 32 bit signed int
	                if (numValues == 1) {
	                    return file.getInt32(entryOffset + 8, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n = 0; n < numValues; n++) {
	                        vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 10: // signed rational, two slongs, first is numerator, second is denominator
	                if (numValues == 1) {
	                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n = 0; n < numValues; n++) {
	                        vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
	                    }
	                    return vals;
	                }
	        }
	    }

	    function getStringFromDB (buffer, start, length) {
	        var outstr = "", n;
	        for (n = start; n < start + length; n++) {
	            outstr += String.fromCharCode(buffer.getUint8(n));
	        }
	        return outstr;
	    }

	    function readEXIFData (file, start) {
	        if (getStringFromDB(file, start, 4) != "Exif") {
	            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
	            return false;
	        }

	        var bigEnd,
	            tags, tag,
	            exifData, gpsData,
	            tiffOffset = start + 6;

	        // test for TIFF validity and endianness
	        if (file.getUint16(tiffOffset) == 0x4949) {
	            bigEnd = false;
	        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
	            bigEnd = true;
	        } else {
	            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
	            return false;
	        }

	        if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
	            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
	            return false;
	        }

	        var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

	        if (firstIFDOffset < 0x00000008) {
	            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
	            return false;
	        }

	        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

	        if (tags.ExifIFDPointer) {
	            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
	            for (tag in exifData) {
	                switch (tag) {
	                    case "LightSource" :
	                    case "Flash" :
	                    case "MeteringMode" :
	                    case "ExposureProgram" :
	                    case "SensingMethod" :
	                    case "SceneCaptureType" :
	                    case "SceneType" :
	                    case "CustomRendered" :
	                    case "WhiteBalance" :
	                    case "GainControl" :
	                    case "Contrast" :
	                    case "Saturation" :
	                    case "Sharpness" :
	                    case "SubjectDistanceRange" :
	                    case "FileSource" :
	                        exifData[tag] = StringValues[tag][exifData[tag]];
	                        break;

	                    case "ExifVersion" :
	                    case "FlashpixVersion" :
	                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
	                        break;

	                    case "ComponentsConfiguration" :
	                        exifData[tag] =
	                            StringValues.Components[exifData[tag][0]] +
	                            StringValues.Components[exifData[tag][1]] +
	                            StringValues.Components[exifData[tag][2]] +
	                            StringValues.Components[exifData[tag][3]];
	                        break;
	                }
	                tags[tag] = exifData[tag];
	            }
	        }

	        if (tags.GPSInfoIFDPointer) {
	            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
	            for (tag in gpsData) {
	                switch (tag) {
	                    case "GPSVersionID" :
	                        gpsData[tag] = gpsData[tag][0] +
	                            "." + gpsData[tag][1] +
	                            "." + gpsData[tag][2] +
	                            "." + gpsData[tag][3];
	                        break;
	                }
	                tags[tag] = gpsData[tag];
	            }
	        }

	        return tags;
	    }

	    EXIF.getData = function (img, callback) {
	        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

	        if (!imageHasData(img)) {
	            getImageData(img, callback);
	        } else {
	            if (callback) {
	                callback.call(img);
	            }
	        }
	        return true;
	    }

	    EXIF.getTag = function (img, tag) {
	        if (!imageHasData(img)) return;
	        return img.exifdata[tag];
	    }

	    EXIF.getAllTags = function (img) {
	        if (!imageHasData(img)) return {};
	        var a,
	            data = img.exifdata,
	            tags = {};
	        for (a in data) {
	            if (data.hasOwnProperty(a)) {
	                tags[a] = data[a];
	            }
	        }
	        return tags;
	    }

	    EXIF.pretty = function (img) {
	        if (!imageHasData(img)) return "";
	        var a,
	            data      = img.exifdata,
	            strPretty = "";
	        for (a in data) {
	            if (data.hasOwnProperty(a)) {
	                if (typeof data[a] == "object") {
	                    if (data[a] instanceof Number) {
	                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
	                    } else {
	                        strPretty += a + " : [" + data[a].length + " values]\r\n";
	                    }
	                } else {
	                    strPretty += a + " : " + data[a] + "\r\n";
	                }
	            }
	        }
	        return strPretty;
	    }

	    EXIF.readFromBinaryFile = function (file) {
	        return findEXIFinJPEG(file);
	    }

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return EXIF;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}.call(this));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Mega pixel image rendering library for iOS6 Safari
	 *
	 * Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel),
	 * which causes unexpected subsampling when drawing it in canvas.
	 * By using this library, you can safely render the image with proper stretching.
	 *
	 * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>
	 * Released under the MIT license
	 */
	(function () {

	    /**
	     * Detect subsampling in loaded image.
	     * In iOS, larger images than 2M pixels may be subsampled in rendering.
	     */
	    function detectSubsampling (img) {
	        var iw = img.naturalWidth, ih = img.naturalHeight;
	        if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
	            var canvas   = document.createElement('canvas');
	            canvas.width = canvas.height = 1;
	            var ctx = canvas.getContext('2d');
	            ctx.drawImage(img, -iw + 1, 0);
	            // subsampled image becomes half smaller in rendering size.
	            // check alpha channel value to confirm image is covering edge pixel or not.
	            // if alpha value is 0 image is not covering, hence subsampled.
	            return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
	        } else {
	            return false;
	        }
	    }

	    /**
	     * Detecting vertical squash in loaded image.
	     * Fixes a bug which squash image vertically while drawing into canvas for some images.
	     */
	    function detectVerticalSquash (img, iw, ih) {
	        var canvas    = document.createElement('canvas');
	        canvas.width  = 1;
	        canvas.height = ih;
	        var ctx       = canvas.getContext('2d');
	        ctx.drawImage(img, 0, 0);
	        var data      = ctx.getImageData(0, 0, 1, ih).data;
	        // search image edge pixel position in case it is squashed vertically.
	        var sy = 0;
	        var ey = ih;
	        var py = ih;
	        while (py > sy) {
	            var alpha = data[(py - 1) * 4 + 3];
	            if (alpha === 0) {
	                ey = py;
	            } else {
	                sy = py;
	            }
	            py = (ey + sy) >> 1;
	        }
	        var ratio = (py / ih);
	        return (ratio === 0) ? 1 : ratio;
	    }

	    /**
	     * Rendering image element (with resizing) and get its data URL
	     */
	    function renderImageToDataURL (img, options, doSquash) {
	        var canvas = document.createElement('canvas');
	        renderImageToCanvas(img, canvas, options, doSquash);
	        return canvas.toDataURL("image/jpeg", options.quality || 0.8);
	    }

	    /**
	     * Rendering image element (with resizing) into the canvas element
	     */
	    function renderImageToCanvas (img, canvas, options, doSquash) {
	        var iw         = img.naturalWidth, ih = img.naturalHeight;
	        var width      = options.width, height = options.height;
	        var ctx        = canvas.getContext('2d');
	        ctx.save();
	        transformCoordinate(canvas, ctx, width, height, options.orientation);
	        var subsampled = detectSubsampling(img);
	        if (subsampled) {
	            iw /= 2;
	            ih /= 2;
	        }
	        var d = 1024; // size of tiling canvas
	        var tmpCanvas   = document.createElement('canvas');
	        tmpCanvas.width = tmpCanvas.height = d;
	        var tmpCtx          = tmpCanvas.getContext('2d');
	        var vertSquashRatio = doSquash ? detectVerticalSquash(img, iw, ih) : 1;
	        var dw              = Math.ceil(d * width / iw);
	        var dh              = Math.ceil(d * height / ih / vertSquashRatio);
	        var sy              = 0;
	        var dy              = 0;
	        while (sy < ih) {
	            var sx = 0;
	            var dx = 0;
	            while (sx < iw) {
	                tmpCtx.clearRect(0, 0, d, d);
	                tmpCtx.drawImage(img, -sx, -sy);
	                ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
	                sx += d;
	                dx += dw;
	            }
	            sy += d;
	            dy += dh;
	        }
	        ctx.restore();
	        tmpCanvas           = tmpCtx = null;
	    }

	    /**
	     * Transform canvas coordination according to specified frame size and orientation
	     * Orientation value is from EXIF tag
	     */
	    function transformCoordinate (canvas, ctx, width, height, orientation) {
	        switch (orientation) {
	            case 5:
	            case 6:
	            case 7:
	            case 8:
	                canvas.width  = height;
	                canvas.height = width;
	                break;
	            default:
	                canvas.width  = width;
	                canvas.height = height;
	        }
	        switch (orientation) {
	            case 2:
	                // horizontal flip
	                ctx.translate(width, 0);
	                ctx.scale(-1, 1);
	                break;
	            case 3:
	                // 180 rotate left
	                ctx.translate(width, height);
	                ctx.rotate(Math.PI);
	                break;
	            case 4:
	                // vertical flip
	                ctx.translate(0, height);
	                ctx.scale(1, -1);
	                break;
	            case 5:
	                // vertical flip + 90 rotate right
	                ctx.rotate(0.5 * Math.PI);
	                ctx.scale(1, -1);
	                break;
	            case 6:
	                // 90 rotate right
	                ctx.rotate(0.5 * Math.PI);
	                ctx.translate(0, -height);
	                break;
	            case 7:
	                // horizontal flip + 90 rotate right
	                ctx.rotate(0.5 * Math.PI);
	                ctx.translate(width, -height);
	                ctx.scale(-1, 1);
	                break;
	            case 8:
	                // 90 rotate left
	                ctx.rotate(-0.5 * Math.PI);
	                ctx.translate(-width, 0);
	                break;
	            default:
	                break;
	        }
	    }


	    /**
	     * MegaPixImage class
	     */
	    function MegaPixImage (srcImage) {
	        if (window.Blob && srcImage instanceof Blob) {
	            var img = new Image();
	            var URL = window.URL && window.URL.createObjectURL ? window.URL :
	                window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL :
	                    null;
	            if (!URL) {
	                throw Error("No createObjectURL function found to create blob url");
	            }
	            img.src   = URL.createObjectURL(srcImage);
	            this.blob = srcImage;
	            srcImage  = img;
	        }
	        if (!srcImage.naturalWidth && !srcImage.naturalHeight) {
	            var _this               = this;
	            srcImage.onload         = function () {
	                var listeners = _this.imageLoadListeners;
	                if (listeners) {
	                    _this.imageLoadListeners = null;
	                    for (var i = 0, len = listeners.length; i < len; i++) {
	                        listeners[i]();
	                    }
	                }
	            };
	            this.imageLoadListeners = [];
	        }
	        this.srcImage = srcImage;
	    }

	    /**
	     * Rendering megapix image into specified target element
	     */
	    MegaPixImage.prototype.render = function (target, options, callback) {
	        if (this.imageLoadListeners) {
	            var _this = this;
	            this.imageLoadListeners.push(function () {
	                _this.render(target, options, callback);
	            });
	            return;
	        }
	        options       = options || {};
	        var srcImage  = this.srcImage,
	            src       = srcImage.src,
	            srcLength = src.length,
	            imgWidth  = srcImage.naturalWidth, imgHeight = srcImage.naturalHeight,
	            width     = options.width, height = options.height,
	            maxWidth  = options.maxWidth, maxHeight = options.maxHeight,
	            doSquash  = this.blob && this.blob.type === 'image/jpeg' ||
	                src.indexOf('data:image/jpeg') === 0 ||
	                src.indexOf('.jpg') === srcLength - 4 ||
	                src.indexOf('.jpeg') === srcLength - 5;
	        if (width && !height) {
	            height = (imgHeight * width / imgWidth) << 0;
	        } else if (height && !width) {
	            width = (imgWidth * height / imgHeight) << 0;
	        } else {
	            width  = imgWidth;
	            height = imgHeight;
	        }
	        if (maxWidth && width > maxWidth) {
	            width  = maxWidth;
	            height = (imgHeight * width / imgWidth) << 0;
	        }
	        if (maxHeight && height > maxHeight) {
	            height = maxHeight;
	            width  = (imgWidth * height / imgHeight) << 0;
	        }
	        var opt = {width: width, height: height};
	        for (var k in options) opt[k] = options[k];

	        var tagName = target.tagName.toLowerCase();
	        if (tagName === 'img') {
	            target.src = renderImageToDataURL(this.srcImage, opt, doSquash);
	        } else if (tagName === 'canvas') {
	            renderImageToCanvas(this.srcImage, target, opt, doSquash);
	        }
	        if (typeof this.onrender === 'function') {
	            this.onrender(target);
	        }
	        if (callback) {
	            callback();
	        }
	    };

	    /**
	     * Export class to global
	     */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return MegaPixImage;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // for AMD loader
	    } else {
	        this.MegaPixImage = MegaPixImage;
	    }

	})();


/***/ },
/* 7 */
/***/ function(module, exports) {

	function JPEGEncoder (l) {
	    var o = this;
	    var s = Math.round;
	    var k = Math.floor;
	    var O = new Array(64);
	    var K = new Array(64);
	    var d = new Array(64);
	    var Z = new Array(64);
	    var u;
	    var h;
	    var G;
	    var T;
	    var n = new Array(65535);
	    var m = new Array(65535);
	    var P = new Array(64);
	    var S = new Array(64);
	    var j = [];
	    var t = 0;
	    var a = 7;
	    var A = new Array(64);
	    var f = new Array(64);
	    var U = new Array(64);
	    var e = new Array(256);
	    var C = new Array(2048);
	    var x;
	    var i = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];
	    var g = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
	    var c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	    var w = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
	    var E = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250];
	    var v = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
	    var Y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	    var J = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
	    var B = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];

	    function M (ag) {
	        var af = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
	        for (var ae = 0; ae < 64; ae++) {
	            var aj = k((af[ae] * ag + 50) / 100);
	            if (aj < 1) {
	                aj = 1
	            } else {
	                if (aj > 255) {
	                    aj = 255
	                }
	            }
	            O[i[ae]] = aj
	        }
	        var ah = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];
	        for (var ad = 0; ad < 64; ad++) {
	            var ai = k((ah[ad] * ag + 50) / 100);
	            if (ai < 1) {
	                ai = 1
	            } else {
	                if (ai > 255) {
	                    ai = 255
	                }
	            }
	            K[i[ad]] = ai
	        }
	        var ac = [1, 1.387039845, 1.306562965, 1.175875602, 1, 0.785694958, 0.5411961, 0.275899379];
	        var ab = 0;
	        for (var ak = 0; ak < 8; ak++) {
	            for (var aa = 0; aa < 8; aa++) {
	                d[ab] = (1 / (O[i[ab]] * ac[ak] * ac[aa] * 8));
	                Z[ab] = (1 / (K[i[ab]] * ac[ak] * ac[aa] * 8));
	                ab++
	            }
	        }
	    }

	    function q (ae, aa) {
	        var ad = 0;
	        var ag = 0;
	        var af = new Array();
	        for (var ab = 1; ab <= 16; ab++) {
	            for (var ac = 1; ac <= ae[ab]; ac++) {
	                af[aa[ag]]    = [];
	                af[aa[ag]][0] = ad;
	                af[aa[ag]][1] = ab;
	                ag++;
	                ad++
	            }
	            ad *= 2
	        }
	        return af
	    }

	    function W () {
	        u = q(g, c);
	        h = q(v, Y);
	        G = q(w, E);
	        T = q(J, B)
	    }

	    function z () {
	        var ac = 1;
	        var ab = 2;
	        for (var aa = 1; aa <= 15; aa++) {
	            for (var ad = ac; ad < ab; ad++) {
	                m[32767 + ad]    = aa;
	                n[32767 + ad]    = [];
	                n[32767 + ad][1] = aa;
	                n[32767 + ad][0] = ad
	            }
	            for (var ae = -(ab - 1); ae <= -ac; ae++) {
	                m[32767 + ae]    = aa;
	                n[32767 + ae]    = [];
	                n[32767 + ae][1] = aa;
	                n[32767 + ae][0] = ab - 1 + ae
	            }
	            ac <<= 1;
	            ab <<= 1
	        }
	    }

	    function V () {
	        for (var aa = 0; aa < 256; aa++) {
	            C[aa]               = 19595 * aa;
	            C[(aa + 256) >> 0]  = 38470 * aa;
	            C[(aa + 512) >> 0]  = 7471 * aa + 32768;
	            C[(aa + 768) >> 0]  = -11059 * aa;
	            C[(aa + 1024) >> 0] = -21709 * aa;
	            C[(aa + 1280) >> 0] = 32768 * aa + 8421375;
	            C[(aa + 1536) >> 0] = -27439 * aa;
	            C[(aa + 1792) >> 0] = -5329 * aa
	        }
	    }

	    function X (aa) {
	        var ac = aa[0];
	        var ab = aa[1] - 1;
	        while (ab >= 0) {
	            if (ac & (1 << ab)) {
	                t |= (1 << a)
	            }
	            ab--;
	            a--;
	            if (a < 0) {
	                if (t == 255) {
	                    F(255);
	                    F(0)
	                } else {
	                    F(t)
	                }
	                a = 7;
	                t = 0
	            }
	        }
	    }

	    function F (aa) {
	        j.push(e[aa])
	    }

	    function p (aa) {
	        F((aa >> 8) & 255);
	        F((aa) & 255)
	    }

	    function N (aZ, ap) {
	        var aL, aK, aJ, aI, aH, aD, aC, aB;
	        var aN   = 0;
	        var aR;
	        const aq = 8;
	        const ai = 64;
	        for (aR = 0; aR < aq; ++aR) {
	            aL         = aZ[aN];
	            aK         = aZ[aN + 1];
	            aJ         = aZ[aN + 2];
	            aI         = aZ[aN + 3];
	            aH         = aZ[aN + 4];
	            aD         = aZ[aN + 5];
	            aC         = aZ[aN + 6];
	            aB         = aZ[aN + 7];
	            var aY     = aL + aB;
	            var aO     = aL - aB;
	            var aX     = aK + aC;
	            var aP     = aK - aC;
	            var aU     = aJ + aD;
	            var aQ     = aJ - aD;
	            var aT     = aI + aH;
	            var aS     = aI - aH;
	            var an     = aY + aT;
	            var ak     = aY - aT;
	            var am     = aX + aU;
	            var al     = aX - aU;
	            aZ[aN]     = an + am;
	            aZ[aN + 4] = an - am;
	            var ax     = (al + ak) * 0.707106781;
	            aZ[aN + 2] = ak + ax;
	            aZ[aN + 6] = ak - ax;
	            an         = aS + aQ;
	            am         = aQ + aP;
	            al         = aP + aO;
	            var at     = (an - al) * 0.382683433;
	            var aw     = 0.5411961 * an + at;
	            var au     = 1.306562965 * al + at;
	            var av     = am * 0.707106781;
	            var ah     = aO + av;
	            var ag     = aO - av;
	            aZ[aN + 5] = ag + aw;
	            aZ[aN + 3] = ag - aw;
	            aZ[aN + 1] = ah + au;
	            aZ[aN + 7] = ah - au;
	            aN += 8
	        }
	        aN = 0;
	        for (aR = 0; aR < aq; ++aR) {
	            aL          = aZ[aN];
	            aK          = aZ[aN + 8];
	            aJ          = aZ[aN + 16];
	            aI          = aZ[aN + 24];
	            aH          = aZ[aN + 32];
	            aD          = aZ[aN + 40];
	            aC          = aZ[aN + 48];
	            aB          = aZ[aN + 56];
	            var ar      = aL + aB;
	            var aj      = aL - aB;
	            var az      = aK + aC;
	            var ae      = aK - aC;
	            var aG      = aJ + aD;
	            var ac      = aJ - aD;
	            var aW      = aI + aH;
	            var aa      = aI - aH;
	            var ao      = ar + aW;
	            var aV      = ar - aW;
	            var ay      = az + aG;
	            var aF      = az - aG;
	            aZ[aN]      = ao + ay;
	            aZ[aN + 32] = ao - ay;
	            var af      = (aF + aV) * 0.707106781;
	            aZ[aN + 16] = aV + af;
	            aZ[aN + 48] = aV - af;
	            ao          = aa + ac;
	            ay          = ac + ae;
	            aF          = ae + aj;
	            var aM      = (ao - aF) * 0.382683433;
	            var ad      = 0.5411961 * ao + aM;
	            var a1      = 1.306562965 * aF + aM;
	            var ab      = ay * 0.707106781;
	            var a0      = aj + ab;
	            var aA      = aj - ab;
	            aZ[aN + 40] = aA + ad;
	            aZ[aN + 24] = aA - ad;
	            aZ[aN + 8]  = a0 + a1;
	            aZ[aN + 56] = a0 - a1;
	            aN++
	        }
	        var aE;
	        for (aR = 0; aR < ai; ++aR) {
	            aE    = aZ[aR] * ap[aR];
	            P[aR] = (aE > 0) ? ((aE + 0.5) | 0) : ((aE - 0.5) | 0)
	        }
	        return P
	    }

	    function b () {
	        p(65504);
	        p(16);
	        F(74);
	        F(70);
	        F(73);
	        F(70);
	        F(0);
	        F(1);
	        F(1);
	        F(0);
	        p(1);
	        p(1);
	        F(0);
	        F(0)
	    }

	    function r (aa, ab) {
	        p(65472);
	        p(17);
	        F(8);
	        p(ab);
	        p(aa);
	        F(3);
	        F(1);
	        F(17);
	        F(0);
	        F(2);
	        F(17);
	        F(1);
	        F(3);
	        F(17);
	        F(1)
	    }

	    function D () {
	        p(65499);
	        p(132);
	        F(0);
	        for (var ab = 0; ab < 64; ab++) {
	            F(O[ab])
	        }
	        F(1);
	        for (var aa = 0; aa < 64; aa++) {
	            F(K[aa])
	        }
	    }

	    function H () {
	        p(65476);
	        p(418);
	        F(0);
	        for (var ae = 0; ae < 16; ae++) {
	            F(g[ae + 1])
	        }
	        for (var ad = 0; ad <= 11; ad++) {
	            F(c[ad])
	        }
	        F(16);
	        for (var ac = 0; ac < 16; ac++) {
	            F(w[ac + 1])
	        }
	        for (var ab = 0; ab <= 161; ab++) {
	            F(E[ab])
	        }
	        F(1);
	        for (var aa = 0; aa < 16; aa++) {
	            F(v[aa + 1])
	        }
	        for (var ah = 0; ah <= 11; ah++) {
	            F(Y[ah])
	        }
	        F(17);
	        for (var ag = 0; ag < 16; ag++) {
	            F(J[ag + 1])
	        }
	        for (var af = 0; af <= 161; af++) {
	            F(B[af])
	        }
	    }

	    function I () {
	        p(65498);
	        p(12);
	        F(3);
	        F(1);
	        F(0);
	        F(2);
	        F(17);
	        F(3);
	        F(17);
	        F(0);
	        F(63);
	        F(0)
	    }

	    function L (ad, aa, al, at, ap) {
	        var ag   = ap[0];
	        var ab   = ap[240];
	        var ac;
	        const ar = 16;
	        const ai = 63;
	        const ah = 64;
	        var aq   = N(ad, aa);
	        for (var am = 0; am < ah; ++am) {
	            S[i[am]] = aq[am]
	        }
	        var an = S[0] - al;
	        al     = S[0];
	        if (an == 0) {
	            X(at[0])
	        } else {
	            ac = 32767 + an;
	            X(at[m[ac]]);
	            X(n[ac])
	        }
	        var ae = 63;
	        for (; (ae > 0) && (S[ae] == 0); ae--) {
	        }
	        if (ae == 0) {
	            X(ag);
	            return al
	        }
	        var ao = 1;
	        var au;
	        while (ao <= ae) {
	            var ak = ao;
	            for (; (S[ao] == 0) && (ao <= ae); ++ao) {
	            }
	            var aj = ao - ak;
	            if (aj >= ar) {
	                au = aj >> 4;
	                for (var af = 1; af <= au; ++af) {
	                    X(ab)
	                }
	                aj = aj & 15
	            }
	            ac = 32767 + S[ao];
	            X(ap[(aj << 4) + m[ac]]);
	            X(n[ac]);
	            ao++
	        }
	        if (ae != ai) {
	            X(ag)
	        }
	        return al
	    }

	    function y () {
	        var ab = String.fromCharCode;
	        for (var aa = 0; aa < 256; aa++) {
	            e[aa] = ab(aa)
	        }
	    }

	    this.encode = function (an, aj, aB) {
	        var aa = new Date().getTime();
	        if (aj) {
	            R(aj)
	        }
	        j                       = new Array();
	        t                       = 0;
	        a                       = 7;
	        p(65496);
	        b();
	        D();
	        r(an.width, an.height);
	        H();
	        I();
	        var al                  = 0;
	        var aq                  = 0;
	        var ao                  = 0;
	        t                       = 0;
	        a                       = 7;
	        this.encode.displayName = "_encode_";
	        var at                  = an.data;
	        var ar                  = an.width;
	        var aA                  = an.height;
	        var ay                  = ar * 4;
	        var ai                  = ar * 3;
	        var ah, ag              = 0;
	        var am, ax, az;
	        var ab, ap, ac, af, ae;
	        while (ag < aA) {
	            ah = 0;
	            while (ah < ay) {
	                ab = ay * ag + ah;
	                ap = ab;
	                ac = -1;
	                af = 0;
	                for (ae = 0; ae < 64; ae++) {
	                    af = ae >> 3;
	                    ac = (ae & 7) * 4;
	                    ap = ab + (af * ay) + ac;
	                    if (ag + af >= aA) {
	                        ap -= (ay * (ag + 1 + af - aA))
	                    }
	                    if (ah + ac >= ay) {
	                        ap -= ((ah + ac) - ay + 4)
	                    }
	                    am    = at[ap++];
	                    ax    = at[ap++];
	                    az    = at[ap++];
	                    A[ae] = ((C[am] + C[(ax + 256) >> 0] + C[(az + 512) >> 0]) >> 16) - 128;
	                    f[ae] = ((C[(am + 768) >> 0] + C[(ax + 1024) >> 0] + C[(az + 1280) >> 0]) >> 16) - 128;
	                    U[ae] = ((C[(am + 1280) >> 0] + C[(ax + 1536) >> 0] + C[(az + 1792) >> 0]) >> 16) - 128
	                }
	                al = L(A, d, al, u, G);
	                aq = L(f, Z, aq, h, T);
	                ao = L(U, Z, ao, h, T);
	                ah += 32
	            }
	            ag += 8
	        }
	        if (a >= 0) {
	            var aw = [];
	            aw[1]  = a + 1;
	            aw[0]  = (1 << (a + 1)) - 1;
	            X(aw)
	        }
	        p(65497);
	        if (aB) {
	            var av = j.length;
	            var aC = new Uint8Array(av);
	            for (var au = 0; au < av; au++) {
	                aC[au] = j[au].charCodeAt()
	            }
	            j      = [];
	            var ak = new Date().getTime() - aa;
	            return aC
	        }
	        var ad = "data:image/jpeg;base64," + btoa(j.join(""));
	        j      = [];
	        var ak = new Date().getTime() - aa;
	        return ad
	    };
	    function R (ab) {
	        if (ab <= 0) {
	            ab = 1
	        }
	        if (ab > 100) {
	            ab = 100
	        }
	        if (x == ab) {
	            return
	        }
	        var aa = 0;
	        if (ab < 50) {
	            aa = Math.floor(5000 / ab)
	        } else {
	            aa = Math.floor(200 - ab * 2)
	        }
	        M(aa);
	        x      = ab;
	    }

	    function Q () {
	        var aa = new Date().getTime();
	        if (!l) {
	            l = 50
	        }
	        y();
	        W();
	        z();
	        V();
	        R(l);
	        var ab = new Date().getTime() - aa;
	    }

	    Q()
	}

	module.exports = JPEGEncoder;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// 保证按需加载的文件路径正确
	__webpack_require__.p = getJsDir('lrz') + '/';
	window.URL              = window.URL || window.webkitURL;

	var Promise          = __webpack_require__(1),
	    BlobFormDataShim = __webpack_require__(4),
	    exif             = __webpack_require__(5);


	var UA = (function (userAgent) {
	    var ISOldIOS     = /OS (\d)_.* like Mac OS X/g.exec(userAgent),
	        isOldAndroid = /Android (\d.*?);/g.exec(userAgent) || /Android\/(\d.*?) /g.exec(userAgent);

	    // 判断设备是否是IOS7以下
	    // 判断设备是否是android4.5以下
	    // 判断是否iOS
	    // 判断是否android
	    // 判断是否QQ浏览器
	    return {
	        oldIOS    : ISOldIOS ? +ISOldIOS.pop() < 8 : false,
	        oldAndroid: isOldAndroid ? +isOldAndroid.pop().substr(0, 3) < 4.5 : false,
	        iOS       : /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(userAgent),
	        android   : /Android/g.test(userAgent),
	        mQQBrowser: /MQQBrowser/g.test(userAgent)
	    }
	})(navigator.userAgent);


	function Lrz (file, opts) {
	    var that = this;

	    if (!file) throw new Error('没有收到图片，可能的解决方案：https://github.com/think2011/localResizeIMG/issues/7');

	    opts = opts || {};

	    that.defaults = {
	        width    : null,
	        height   : null,
	        fieldName: 'file',
	        quality  : 0.7
	    };

	    that.file = file;

	    for (var p in opts) {
	        if (!opts.hasOwnProperty(p)) continue;
	        that.defaults[p] = opts[p];
	    }

	    return this.init();
	}

	Lrz.prototype.init = function () {
	    var that         = this,
	        file         = that.file,
	        fileIsString = typeof file === 'string',
	        fileIsBase64 = /^data:/.test(file),
	        img          = new Image(),
	        canvas       = document.createElement('canvas'),
	        blob         = fileIsString ? file : URL.createObjectURL(file);

	    that.img    = img;
	    that.blob   = blob;
	    that.canvas = canvas;

	    if (fileIsString) {
	        that.fileName = fileIsBase64 ? 'base64.jpg' : (file.split('/').pop());
	    } else {
	        that.fileName = file.name;
	    }

	    if (!document.createElement('canvas').getContext) {
	        throw new Error('浏览器不支持canvas');
	    }

	    return new Promise(function (resolve, reject) {
	        img.onerror = function () {
	            throw new Error('加载图片文件失败');
	        };

	        img.onload = function () {
	            that._getBase64()
	                .then(function (base64) {
	                    if (base64.length < 10) reject('生成base64失败');

	                    return base64;
	                })
	                .then(function (base64) {
	                    var formData = null;

	                    // 压缩文件太大就采用源文件,且使用原生的FormData() @source #55
	                    if (typeof that.file === 'object' && base64.length > that.file.size) {
	                        formData = new FormData();
	                        file     = that.file;
	                    } else {
	                        formData = new BlobFormDataShim.FormData();
	                        file     = dataURItoBlob(base64);
	                    }

	                    formData.append(that.defaults.fieldName, file, (that.fileName.replace(/\..+/g, '.jpg')));

	                    resolve({
	                        formData : formData,
	                        fileLen : +file.size,
	                        base64  : base64,
	                        base64Len: base64.length,
	                        origin   : that.file,
	                        file   : file
	                    });

	                    // 释放内存
	                    for (var p in that) {
	                        if (!that.hasOwnProperty(p)) continue;

	                        that[p] = null;
	                    }
	                    URL.revokeObjectURL(that.blob);
	                });
	        };

	        // 如果传入的是base64在移动端会报错
	        !fileIsBase64 && (img.crossOrigin = "*");

	        img.src = blob;
	    });
	};

	Lrz.prototype._getBase64 = function () {
	    var that   = this,
	        img    = that.img,
	        file   = that.file,
	        canvas = that.canvas;

	    return new Promise(function (resolve) {
	        try {
	            // 传入blob在android4.3以下有bug
	            exif.getData(typeof file === 'object' ? file : img, function () {
	                that.orientation = exif.getTag(this, "Orientation");

	                that.resize = that._getResize();
	                that.ctx    = canvas.getContext('2d');

	                canvas.width  = that.resize.width;
	                canvas.height = that.resize.height;

	                // 设置为白色背景，jpg是不支持透明的，所以会被默认为canvas默认的黑色背景。
	                that.ctx.fillStyle = '#fff';
	                that.ctx.fillRect(0, 0, canvas.width, canvas.height);

	                // 根据设备对应处理方式
	                if (UA.oldIOS) {
	                    that._createBase64ForOldIOS().then(resolve);
	                }
	                else {
	                    that._createBase64().then(resolve);
	                }
	            });
	        } catch (err) {
	            // 这样能解决低内存设备闪退的问题吗？
	            throw new Error(err);
	        }
	    });
	};


	Lrz.prototype._createBase64ForOldIOS = function () {
	    var that        = this,
	        img         = that.img,
	        canvas      = that.canvas,
	        defaults    = that.defaults,
	        orientation = that.orientation;

	    return new Promise(function (resolve) {
	        !/* require */(/* empty */function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(6)]; (function (MegaPixImage) {
	            var mpImg = new MegaPixImage(img);

	            if ("5678".indexOf(orientation) > -1) {
	                mpImg.render(canvas, {
	                    width      : canvas.height,
	                    height     : canvas.width,
	                    orientation: orientation
	                });
	            } else {
	                mpImg.render(canvas, {
	                    width      : canvas.width,
	                    height     : canvas.height,
	                    orientation: orientation
	                });
	            }

	            resolve(canvas.toDataURL('image/jpeg', defaults.quality));
	        }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}());
	    });
	};

	Lrz.prototype._createBase64 = function () {
	    var that        = this,
	        resize      = that.resize,
	        img         = that.img,
	        canvas      = that.canvas,
	        ctx         = that.ctx,
	        defaults    = that.defaults,
	        orientation = that.orientation;

	    // 调整为正确方向
	    switch (orientation) {
	        case 3:
	            ctx.rotate(180 * Math.PI / 180);
	            ctx.drawImage(img, -resize.width, -resize.height, resize.width, resize.height);
	            break;
	        case 6:
	            ctx.rotate(90 * Math.PI / 180);
	            ctx.drawImage(img, 0, -resize.width, resize.height, resize.width);
	            break;
	        case 8:
	            ctx.rotate(270 * Math.PI / 180);
	            ctx.drawImage(img, -resize.height, 0, resize.height, resize.width);
	            break;

	        case 2:
	            ctx.translate(resize.width, 0);
	            ctx.scale(-1, 1);
	            ctx.drawImage(img, 0, 0, resize.width, resize.height);
	            break;
	        case 4:
	            ctx.translate(resize.width, 0);
	            ctx.scale(-1, 1);
	            ctx.rotate(180 * Math.PI / 180);
	            ctx.drawImage(img, -resize.width, -resize.height, resize.width, resize.height);
	            break;
	        case 5:
	            ctx.translate(resize.width, 0);
	            ctx.scale(-1, 1);
	            ctx.rotate(90 * Math.PI / 180);
	            ctx.drawImage(img, 0, -resize.width, resize.height, resize.width);
	            break;
	        case 7:
	            ctx.translate(resize.width, 0);
	            ctx.scale(-1, 1);
	            ctx.rotate(270 * Math.PI / 180);
	            ctx.drawImage(img, -resize.height, 0, resize.height, resize.width);
	            break;

	        default:
	            ctx.drawImage(img, 0, 0, resize.width, resize.height);
	    }

	    return new Promise(function (resolve) {
	        if (UA.oldAndroid || UA.mQQBrowser || !navigator.userAgent) {
	            !/* require */(/* empty */function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(7)]; (function (JPEGEncoder) {
	                var encoder = new JPEGEncoder(),
	                    img     = ctx.getImageData(0, 0, canvas.width, canvas.height);

	                resolve(encoder.encode(img, defaults.quality * 100));
	            }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}())
	        }
	        else {
	            resolve(canvas.toDataURL('image/jpeg', defaults.quality));
	        }
	    });
	};

	Lrz.prototype._getResize = function () {
	    var that        = this,
	        img         = that.img,
	        defaults    = that.defaults,
	        width       = defaults.width,
	        height      = defaults.height,
	        orientation = that.orientation;

	    var ret = {
	        width : img.width,
	        height: img.height
	    };

	    if ("5678".indexOf(orientation) > -1) {
	        ret.width  = img.height;
	        ret.height = img.width;
	    }

	    // 如果原图小于设定，采用原图
	    if (ret.width < width || ret.height < height) {
	        return ret;
	    }

	    var scale = ret.width / ret.height;

	    if (width && height) {
	        if (scale >= width / height) {
	            if (ret.width > width) {
	                ret.width  = width;
	                ret.height = Math.ceil(width / scale);
	            }
	        } else {
	            if (ret.height > height) {
	                ret.height = height;
	                ret.width  = Math.ceil(height * scale);
	            }
	        }
	    }
	    else if (width) {
	        if (width < ret.width) {
	            ret.width  = width;
	            ret.height = Math.ceil(width / scale);
	        }
	    }
	    else if (height) {
	        if (height < ret.height) {
	            ret.width  = Math.ceil(height * scale);
	            ret.height = height;
	        }
	    }

	    // 超过这个值base64无法生成，在IOS上
	    while (ret.width >= 3264 || ret.height >= 2448) {
	        ret.width *= 0.8;
	        ret.height *= 0.8;
	    }

	    return ret;
	};

	/**
	 * 获取当前js文件所在路径，必须得在代码顶部执行此函数
	 * @returns {string}
	 */
	function getJsDir (src) {
	    var script = null;

	    if (src) {
	        script = [].filter.call(document.scripts, function (v) {
	            return v.src.indexOf(src) !== -1;
	        })[0];
	    } else {
	        script = document.scripts[document.scripts.length - 1];
	    }

	    if (!script) return null;

	    return script.src.substr(0, script.src.lastIndexOf('/'));
	}


	/**
	 * 转换成formdata
	 * @param dataURI
	 * @returns {*}
	 *
	 * @source http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
	 */
	function dataURItoBlob (dataURI) {
	    // convert base64/URLEncoded data component to raw binary data held in a string
	    var byteString;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
	        byteString = atob(dataURI.split(',')[1]);
	    else
	        byteString = unescape(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    // write the bytes of the string to a typed array
	    var ia = new Uint8Array(byteString.length);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }

	    return new BlobFormDataShim.Blob([ia.buffer], {type: mimeString});
	}

	window.lrz = function (file, opts) {
	    return new Lrz(file, opts);
	};

	// 版本号来自package.json，构建时自动填充
	window.lrz.version = '__packageJSON.version__';

	module.exports = window.lrz;

	/**
	 *
	 * 　　　┏┓　　　┏┓
	 * 　　┏┛┻━━━┛┻┓
	 * 　　┃　　　　　　　┃
	 * 　　┃　　　━　　　┃
	 * 　　┃　┳┛　┗┳　┃
	 * 　　┃　　　　　　　┃
	 * 　　┃　　　┻　　　┃
	 * 　　┃　　　　　　　┃
	 * 　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
	 * 　　　　┃　　　┃    神兽保佑,代码无bug
	 * 　　　　┃　　　┃
	 * 　　　　┃　　　┗━━━┓
	 * 　　　　┃　　　　　 ┣┓
	 * 　　　　┃　　　　 ┏┛
	 * 　　　　┗┓┓┏━┳┓┏┛
	 * 　　　　　┃┫┫　┃┫┫
	 * 　　　　　┗┻┛　┗┻┛
	 *
	 */




/***/ }
/******/ ])
});
;