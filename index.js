var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/qr-scanner/qr-scanner-worker.min.js
var qr_scanner_worker_min_exports = {};
__export(qr_scanner_worker_min_exports, {
  createWorker: () => createWorker
});
var createWorker;
var init_qr_scanner_worker_min = __esm({
  "node_modules/qr-scanner/qr-scanner-worker.min.js"() {
    createWorker = () => new Worker(URL.createObjectURL(new Blob([`class x{constructor(a,b){this.width=b;this.height=a.length/b;this.data=a}static createEmpty(a,b){return new x(new Uint8ClampedArray(a*b),a)}get(a,b){return 0>a||a>=this.width||0>b||b>=this.height?!1:!!this.data[b*this.width+a]}set(a,b,c){this.data[b*this.width+a]=c?1:0}setRegion(a,b,c,d,e){for(let f=b;f<b+d;f++)for(let g=a;g<a+c;g++)this.set(g,f,!!e)}}
class A{constructor(a,b,c){this.width=a;a*=b;if(c&&c.length!==a)throw Error("Wrong buffer size");this.data=c||new Uint8ClampedArray(a)}get(a,b){return this.data[b*this.width+a]}set(a,b,c){this.data[b*this.width+a]=c}}
class ba{constructor(a){this.bitOffset=this.byteOffset=0;this.bytes=a}readBits(a){if(1>a||32<a||a>this.available())throw Error("Cannot read "+a.toString()+" bits");var b=0;if(0<this.bitOffset){b=8-this.bitOffset;var c=a<b?a:b;b-=c;b=(this.bytes[this.byteOffset]&255>>8-c<<b)>>b;a-=c;this.bitOffset+=c;8===this.bitOffset&&(this.bitOffset=0,this.byteOffset++)}if(0<a){for(;8<=a;)b=b<<8|this.bytes[this.byteOffset]&255,this.byteOffset++,a-=8;0<a&&(c=8-a,b=b<<a|(this.bytes[this.byteOffset]&255>>c<<c)>>c,
this.bitOffset+=a)}return b}available(){return 8*(this.bytes.length-this.byteOffset)-this.bitOffset}}var B,C=B||(B={});C.Numeric="numeric";C.Alphanumeric="alphanumeric";C.Byte="byte";C.Kanji="kanji";C.ECI="eci";C.StructuredAppend="structuredappend";var D,E=D||(D={});E[E.Terminator=0]="Terminator";E[E.Numeric=1]="Numeric";E[E.Alphanumeric=2]="Alphanumeric";E[E.Byte=4]="Byte";E[E.Kanji=8]="Kanji";E[E.ECI=7]="ECI";E[E.StructuredAppend=3]="StructuredAppend";let F="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".split("");
function ca(a,b){let c=[],d="";b=a.readBits([8,16,16][b]);for(let e=0;e<b;e++){let f=a.readBits(8);c.push(f)}try{d+=decodeURIComponent(c.map(e=>\`%\${("0"+e.toString(16)).substr(-2)}\`).join(""))}catch(e){}return{bytes:c,text:d}}
function da(a,b){a=new ba(a);let c=9>=b?0:26>=b?1:2;for(b={text:"",bytes:[],chunks:[],version:b};4<=a.available();){var d=a.readBits(4);if(d===D.Terminator)return b;if(d===D.ECI)0===a.readBits(1)?b.chunks.push({type:B.ECI,assignmentNumber:a.readBits(7)}):0===a.readBits(1)?b.chunks.push({type:B.ECI,assignmentNumber:a.readBits(14)}):0===a.readBits(1)?b.chunks.push({type:B.ECI,assignmentNumber:a.readBits(21)}):b.chunks.push({type:B.ECI,assignmentNumber:-1});else if(d===D.Numeric){var e=a,f=[];d="";for(var g=
e.readBits([10,12,14][c]);3<=g;){var h=e.readBits(10);if(1E3<=h)throw Error("Invalid numeric value above 999");var k=Math.floor(h/100),m=Math.floor(h/10)%10;h%=10;f.push(48+k,48+m,48+h);d+=k.toString()+m.toString()+h.toString();g-=3}if(2===g){g=e.readBits(7);if(100<=g)throw Error("Invalid numeric value above 99");e=Math.floor(g/10);g%=10;f.push(48+e,48+g);d+=e.toString()+g.toString()}else if(1===g){e=e.readBits(4);if(10<=e)throw Error("Invalid numeric value above 9");f.push(48+e);d+=e.toString()}b.text+=
d;b.bytes.push(...f);b.chunks.push({type:B.Numeric,text:d})}else if(d===D.Alphanumeric){e=a;f=[];d="";for(g=e.readBits([9,11,13][c]);2<=g;)m=e.readBits(11),k=Math.floor(m/45),m%=45,f.push(F[k].charCodeAt(0),F[m].charCodeAt(0)),d+=F[k]+F[m],g-=2;1===g&&(e=e.readBits(6),f.push(F[e].charCodeAt(0)),d+=F[e]);b.text+=d;b.bytes.push(...f);b.chunks.push({type:B.Alphanumeric,text:d})}else if(d===D.Byte)d=ca(a,c),b.text+=d.text,b.bytes.push(...d.bytes),b.chunks.push({type:B.Byte,bytes:d.bytes,text:d.text});
else if(d===D.Kanji){f=a;d=[];e=f.readBits([8,10,12][c]);for(g=0;g<e;g++)k=f.readBits(13),k=Math.floor(k/192)<<8|k%192,k=7936>k?k+33088:k+49472,d.push(k>>8,k&255);f=(new TextDecoder("shift-jis")).decode(Uint8Array.from(d));b.text+=f;b.bytes.push(...d);b.chunks.push({type:B.Kanji,bytes:d,text:f})}else d===D.StructuredAppend&&b.chunks.push({type:B.StructuredAppend,currentSequence:a.readBits(4),totalSequence:a.readBits(4),parity:a.readBits(8)})}if(0===a.available()||0===a.readBits(a.available()))return b}
class G{constructor(a,b){if(0===b.length)throw Error("No coefficients.");this.field=a;let c=b.length;if(1<c&&0===b[0]){let d=1;for(;d<c&&0===b[d];)d++;if(d===c)this.coefficients=a.zero.coefficients;else for(this.coefficients=new Uint8ClampedArray(c-d),a=0;a<this.coefficients.length;a++)this.coefficients[a]=b[d+a]}else this.coefficients=b}degree(){return this.coefficients.length-1}isZero(){return 0===this.coefficients[0]}getCoefficient(a){return this.coefficients[this.coefficients.length-1-a]}addOrSubtract(a){if(this.isZero())return a;
if(a.isZero())return this;let b=this.coefficients;a=a.coefficients;b.length>a.length&&([b,a]=[a,b]);let c=new Uint8ClampedArray(a.length),d=a.length-b.length;for(var e=0;e<d;e++)c[e]=a[e];for(e=d;e<a.length;e++)c[e]=b[e-d]^a[e];return new G(this.field,c)}multiply(a){if(0===a)return this.field.zero;if(1===a)return this;let b=this.coefficients.length,c=new Uint8ClampedArray(b);for(let d=0;d<b;d++)c[d]=this.field.multiply(this.coefficients[d],a);return new G(this.field,c)}multiplyPoly(a){if(this.isZero()||
a.isZero())return this.field.zero;let b=this.coefficients,c=b.length;a=a.coefficients;let d=a.length,e=new Uint8ClampedArray(c+d-1);for(let f=0;f<c;f++){let g=b[f];for(let h=0;h<d;h++)e[f+h]=H(e[f+h],this.field.multiply(g,a[h]))}return new G(this.field,e)}multiplyByMonomial(a,b){if(0>a)throw Error("Invalid degree less than 0");if(0===b)return this.field.zero;let c=this.coefficients.length;a=new Uint8ClampedArray(c+a);for(let d=0;d<c;d++)a[d]=this.field.multiply(this.coefficients[d],b);return new G(this.field,
a)}evaluateAt(a){let b=0;if(0===a)return this.getCoefficient(0);let c=this.coefficients.length;if(1===a)return this.coefficients.forEach(d=>{b^=d}),b;b=this.coefficients[0];for(let d=1;d<c;d++)b=H(this.field.multiply(a,b),this.coefficients[d]);return b}}function H(a,b){return a^b}
class ea{constructor(a,b,c){this.primitive=a;this.size=b;this.generatorBase=c;this.expTable=Array(this.size);this.logTable=Array(this.size);a=1;for(b=0;b<this.size;b++)this.expTable[b]=a,a*=2,a>=this.size&&(a=(a^this.primitive)&this.size-1);for(a=0;a<this.size-1;a++)this.logTable[this.expTable[a]]=a;this.zero=new G(this,Uint8ClampedArray.from([0]));this.one=new G(this,Uint8ClampedArray.from([1]))}multiply(a,b){return 0===a||0===b?0:this.expTable[(this.logTable[a]+this.logTable[b])%(this.size-1)]}inverse(a){if(0===
a)throw Error("Can't invert 0");return this.expTable[this.size-this.logTable[a]-1]}buildMonomial(a,b){if(0>a)throw Error("Invalid monomial degree less than 0");if(0===b)return this.zero;a=new Uint8ClampedArray(a+1);a[0]=b;return new G(this,a)}log(a){if(0===a)throw Error("Can't take log(0)");return this.logTable[a]}exp(a){return this.expTable[a]}}
function fa(a,b,c,d){b.degree()<c.degree()&&([b,c]=[c,b]);let e=a.zero;for(var f=a.one;c.degree()>=d/2;){var g=b;let h=e;b=c;e=f;if(b.isZero())return null;c=g;f=a.zero;g=b.getCoefficient(b.degree());for(g=a.inverse(g);c.degree()>=b.degree()&&!c.isZero();){let k=c.degree()-b.degree(),m=a.multiply(c.getCoefficient(c.degree()),g);f=f.addOrSubtract(a.buildMonomial(k,m));c=c.addOrSubtract(b.multiplyByMonomial(k,m))}f=f.multiplyPoly(e).addOrSubtract(h);if(c.degree()>=b.degree())return null}d=f.getCoefficient(0);
if(0===d)return null;a=a.inverse(d);return[f.multiply(a),c.multiply(a)]}
function ha(a,b){let c=new Uint8ClampedArray(a.length);c.set(a);a=new ea(285,256,0);var d=new G(a,c),e=new Uint8ClampedArray(b),f=!1;for(var g=0;g<b;g++){var h=d.evaluateAt(a.exp(g+a.generatorBase));e[e.length-1-g]=h;0!==h&&(f=!0)}if(!f)return c;d=new G(a,e);d=fa(a,a.buildMonomial(b,1),d,b);if(null===d)return null;b=d[0];g=b.degree();if(1===g)b=[b.getCoefficient(1)];else{e=Array(g);f=0;for(h=1;h<a.size&&f<g;h++)0===b.evaluateAt(h)&&(e[f]=a.inverse(h),f++);b=f!==g?null:e}if(null==b)return null;e=d[1];
f=b.length;d=Array(f);for(g=0;g<f;g++){h=a.inverse(b[g]);let k=1;for(let m=0;m<f;m++)g!==m&&(k=a.multiply(k,H(1,a.multiply(b[m],h))));d[g]=a.multiply(e.evaluateAt(h),a.inverse(k));0!==a.generatorBase&&(d[g]=a.multiply(d[g],h))}for(e=0;e<b.length;e++){f=c.length-1-a.log(b[e]);if(0>f)return null;c[f]^=d[e]}return c}
let I=[{infoBits:null,versionNumber:1,alignmentPatternCenters:[],errorCorrectionLevels:[{ecCodewordsPerBlock:7,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:19}]},{ecCodewordsPerBlock:10,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:16}]},{ecCodewordsPerBlock:13,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:13}]},{ecCodewordsPerBlock:17,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:9}]}]},{infoBits:null,versionNumber:2,alignmentPatternCenters:[6,18],errorCorrectionLevels:[{ecCodewordsPerBlock:10,ecBlocks:[{numBlocks:1,
dataCodewordsPerBlock:34}]},{ecCodewordsPerBlock:16,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:28}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:22}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:16}]}]},{infoBits:null,versionNumber:3,alignmentPatternCenters:[6,22],errorCorrectionLevels:[{ecCodewordsPerBlock:15,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:55}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:44}]},{ecCodewordsPerBlock:18,
ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:17}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:13}]}]},{infoBits:null,versionNumber:4,alignmentPatternCenters:[6,26],errorCorrectionLevels:[{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:80}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:32}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:24}]},{ecCodewordsPerBlock:16,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:9}]}]},
{infoBits:null,versionNumber:5,alignmentPatternCenters:[6,30],errorCorrectionLevels:[{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:108}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:43}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:15},{numBlocks:2,dataCodewordsPerBlock:16}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:11},{numBlocks:2,dataCodewordsPerBlock:12}]}]},{infoBits:null,versionNumber:6,alignmentPatternCenters:[6,
34],errorCorrectionLevels:[{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:68}]},{ecCodewordsPerBlock:16,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:27}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:19}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:15}]}]},{infoBits:31892,versionNumber:7,alignmentPatternCenters:[6,22,38],errorCorrectionLevels:[{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:78}]},{ecCodewordsPerBlock:18,
ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:31}]},{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:14},{numBlocks:4,dataCodewordsPerBlock:15}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:13},{numBlocks:1,dataCodewordsPerBlock:14}]}]},{infoBits:34236,versionNumber:8,alignmentPatternCenters:[6,24,42],errorCorrectionLevels:[{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:97}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:38},
{numBlocks:2,dataCodewordsPerBlock:39}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:18},{numBlocks:2,dataCodewordsPerBlock:19}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:14},{numBlocks:2,dataCodewordsPerBlock:15}]}]},{infoBits:39577,versionNumber:9,alignmentPatternCenters:[6,26,46],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:36},
{numBlocks:2,dataCodewordsPerBlock:37}]},{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:16},{numBlocks:4,dataCodewordsPerBlock:17}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:12},{numBlocks:4,dataCodewordsPerBlock:13}]}]},{infoBits:42195,versionNumber:10,alignmentPatternCenters:[6,28,50],errorCorrectionLevels:[{ecCodewordsPerBlock:18,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:68},{numBlocks:2,dataCodewordsPerBlock:69}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,
dataCodewordsPerBlock:43},{numBlocks:1,dataCodewordsPerBlock:44}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:19},{numBlocks:2,dataCodewordsPerBlock:20}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:15},{numBlocks:2,dataCodewordsPerBlock:16}]}]},{infoBits:48118,versionNumber:11,alignmentPatternCenters:[6,30,54],errorCorrectionLevels:[{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:81}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:1,
dataCodewordsPerBlock:50},{numBlocks:4,dataCodewordsPerBlock:51}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:22},{numBlocks:4,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:12},{numBlocks:8,dataCodewordsPerBlock:13}]}]},{infoBits:51042,versionNumber:12,alignmentPatternCenters:[6,32,58],errorCorrectionLevels:[{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:92},{numBlocks:2,dataCodewordsPerBlock:93}]},
{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:36},{numBlocks:2,dataCodewordsPerBlock:37}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:20},{numBlocks:6,dataCodewordsPerBlock:21}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:14},{numBlocks:4,dataCodewordsPerBlock:15}]}]},{infoBits:55367,versionNumber:13,alignmentPatternCenters:[6,34,62],errorCorrectionLevels:[{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:107}]},
{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:37},{numBlocks:1,dataCodewordsPerBlock:38}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:20},{numBlocks:4,dataCodewordsPerBlock:21}]},{ecCodewordsPerBlock:22,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:11},{numBlocks:4,dataCodewordsPerBlock:12}]}]},{infoBits:58893,versionNumber:14,alignmentPatternCenters:[6,26,46,66],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:115},
{numBlocks:1,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:40},{numBlocks:5,dataCodewordsPerBlock:41}]},{ecCodewordsPerBlock:20,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:16},{numBlocks:5,dataCodewordsPerBlock:17}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:12},{numBlocks:5,dataCodewordsPerBlock:13}]}]},{infoBits:63784,versionNumber:15,alignmentPatternCenters:[6,26,48,70],errorCorrectionLevels:[{ecCodewordsPerBlock:22,
ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:87},{numBlocks:1,dataCodewordsPerBlock:88}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:41},{numBlocks:5,dataCodewordsPerBlock:42}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:24},{numBlocks:7,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:12},{numBlocks:7,dataCodewordsPerBlock:13}]}]},{infoBits:68472,versionNumber:16,alignmentPatternCenters:[6,26,50,
74],errorCorrectionLevels:[{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:98},{numBlocks:1,dataCodewordsPerBlock:99}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:45},{numBlocks:3,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:19},{numBlocks:2,dataCodewordsPerBlock:20}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:15},{numBlocks:13,dataCodewordsPerBlock:16}]}]},{infoBits:70749,
versionNumber:17,alignmentPatternCenters:[6,30,54,78],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:107},{numBlocks:5,dataCodewordsPerBlock:108}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:46},{numBlocks:1,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:22},{numBlocks:15,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:14},{numBlocks:17,
dataCodewordsPerBlock:15}]}]},{infoBits:76311,versionNumber:18,alignmentPatternCenters:[6,30,56,82],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:120},{numBlocks:1,dataCodewordsPerBlock:121}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:9,dataCodewordsPerBlock:43},{numBlocks:4,dataCodewordsPerBlock:44}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:22},{numBlocks:1,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,
dataCodewordsPerBlock:14},{numBlocks:19,dataCodewordsPerBlock:15}]}]},{infoBits:79154,versionNumber:19,alignmentPatternCenters:[6,30,58,86],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:113},{numBlocks:4,dataCodewordsPerBlock:114}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:44},{numBlocks:11,dataCodewordsPerBlock:45}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:21},{numBlocks:4,dataCodewordsPerBlock:22}]},
{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:9,dataCodewordsPerBlock:13},{numBlocks:16,dataCodewordsPerBlock:14}]}]},{infoBits:84390,versionNumber:20,alignmentPatternCenters:[6,34,62,90],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:107},{numBlocks:5,dataCodewordsPerBlock:108}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:41},{numBlocks:13,dataCodewordsPerBlock:42}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:24},
{numBlocks:5,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:15},{numBlocks:10,dataCodewordsPerBlock:16}]}]},{infoBits:87683,versionNumber:21,alignmentPatternCenters:[6,28,50,72,94],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:116},{numBlocks:4,dataCodewordsPerBlock:117}]},{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:42}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:22},
{numBlocks:6,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:16},{numBlocks:6,dataCodewordsPerBlock:17}]}]},{infoBits:92361,versionNumber:22,alignmentPatternCenters:[6,26,50,74,98],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:111},{numBlocks:7,dataCodewordsPerBlock:112}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:24},
{numBlocks:16,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:24,ecBlocks:[{numBlocks:34,dataCodewordsPerBlock:13}]}]},{infoBits:96236,versionNumber:23,alignmentPatternCenters:[6,30,54,74,102],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:121},{numBlocks:5,dataCodewordsPerBlock:122}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:47},{numBlocks:14,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:24},
{numBlocks:14,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:16,dataCodewordsPerBlock:15},{numBlocks:14,dataCodewordsPerBlock:16}]}]},{infoBits:102084,versionNumber:24,alignmentPatternCenters:[6,28,54,80,106],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:117},{numBlocks:4,dataCodewordsPerBlock:118}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:45},{numBlocks:14,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,
ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:24},{numBlocks:16,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:30,dataCodewordsPerBlock:16},{numBlocks:2,dataCodewordsPerBlock:17}]}]},{infoBits:102881,versionNumber:25,alignmentPatternCenters:[6,32,58,84,110],errorCorrectionLevels:[{ecCodewordsPerBlock:26,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:106},{numBlocks:4,dataCodewordsPerBlock:107}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:47},{numBlocks:13,
dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:24},{numBlocks:22,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:22,dataCodewordsPerBlock:15},{numBlocks:13,dataCodewordsPerBlock:16}]}]},{infoBits:110507,versionNumber:26,alignmentPatternCenters:[6,30,58,86,114],errorCorrectionLevels:[{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:114},{numBlocks:2,dataCodewordsPerBlock:115}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:19,
dataCodewordsPerBlock:46},{numBlocks:4,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:28,dataCodewordsPerBlock:22},{numBlocks:6,dataCodewordsPerBlock:23}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:33,dataCodewordsPerBlock:16},{numBlocks:4,dataCodewordsPerBlock:17}]}]},{infoBits:110734,versionNumber:27,alignmentPatternCenters:[6,34,62,90,118],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:122},{numBlocks:4,dataCodewordsPerBlock:123}]},
{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:22,dataCodewordsPerBlock:45},{numBlocks:3,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:8,dataCodewordsPerBlock:23},{numBlocks:26,dataCodewordsPerBlock:24}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:15},{numBlocks:28,dataCodewordsPerBlock:16}]}]},{infoBits:117786,versionNumber:28,alignmentPatternCenters:[6,26,50,74,98,122],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:117},
{numBlocks:10,dataCodewordsPerBlock:118}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:3,dataCodewordsPerBlock:45},{numBlocks:23,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:4,dataCodewordsPerBlock:24},{numBlocks:31,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:15},{numBlocks:31,dataCodewordsPerBlock:16}]}]},{infoBits:119615,versionNumber:29,alignmentPatternCenters:[6,30,54,78,102,126],errorCorrectionLevels:[{ecCodewordsPerBlock:30,
ecBlocks:[{numBlocks:7,dataCodewordsPerBlock:116},{numBlocks:7,dataCodewordsPerBlock:117}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:21,dataCodewordsPerBlock:45},{numBlocks:7,dataCodewordsPerBlock:46}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:1,dataCodewordsPerBlock:23},{numBlocks:37,dataCodewordsPerBlock:24}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:15},{numBlocks:26,dataCodewordsPerBlock:16}]}]},{infoBits:126325,versionNumber:30,alignmentPatternCenters:[6,
26,52,78,104,130],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:5,dataCodewordsPerBlock:115},{numBlocks:10,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:47},{numBlocks:10,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:15,dataCodewordsPerBlock:24},{numBlocks:25,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:23,dataCodewordsPerBlock:15},{numBlocks:25,dataCodewordsPerBlock:16}]}]},
{infoBits:127568,versionNumber:31,alignmentPatternCenters:[6,30,56,82,108,134],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:13,dataCodewordsPerBlock:115},{numBlocks:3,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:46},{numBlocks:29,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:42,dataCodewordsPerBlock:24},{numBlocks:1,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:23,dataCodewordsPerBlock:15},
{numBlocks:28,dataCodewordsPerBlock:16}]}]},{infoBits:133589,versionNumber:32,alignmentPatternCenters:[6,34,60,86,112,138],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:115}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:46},{numBlocks:23,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:24},{numBlocks:35,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,
dataCodewordsPerBlock:15},{numBlocks:35,dataCodewordsPerBlock:16}]}]},{infoBits:136944,versionNumber:33,alignmentPatternCenters:[6,30,58,86,114,142],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:115},{numBlocks:1,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:14,dataCodewordsPerBlock:46},{numBlocks:21,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:29,dataCodewordsPerBlock:24},{numBlocks:19,dataCodewordsPerBlock:25}]},
{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:11,dataCodewordsPerBlock:15},{numBlocks:46,dataCodewordsPerBlock:16}]}]},{infoBits:141498,versionNumber:34,alignmentPatternCenters:[6,34,62,90,118,146],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:13,dataCodewordsPerBlock:115},{numBlocks:6,dataCodewordsPerBlock:116}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:14,dataCodewordsPerBlock:46},{numBlocks:23,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:44,
dataCodewordsPerBlock:24},{numBlocks:7,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:59,dataCodewordsPerBlock:16},{numBlocks:1,dataCodewordsPerBlock:17}]}]},{infoBits:145311,versionNumber:35,alignmentPatternCenters:[6,30,54,78,102,126,150],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:121},{numBlocks:7,dataCodewordsPerBlock:122}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:12,dataCodewordsPerBlock:47},{numBlocks:26,dataCodewordsPerBlock:48}]},
{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:39,dataCodewordsPerBlock:24},{numBlocks:14,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:22,dataCodewordsPerBlock:15},{numBlocks:41,dataCodewordsPerBlock:16}]}]},{infoBits:150283,versionNumber:36,alignmentPatternCenters:[6,24,50,76,102,128,154],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:6,dataCodewordsPerBlock:121},{numBlocks:14,dataCodewordsPerBlock:122}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:6,
dataCodewordsPerBlock:47},{numBlocks:34,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:46,dataCodewordsPerBlock:24},{numBlocks:10,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:2,dataCodewordsPerBlock:15},{numBlocks:64,dataCodewordsPerBlock:16}]}]},{infoBits:152622,versionNumber:37,alignmentPatternCenters:[6,28,54,80,106,132,158],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:17,dataCodewordsPerBlock:122},{numBlocks:4,dataCodewordsPerBlock:123}]},
{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:29,dataCodewordsPerBlock:46},{numBlocks:14,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:49,dataCodewordsPerBlock:24},{numBlocks:10,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:24,dataCodewordsPerBlock:15},{numBlocks:46,dataCodewordsPerBlock:16}]}]},{infoBits:158308,versionNumber:38,alignmentPatternCenters:[6,32,58,84,110,136,162],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:4,
dataCodewordsPerBlock:122},{numBlocks:18,dataCodewordsPerBlock:123}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:13,dataCodewordsPerBlock:46},{numBlocks:32,dataCodewordsPerBlock:47}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:48,dataCodewordsPerBlock:24},{numBlocks:14,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:42,dataCodewordsPerBlock:15},{numBlocks:32,dataCodewordsPerBlock:16}]}]},{infoBits:161089,versionNumber:39,alignmentPatternCenters:[6,26,54,82,110,138,166],
errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:20,dataCodewordsPerBlock:117},{numBlocks:4,dataCodewordsPerBlock:118}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:40,dataCodewordsPerBlock:47},{numBlocks:7,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:43,dataCodewordsPerBlock:24},{numBlocks:22,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:10,dataCodewordsPerBlock:15},{numBlocks:67,dataCodewordsPerBlock:16}]}]},{infoBits:167017,
versionNumber:40,alignmentPatternCenters:[6,30,58,86,114,142,170],errorCorrectionLevels:[{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:19,dataCodewordsPerBlock:118},{numBlocks:6,dataCodewordsPerBlock:119}]},{ecCodewordsPerBlock:28,ecBlocks:[{numBlocks:18,dataCodewordsPerBlock:47},{numBlocks:31,dataCodewordsPerBlock:48}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:34,dataCodewordsPerBlock:24},{numBlocks:34,dataCodewordsPerBlock:25}]},{ecCodewordsPerBlock:30,ecBlocks:[{numBlocks:20,dataCodewordsPerBlock:15},
{numBlocks:61,dataCodewordsPerBlock:16}]}]}];function J(a,b){a^=b;for(b=0;a;)b++,a&=a-1;return b}function K(a,b){return b<<1|a}
let ia=[{bits:21522,formatInfo:{errorCorrectionLevel:1,dataMask:0}},{bits:20773,formatInfo:{errorCorrectionLevel:1,dataMask:1}},{bits:24188,formatInfo:{errorCorrectionLevel:1,dataMask:2}},{bits:23371,formatInfo:{errorCorrectionLevel:1,dataMask:3}},{bits:17913,formatInfo:{errorCorrectionLevel:1,dataMask:4}},{bits:16590,formatInfo:{errorCorrectionLevel:1,dataMask:5}},{bits:20375,formatInfo:{errorCorrectionLevel:1,dataMask:6}},{bits:19104,formatInfo:{errorCorrectionLevel:1,dataMask:7}},{bits:30660,formatInfo:{errorCorrectionLevel:0,
dataMask:0}},{bits:29427,formatInfo:{errorCorrectionLevel:0,dataMask:1}},{bits:32170,formatInfo:{errorCorrectionLevel:0,dataMask:2}},{bits:30877,formatInfo:{errorCorrectionLevel:0,dataMask:3}},{bits:26159,formatInfo:{errorCorrectionLevel:0,dataMask:4}},{bits:25368,formatInfo:{errorCorrectionLevel:0,dataMask:5}},{bits:27713,formatInfo:{errorCorrectionLevel:0,dataMask:6}},{bits:26998,formatInfo:{errorCorrectionLevel:0,dataMask:7}},{bits:5769,formatInfo:{errorCorrectionLevel:3,dataMask:0}},{bits:5054,
formatInfo:{errorCorrectionLevel:3,dataMask:1}},{bits:7399,formatInfo:{errorCorrectionLevel:3,dataMask:2}},{bits:6608,formatInfo:{errorCorrectionLevel:3,dataMask:3}},{bits:1890,formatInfo:{errorCorrectionLevel:3,dataMask:4}},{bits:597,formatInfo:{errorCorrectionLevel:3,dataMask:5}},{bits:3340,formatInfo:{errorCorrectionLevel:3,dataMask:6}},{bits:2107,formatInfo:{errorCorrectionLevel:3,dataMask:7}},{bits:13663,formatInfo:{errorCorrectionLevel:2,dataMask:0}},{bits:12392,formatInfo:{errorCorrectionLevel:2,
dataMask:1}},{bits:16177,formatInfo:{errorCorrectionLevel:2,dataMask:2}},{bits:14854,formatInfo:{errorCorrectionLevel:2,dataMask:3}},{bits:9396,formatInfo:{errorCorrectionLevel:2,dataMask:4}},{bits:8579,formatInfo:{errorCorrectionLevel:2,dataMask:5}},{bits:11994,formatInfo:{errorCorrectionLevel:2,dataMask:6}},{bits:11245,formatInfo:{errorCorrectionLevel:2,dataMask:7}}],ja=[a=>0===(a.y+a.x)%2,a=>0===a.y%2,a=>0===a.x%3,a=>0===(a.y+a.x)%3,a=>0===(Math.floor(a.y/2)+Math.floor(a.x/3))%2,a=>0===a.x*a.y%
2+a.x*a.y%3,a=>0===(a.y*a.x%2+a.y*a.x%3)%2,a=>0===((a.y+a.x)%2+a.y*a.x%3)%2];
function ka(a,b,c){c=ja[c.dataMask];let d=a.height;var e=17+4*b.versionNumber;let f=x.createEmpty(e,e);f.setRegion(0,0,9,9,!0);f.setRegion(e-8,0,8,9,!0);f.setRegion(0,e-8,9,8,!0);for(var g of b.alignmentPatternCenters)for(var h of b.alignmentPatternCenters)6===g&&6===h||6===g&&h===e-7||g===e-7&&6===h||f.setRegion(g-2,h-2,5,5,!0);f.setRegion(6,9,1,e-17,!0);f.setRegion(9,6,e-17,1,!0);6<b.versionNumber&&(f.setRegion(e-11,0,3,6,!0),f.setRegion(0,e-11,6,3,!0));b=[];h=g=0;e=!0;for(let k=d-1;0<k;k-=2){6===
k&&k--;for(let m=0;m<d;m++){let l=e?d-1-m:m;for(let n=0;2>n;n++){let q=k-n;if(!f.get(q,l)){h++;let r=a.get(q,l);c({y:l,x:q})&&(r=!r);g=g<<1|r;8===h&&(b.push(g),g=h=0)}}}e=!e}return b}
function la(a){var b=a.height,c=Math.floor((b-17)/4);if(6>=c)return I[c-1];c=0;for(var d=5;0<=d;d--)for(var e=b-9;e>=b-11;e--)c=K(a.get(e,d),c);d=0;for(e=5;0<=e;e--)for(let g=b-9;g>=b-11;g--)d=K(a.get(e,g),d);a=Infinity;let f;for(let g of I){if(g.infoBits===c||g.infoBits===d)return g;b=J(c,g.infoBits);b<a&&(f=g,a=b);b=J(d,g.infoBits);b<a&&(f=g,a=b)}if(3>=a)return f}
function ma(a){let b=0;for(var c=0;8>=c;c++)6!==c&&(b=K(a.get(c,8),b));for(c=7;0<=c;c--)6!==c&&(b=K(a.get(8,c),b));var d=a.height;c=0;for(var e=d-1;e>=d-7;e--)c=K(a.get(8,e),c);for(e=d-8;e<d;e++)c=K(a.get(e,8),c);a=Infinity;d=null;for(let {bits:f,formatInfo:g}of ia){if(f===b||f===c)return g;e=J(b,f);e<a&&(d=g,a=e);b!==c&&(e=J(c,f),e<a&&(d=g,a=e))}return 3>=a?d:null}
function na(a,b,c){let d=b.errorCorrectionLevels[c],e=[],f=0;d.ecBlocks.forEach(h=>{for(let k=0;k<h.numBlocks;k++)e.push({numDataCodewords:h.dataCodewordsPerBlock,codewords:[]}),f+=h.dataCodewordsPerBlock+d.ecCodewordsPerBlock});if(a.length<f)return null;a=a.slice(0,f);b=d.ecBlocks[0].dataCodewordsPerBlock;for(c=0;c<b;c++)for(var g of e)g.codewords.push(a.shift());if(1<d.ecBlocks.length)for(g=d.ecBlocks[0].numBlocks,b=d.ecBlocks[1].numBlocks,c=0;c<b;c++)e[g+c].codewords.push(a.shift());for(;0<a.length;)for(let h of e)h.codewords.push(a.shift());
return e}function L(a){let b=la(a);if(!b)return null;var c=ma(a);if(!c)return null;a=ka(a,b,c);var d=na(a,b,c.errorCorrectionLevel);if(!d)return null;c=d.reduce((e,f)=>e+f.numDataCodewords,0);c=new Uint8ClampedArray(c);a=0;for(let e of d){d=ha(e.codewords,e.codewords.length-e.numDataCodewords);if(!d)return null;for(let f=0;f<e.numDataCodewords;f++)c[a++]=d[f]}try{return da(c,b.versionNumber)}catch(e){return null}}
function M(a,b,c,d){var e=a.x-b.x+c.x-d.x;let f=a.y-b.y+c.y-d.y;if(0===e&&0===f)return{a11:b.x-a.x,a12:b.y-a.y,a13:0,a21:c.x-b.x,a22:c.y-b.y,a23:0,a31:a.x,a32:a.y,a33:1};let g=b.x-c.x;var h=d.x-c.x;let k=b.y-c.y,m=d.y-c.y;c=g*m-h*k;h=(e*m-h*f)/c;e=(g*f-e*k)/c;return{a11:b.x-a.x+h*b.x,a12:b.y-a.y+h*b.y,a13:h,a21:d.x-a.x+e*d.x,a22:d.y-a.y+e*d.y,a23:e,a31:a.x,a32:a.y,a33:1}}
function oa(a,b,c,d){a=M(a,b,c,d);return{a11:a.a22*a.a33-a.a23*a.a32,a12:a.a13*a.a32-a.a12*a.a33,a13:a.a12*a.a23-a.a13*a.a22,a21:a.a23*a.a31-a.a21*a.a33,a22:a.a11*a.a33-a.a13*a.a31,a23:a.a13*a.a21-a.a11*a.a23,a31:a.a21*a.a32-a.a22*a.a31,a32:a.a12*a.a31-a.a11*a.a32,a33:a.a11*a.a22-a.a12*a.a21}}
function pa(a,b){var c=oa({x:3.5,y:3.5},{x:b.dimension-3.5,y:3.5},{x:b.dimension-6.5,y:b.dimension-6.5},{x:3.5,y:b.dimension-3.5}),d=M(b.topLeft,b.topRight,b.alignmentPattern,b.bottomLeft),e=d.a11*c.a11+d.a21*c.a12+d.a31*c.a13,f=d.a12*c.a11+d.a22*c.a12+d.a32*c.a13,g=d.a13*c.a11+d.a23*c.a12+d.a33*c.a13,h=d.a11*c.a21+d.a21*c.a22+d.a31*c.a23,k=d.a12*c.a21+d.a22*c.a22+d.a32*c.a23,m=d.a13*c.a21+d.a23*c.a22+d.a33*c.a23,l=d.a11*c.a31+d.a21*c.a32+d.a31*c.a33,n=d.a12*c.a31+d.a22*c.a32+d.a32*c.a33,q=d.a13*
c.a31+d.a23*c.a32+d.a33*c.a33;c=x.createEmpty(b.dimension,b.dimension);d=(r,u)=>{const p=g*r+m*u+q;return{x:(e*r+h*u+l)/p,y:(f*r+k*u+n)/p}};for(let r=0;r<b.dimension;r++)for(let u=0;u<b.dimension;u++){let p=d(u+.5,r+.5);c.set(u,r,a.get(Math.floor(p.x),Math.floor(p.y)))}return{matrix:c,mappingFunction:d}}let N=(a,b)=>Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2));function O(a){return a.reduce((b,c)=>b+c)}
function qa(a,b,c){let d=N(a,b),e=N(b,c),f=N(a,c),g,h,k;e>=d&&e>=f?[g,h,k]=[b,a,c]:f>=e&&f>=d?[g,h,k]=[a,b,c]:[g,h,k]=[a,c,b];0>(k.x-h.x)*(g.y-h.y)-(k.y-h.y)*(g.x-h.x)&&([g,k]=[k,g]);return{bottomLeft:g,topLeft:h,topRight:k}}
function ra(a,b,c,d){d=(O(P(a,c,d,5))/7+O(P(a,b,d,5))/7+O(P(c,a,d,5))/7+O(P(b,a,d,5))/7)/4;if(1>d)throw Error("Invalid module size");b=Math.round(N(a,b)/d);a=Math.round(N(a,c)/d);a=Math.floor((b+a)/2)+7;switch(a%4){case 0:a++;break;case 2:a--}return{dimension:a,moduleSize:d}}
function Q(a,b,c,d){let e=[{x:Math.floor(a.x),y:Math.floor(a.y)}];var f=Math.abs(b.y-a.y)>Math.abs(b.x-a.x);if(f){var g=Math.floor(a.y);var h=Math.floor(a.x);a=Math.floor(b.y);b=Math.floor(b.x)}else g=Math.floor(a.x),h=Math.floor(a.y),a=Math.floor(b.x),b=Math.floor(b.y);let k=Math.abs(a-g),m=Math.abs(b-h),l=Math.floor(-k/2),n=g<a?1:-1,q=h<b?1:-1,r=!0;for(let u=g,p=h;u!==a+n;u+=n){g=f?p:u;h=f?u:p;if(c.get(g,h)!==r&&(r=!r,e.push({x:g,y:h}),e.length===d+1))break;l+=m;if(0<l){if(p===b)break;p+=q;l-=k}}c=
[];for(f=0;f<d;f++)e[f]&&e[f+1]?c.push(N(e[f],e[f+1])):c.push(0);return c}function P(a,b,c,d){let e=b.y-a.y,f=b.x-a.x;b=Q(a,b,c,Math.ceil(d/2));a=Q(a,{x:a.x-f,y:a.y-e},c,Math.ceil(d/2));c=b.shift()+a.shift()-1;return a.concat(c).concat(...b)}function R(a,b){let c=O(a)/O(b),d=0;b.forEach((e,f)=>{d+=Math.pow(a[f]-e*c,2)});return{averageSize:c,error:d}}
function S(a,b,c){try{let d=P(a,{x:-1,y:a.y},c,b.length),e=P(a,{x:a.x,y:-1},c,b.length),f=P(a,{x:Math.max(0,a.x-a.y)-1,y:Math.max(0,a.y-a.x)-1},c,b.length),g=P(a,{x:Math.min(c.width,a.x+a.y)+1,y:Math.min(c.height,a.y+a.x)+1},c,b.length),h=R(d,b),k=R(e,b),m=R(f,b),l=R(g,b),n=(h.averageSize+k.averageSize+m.averageSize+l.averageSize)/4;return Math.sqrt(h.error*h.error+k.error*k.error+m.error*m.error+l.error*l.error)+(Math.pow(h.averageSize-n,2)+Math.pow(k.averageSize-n,2)+Math.pow(m.averageSize-n,2)+
Math.pow(l.averageSize-n,2))/n}catch(d){return Infinity}}function T(a,b){for(var c=Math.round(b.x);a.get(c,Math.round(b.y));)c--;for(var d=Math.round(b.x);a.get(d,Math.round(b.y));)d++;c=(c+d)/2;for(d=Math.round(b.y);a.get(Math.round(c),d);)d--;for(b=Math.round(b.y);a.get(Math.round(c),b);)b++;return{x:c,y:(d+b)/2}}
function sa(a){var b=[],c=[];let d=[];var e=[];for(let p=0;p<=a.height;p++){var f=0,g=!1;let t=[0,0,0,0,0];for(let v=-1;v<=a.width;v++){var h=a.get(v,p);if(h===g)f++;else{t=[t[1],t[2],t[3],t[4],f];f=1;g=h;var k=O(t)/7;k=Math.abs(t[0]-k)<k&&Math.abs(t[1]-k)<k&&Math.abs(t[2]-3*k)<3*k&&Math.abs(t[3]-k)<k&&Math.abs(t[4]-k)<k&&!h;var m=O(t.slice(-3))/3;h=Math.abs(t[2]-m)<m&&Math.abs(t[3]-m)<m&&Math.abs(t[4]-m)<m&&h;if(k){let z=v-t[3]-t[4],y=z-t[2];k={startX:y,endX:z,y:p};m=c.filter(w=>y>=w.bottom.startX&&
y<=w.bottom.endX||z>=w.bottom.startX&&y<=w.bottom.endX||y<=w.bottom.startX&&z>=w.bottom.endX&&1.5>t[2]/(w.bottom.endX-w.bottom.startX)&&.5<t[2]/(w.bottom.endX-w.bottom.startX));0<m.length?m[0].bottom=k:c.push({top:k,bottom:k})}if(h){let z=v-t[4],y=z-t[3];h={startX:y,y:p,endX:z};k=e.filter(w=>y>=w.bottom.startX&&y<=w.bottom.endX||z>=w.bottom.startX&&y<=w.bottom.endX||y<=w.bottom.startX&&z>=w.bottom.endX&&1.5>t[2]/(w.bottom.endX-w.bottom.startX)&&.5<t[2]/(w.bottom.endX-w.bottom.startX));0<k.length?
k[0].bottom=h:e.push({top:h,bottom:h})}}}b.push(...c.filter(v=>v.bottom.y!==p&&2<=v.bottom.y-v.top.y));c=c.filter(v=>v.bottom.y===p);d.push(...e.filter(v=>v.bottom.y!==p));e=e.filter(v=>v.bottom.y===p)}b.push(...c.filter(p=>2<=p.bottom.y-p.top.y));d.push(...e);c=[];for(var l of b)2>l.bottom.y-l.top.y||(b=(l.top.startX+l.top.endX+l.bottom.startX+l.bottom.endX)/4,e=(l.top.y+l.bottom.y+1)/2,a.get(Math.round(b),Math.round(e))&&(f=[l.top.endX-l.top.startX,l.bottom.endX-l.bottom.startX,l.bottom.y-l.top.y+
1],f=O(f)/f.length,g=S({x:Math.round(b),y:Math.round(e)},[1,1,3,1,1],a),c.push({score:g,x:b,y:e,size:f})));if(3>c.length)return null;c.sort((p,t)=>p.score-t.score);l=[];for(b=0;b<Math.min(c.length,5);++b){e=c[b];f=[];for(var n of c)n!==e&&f.push(Object.assign(Object.assign({},n),{score:n.score+Math.pow(n.size-e.size,2)/e.size}));f.sort((p,t)=>p.score-t.score);l.push({points:[e,f[0],f[1]],score:e.score+f[0].score+f[1].score})}l.sort((p,t)=>p.score-t.score);let {topRight:q,topLeft:r,bottomLeft:u}=qa(...l[0].points);
l=U(a,d,q,r,u);n=[];l&&n.push({alignmentPattern:{x:l.alignmentPattern.x,y:l.alignmentPattern.y},bottomLeft:{x:u.x,y:u.y},dimension:l.dimension,topLeft:{x:r.x,y:r.y},topRight:{x:q.x,y:q.y}});l=T(a,q);b=T(a,r);c=T(a,u);(a=U(a,d,l,b,c))&&n.push({alignmentPattern:{x:a.alignmentPattern.x,y:a.alignmentPattern.y},bottomLeft:{x:c.x,y:c.y},topLeft:{x:b.x,y:b.y},topRight:{x:l.x,y:l.y},dimension:a.dimension});return 0===n.length?null:n}
function U(a,b,c,d,e){let f,g;try{({dimension:f,moduleSize:g}=ra(d,c,e,a))}catch(l){return null}var h=c.x-d.x+e.x,k=c.y-d.y+e.y;c=(N(d,e)+N(d,c))/2/g;e=1-3/c;let m={x:d.x+e*(h-d.x),y:d.y+e*(k-d.y)};b=b.map(l=>{const n=(l.top.startX+l.top.endX+l.bottom.startX+l.bottom.endX)/4;l=(l.top.y+l.bottom.y+1)/2;if(a.get(Math.floor(n),Math.floor(l))){var q=S({x:Math.floor(n),y:Math.floor(l)},[1,1,1],a)+N({x:n,y:l},m);return{x:n,y:l,score:q}}}).filter(l=>!!l).sort((l,n)=>l.score-n.score);return{alignmentPattern:15<=
c&&b.length?b[0]:m,dimension:f}}
function V(a){var b=sa(a);if(!b)return null;for(let e of b){b=pa(a,e);var c=b.matrix;if(null==c)c=null;else{var d=L(c);if(d)c=d;else{for(d=0;d<c.width;d++)for(let f=d+1;f<c.height;f++)c.get(d,f)!==c.get(f,d)&&(c.set(d,f,!c.get(d,f)),c.set(f,d,!c.get(f,d)));c=L(c)}}if(c)return{binaryData:c.bytes,data:c.text,chunks:c.chunks,version:c.version,location:{topRightCorner:b.mappingFunction(e.dimension,0),topLeftCorner:b.mappingFunction(0,0),bottomRightCorner:b.mappingFunction(e.dimension,e.dimension),bottomLeftCorner:b.mappingFunction(0,
e.dimension),topRightFinderPattern:e.topRight,topLeftFinderPattern:e.topLeft,bottomLeftFinderPattern:e.bottomLeft,bottomRightAlignmentPattern:e.alignmentPattern},matrix:b.matrix}}return null}let ta={inversionAttempts:"attemptBoth",greyScaleWeights:{red:.2126,green:.7152,blue:.0722,useIntegerApproximation:!1},canOverwriteImage:!0};function W(a,b){Object.keys(b).forEach(c=>{a[c]=b[c]})}
function X(a,b,c,d={}){let e=Object.create(null);W(e,ta);W(e,d);d="onlyInvert"===e.inversionAttempts||"invertFirst"===e.inversionAttempts;var f="attemptBoth"===e.inversionAttempts||d;var g=e.greyScaleWeights,h=e.canOverwriteImage,k=b*c;if(a.length!==4*k)throw Error("Malformed data passed to binarizer.");var m=0;if(h){var l=new Uint8ClampedArray(a.buffer,m,k);m+=k}l=new A(b,c,l);if(g.useIntegerApproximation)for(var n=0;n<c;n++)for(var q=0;q<b;q++){var r=4*(n*b+q);l.set(q,n,g.red*a[r]+g.green*a[r+1]+
g.blue*a[r+2]+128>>8)}else for(n=0;n<c;n++)for(q=0;q<b;q++)r=4*(n*b+q),l.set(q,n,g.red*a[r]+g.green*a[r+1]+g.blue*a[r+2]);g=Math.ceil(b/8);n=Math.ceil(c/8);q=g*n;if(h){var u=new Uint8ClampedArray(a.buffer,m,q);m+=q}u=new A(g,n,u);for(q=0;q<n;q++)for(r=0;r<g;r++){var p=Infinity,t=0;for(var v=0;8>v;v++)for(let w=0;8>w;w++){let aa=l.get(8*r+w,8*q+v);p=Math.min(p,aa);t=Math.max(t,aa)}v=(p+t)/2;v=Math.min(255,1.11*v);24>=t-p&&(v=p/2,0<q&&0<r&&(t=(u.get(r,q-1)+2*u.get(r-1,q)+u.get(r-1,q-1))/4,p<t&&(v=t)));
u.set(r,q,v)}h?(q=new Uint8ClampedArray(a.buffer,m,k),m+=k,q=new x(q,b)):q=x.createEmpty(b,c);r=null;f&&(h?(a=new Uint8ClampedArray(a.buffer,m,k),r=new x(a,b)):r=x.createEmpty(b,c));for(b=0;b<n;b++)for(a=0;a<g;a++){c=g-3;c=2>a?2:a>c?c:a;h=n-3;h=2>b?2:b>h?h:b;k=0;for(m=-2;2>=m;m++)for(p=-2;2>=p;p++)k+=u.get(c+m,h+p);c=k/25;for(h=0;8>h;h++)for(k=0;8>k;k++)m=8*a+h,p=8*b+k,t=l.get(m,p),q.set(m,p,t<=c),f&&r.set(m,p,!(t<=c))}f=f?{binarized:q,inverted:r}:{binarized:q};let {binarized:z,inverted:y}=f;(f=V(d?
y:z))||"attemptBoth"!==e.inversionAttempts&&"invertFirst"!==e.inversionAttempts||(f=V(d?z:y));return f}X.default=X;let Y="dontInvert",Z={red:77,green:150,blue:29,useIntegerApproximation:!0};
self.onmessage=a=>{let b=a.data.id,c=a.data.data;switch(a.data.type){case "decode":(a=X(c.data,c.width,c.height,{inversionAttempts:Y,greyScaleWeights:Z}))?self.postMessage({id:b,type:"qrResult",data:a.data,cornerPoints:[a.location.topLeftCorner,a.location.topRightCorner,a.location.bottomRightCorner,a.location.bottomLeftCorner]}):self.postMessage({id:b,type:"qrResult",data:null});break;case "grayscaleWeights":Z.red=c.red;Z.green=c.green;Z.blue=c.blue;Z.useIntegerApproximation=c.useIntegerApproximation;
break;case "inversionMode":switch(c){case "original":Y="dontInvert";break;case "invert":Y="onlyInvert";break;case "both":Y="attemptBoth";break;default:throw Error("Invalid inversion mode");}break;case "close":self.close()}}
`]), { type: "application/javascript" }));
  }
});

// node_modules/qr/index.js
var chCodes = { newline: 10, reset: 27 };
function assertNumber(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`integer expected: ${n}`);
}
function validateVersion(ver) {
  if (!Number.isSafeInteger(ver) || ver < 1 || ver > 40)
    throw new Error(`Invalid version=${ver}. Expected number [1..40]`);
}
function bin(dec, pad) {
  return dec.toString(2).padStart(pad, "0");
}
function mod(a, b) {
  const result = a % b;
  return result >= 0 ? result : b + result;
}
function fillArr(length, val) {
  return new Array(length).fill(val);
}
function popcnt(n) {
  n = n - (n >>> 1 & 1431655765);
  n = (n & 858993459) + (n >>> 2 & 858993459);
  return (n + (n >>> 4) & 252645135) * 16843009 >>> 24;
}
function interleaveBytes(blocks) {
  let maxLen = 0;
  let totalLen = 0;
  for (const block of blocks) {
    maxLen = Math.max(maxLen, block.length);
    totalLen += block.length;
  }
  const result = new Uint8Array(totalLen);
  let idx = 0;
  for (let i = 0; i < maxLen; i++) {
    for (const block of blocks) {
      if (i < block.length)
        result[idx++] = block[i];
    }
  }
  return result;
}
function best() {
  let best2;
  let bestScore = Infinity;
  return {
    add(score, value) {
      if (score >= bestScore)
        return;
      best2 = value;
      bestScore = score;
    },
    get: () => best2,
    score: () => bestScore
  };
}
function alphabet(alphabet2) {
  return {
    has: (char) => alphabet2.includes(char),
    decode: (input) => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== "string")
        throw new Error("alphabet.decode input should be array of strings");
      return input.map((letter) => {
        if (typeof letter !== "string")
          throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet2.indexOf(letter);
        if (index === -1)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet2}`);
        return index;
      });
    },
    encode: (digits) => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number")
        throw new Error("alphabet.encode input should be an array of numbers");
      return digits.map((i) => {
        assertNumber(i);
        if (i < 0 || i >= alphabet2.length)
          throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet2.length})`);
        return alphabet2[i];
      });
    }
  };
}
function transpose32(a) {
  if (a.length !== 32)
    throw new Error("expects 32 element matrix");
  const masks = [1431655765, 858993459, 252645135, 16711935, 65535];
  for (let stage = 0; stage < 5; stage++) {
    const m = masks[stage] >>> 0;
    const s = 1 << stage;
    const step = s << 1;
    for (let i = 0; i < 32; i += step) {
      for (let k = 0; k < s; k++) {
        const i0 = i + k;
        const i1 = i0 + s;
        const x = a[i0] >>> 0;
        const y = a[i1] >>> 0;
        const t = (x >>> s ^ y) & m;
        a[i0] = (x ^ t << s) >>> 0;
        a[i1] = (y ^ t) >>> 0;
      }
    }
  }
}
var bitMask = (x) => 1 << (x & 31) >>> 0;
var rangeMask = (shift, len) => {
  if (len === 0)
    return 0;
  if (len === 32)
    return 4294967295;
  return (1 << len) - 1 << shift >>> 0;
};
var Bitmap = class _Bitmap {
  static size(size, limit) {
    if (typeof size === "number")
      size = { height: size, width: size };
    if (!Number.isSafeInteger(size.height) && size.height !== Infinity)
      throw new Error(`Bitmap: invalid height=${size.height} (${typeof size.height})`);
    if (!Number.isSafeInteger(size.width) && size.width !== Infinity)
      throw new Error(`Bitmap: invalid width=${size.width} (${typeof size.width})`);
    if (limit !== void 0) {
      size = {
        width: Math.min(size.width, limit.width),
        height: Math.min(size.height, limit.height)
      };
    }
    return size;
  }
  static fromString(s) {
    s = s.replace(/^\n+/g, "").replace(/\n+$/g, "");
    const lines = s.split(String.fromCharCode(chCodes.newline));
    const height = lines.length;
    let width;
    const rows = [];
    for (const line of lines) {
      const row = line.split("").map((i) => {
        if (i === "X")
          return true;
        if (i === " ")
          return false;
        if (i === "?")
          return void 0;
        throw new Error(`Bitmap.fromString: unknown symbol=${i}`);
      });
      if (width !== void 0 && row.length !== width)
        throw new Error(`Bitmap.fromString different row sizes: width=${width} cur=${row.length}`);
      width = row.length;
      rows.push(row);
    }
    if (width === void 0)
      width = 0;
    return new _Bitmap({ height, width }, rows);
  }
  // Two bitsets:
  // defined=0 -> undefined
  // defined=1,value=0 -> false
  // defined=1,value=1 -> true
  defined;
  value;
  tailMask;
  words;
  fullWords;
  height;
  width;
  constructor(size, data) {
    const { height, width } = _Bitmap.size(size);
    this.height = height;
    this.width = width;
    this.tailMask = rangeMask(0, width & 31 || 32);
    this.words = Math.ceil(width / 32) | 0;
    this.fullWords = Math.floor(width / 32) | 0;
    this.value = new Uint32Array(this.words * height);
    this.defined = new Uint32Array(this.value.length);
    if (data) {
      if (data.length !== height)
        throw new Error(`Bitmap: data height mismatch: exp=${height} got=${data.length}`);
      for (let y = 0; y < height; y++) {
        const row = data[y];
        if (!row || row.length !== width)
          throw new Error(`Bitmap: data width mismatch at y=${y}: exp=${width} got=${row?.length}`);
        for (let x = 0; x < width; x++)
          this.set(x, y, row[x]);
      }
    }
  }
  point(p) {
    return this.get(p.x, p.y);
  }
  isInside(p) {
    return 0 <= p.x && p.x < this.width && 0 <= p.y && p.y < this.height;
  }
  size(offset) {
    if (!offset)
      return { height: this.height, width: this.width };
    const { x, y } = this.xy(offset);
    return { height: this.height - y, width: this.width - x };
  }
  xy(c) {
    if (typeof c === "number")
      c = { x: c, y: c };
    if (!Number.isSafeInteger(c.x))
      throw new Error(`Bitmap: invalid x=${c.x}`);
    if (!Number.isSafeInteger(c.y))
      throw new Error(`Bitmap: invalid y=${c.y}`);
    c.x = mod(c.x, this.width);
    c.y = mod(c.y, this.height);
    return c;
  }
  /**
   * Return pixel bit index
   */
  wordIndex(x, y) {
    return y * this.words + (x >>> 5);
  }
  bitIndex(x, y) {
    return { word: this.wordIndex(x, y), bit: x & 31 };
  }
  isDefined(x, y) {
    const wi = this.wordIndex(x, y);
    const m = bitMask(x);
    return (this.defined[wi] & m) !== 0;
  }
  get(x, y) {
    const wi = this.wordIndex(x, y);
    const m = bitMask(x);
    return (this.value[wi] & m) !== 0;
  }
  maskWord(wi, mask, v) {
    const { defined, value } = this;
    defined[wi] |= mask;
    value[wi] = value[wi] & ~mask | -v & mask;
  }
  set(x, y, v) {
    if (v === void 0)
      return;
    this.maskWord(this.wordIndex(x, y), bitMask(x), v);
  }
  // word-span fill for constant values (fast path)
  fillRectConst(x0, y0, w, h, v) {
    if (w <= 0 || h <= 0)
      return;
    if (v === void 0)
      return;
    const { value, defined, words } = this;
    const startWord = x0 >>> 5;
    const endWord = x0 + w - 1 >>> 5;
    const startBit = x0 & 31;
    const endBit = x0 + w - 1 & 31;
    for (let ry = 0; ry < h; ry++) {
      const rowBase = (y0 + ry) * words;
      if (startWord === endWord) {
        const mask = rangeMask(startBit, endBit - startBit + 1);
        this.maskWord(rowBase + startWord, mask, v);
        continue;
      }
      this.maskWord(rowBase + startWord, rangeMask(startBit, 32 - startBit), v);
      for (let i = startWord + 1; i < endWord; i++) {
        defined[rowBase + i] = 4294967295;
        value[rowBase + i] = v ? 4294967295 : 0;
      }
      this.maskWord(rowBase + endWord, rangeMask(0, endBit + 1), v);
    }
  }
  rectWords(x, y, width, height, cb) {
    for (let yPos = 0; yPos < height; yPos++) {
      const Py = y + yPos;
      for (let xPos = 0; xPos < width; ) {
        const bitX = x + xPos;
        const { bit, word } = this.bitIndex(bitX, Py);
        const bitsPerWord = Math.min(32 - bit, width - xPos);
        cb(word, bitX, xPos, yPos, bitsPerWord);
        xPos += bitsPerWord;
      }
    }
  }
  // Basically every operation can be represented as rect
  rect(c, size, fn) {
    const { x, y } = this.xy(c);
    const { height, width } = _Bitmap.size(size, this.size({ x, y }));
    if (typeof fn !== "function") {
      this.fillRectConst(x, y, width, height, fn);
      return this;
    }
    const { defined, value } = this;
    this.rectWords(x, y, width, height, (wi, bitX, xPos, yPos, n) => {
      let defWord = 0;
      let valWord = value[wi];
      for (let b = 0; b < n; b++) {
        const mask = bitMask(bitX + b);
        const res = fn({ x: xPos + b, y: yPos }, (valWord & mask) !== 0);
        if (res === void 0)
          continue;
        defWord |= mask;
        valWord = valWord & ~mask | -res & mask;
      }
      defined[wi] |= defWord;
      value[wi] = valWord;
    });
    return this;
  }
  // returns rectangular part of bitmap
  rectRead(c, size, fn) {
    const { x, y } = this.xy(c);
    const { height, width } = _Bitmap.size(size, this.size({ x, y }));
    const { value } = this;
    this.rectWords(x, y, width, height, (wi, bitX, xPos, yPos, n) => {
      const valWord = value[wi];
      for (let b = 0; b < n; b++) {
        const mask = bitMask(bitX + b);
        fn({ x: xPos + b, y: yPos }, (valWord & mask) !== 0);
      }
    });
    return this;
  }
  // Horizontal & vertical lines
  hLine(c, len, value) {
    return this.rect(c, { width: len, height: 1 }, value);
  }
  vLine(c, len, value) {
    return this.rect(c, { width: 1, height: len }, value);
  }
  // add border
  border(border = 2, value) {
    const height = this.height + 2 * border;
    const width = this.width + 2 * border;
    const out = new _Bitmap({ height, width });
    out.rect(0, Infinity, value);
    out.embed({ x: border, y: border }, this);
    return out;
  }
  // Embed another bitmap on coordinates
  embed(c, src) {
    const { x, y } = this.xy(c);
    const { height, width } = _Bitmap.size(src.size(), this.size({ x, y }));
    if (width <= 0 || height <= 0)
      return this;
    const { value, defined } = this;
    const { words: srcStride, value: srcValue } = src;
    for (let yPos = 0; yPos < height; yPos++) {
      const srcRow = yPos * srcStride;
      for (let xPos = 0; xPos < width; ) {
        const dstX = x + xPos;
        const { word: dstWord, bit: dstBit } = this.bitIndex(dstX, y + yPos);
        const { word: srcWord, bit: srcBit } = src.bitIndex(xPos, yPos);
        const len = Math.min(32 - dstBit, width - xPos);
        const w0 = srcValue[srcWord];
        const w1 = srcBit && srcWord + 1 < srcRow + srcStride ? srcValue[srcWord + 1] : 0;
        const sVal = srcBit ? (w0 >>> srcBit | w1 << 32 - srcBit) >>> 0 : w0;
        const dstMask = rangeMask(dstBit, len);
        const valBits = (sVal & rangeMask(0, len)) << dstBit >>> 0;
        defined[dstWord] |= dstMask;
        value[dstWord] = value[dstWord] & ~dstMask | valBits;
        xPos += len;
      }
    }
    return this;
  }
  // returns rectangular part of bitmap
  rectSlice(c, size = this.size()) {
    const { x, y } = this.xy(c);
    const { height, width } = _Bitmap.size(size, this.size({ x, y }));
    const rect = new _Bitmap({ height, width });
    this.rectRead({ x, y }, { height, width }, (p, cur) => {
      if (this.isDefined(x + p.x, y + p.y)) {
        rect.set(p.x, p.y, cur);
      }
    });
    return rect;
  }
  // Change shape, replace rows with columns (data[y][x] -> data[x][y])
  transpose() {
    const { height, width, value, defined, words } = this;
    const dst = new _Bitmap({ height: width, width: height });
    const { words: dstStride, value: dstValue, defined: dstDefined, tailMask: dstTail } = dst;
    const tmpV = new Uint32Array(32);
    const tmpD = new Uint32Array(32);
    for (let by = 0; by < height; by += 32) {
      for (let bx = 0; bx < words; bx++) {
        const rows = Math.min(32, height - by);
        for (let r = 0; r < rows; r++) {
          const wi = this.wordIndex(32 * bx, by + r);
          tmpV[r] = value[wi];
          tmpD[r] = defined[wi];
        }
        tmpV.fill(0, rows);
        tmpD.fill(0, rows);
        transpose32(tmpV);
        transpose32(tmpD);
        for (let i = 0; i < 32; i++) {
          const dstY = bx * 32 + i;
          if (dstY >= width)
            break;
          const dstPos = dst.wordIndex(by, dstY);
          const curMask = by >>> 5 === dstStride - 1 ? dstTail : 4294967295;
          dstValue[dstPos] = tmpV[i] & curMask;
          dstDefined[dstPos] = tmpD[i] & curMask;
        }
      }
    }
    return dst;
  }
  // black <-> white (inplace)
  negate() {
    const n = this.defined.length;
    for (let i = 0; i < n; i++) {
      this.value[i] = ~this.value[i];
      this.defined[i] = 4294967295;
    }
    return this;
  }
  // Each pixel size is multiplied by factor
  scale(factor) {
    if (!Number.isSafeInteger(factor) || factor > 1024)
      throw new Error(`invalid scale factor: ${factor}`);
    const { height, width } = this;
    const res = new _Bitmap({ height: factor * height, width: factor * width });
    return res.rect({ x: 0, y: 0 }, Infinity, ({ x, y }) => this.get(x / factor | 0, y / factor | 0));
  }
  clone() {
    const res = new _Bitmap(this.size());
    res.defined.set(this.defined);
    res.value.set(this.value);
    return res;
  }
  // Ensure that there is no undefined values left
  assertDrawn() {
    const { height, width, defined, tailMask, fullWords, words } = this;
    if (!height || !width)
      return;
    for (let y = 0; y < height; y++) {
      const rowBase = y * words;
      for (let wi = 0; wi < fullWords; wi++) {
        if (defined[rowBase + wi] !== 4294967295)
          throw new Error(`Invalid color type=undefined`);
      }
      if (words !== fullWords && (defined[rowBase + fullWords] & tailMask) !== tailMask)
        throw new Error(`Invalid color type=undefined`);
    }
  }
  countPatternInRow(y, patternLen, ...patterns) {
    if (patternLen <= 0 || patternLen >= 32)
      throw new Error("wrong patternLen");
    const mask = (1 << patternLen) - 1;
    const { width, value, words } = this;
    let count = 0;
    const rowBase = this.wordIndex(0, y);
    for (let i = 0, window2 = 0; i < words; i++) {
      const w = value[rowBase + i];
      const bitEnd = i === words - 1 ? width & 31 || 32 : 32;
      for (let b = 0; b < bitEnd; b++) {
        window2 = (window2 << 1 | w >>> b & 1) & mask;
        if (i * 32 + b + 1 < patternLen)
          continue;
        for (const p of patterns) {
          if (window2 !== p)
            continue;
          count++;
          break;
        }
      }
    }
    return count;
  }
  getRuns(y, fn) {
    const { width, value, words } = this;
    if (width === 0)
      return;
    let runLen = 0;
    let runValue;
    const rowBase = this.wordIndex(0, y);
    for (let i = 0; i < words; i++) {
      const word = value[rowBase + i];
      const bitEnd = i === words - 1 ? width & 31 || 32 : 32;
      for (let b = 0; b < bitEnd; b++) {
        const bit = (word & 1 << b) !== 0;
        if (bit === runValue) {
          runLen++;
          continue;
        }
        if (runValue !== void 0)
          fn(runLen, runValue);
        runValue = bit;
        runLen = 1;
      }
    }
    if (runValue !== void 0)
      fn(runLen, runValue);
  }
  popcnt() {
    const { height, width, words, fullWords, tailMask } = this;
    if (!height || !width)
      return 0;
    let count = 0;
    for (let y = 0; y < height; y++) {
      const rowBase = y * words;
      for (let wi = 0; wi < fullWords; wi++)
        count += popcnt(this.value[rowBase + wi]);
      if (words !== fullWords)
        count += popcnt(this.value[rowBase + fullWords] & tailMask);
    }
    return count;
  }
  countBoxes2x2(y) {
    const { width, words } = this;
    if (width < 2 || (y | 0) < 0 || y + 1 >= this.height)
      return 0;
    const base0 = this.wordIndex(0, y) | 0;
    const base1 = this.wordIndex(0, y + 1) | 0;
    const tailBits = width & 31;
    const validLast = tailBits === 0 ? 2147483647 : rangeMask(0, width - 1 & 31);
    let boxes = 0;
    for (let wi = 0; wi < words; wi++) {
      const a0 = this.value[base0 + wi];
      const a1 = this.value[base1 + wi];
      const eqV = ~(a0 ^ a1) >>> 0;
      const n0 = wi + 1 < words ? this.value[base0 + wi + 1] >>> 0 : 0;
      const eqH0 = ~(a0 ^ (a0 >>> 1 | (n0 & 1) << 31) >>> 0) >>> 0;
      const n1 = wi + 1 < words ? this.value[base1 + wi + 1] >>> 0 : 0;
      const eqH1 = ~(a1 ^ (a1 >>> 1 | (n1 & 1) << 31) >>> 0) >>> 0;
      let m = (eqV & eqH0 & eqH1) >>> 0;
      if (wi === words - 1)
        m &= validLast;
      boxes += popcnt(m);
    }
    return boxes;
  }
  // Export
  toString() {
    const nl = String.fromCharCode(chCodes.newline);
    let out = "";
    for (let y = 0; y < this.height; y++) {
      let line = "";
      for (let x = 0; x < this.width; x++) {
        const v = this.get(x, y);
        line += !this.isDefined(x, y) ? "?" : v ? "X" : " ";
      }
      out += line + (y + 1 === this.height ? "" : nl);
    }
    return out;
  }
  toRaw() {
    const out = Array.from({ length: this.height }, () => new Array(this.width));
    for (let y = 0; y < this.height; y++) {
      const row = out[y];
      for (let x = 0; x < this.width; x++)
        row[x] = this.get(x, y);
    }
    return out;
  }
  toASCII() {
    const { height, width } = this;
    let out = "";
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x++) {
        const first = this.get(x, y);
        const second = y + 1 >= height ? true : this.get(x, y + 1);
        if (!first && !second)
          out += "\u2588";
        else if (!first && second)
          out += "\u2580";
        else if (first && !second)
          out += "\u2584";
        else if (first && second)
          out += " ";
      }
      out += String.fromCharCode(chCodes.newline);
    }
    return out;
  }
  toTerm() {
    const cc = String.fromCharCode(chCodes.reset);
    const reset = cc + "[0m";
    const whiteBG = cc + "[1;47m  " + reset;
    const darkBG = cc + `[40m  ` + reset;
    const nl = String.fromCharCode(chCodes.newline);
    let out = "";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const v = this.get(x, y);
        out += v ? darkBG : whiteBG;
      }
      out += nl;
    }
    return out;
  }
  toSVG(optimize = true) {
    let out = `<svg viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">`;
    let pathData = "";
    let prevPoint;
    this.rectRead(0, Infinity, (point, val) => {
      if (!val)
        return;
      const { x, y } = point;
      if (!optimize) {
        out += `<rect x="${x}" y="${y}" width="1" height="1" />`;
        return;
      }
      let m = `M${x} ${y}`;
      if (prevPoint) {
        const relM = `m${x - prevPoint.x} ${y - prevPoint.y}`;
        if (relM.length <= m.length)
          m = relM;
      }
      const bH = x < 10 ? `H${x}` : "h-1";
      pathData += `${m}h1v1${bH}Z`;
      prevPoint = point;
    });
    if (optimize)
      out += `<path d="${pathData}"/>`;
    out += `</svg>`;
    return out;
  }
  toGIF() {
    const u16le = (i) => [i & 255, i >>> 8 & 255];
    const dims = [...u16le(this.width), ...u16le(this.height)];
    const data = [];
    this.rectRead(0, Infinity, (_, cur) => data.push(+(cur === true)));
    const N = 126;
    const bytes = [
      71,
      73,
      70,
      56,
      55,
      97,
      ...dims,
      246,
      0,
      0,
      255,
      255,
      255,
      ...fillArr(3 * 127, 0),
      44,
      0,
      0,
      0,
      0,
      ...dims,
      0,
      7
    ];
    const fullChunks = Math.floor(data.length / N);
    for (let i = 0; i < fullChunks; i++)
      bytes.push(N + 1, 128, ...data.slice(N * i, N * (i + 1)).map((i2) => +i2));
    bytes.push(data.length % N + 1, 128, ...data.slice(fullChunks * N).map((i) => +i));
    bytes.push(1, 129, 0, 59);
    return new Uint8Array(bytes);
  }
  toImage(isRGB = false) {
    const { height, width } = this.size();
    const data = new Uint8Array(height * width * (isRGB ? 3 : 4));
    let i = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = this.get(x, y) ? 0 : 255;
        data[i++] = value;
        data[i++] = value;
        data[i++] = value;
        if (!isRGB)
          data[i++] = 255;
      }
    }
    return { height, width, data };
  }
};
var ECMode = ["low", "medium", "quartile", "high"];
var Encoding = ["numeric", "alphanumeric", "byte", "kanji", "eci"];
var BYTES = [
  // 1,  2,  3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,  14,  15,  16,  17,  18,  19,   20,
  26,
  44,
  70,
  100,
  134,
  172,
  196,
  242,
  292,
  346,
  404,
  466,
  532,
  581,
  655,
  733,
  815,
  901,
  991,
  1085,
  //  21,   22,   23,   24,   25,   26,   27,   28,   29,   30,   31,   32,   33,   34,   35,   36,   37,   38,   39,   40
  1156,
  1258,
  1364,
  1474,
  1588,
  1706,
  1828,
  1921,
  2051,
  2185,
  2323,
  2465,
  2611,
  2761,
  2876,
  3034,
  3196,
  3362,
  3532,
  3706
];
var WORDS_PER_BLOCK = {
  // Version 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
  low: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  medium: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  quartile: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  high: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
};
var ECC_BLOCKS = {
  // Version   1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
  low: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  medium: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  quartile: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  high: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
};
var info = {
  size: {
    encode: (ver) => 21 + 4 * (ver - 1),
    // ver1 = 21, ver40=177 blocks
    decode: (size) => (size - 17) / 4
  },
  sizeType: (ver) => Math.floor((ver + 7) / 17),
  // Based on https://codereview.stackexchange.com/questions/74925/algorithm-to-generate-this-alignment-pattern-locations-table-for-qr-codes
  alignmentPatterns(ver) {
    if (ver === 1)
      return [];
    const first = 6;
    const last = info.size.encode(ver) - first - 1;
    const distance = last - first;
    const count = Math.ceil(distance / 28);
    let interval = Math.floor(distance / count);
    if (interval % 2)
      interval += 1;
    else if (distance % count * 2 >= count)
      interval += 2;
    const res = [first];
    for (let m = 1; m < count; m++)
      res.push(last - (count - m) * interval);
    res.push(last);
    return res;
  },
  ECCode: {
    low: 1,
    medium: 0,
    quartile: 3,
    high: 2
  },
  formatMask: 21522,
  formatBits(ecc, maskIdx) {
    const data = info.ECCode[ecc] << 3 | maskIdx;
    let d = data;
    for (let i = 0; i < 10; i++)
      d = d << 1 ^ (d >> 9) * 1335;
    return (data << 10 | d) ^ info.formatMask;
  },
  versionBits(ver) {
    let d = ver;
    for (let i = 0; i < 12; i++)
      d = d << 1 ^ (d >> 11) * 7973;
    return ver << 12 | d;
  },
  alphabet: {
    numeric: alphabet("0123456789"),
    alphanumerc: alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:")
  },
  // as Record<EncodingType, ReturnType<typeof alphabet>>,
  lengthBits(ver, type) {
    const table = {
      numeric: [10, 12, 14],
      alphanumeric: [9, 11, 13],
      byte: [8, 16, 16],
      kanji: [8, 10, 12],
      eci: [0, 0, 0]
    };
    return table[type][info.sizeType(ver)];
  },
  modeBits: {
    numeric: "0001",
    alphanumeric: "0010",
    byte: "0100",
    kanji: "1000",
    eci: "0111"
  },
  capacity(ver, ecc) {
    const bytes = BYTES[ver - 1];
    const words = WORDS_PER_BLOCK[ecc][ver - 1];
    const numBlocks = ECC_BLOCKS[ecc][ver - 1];
    const blockLen = Math.floor(bytes / numBlocks) - words;
    const shortBlocks = numBlocks - bytes % numBlocks;
    return {
      words,
      numBlocks,
      shortBlocks,
      blockLen,
      capacity: (bytes - words * numBlocks) * 8,
      total: (words + blockLen) * numBlocks + numBlocks - shortBlocks
    };
  }
};
var PATTERNS = [
  (x, y) => (x + y) % 2 == 0,
  (_x, y) => y % 2 == 0,
  (x, _y) => x % 3 == 0,
  (x, y) => (x + y) % 3 == 0,
  (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 == 0,
  (x, y) => x * y % 2 + x * y % 3 == 0,
  (x, y) => (x * y % 2 + x * y % 3) % 2 == 0,
  (x, y) => ((x + y) % 2 + x * y % 3) % 2 == 0
];
var GF = {
  tables: ((p_poly) => {
    const exp = fillArr(256, 0);
    const log = fillArr(256, 0);
    for (let i = 0, x = 1; i < 256; i++) {
      exp[i] = x;
      log[x] = i;
      x <<= 1;
      if (x & 256)
        x ^= p_poly;
    }
    return { exp, log };
  })(285),
  exp: (x) => GF.tables.exp[x],
  log(x) {
    if (x === 0)
      throw new Error(`GF.log: invalid arg=${x}`);
    return GF.tables.log[x] % 255;
  },
  mul(x, y) {
    if (x === 0 || y === 0)
      return 0;
    return GF.tables.exp[(GF.tables.log[x] + GF.tables.log[y]) % 255];
  },
  add: (x, y) => x ^ y,
  pow: (x, e2) => GF.tables.exp[GF.tables.log[x] * e2 % 255],
  inv(x) {
    if (x === 0)
      throw new Error(`GF.inverse: invalid arg=${x}`);
    return GF.tables.exp[255 - GF.tables.log[x]];
  },
  polynomial(poly) {
    if (poly.length == 0)
      throw new Error("GF.polymomial: invalid length");
    if (poly[0] !== 0)
      return poly;
    let i = 0;
    for (; i < poly.length - 1 && poly[i] == 0; i++)
      ;
    return poly.slice(i);
  },
  monomial(degree, coefficient) {
    if (degree < 0)
      throw new Error(`GF.monomial: invalid degree=${degree}`);
    if (coefficient == 0)
      return [0];
    let coefficients = fillArr(degree + 1, 0);
    coefficients[0] = coefficient;
    return GF.polynomial(coefficients);
  },
  degree: (a) => a.length - 1,
  coefficient: (a, degree) => a[GF.degree(a) - degree],
  mulPoly(a, b) {
    if (a[0] === 0 || b[0] === 0)
      return [0];
    const res = fillArr(a.length + b.length - 1, 0);
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        res[i + j] = GF.add(res[i + j], GF.mul(a[i], b[j]));
      }
    }
    return GF.polynomial(res);
  },
  mulPolyScalar(a, scalar) {
    if (scalar == 0)
      return [0];
    if (scalar == 1)
      return a;
    const res = fillArr(a.length, 0);
    for (let i = 0; i < a.length; i++)
      res[i] = GF.mul(a[i], scalar);
    return GF.polynomial(res);
  },
  mulPolyMonomial(a, degree, coefficient) {
    if (degree < 0)
      throw new Error("GF.mulPolyMonomial: invalid degree");
    if (coefficient == 0)
      return [0];
    const res = fillArr(a.length + degree, 0);
    for (let i = 0; i < a.length; i++)
      res[i] = GF.mul(a[i], coefficient);
    return GF.polynomial(res);
  },
  addPoly(a, b) {
    if (a[0] === 0)
      return b;
    if (b[0] === 0)
      return a;
    let smaller = a;
    let larger = b;
    if (smaller.length > larger.length)
      [smaller, larger] = [larger, smaller];
    let sumDiff = fillArr(larger.length, 0);
    let lengthDiff = larger.length - smaller.length;
    let s = larger.slice(0, lengthDiff);
    for (let i = 0; i < s.length; i++)
      sumDiff[i] = s[i];
    for (let i = lengthDiff; i < larger.length; i++)
      sumDiff[i] = GF.add(smaller[i - lengthDiff], larger[i]);
    return GF.polynomial(sumDiff);
  },
  remainderPoly(data, divisor) {
    const out = Array.from(data);
    for (let i = 0; i < data.length - divisor.length + 1; i++) {
      const elm = out[i];
      if (elm === 0)
        continue;
      for (let j = 1; j < divisor.length; j++) {
        if (divisor[j] !== 0)
          out[i + j] = GF.add(out[i + j], GF.mul(divisor[j], elm));
      }
    }
    return out.slice(data.length - divisor.length + 1, out.length);
  },
  divisorPoly(degree) {
    let g = [1];
    for (let i = 0; i < degree; i++)
      g = GF.mulPoly(g, [1, GF.pow(2, i)]);
    return g;
  },
  evalPoly(poly, a) {
    if (a == 0)
      return GF.coefficient(poly, 0);
    let res = poly[0];
    for (let i = 1; i < poly.length; i++)
      res = GF.add(GF.mul(a, res), poly[i]);
    return res;
  },
  // TODO: cleanup
  euclidian(a, b, R) {
    if (GF.degree(a) < GF.degree(b))
      [a, b] = [b, a];
    let rLast = a;
    let r = b;
    let tLast = [0];
    let t = [1];
    while (2 * GF.degree(r) >= R) {
      let rLastLast = rLast;
      let tLastLast = tLast;
      rLast = r;
      tLast = t;
      if (rLast[0] === 0)
        throw new Error("rLast[0] === 0");
      r = rLastLast;
      let q = [0];
      const dltInverse = GF.inv(rLast[0]);
      while (GF.degree(r) >= GF.degree(rLast) && r[0] !== 0) {
        const degreeDiff = GF.degree(r) - GF.degree(rLast);
        const scale = GF.mul(r[0], dltInverse);
        q = GF.addPoly(q, GF.monomial(degreeDiff, scale));
        r = GF.addPoly(r, GF.mulPolyMonomial(rLast, degreeDiff, scale));
      }
      q = GF.mulPoly(q, tLast);
      t = GF.addPoly(q, tLastLast);
      if (GF.degree(r) >= GF.degree(rLast))
        throw new Error(`Division failed r: ${r}, rLast: ${rLast}`);
    }
    const sigmaTildeAtZero = GF.coefficient(t, 0);
    if (sigmaTildeAtZero == 0)
      throw new Error("sigmaTilde(0) was zero");
    const inverse = GF.inv(sigmaTildeAtZero);
    return [GF.mulPolyScalar(t, inverse), GF.mulPolyScalar(r, inverse)];
  }
};
function RS(eccWords) {
  return {
    encode(from) {
      const d = GF.divisorPoly(eccWords);
      const pol = Array.from(from);
      pol.push(...d.slice(0, -1).fill(0));
      return Uint8Array.from(GF.remainderPoly(pol, d));
    },
    decode(to) {
      const res = to.slice();
      const poly = GF.polynomial(Array.from(to));
      let syndrome = fillArr(eccWords, 0);
      let hasError = false;
      for (let i = 0; i < eccWords; i++) {
        const evl = GF.evalPoly(poly, GF.exp(i));
        syndrome[syndrome.length - 1 - i] = evl;
        if (evl !== 0)
          hasError = true;
      }
      if (!hasError)
        return res;
      syndrome = GF.polynomial(syndrome);
      const monomial = GF.monomial(eccWords, 1);
      const [errorLocator, errorEvaluator] = GF.euclidian(monomial, syndrome, eccWords);
      const locations = fillArr(GF.degree(errorLocator), 0);
      let e2 = 0;
      for (let i = 1; i < 256 && e2 < locations.length; i++) {
        if (GF.evalPoly(errorLocator, i) === 0)
          locations[e2++] = GF.inv(i);
      }
      if (e2 !== locations.length)
        throw new Error("RS.decode: invalid errors number");
      for (let i = 0; i < locations.length; i++) {
        const pos = res.length - 1 - GF.log(locations[i]);
        if (pos < 0)
          throw new Error("RS.decode: invalid error location");
        const xiInverse = GF.inv(locations[i]);
        let denominator = 1;
        for (let j = 0; j < locations.length; j++) {
          if (i === j)
            continue;
          denominator = GF.mul(denominator, GF.add(1, GF.mul(locations[j], xiInverse)));
        }
        res[pos] = GF.add(res[pos], GF.mul(GF.evalPoly(errorEvaluator, xiInverse), GF.inv(denominator)));
      }
      return res;
    }
  };
}
function interleave(ver, ecc) {
  const { words, shortBlocks, numBlocks, blockLen, total } = info.capacity(ver, ecc);
  const rs = RS(words);
  return {
    encode(bytes) {
      const blocks = [];
      const eccBlocks = [];
      for (let i = 0; i < numBlocks; i++) {
        const isShort = i < shortBlocks;
        const len = blockLen + (isShort ? 0 : 1);
        blocks.push(bytes.subarray(0, len));
        eccBlocks.push(rs.encode(bytes.subarray(0, len)));
        bytes = bytes.subarray(len);
      }
      const resBlocks = interleaveBytes(blocks);
      const resECC = interleaveBytes(eccBlocks);
      const res = new Uint8Array(resBlocks.length + resECC.length);
      res.set(resBlocks);
      res.set(resECC, resBlocks.length);
      return res;
    },
    decode(data) {
      if (data.length !== total)
        throw new Error(`interleave.decode: len(data)=${data.length}, total=${total}`);
      const blocks = [];
      for (let i = 0; i < numBlocks; i++) {
        const isShort = i < shortBlocks;
        blocks.push(new Uint8Array(words + blockLen + (isShort ? 0 : 1)));
      }
      let pos = 0;
      for (let i = 0; i < blockLen; i++) {
        for (let j = 0; j < numBlocks; j++)
          blocks[j][i] = data[pos++];
      }
      for (let j = shortBlocks; j < numBlocks; j++)
        blocks[j][blockLen] = data[pos++];
      for (let i = blockLen; i < blockLen + words; i++) {
        for (let j = 0; j < numBlocks; j++) {
          const isShort = j < shortBlocks;
          blocks[j][i + (isShort ? 0 : 1)] = data[pos++];
        }
      }
      const res = [];
      for (const block of blocks)
        res.push(...Array.from(rs.decode(block)).slice(0, -words));
      return Uint8Array.from(res);
    }
  };
}
function drawTemplate(ver, ecc, maskIdx, test = false) {
  const size = info.size.encode(ver);
  let b = new Bitmap(size + 2);
  const finder = new Bitmap(3).rect(0, 3, true).border(1, false).border(1, true).border(1, false);
  b = b.embed(0, finder).embed({ x: -finder.width, y: 0 }, finder).embed({ x: 0, y: -finder.height }, finder);
  b = b.rectSlice(1, size);
  const align = new Bitmap(1).rect(0, 1, true).border(1, false).border(1, true);
  const alignPos = info.alignmentPatterns(ver);
  for (const y of alignPos) {
    for (const x of alignPos) {
      if (b.isDefined(x, y))
        continue;
      b.embed({ x: x - 2, y: y - 2 }, align);
    }
  }
  b = b.hLine({ x: 0, y: 6 }, Infinity, ({ x }) => b.isDefined(x, 6) ? void 0 : x % 2 == 0).vLine({ x: 6, y: 0 }, Infinity, ({ y }) => b.isDefined(6, y) ? void 0 : y % 2 == 0);
  {
    const bits = info.formatBits(ecc, maskIdx);
    const getBit = (i) => !test && (bits >> i & 1) == 1;
    for (let i = 0; i < 6; i++)
      b.set(8, i, getBit(i));
    for (let i = 6; i < 8; i++)
      b.set(8, i + 1, getBit(i));
    for (let i = 8; i < 15; i++)
      b.set(8, size - 15 + i, getBit(i));
    for (let i = 0; i < 8; i++)
      b.set(size - i - 1, 8, getBit(i));
    for (let i = 8; i < 9; i++)
      b.set(15 - i - 1 + 1, 8, getBit(i));
    for (let i = 9; i < 15; i++)
      b.set(15 - i - 1, 8, getBit(i));
    b.set(8, size - 8, !test);
  }
  if (ver >= 7) {
    const bits = info.versionBits(ver);
    for (let i = 0; i < 18; i += 1) {
      const bit = !test && (bits >> i & 1) == 1;
      const x = Math.floor(i / 3);
      const y = i % 3 + size - 8 - 3;
      b.set(y, x, bit);
      b.set(x, y, bit);
    }
  }
  return b;
}
function zigzag(tpl, maskIdx, fn) {
  const size = tpl.height;
  const pattern = PATTERNS[maskIdx];
  let dir = -1;
  let y = size - 1;
  for (let xOffset = size - 1; xOffset > 0; xOffset -= 2) {
    if (xOffset == 6)
      xOffset = 5;
    for (; ; y += dir) {
      for (let j = 0; j < 2; j += 1) {
        const x = xOffset - j;
        if (tpl.isDefined(x, y))
          continue;
        fn(x, y, pattern(x, y));
      }
      if (y + dir < 0 || y + dir >= size)
        break;
    }
    dir = -dir;
  }
}
function detectType(str) {
  let type = "numeric";
  for (let x of str) {
    if (info.alphabet.numeric.has(x))
      continue;
    type = "alphanumeric";
    if (!info.alphabet.alphanumerc.has(x))
      return "byte";
  }
  return type;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function encode(ver, ecc, data, type, encoder = utf8ToBytes) {
  let encoded = "";
  let dataLen = data.length;
  if (type === "numeric") {
    const t = info.alphabet.numeric.decode(data.split(""));
    const n = t.length;
    for (let i = 0; i < n - 2; i += 3)
      encoded += bin(t[i] * 100 + t[i + 1] * 10 + t[i + 2], 10);
    if (n % 3 === 1) {
      encoded += bin(t[n - 1], 4);
    } else if (n % 3 === 2) {
      encoded += bin(t[n - 2] * 10 + t[n - 1], 7);
    }
  } else if (type === "alphanumeric") {
    const t = info.alphabet.alphanumerc.decode(data.split(""));
    const n = t.length;
    for (let i = 0; i < n - 1; i += 2)
      encoded += bin(t[i] * 45 + t[i + 1], 11);
    if (n % 2 == 1)
      encoded += bin(t[n - 1], 6);
  } else if (type === "byte") {
    const utf8 = encoder(data);
    dataLen = utf8.length;
    encoded = Array.from(utf8).map((i) => bin(i, 8)).join("");
  } else {
    throw new Error("encode: unsupported type");
  }
  const { capacity } = info.capacity(ver, ecc);
  const len = bin(dataLen, info.lengthBits(ver, type));
  let bits = info.modeBits[type] + len + encoded;
  if (bits.length > capacity)
    throw new Error("Capacity overflow");
  bits += "0".repeat(Math.min(4, Math.max(0, capacity - bits.length)));
  if (bits.length % 8)
    bits += "0".repeat(8 - bits.length % 8);
  const padding = "1110110000010001";
  for (let idx = 0; bits.length !== capacity; idx++)
    bits += padding[idx % padding.length];
  const bytes = Uint8Array.from(bits.match(/(.{8})/g).map((i) => Number(`0b${i}`)));
  return interleave(ver, ecc).encode(bytes);
}
function drawQR(ver, ecc, data, maskIdx, test = false) {
  const b = drawTemplate(ver, ecc, maskIdx, test);
  let i = 0;
  const need = 8 * data.length;
  zigzag(b, maskIdx, (x, y, mask) => {
    let value = false;
    if (i < need) {
      value = (data[i >>> 3] >> (7 - i & 7) & 1) !== 0;
      i++;
    }
    b.set(x, y, value !== mask);
  });
  if (i !== need)
    throw new Error("QR: bytes left after draw");
  return b;
}
var mkPattern = (pattern) => {
  const s = pattern.map((i) => i ? "1" : "0").join("");
  return { len: s.length, n: Number(`0b${s}`) };
};
var finderPattern = [true, false, true, true, true, false, true];
var lightPattern = [false, false, false, false];
var P1 = mkPattern([...finderPattern, ...lightPattern]);
var P2 = mkPattern([...lightPattern, ...finderPattern]);
function penalty(bm) {
  const { width, height } = bm;
  const transposed = bm.transpose();
  let adjacent = 0;
  for (let y = 0; y < height; y++) {
    bm.getRuns(y, (len) => {
      if (len >= 5)
        adjacent += 3 + (len - 5);
    });
  }
  for (let y = 0; y < width; y++) {
    transposed.getRuns(y, (len) => {
      if (len >= 5)
        adjacent += 3 + (len - 5);
    });
  }
  let box = 0;
  for (let y = 0; y < height - 1; y++)
    box += 3 * bm.countBoxes2x2(y);
  let finder = 0;
  for (let y = 0; y < height; y++)
    finder += 40 * bm.countPatternInRow(y, P1.len, P1.n, P2.n);
  for (let y = 0; y < width; y++)
    finder += 40 * transposed.countPatternInRow(y, P1.len, P1.n, P2.n);
  let darkPixels = 0;
  darkPixels = bm.popcnt();
  const darkPercent = darkPixels / (height * width) * 100;
  const dark = 10 * Math.floor(Math.abs(darkPercent - 50) / 5);
  return adjacent + box + finder + dark;
}
function drawQRBest(ver, ecc, data, maskIdx) {
  if (maskIdx === void 0) {
    const bestMask = best();
    for (let mask = 0; mask < PATTERNS.length; mask++)
      bestMask.add(penalty(drawQR(ver, ecc, data, mask, true)), mask);
    maskIdx = bestMask.get();
  }
  if (maskIdx === void 0)
    throw new Error("Cannot find mask");
  return drawQR(ver, ecc, data, maskIdx);
}
function validateECC(ec) {
  if (!ECMode.includes(ec))
    throw new Error(`Invalid error correction mode=${ec}. Expected: ${ECMode}`);
}
function validateEncoding(enc) {
  if (!Encoding.includes(enc))
    throw new Error(`Encoding: invalid mode=${enc}. Expected: ${Encoding}`);
  if (enc === "kanji" || enc === "eci")
    throw new Error(`Encoding: ${enc} is not supported (yet?).`);
}
function validateMask(mask) {
  if (![0, 1, 2, 3, 4, 5, 6, 7].includes(mask) || !PATTERNS[mask])
    throw new Error(`Invalid mask=${mask}. Expected number [0..7]`);
}
function encodeQR(text, output = "raw", opts = {}) {
  const ecc = opts.ecc !== void 0 ? opts.ecc : "medium";
  validateECC(ecc);
  const encoding = opts.encoding !== void 0 ? opts.encoding : detectType(text);
  validateEncoding(encoding);
  if (opts.mask !== void 0)
    validateMask(opts.mask);
  let ver = opts.version;
  let data, err = new Error("Unknown error");
  if (ver !== void 0) {
    validateVersion(ver);
    data = encode(ver, ecc, text, encoding, opts.textEncoder);
  } else {
    for (let i = 1; i <= 40; i++) {
      try {
        data = encode(i, ecc, text, encoding, opts.textEncoder);
        ver = i;
        break;
      } catch (e2) {
        err = e2;
      }
    }
  }
  if (!ver || !data)
    throw err;
  let res = drawQRBest(ver, ecc, data, opts.mask);
  res.assertDrawn();
  const border = opts.border === void 0 ? 2 : opts.border;
  if (!Number.isSafeInteger(border))
    throw new Error(`invalid border type=${typeof border}`);
  res = res.border(border, false);
  if (opts.scale !== void 0)
    res = res.scale(opts.scale);
  if (output === "raw")
    return res.toRaw();
  else if (output === "ascii")
    return res.toASCII();
  else if (output === "svg")
    return res.toSVG(opts.optimize);
  else if (output === "gif")
    return res.toGIF();
  else if (output === "term")
    return res.toTerm();
  else
    throw new Error(`Unknown output: ${output}`);
}
var qr_default = encodeQR;

// node_modules/qr-scanner/qr-scanner.min.js
var e = class _e {
  constructor(a, b, c, d, f) {
    this._legacyCanvasSize = _e.DEFAULT_CANVAS_SIZE;
    this._preferredCamera = "environment";
    this._maxScansPerSecond = 25;
    this._lastScanTimestamp = -1;
    this._destroyed = this._flashOn = this._paused = this._active = false;
    this.$video = a;
    this.$canvas = document.createElement("canvas");
    c && "object" === typeof c ? this._onDecode = b : (c || d || f ? console.warn("You're using a deprecated version of the QrScanner constructor which will be removed in the future") : console.warn("Note that the type of the scan result passed to onDecode will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true."), this._legacyOnDecode = b);
    b = "object" === typeof c ? c : {};
    this._onDecodeError = b.onDecodeError || ("function" === typeof c ? c : this._onDecodeError);
    this._calculateScanRegion = b.calculateScanRegion || ("function" === typeof d ? d : this._calculateScanRegion);
    this._preferredCamera = b.preferredCamera || f || this._preferredCamera;
    this._legacyCanvasSize = "number" === typeof c ? c : "number" === typeof d ? d : this._legacyCanvasSize;
    this._maxScansPerSecond = b.maxScansPerSecond || this._maxScansPerSecond;
    this._onPlay = this._onPlay.bind(this);
    this._onLoadedMetaData = this._onLoadedMetaData.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._updateOverlay = this._updateOverlay.bind(this);
    a.disablePictureInPicture = true;
    a.playsInline = true;
    a.muted = true;
    let h = false;
    a.hidden && (a.hidden = false, h = true);
    document.body.contains(a) || (document.body.appendChild(a), h = true);
    c = a.parentElement;
    if (b.highlightScanRegion || b.highlightCodeOutline) {
      d = !!b.overlay;
      this.$overlay = b.overlay || document.createElement("div");
      f = this.$overlay.style;
      f.position = "absolute";
      f.display = "none";
      f.pointerEvents = "none";
      this.$overlay.classList.add("scan-region-highlight");
      if (!d && b.highlightScanRegion) {
        this.$overlay.innerHTML = '<svg class="scan-region-highlight-svg" viewBox="0 0 238 238" preserveAspectRatio="none" style="position:absolute;width:100%;height:100%;left:0;top:0;fill:none;stroke:#e9b213;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"><path d="M31 2H10a8 8 0 0 0-8 8v21M207 2h21a8 8 0 0 1 8 8v21m0 176v21a8 8 0 0 1-8 8h-21m-176 0H10a8 8 0 0 1-8-8v-21"/></svg>';
        try {
          this.$overlay.firstElementChild.animate({ transform: [
            "scale(.98)",
            "scale(1.01)"
          ] }, { duration: 400, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
        } catch (m) {
        }
        c.insertBefore(this.$overlay, this.$video.nextSibling);
      }
      b.highlightCodeOutline && (this.$overlay.insertAdjacentHTML("beforeend", '<svg class="code-outline-highlight" preserveAspectRatio="none" style="display:none;width:100%;height:100%;fill:none;stroke:#e9b213;stroke-width:5;stroke-dasharray:25;stroke-linecap:round;stroke-linejoin:round"><polygon/></svg>'), this.$codeOutlineHighlight = this.$overlay.lastElementChild);
    }
    this._scanRegion = this._calculateScanRegion(a);
    requestAnimationFrame(() => {
      let m = window.getComputedStyle(a);
      "none" === m.display && (a.style.setProperty("display", "block", "important"), h = true);
      "visible" !== m.visibility && (a.style.setProperty("visibility", "visible", "important"), h = true);
      h && (console.warn("QrScanner has overwritten the video hiding style to avoid Safari stopping the playback."), a.style.opacity = "0", a.style.width = "0", a.style.height = "0", this.$overlay && this.$overlay.parentElement && this.$overlay.parentElement.removeChild(this.$overlay), delete this.$overlay, delete this.$codeOutlineHighlight);
      this.$overlay && this._updateOverlay();
    });
    a.addEventListener("play", this._onPlay);
    a.addEventListener("loadedmetadata", this._onLoadedMetaData);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    window.addEventListener("resize", this._updateOverlay);
    this._qrEnginePromise = _e.createQrEngine();
  }
  static set WORKER_PATH(a) {
    console.warn("Setting QrScanner.WORKER_PATH is not required and not supported anymore. Have a look at the README for new setup instructions.");
  }
  static async hasCamera() {
    try {
      return !!(await _e.listCameras(false)).length;
    } catch (a) {
      return false;
    }
  }
  static async listCameras(a = false) {
    if (!navigator.mediaDevices) return [];
    let b = async () => (await navigator.mediaDevices.enumerateDevices()).filter((d) => "videoinput" === d.kind), c;
    try {
      a && (await b()).every((d) => !d.label) && (c = await navigator.mediaDevices.getUserMedia({ audio: false, video: true }));
    } catch (d) {
    }
    try {
      return (await b()).map((d, f) => ({ id: d.deviceId, label: d.label || (0 === f ? "Default Camera" : `Camera ${f + 1}`) }));
    } finally {
      c && (console.warn("Call listCameras after successfully starting a QR scanner to avoid creating a temporary video stream"), _e._stopVideoStream(c));
    }
  }
  async hasFlash() {
    let a;
    try {
      if (this.$video.srcObject) {
        if (!(this.$video.srcObject instanceof MediaStream)) return false;
        a = this.$video.srcObject;
      } else a = (await this._getCameraStream()).stream;
      return "torch" in a.getVideoTracks()[0].getSettings();
    } catch (b) {
      return false;
    } finally {
      a && a !== this.$video.srcObject && (console.warn("Call hasFlash after successfully starting the scanner to avoid creating a temporary video stream"), _e._stopVideoStream(a));
    }
  }
  isFlashOn() {
    return this._flashOn;
  }
  async toggleFlash() {
    this._flashOn ? await this.turnFlashOff() : await this.turnFlashOn();
  }
  async turnFlashOn() {
    if (!this._flashOn && !this._destroyed && (this._flashOn = true, this._active && !this._paused)) try {
      if (!await this.hasFlash()) throw "No flash available";
      await this.$video.srcObject.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: true }] });
    } catch (a) {
      throw this._flashOn = false, a;
    }
  }
  async turnFlashOff() {
    this._flashOn && (this._flashOn = false, await this._restartVideoStream());
  }
  destroy() {
    this.$video.removeEventListener("loadedmetadata", this._onLoadedMetaData);
    this.$video.removeEventListener("play", this._onPlay);
    document.removeEventListener(
      "visibilitychange",
      this._onVisibilityChange
    );
    window.removeEventListener("resize", this._updateOverlay);
    this._destroyed = true;
    this._flashOn = false;
    this.stop();
    _e._postWorkerMessage(this._qrEnginePromise, "close");
  }
  async start() {
    if (this._destroyed) throw Error("The QR scanner can not be started as it had been destroyed.");
    if (!this._active || this._paused) {
      if ("https:" !== window.location.protocol && console.warn("The camera stream is only accessible if the page is transferred via https."), this._active = true, !document.hidden) if (this._paused = false, this.$video.srcObject) await this.$video.play();
      else try {
        let { stream: a, facingMode: b } = await this._getCameraStream();
        !this._active || this._paused ? _e._stopVideoStream(a) : (this._setVideoMirror(b), this.$video.srcObject = a, await this.$video.play(), this._flashOn && (this._flashOn = false, this.turnFlashOn().catch(() => {
        })));
      } catch (a) {
        if (!this._paused) throw this._active = false, a;
      }
    }
  }
  stop() {
    this.pause();
    this._active = false;
  }
  async pause(a = false) {
    this._paused = true;
    if (!this._active) return true;
    this.$video.pause();
    this.$overlay && (this.$overlay.style.display = "none");
    let b = () => {
      this.$video.srcObject instanceof MediaStream && (_e._stopVideoStream(this.$video.srcObject), this.$video.srcObject = null);
    };
    if (a) return b(), true;
    await new Promise((c) => setTimeout(c, 300));
    if (!this._paused) return false;
    b();
    return true;
  }
  async setCamera(a) {
    a !== this._preferredCamera && (this._preferredCamera = a, await this._restartVideoStream());
  }
  static async scanImage(a, b, c, d, f = false, h = false) {
    let m, n = false;
    b && ("scanRegion" in b || "qrEngine" in b || "canvas" in b || "disallowCanvasResizing" in b || "alsoTryWithoutScanRegion" in b || "returnDetailedScanResult" in b) ? (m = b.scanRegion, c = b.qrEngine, d = b.canvas, f = b.disallowCanvasResizing || false, h = b.alsoTryWithoutScanRegion || false, n = true) : b || c || d || f || h ? console.warn("You're using a deprecated api for scanImage which will be removed in the future.") : console.warn("Note that the return type of scanImage will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true.");
    b = !!c;
    try {
      let p, k;
      [c, p] = await Promise.all([c || _e.createQrEngine(), _e._loadImage(a)]);
      [d, k] = _e._drawToCanvas(p, m, d, f);
      let q;
      if (c instanceof Worker) {
        let g = c;
        b || _e._postWorkerMessageSync(g, "inversionMode", "both");
        q = await new Promise((l, v) => {
          let w, u, r, y = -1;
          u = (t) => {
            t.data.id === y && (g.removeEventListener("message", u), g.removeEventListener("error", r), clearTimeout(w), null !== t.data.data ? l({ data: t.data.data, cornerPoints: _e._convertPoints(t.data.cornerPoints, m) }) : v(_e.NO_QR_CODE_FOUND));
          };
          r = (t) => {
            g.removeEventListener("message", u);
            g.removeEventListener("error", r);
            clearTimeout(w);
            v("Scanner error: " + (t ? t.message || t : "Unknown Error"));
          };
          g.addEventListener("message", u);
          g.addEventListener("error", r);
          w = setTimeout(() => r("timeout"), 1e4);
          let x = k.getImageData(0, 0, d.width, d.height);
          y = _e._postWorkerMessageSync(g, "decode", x, [x.data.buffer]);
        });
      } else q = await Promise.race([new Promise((g, l) => window.setTimeout(() => l("Scanner error: timeout"), 1e4)), (async () => {
        try {
          var [g] = await c.detect(d);
          if (!g) throw _e.NO_QR_CODE_FOUND;
          return { data: g.rawValue, cornerPoints: _e._convertPoints(g.cornerPoints, m) };
        } catch (l) {
          g = l.message || l;
          if (/not implemented|service unavailable/.test(g)) return _e._disableBarcodeDetector = true, _e.scanImage(a, { scanRegion: m, canvas: d, disallowCanvasResizing: f, alsoTryWithoutScanRegion: h });
          throw `Scanner error: ${g}`;
        }
      })()]);
      return n ? q : q.data;
    } catch (p) {
      if (!m || !h) throw p;
      let k = await _e.scanImage(a, { qrEngine: c, canvas: d, disallowCanvasResizing: f });
      return n ? k : k.data;
    } finally {
      b || _e._postWorkerMessage(c, "close");
    }
  }
  setGrayscaleWeights(a, b, c, d = true) {
    _e._postWorkerMessage(this._qrEnginePromise, "grayscaleWeights", {
      red: a,
      green: b,
      blue: c,
      useIntegerApproximation: d
    });
  }
  setInversionMode(a) {
    _e._postWorkerMessage(this._qrEnginePromise, "inversionMode", a);
  }
  static async createQrEngine(a) {
    a && console.warn("Specifying a worker path is not required and not supported anymore.");
    a = () => Promise.resolve().then(() => (init_qr_scanner_worker_min(), qr_scanner_worker_min_exports)).then((c) => c.createWorker());
    if (!(!_e._disableBarcodeDetector && "BarcodeDetector" in window && BarcodeDetector.getSupportedFormats && (await BarcodeDetector.getSupportedFormats()).includes("qr_code"))) return a();
    let b = navigator.userAgentData;
    return b && b.brands.some(({ brand: c }) => /Chromium/i.test(c)) && /mac ?OS/i.test(b.platform) && await b.getHighEntropyValues(["architecture", "platformVersion"]).then(({ architecture: c, platformVersion: d }) => /arm/i.test(c || "arm") && 13 <= parseInt(d || "13")).catch(() => true) ? a() : new BarcodeDetector({ formats: ["qr_code"] });
  }
  _onPlay() {
    this._scanRegion = this._calculateScanRegion(this.$video);
    this._updateOverlay();
    this.$overlay && (this.$overlay.style.display = "");
    this._scanFrame();
  }
  _onLoadedMetaData() {
    this._scanRegion = this._calculateScanRegion(this.$video);
    this._updateOverlay();
  }
  _onVisibilityChange() {
    document.hidden ? this.pause() : this._active && this.start();
  }
  _calculateScanRegion(a) {
    let b = Math.round(2 / 3 * Math.min(a.videoWidth, a.videoHeight));
    return { x: Math.round((a.videoWidth - b) / 2), y: Math.round((a.videoHeight - b) / 2), width: b, height: b, downScaledWidth: this._legacyCanvasSize, downScaledHeight: this._legacyCanvasSize };
  }
  _updateOverlay() {
    requestAnimationFrame(() => {
      if (this.$overlay) {
        var a = this.$video, b = a.videoWidth, c = a.videoHeight, d = a.offsetWidth, f = a.offsetHeight, h = a.offsetLeft, m = a.offsetTop, n = window.getComputedStyle(a), p = n.objectFit, k = b / c, q = d / f;
        switch (p) {
          case "none":
            var g = b;
            var l = c;
            break;
          case "fill":
            g = d;
            l = f;
            break;
          default:
            ("cover" === p ? k > q : k < q) ? (l = f, g = l * k) : (g = d, l = g / k), "scale-down" === p && (g = Math.min(g, b), l = Math.min(l, c));
        }
        var [v, w] = n.objectPosition.split(" ").map((r, y) => {
          const x = parseFloat(r);
          return r.endsWith("%") ? (y ? f - l : d - g) * x / 100 : x;
        });
        n = this._scanRegion.width || b;
        q = this._scanRegion.height || c;
        p = this._scanRegion.x || 0;
        var u = this._scanRegion.y || 0;
        k = this.$overlay.style;
        k.width = `${n / b * g}px`;
        k.height = `${q / c * l}px`;
        k.top = `${m + w + u / c * l}px`;
        c = /scaleX\(-1\)/.test(a.style.transform);
        k.left = `${h + (c ? d - v - g : v) + (c ? b - p - n : p) / b * g}px`;
        k.transform = a.style.transform;
      }
    });
  }
  static _convertPoints(a, b) {
    if (!b) return a;
    let c = b.x || 0, d = b.y || 0, f = b.width && b.downScaledWidth ? b.width / b.downScaledWidth : 1;
    b = b.height && b.downScaledHeight ? b.height / b.downScaledHeight : 1;
    for (let h of a) h.x = h.x * f + c, h.y = h.y * b + d;
    return a;
  }
  _scanFrame() {
    !this._active || this.$video.paused || this.$video.ended || ("requestVideoFrameCallback" in this.$video ? this.$video.requestVideoFrameCallback.bind(this.$video) : requestAnimationFrame)(async () => {
      if (!(1 >= this.$video.readyState)) {
        var a = Date.now() - this._lastScanTimestamp, b = 1e3 / this._maxScansPerSecond;
        a < b && await new Promise((d) => setTimeout(d, b - a));
        this._lastScanTimestamp = Date.now();
        try {
          var c = await _e.scanImage(this.$video, { scanRegion: this._scanRegion, qrEngine: this._qrEnginePromise, canvas: this.$canvas });
        } catch (d) {
          if (!this._active) return;
          this._onDecodeError(d);
        }
        !_e._disableBarcodeDetector || await this._qrEnginePromise instanceof Worker || (this._qrEnginePromise = _e.createQrEngine());
        c ? (this._onDecode ? this._onDecode(c) : this._legacyOnDecode && this._legacyOnDecode(c.data), this.$codeOutlineHighlight && (clearTimeout(this._codeOutlineHighlightRemovalTimeout), this._codeOutlineHighlightRemovalTimeout = void 0, this.$codeOutlineHighlight.setAttribute("viewBox", `${this._scanRegion.x || 0} ${this._scanRegion.y || 0} ${this._scanRegion.width || this.$video.videoWidth} ${this._scanRegion.height || this.$video.videoHeight}`), this.$codeOutlineHighlight.firstElementChild.setAttribute(
          "points",
          c.cornerPoints.map(({ x: d, y: f }) => `${d},${f}`).join(" ")
        ), this.$codeOutlineHighlight.style.display = "")) : this.$codeOutlineHighlight && !this._codeOutlineHighlightRemovalTimeout && (this._codeOutlineHighlightRemovalTimeout = setTimeout(() => this.$codeOutlineHighlight.style.display = "none", 100));
      }
      this._scanFrame();
    });
  }
  _onDecodeError(a) {
    a !== _e.NO_QR_CODE_FOUND && console.log(a);
  }
  async _getCameraStream() {
    if (!navigator.mediaDevices) throw "Camera not found.";
    let a = /^(environment|user)$/.test(this._preferredCamera) ? "facingMode" : "deviceId", b = [{ width: { min: 1024 } }, { width: { min: 768 } }, {}], c = b.map((d) => Object.assign({}, d, { [a]: { exact: this._preferredCamera } }));
    for (let d of [...c, ...b]) try {
      let f = await navigator.mediaDevices.getUserMedia({ video: d, audio: false }), h = this._getFacingMode(f) || (d.facingMode ? this._preferredCamera : "environment" === this._preferredCamera ? "user" : "environment");
      return { stream: f, facingMode: h };
    } catch (f) {
    }
    throw "Camera not found.";
  }
  async _restartVideoStream() {
    let a = this._paused;
    await this.pause(true) && !a && this._active && await this.start();
  }
  static _stopVideoStream(a) {
    for (let b of a.getTracks()) b.stop(), a.removeTrack(b);
  }
  _setVideoMirror(a) {
    this.$video.style.transform = "scaleX(" + ("user" === a ? -1 : 1) + ")";
  }
  _getFacingMode(a) {
    return (a = a.getVideoTracks()[0]) ? /rear|back|environment/i.test(a.label) ? "environment" : /front|user|face/i.test(a.label) ? "user" : null : null;
  }
  static _drawToCanvas(a, b, c, d = false) {
    c = c || document.createElement("canvas");
    let f = b && b.x ? b.x : 0, h = b && b.y ? b.y : 0, m = b && b.width ? b.width : a.videoWidth || a.width, n = b && b.height ? b.height : a.videoHeight || a.height;
    d || (d = b && b.downScaledWidth ? b.downScaledWidth : m, b = b && b.downScaledHeight ? b.downScaledHeight : n, c.width !== d && (c.width = d), c.height !== b && (c.height = b));
    b = c.getContext("2d", { alpha: false });
    b.imageSmoothingEnabled = false;
    b.drawImage(a, f, h, m, n, 0, 0, c.width, c.height);
    return [c, b];
  }
  static async _loadImage(a) {
    if (a instanceof Image) return await _e._awaitImageLoad(a), a;
    if (a instanceof HTMLVideoElement || a instanceof HTMLCanvasElement || a instanceof SVGImageElement || "OffscreenCanvas" in window && a instanceof OffscreenCanvas || "ImageBitmap" in window && a instanceof ImageBitmap) return a;
    if (a instanceof File || a instanceof Blob || a instanceof URL || "string" === typeof a) {
      let b = new Image();
      b.src = a instanceof File || a instanceof Blob ? URL.createObjectURL(a) : a.toString();
      try {
        return await _e._awaitImageLoad(b), b;
      } finally {
        (a instanceof File || a instanceof Blob) && URL.revokeObjectURL(b.src);
      }
    } else throw "Unsupported image type.";
  }
  static async _awaitImageLoad(a) {
    a.complete && 0 !== a.naturalWidth || await new Promise((b, c) => {
      let d = (f) => {
        a.removeEventListener("load", d);
        a.removeEventListener("error", d);
        f instanceof ErrorEvent ? c("Image load error") : b();
      };
      a.addEventListener("load", d);
      a.addEventListener("error", d);
    });
  }
  static async _postWorkerMessage(a, b, c, d) {
    return _e._postWorkerMessageSync(await a, b, c, d);
  }
  static _postWorkerMessageSync(a, b, c, d) {
    if (!(a instanceof Worker)) return -1;
    let f = _e._workerMessageId++;
    a.postMessage({ id: f, type: b, data: c }, d);
    return f;
  }
};
e.DEFAULT_CANVAS_SIZE = 400;
e.NO_QR_CODE_FOUND = "No QR code found";
e._disableBarcodeDetector = false;
e._workerMessageId = 0;
var qr_scanner_min_default = e;

// node_modules/@sovereignbase/qr/dist/index.js
var QRError = class extends Error {
  code;
  constructor(code, message) {
    const detail = message ?? code;
    super(`{@sovereignbase/qr} ${detail}`);
    this.code = code;
    this.name = "QRError";
  }
};
function runAfterPaint(callback) {
  if (typeof globalThis.requestAnimationFrame === "function") {
    globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(callback);
    });
    return;
  }
  setTimeout(callback, 0);
}
function attachFadeStyles(element, durationMs) {
  const previousOpacity = element.style.opacity;
  const previousTransitionProperty = element.style.transitionProperty;
  const previousTransitionDuration = element.style.transitionDuration;
  const previousTransitionTimingFunction = element.style.transitionTimingFunction;
  element.style.opacity = "0";
  element.style.transitionProperty = "opacity";
  element.style.transitionDuration = `${durationMs}ms`;
  element.style.transitionTimingFunction = "ease";
  return {
    reveal: () => runAfterPaint(() => element.style.opacity = "1"),
    hide: () => element.style.opacity = "0",
    detach: () => {
      element.style.transitionProperty = previousTransitionProperty;
      element.style.transitionDuration = previousTransitionDuration;
      element.style.transitionTimingFunction = previousTransitionTimingFunction;
      element.style.opacity = previousOpacity;
    }
  };
}
function attachDialogBackdropFade(dialog, durationMs) {
  let animation;
  let supportsBackdropAnimation;
  let closeListener;
  let fallbackTimeout;
  let fallbackOverlay;
  const detachFallbackOverlay = () => {
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout);
      fallbackTimeout = void 0;
    }
    fallbackOverlay?.remove();
    fallbackOverlay = void 0;
  };
  const detachCloseListener = () => {
    if (!closeListener) return;
    dialog.removeEventListener("close", closeListener);
    closeListener = void 0;
  };
  const animateBackdrop = (from, to) => {
    if (supportsBackdropAnimation === false) return false;
    if (typeof dialog.animate !== "function") {
      supportsBackdropAnimation = false;
      return false;
    }
    try {
      animation?.cancel();
      animation = dialog.animate([{ opacity: from }, { opacity: to }], {
        duration: durationMs,
        easing: "ease",
        fill: "forwards",
        pseudoElement: "::backdrop"
      });
      supportsBackdropAnimation = true;
      return true;
    } catch {
      supportsBackdropAnimation = false;
      return false;
    }
  };
  return {
    reveal: () => {
      detachCloseListener();
      detachFallbackOverlay();
      animateBackdrop(0, 1);
    },
    hide: () => {
      if (animateBackdrop(1, 0)) return;
      detachCloseListener();
      detachFallbackOverlay();
      closeListener = () => {
        closeListener = void 0;
        if (!document.body) return;
        let backdropColor = "rgba(0, 0, 0, 0.3)";
        if (typeof globalThis.getComputedStyle === "function") {
          try {
            const computed = globalThis.getComputedStyle(dialog, "::backdrop");
            if (computed.backgroundColor.trim().length > 0)
              backdropColor = computed.backgroundColor;
          } catch {
          }
        }
        const overlay = document.createElement("div");
        fallbackOverlay = overlay;
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.pointerEvents = "none";
        overlay.style.opacity = "1";
        overlay.style.background = backdropColor;
        overlay.style.transitionProperty = "opacity";
        overlay.style.transitionDuration = `${durationMs}ms`;
        overlay.style.transitionTimingFunction = "ease";
        overlay.style.zIndex = "2147483647";
        document.body.append(overlay);
        const fadeOverlay = () => {
          overlay.style.opacity = "0";
          fallbackTimeout = setTimeout(() => {
            if (fallbackOverlay === overlay) fallbackOverlay = void 0;
            overlay.remove();
            fallbackTimeout = void 0;
          }, durationMs);
        };
        if (typeof globalThis.requestAnimationFrame === "function")
          globalThis.requestAnimationFrame(fadeOverlay);
        else setTimeout(fadeOverlay, 0);
      };
      dialog.addEventListener("close", closeListener, { once: true });
    },
    detach: () => {
      detachCloseListener();
      detachFallbackOverlay();
      try {
        animation?.cancel();
      } catch {
      }
    }
  };
}
function getErrorMessage(error, fallback) {
  if (error instanceof Error && error.message.trim().length > 0)
    return error.message;
  if (typeof error === "string" && error.trim().length > 0) return error;
  return fallback;
}
function display(value) {
  if (typeof value !== "string") {
    throw new QRError(
      "VALUE_IS_NOT_A_STRING",
      "This library only accepts strings as value, use `@sovereignbase/bytecodec` for conversions"
    );
  }
  const fadeMs = 333;
  const dialog = document.createElement("dialog");
  dialog.style.border = "none";
  dialog.style.padding = "0";
  dialog.style.background = "#fff";
  dialog.style.borderRadius = "1rem";
  dialog.style.display = "flex";
  dialog.style.alignItems = "center";
  dialog.style.justifyContent = "center";
  dialog.style.outline = "none";
  dialog.style.overflow = "hidden";
  const dialogBackdropFade = attachDialogBackdropFade(dialog, fadeMs);
  const dialogFade = attachFadeStyles(dialog, fadeMs);
  let svgText = "";
  try {
    svgText = qr_default(value, "svg");
  } catch (error) {
    throw new QRError(
      "QR_ENCODE_FAILED",
      getErrorMessage(error, "Unable to encode value as QR SVG")
    );
  }
  const url = URL.createObjectURL(
    new Blob([svgText], { type: "image/svg+xml" })
  );
  const img = document.createElement("img");
  img.src = url;
  img.alt = "QR code";
  img.style.width = "min(80vw, 400px)";
  img.style.height = "auto";
  img.style.aspectRatio = "1 / 1";
  img.style.display = "block";
  const imgFade = attachFadeStyles(img, fadeMs);
  dialog.append(img);
  document.body.append(dialog);
  dialog.showModal();
  dialogBackdropFade.reveal();
  dialogFade.reveal();
  const ac = new AbortController();
  let cleaned = false;
  let closing = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    ac.abort();
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("keydown", onKeyDown);
    img.onload = null;
    URL.revokeObjectURL(url);
    dialogBackdropFade.detach();
    dialogFade.detach();
    imgFade.detach();
    dialog.remove();
  };
  const requestClose = () => {
    if (closing || cleaned) return;
    closing = true;
    dialogBackdropFade.hide();
    dialogFade.hide();
    imgFade.hide();
    setTimeout(() => {
      try {
        dialog.close();
      } catch {
      }
      cleanup();
    }, fadeMs);
  };
  img.onload = () => {
    URL.revokeObjectURL(url);
    imgFade.reveal();
  };
  if (img.complete) {
    URL.revokeObjectURL(url);
    imgFade.reveal();
  }
  const onPointerUp = () => requestClose();
  const onMouseUp = () => requestClose();
  const onTouchEnd = () => requestClose();
  const onKeyDown = () => requestClose();
  setTimeout(() => {
    window.addEventListener("pointerup", onPointerUp, { signal: ac.signal });
    window.addEventListener("mouseup", onMouseUp, { signal: ac.signal });
    window.addEventListener("touchend", onTouchEnd, { signal: ac.signal });
    window.addEventListener("keydown", onKeyDown, { signal: ac.signal });
    dialog.addEventListener("close", cleanup, { signal: ac.signal });
  }, fadeMs);
}
function print(value) {
  if (typeof value !== "string")
    throw new QRError(
      "VALUE_IS_NOT_A_STRING",
      "This library only accepts strings as value, use `@sovereignbase/bytecodec` for conversions"
    );
  const PAGE_MM = { w: 210, h: 297 };
  const PAGE_MARGIN_MM = 8;
  const CARD_MM = { w: 85.6, h: 53.98 };
  const CARD_PADDING_MM = 4;
  const QR_ON_CARD_MM = 42;
  const CUTLINE_MM = 0.35;
  const CROP_LEN_MM = 3.5;
  const CROP_OFF_MM = 1.2;
  const printableW = PAGE_MM.w - 2 * PAGE_MARGIN_MM;
  const printableH = PAGE_MM.h - 2 * PAGE_MARGIN_MM;
  const cols = Math.max(1, Math.floor(printableW / CARD_MM.w));
  const rows = Math.max(1, Math.floor(printableH / CARD_MM.h));
  const count = cols * rows;
  const maxQrMm = CARD_MM.h - 2 * CARD_PADDING_MM;
  const qrMm = Math.max(10, Math.min(QR_ON_CARD_MM, maxQrMm));
  let svg = "";
  try {
    svg = qr_default(value, "svg");
  } catch (error) {
    throw new QRError(
      "QR_ENCODE_FAILED",
      getErrorMessage(error, "Unable to encode value as QR SVG")
    );
  }
  const tiles = Array.from({ length: count }, () => {
    return `<div class="card">
      <div class="qr">${svg}</div>
      <i class="crop tl"></i><i class="crop tr"></i><i class="crop bl"></i><i class="crop br"></i>
    </div>`;
  }).join("");
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root{
      --page-margin: ${PAGE_MARGIN_MM}mm;

      --card-w: ${CARD_MM.w}mm;
      --card-h: ${CARD_MM.h}mm;
      --pad: ${CARD_PADDING_MM}mm;

      --qr: ${qrMm}mm;

      --cut: ${CUTLINE_MM}mm;
      --crop-len: ${CROP_LEN_MM}mm;
      --crop-off: ${CROP_OFF_MM}mm;
    }

    @page { size: A4 portrait; margin: var(--page-margin); }

    html, body { margin: 0; padding: 0; background: #fff; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }

    .sheet{
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .grid{
      display: grid;
      grid-template-columns: repeat(${cols}, var(--card-w));
      grid-template-rows: repeat(${rows}, var(--card-h));
      gap: 0;
    }

    .card{
      position: relative;
      width: var(--card-w);
      height: var(--card-h);
      box-sizing: border-box;

      /* single-thickness shared edges */
      outline: var(--cut) dotted #000;
      outline-offset: calc(-1 * var(--cut));

      display: grid;
      place-items: center;
      padding: var(--pad);
    }

    .qr{
      width: var(--qr);
      height: var(--qr);
      display: grid;
      place-items: center;
    }

    .qr > svg{
      width: 100%;
      height: 100%;
      display: block;
    }

    .crop{
      position: absolute;
      width: var(--crop-len);
      height: var(--crop-len);
      pointer-events: none;
    }
    .crop.tl{ top: var(--crop-off); left: var(--crop-off); border-top: 0.35mm solid #000; border-left: 0.35mm solid #000; }
    .crop.tr{ top: var(--crop-off); right: var(--crop-off); border-top: 0.35mm solid #000; border-right: 0.35mm solid #000; }
    .crop.bl{ bottom: var(--crop-off); left: var(--crop-off); border-bottom: 0.35mm solid #000; border-left: 0.35mm solid #000; }
    .crop.br{ bottom: var(--crop-off); right: var(--crop-off); border-bottom: 0.35mm solid #000; border-right: 0.35mm solid #000; }

    @media screen{
      body { background: #eee; }
      .sheet{ padding: 16px; }
      .grid{ background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="grid">
      ${tiles}
    </div>
  </div>

  <script>
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.focus();
        window.print();
      });
    });
    window.addEventListener('afterprint', () => {
      try { window.close(); } catch {}
    });
  <\/script>
</body>
</html>`;
  const url = URL.createObjectURL(
    new Blob([html], { type: "text/html;charset=utf-8" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 6e4);
}
async function scan() {
  let hasCamera = false;
  try {
    hasCamera = await qr_scanner_min_default.hasCamera();
  } catch (error) {
    throw new QRError(
      "CAMERA_CHECK_FAILED",
      getErrorMessage(error, "Unable to check camera availability")
    );
  }
  if (!hasCamera)
    throw new QRError(
      "NO_CAMERA_AVAILABLE",
      "QR-Code scanning requires a camera"
    );
  const fadeMs = 333;
  const dialog = document.createElement("dialog");
  dialog.style.border = "none";
  dialog.style.padding = "0";
  dialog.style.background = "transparent";
  dialog.style.borderRadius = "1rem";
  dialog.style.outline = "none";
  dialog.style.width = "min(80vw, 400px)";
  dialog.style.aspectRatio = "1 / 1";
  dialog.style.overflow = "hidden";
  const dialogBackdropFade = attachDialogBackdropFade(dialog, fadeMs);
  const dialogFade = attachFadeStyles(dialog, fadeMs);
  const video = document.createElement("video");
  video.setAttribute("playsinline", "true");
  video.muted = true;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.display = "block";
  video.style.objectFit = "cover";
  video.style.aspectRatio = "1 / 1";
  const videoFade = attachFadeStyles(video, fadeMs);
  dialog.append(video);
  document.body.append(dialog);
  dialog.showModal();
  dialogBackdropFade.reveal();
  dialogFade.reveal();
  return new Promise((resolve, reject) => {
    const ac = new AbortController();
    let settled = false;
    let scanner;
    let childrenVisible = false;
    const childFades = /* @__PURE__ */ new Map();
    const revealChildren = () => {
      if (childrenVisible) return;
      childrenVisible = true;
      videoFade.reveal();
      for (const childFade of childFades.values()) childFade.reveal();
    };
    const registerChildFade = (node) => {
      if (node === video) return;
      if (typeof node !== "object" || node === null || !("style" in node))
        return;
      const element = node;
      if (childFades.has(element)) return;
      const fade = attachFadeStyles(element, fadeMs);
      childFades.set(element, fade);
      if (childrenVisible) fade.reveal();
    };
    const unregisterChildFade = (node) => {
      if (typeof node !== "object" || node === null || !("style" in node))
        return;
      const element = node;
      const fade = childFades.get(element);
      if (!fade) return;
      fade.detach();
      childFades.delete(element);
    };
    const onVideoLoadedData = () => revealChildren();
    const onVideoPlaying = () => revealChildren();
    video.addEventListener("loadeddata", onVideoLoadedData, {
      signal: ac.signal
    });
    video.addEventListener("playing", onVideoPlaying, { signal: ac.signal });
    if (video.readyState >= 2) revealChildren();
    const childObserver = typeof globalThis.MutationObserver === "function" ? new globalThis.MutationObserver((records) => {
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          registerChildFade(node);
        }
        for (const node of Array.from(record.removedNodes)) {
          unregisterChildFade(node);
        }
      }
    }) : void 0;
    childObserver?.observe(dialog, { childList: true });
    const finalize = (done) => {
      if (settled) return;
      settled = true;
      ac.abort();
      childObserver?.disconnect();
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      dialogBackdropFade.hide();
      dialogFade.hide();
      videoFade.hide();
      for (const childFade of childFades.values()) childFade.hide();
      setTimeout(() => {
        try {
          scanner?.stop();
        } catch {
        }
        try {
          scanner?.destroy();
        } catch {
        }
        dialogBackdropFade.detach();
        dialogFade.detach();
        videoFade.detach();
        for (const childFade of childFades.values()) childFade.detach();
        childFades.clear();
        try {
          dialog.remove();
        } catch {
        }
        done();
      }, fadeMs);
    };
    const rejectWithQRError = (error) => {
      finalize(() => reject(error));
    };
    const resolveWithData = (data) => {
      finalize(() => resolve(data));
    };
    const abort = () => rejectWithQRError(
      new QRError("SCAN_CANCELLED", "QR-Code scanning was cancelled")
    );
    const onPointerUp = () => abort();
    const onMouseUp = () => abort();
    const onTouchEnd = () => abort();
    const onKeyDown = () => abort();
    setTimeout(() => {
      window.addEventListener("pointerup", onPointerUp, { signal: ac.signal });
      window.addEventListener("mouseup", onMouseUp, { signal: ac.signal });
      window.addEventListener("touchend", onTouchEnd, { signal: ac.signal });
      window.addEventListener("keydown", onKeyDown, { signal: ac.signal });
      dialog.addEventListener(
        "cancel",
        (e2) => {
          e2.preventDefault();
          abort();
        },
        { signal: ac.signal }
      );
      dialog.addEventListener("close", abort, { signal: ac.signal });
    }, fadeMs);
    scanner = new qr_scanner_min_default(
      video,
      (result) => {
        resolveWithData(result.data);
      },
      {
        preferredCamera: "environment",
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        onDecodeError: () => {
        }
      }
    );
    scanner.start().catch((error) => {
      rejectWithQRError(
        new QRError(
          "SCAN_START_FAILED",
          getErrorMessage(error, "Unable to start QR scanner")
        )
      );
    });
  });
}
var QR = class {
  /**
   * Opens a modal dialog that renders the provided string as a QR code.
   *
   * The QR image is generated as SVG and displayed from a temporary `blob:` URL.
   *
   * @param value String value to encode.
   * @throws {QRError} Thrown when `value` is not a string or encoding fails.
   */
  static display(value) {
    return display(value);
  }
  /**
   * Opens a print-friendly document containing repeated QR cards for the provided string.
   *
   * The generated document uses an A4 layout and triggers the browser print dialog.
   *
   * @param value String value to encode.
   * @throws {QRError} Thrown when `value` is not a string or encoding fails.
   */
  static print(value) {
    return print(value);
  }
  /**
   * Opens a modal camera scanner and resolves with the first decoded QR payload.
   *
   * @returns A promise that fulfills with the decoded QR code string.
   * @throws {QRError} Thrown when camera probing fails, no camera is available,
   * scanner startup fails, or the interaction is cancelled.
   */
  static scan() {
    return scan();
  }
};

// node_modules/uuid/dist/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

// node_modules/uuid/dist/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}

// node_modules/uuid/dist/v7.js
var _state = {};
function v7(options, buf, offset) {
  let bytes;
  if (options) {
    bytes = v7Bytes(options.random ?? options.rng?.() ?? rng(), options.msecs, options.seq, buf, offset);
  } else {
    const now = Date.now();
    const rnds = rng();
    updateV7State(_state, now, rnds);
    bytes = v7Bytes(rnds, _state.msecs, _state.seq, buf, offset);
  }
  return buf ?? unsafeStringify(bytes);
}
function updateV7State(state, now, rnds) {
  state.msecs ??= -Infinity;
  state.seq ??= 0;
  if (now > state.msecs) {
    state.seq = rnds[6] << 23 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
    state.msecs = now;
  } else {
    state.seq = state.seq + 1 | 0;
    if (state.seq === 0) {
      state.msecs++;
    }
  }
  return state;
}
function v7Bytes(rnds, msecs, seq, buf, offset = 0) {
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  if (!buf) {
    buf = new Uint8Array(16);
    offset = 0;
  } else {
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
  }
  msecs ??= Date.now();
  seq ??= rnds[6] * 127 << 24 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
  buf[offset++] = msecs / 1099511627776 & 255;
  buf[offset++] = msecs / 4294967296 & 255;
  buf[offset++] = msecs / 16777216 & 255;
  buf[offset++] = msecs / 65536 & 255;
  buf[offset++] = msecs / 256 & 255;
  buf[offset++] = msecs & 255;
  buf[offset++] = 112 | seq >>> 28 & 15;
  buf[offset++] = seq >>> 20 & 255;
  buf[offset++] = 128 | seq >>> 14 & 63;
  buf[offset++] = seq >>> 6 & 255;
  buf[offset++] = seq << 2 & 255 | rnds[10] & 3;
  buf[offset++] = rnds[11];
  buf[offset++] = rnds[12];
  buf[offset++] = rnds[13];
  buf[offset++] = rnds[14];
  buf[offset++] = rnds[15];
  return buf;
}
var v7_default = v7;

// node_modules/uuid/dist/version.js
function version(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  return parseInt(uuid.slice(14, 15), 16);
}
var version_default = version;

// node_modules/@sovereignbase/utils/dist/index.js
var PROTOTYPE_LIST = [
  "null",
  "undefined",
  "boolean",
  "string",
  "symbol",
  "number",
  "bigint",
  "record",
  "array",
  "map",
  "set",
  "date",
  "regexp",
  "error",
  "arraybuffer",
  "sharedarraybuffer",
  "dataview",
  "int8array",
  "uint8array",
  "uint8clampedarray",
  "int16array",
  "uint16array",
  "int32array",
  "uint32array",
  "float32array",
  "float64array",
  "bigint64array",
  "biguint64array",
  "url",
  "urlsearchparams",
  "blob",
  "file",
  "unknown"
];
function prototype(value) {
  let type = typeof value;
  if (type === "object") {
    type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  }
  if (type === "object") type = "record";
  if (!PROTOTYPE_LIST.includes(type)) {
    type = "unknown";
  }
  return type;
}
function isUuidV7(value) {
  if (typeof value !== "string") return false;
  try {
    return version_default(value) === 7;
  } catch {
    return false;
  }
}
function safeStructuredClone(value) {
  try {
    return [true, structuredClone(value)];
  } catch {
    return [false];
  }
}

// node_modules/@sovereignbase/convergent-replicated-list/dist/index.js
function assertListIndices(crListReplica) {
  if (!crListReplica.cursor) return;
  let index = crListReplica.size;
  while (crListReplica.cursor.next)
    crListReplica.cursor = crListReplica.cursor.next;
  while (index >= 1) {
    index--;
    crListReplica.cursor.index = index;
    if (crListReplica.cursor.prev === void 0) break;
    crListReplica.cursor = crListReplica.cursor.prev;
  }
}
var CRListError = class extends Error {
  /**
   * The semantic error code for the failure.
   */
  code;
  /**
   * Creates a typed CRList error.
   *
   * @param code - The semantic error code.
   * @param message - An optional human-readable detail message.
   */
  constructor(code, message) {
    const detail = message ?? code;
    super(`{@sovereignbase/convergent-replicated-list} ${detail}`);
    this.code = code;
    this.name = "CRListError";
  }
};
function walkToIndex(targetIndex, crListReplica) {
  if (targetIndex < 0 || targetIndex >= crListReplica.size)
    throw new CRListError("INDEX_OUT_OF_BOUNDS", "Index out of bounds");
  if (!crListReplica.cursor)
    throw new CRListError("LIST_EMPTY", "List is empty");
  const direction = crListReplica.cursor.index > targetIndex ? "prev" : "next";
  while (crListReplica.cursor && crListReplica.cursor.index !== targetIndex) {
    crListReplica.cursor = crListReplica.cursor[direction];
  }
}
function insertBetween(prev, linkedListEntry, next) {
  linkedListEntry.prev = prev;
  linkedListEntry.next = next;
  if (prev) prev.next = linkedListEntry;
  if (next) next.prev = linkedListEntry;
}
function flattenAndLinkTrustedState(crListReplica) {
  crListReplica.cursor = void 0;
  const resolvedSiblingPredecessors = /* @__PURE__ */ new Set();
  for (const entry of crListReplica.parentMap.values()) {
    if (!entry) continue;
    entry.prev = void 0;
    entry.next = void 0;
  }
  const keys = [...crListReplica.childrenMap.keys()].sort(
    (a, b) => a > b ? 1 : -1
  );
  let hasProgress = true;
  while (hasProgress) {
    hasProgress = false;
    for (const predecessorIdentifier of keys) {
      if (resolvedSiblingPredecessors.has(predecessorIdentifier)) continue;
      const siblings = crListReplica.childrenMap.get(predecessorIdentifier);
      if (!siblings) continue;
      if (siblings.length > 1)
        siblings.sort((a, b) => a.uuidv7 > b.uuidv7 ? 1 : -1);
      const predecessor = predecessorIdentifier === "\0" ? void 0 : crListReplica.parentMap.get(predecessorIdentifier);
      if (predecessor && !predecessor.prev && !predecessor.next && crListReplica.cursor !== predecessor)
        continue;
      let prev = predecessor ?? crListReplica.cursor;
      const predecessorNext = predecessor?.next;
      if (siblings.length === 1) {
        const sibling = siblings[0];
        insertBetween(prev, sibling, sibling.next);
        prev = sibling;
        if (predecessorNext && predecessorNext !== sibling) {
          prev.next = predecessorNext;
          predecessorNext.prev = prev;
        } else {
          prev.next = void 0;
        }
        if (!predecessorNext) crListReplica.cursor = prev;
        resolvedSiblingPredecessors.add(predecessorIdentifier);
        hasProgress = true;
        continue;
      }
      const siblingSet = new Set(siblings);
      for (let index = 0; index < siblings.length; index++) {
        const sibling = siblings[index];
        const next = siblings[index + 1];
        insertBetween(prev, sibling, sibling.next);
        prev = sibling;
        if (next) {
          prev.next = next;
          next.prev = prev;
        } else if (predecessorNext && !siblingSet.has(predecessorNext)) {
          prev.next = predecessorNext;
          predecessorNext.prev = prev;
        } else {
          prev.next = void 0;
        }
      }
      if (!predecessorNext) crListReplica.cursor = prev;
      resolvedSiblingPredecessors.add(predecessorIdentifier);
      hasProgress = true;
    }
  }
  crListReplica.size = crListReplica.parentMap.size;
}
function transformSnapshotEntryToStateEntry(valueEntry, crListReplica) {
  if (valueEntry === null || valueEntry === void 0) return void 0;
  if (!isUuidV7(valueEntry.uuidv7) || crListReplica.tombstones.has(valueEntry.uuidv7) || crListReplica.parentMap.has(valueEntry.uuidv7) || !isUuidV7(valueEntry.predecessor) && valueEntry.predecessor !== "\0" && !crListReplica.tombstones.has(valueEntry.predecessor))
    return void 0;
  const [cloned, copiedValue] = safeStructuredClone(valueEntry.value);
  if (!cloned) return void 0;
  return {
    uuidv7: valueEntry.uuidv7,
    value: copiedValue,
    predecessor: valueEntry.predecessor,
    index: 0,
    next: void 0,
    prev: void 0
  };
}
function updateEntryToMaps(crListReplica, linkedListEntry, deltaBuf) {
  crListReplica.parentMap.set(linkedListEntry.uuidv7, linkedListEntry);
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor);
  if (siblings) {
    siblings.push(linkedListEntry);
  } else {
    crListReplica.childrenMap.set(linkedListEntry.predecessor, [
      linkedListEntry
    ]);
  }
  if (deltaBuf && !Array.isArray(deltaBuf.values)) deltaBuf.values = [];
  if (deltaBuf?.values)
    deltaBuf.values.push({
      uuidv7: linkedListEntry.uuidv7,
      value: linkedListEntry.value,
      predecessor: linkedListEntry.predecessor
    });
}
function deleteEntryFromMaps(crListReplica, linkedListEntry) {
  crListReplica.parentMap.delete(linkedListEntry.uuidv7);
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor);
  if (!siblings) return;
  const index = siblings.indexOf(linkedListEntry);
  if (index !== -1) siblings.splice(index, 1);
}
function deleteLinkedEntry(crListReplica, linkedListEntry, deltaBuf) {
  const prev = linkedListEntry.prev;
  const next = linkedListEntry.next;
  crListReplica.tombstones.add(linkedListEntry.uuidv7);
  if (deltaBuf && !Array.isArray(deltaBuf.tombstones)) deltaBuf.tombstones = [];
  deltaBuf?.tombstones?.push(linkedListEntry.uuidv7);
  if (prev) prev.next = next;
  if (next) {
    next.prev = prev;
  }
  void deleteEntryFromMaps(crListReplica, linkedListEntry);
  if (crListReplica.cursor === linkedListEntry)
    crListReplica.cursor = next ?? prev;
  linkedListEntry.prev = void 0;
  linkedListEntry.next = void 0;
  crListReplica.size = crListReplica.parentMap.size;
}
function moveEntryToPredecessor(crListReplica, linkedListEntry, predecessor, deltaBuf) {
  void deleteEntryFromMaps(crListReplica, linkedListEntry);
  linkedListEntry.predecessor = predecessor;
  void updateEntryToMaps(crListReplica, linkedListEntry, deltaBuf);
}
function indexFromPropertyKey(index) {
  if (typeof index !== "string" || !/^(0|[1-9]\d*)$/.test(index))
    return void 0;
  const listIndex = Number(index);
  return Number.isSafeInteger(listIndex) ? listIndex : void 0;
}
function __create(snapshot2) {
  const crListReplica = {
    size: 0,
    cursor: void 0,
    tombstones: /* @__PURE__ */ new Set(),
    parentMap: /* @__PURE__ */ new Map(),
    childrenMap: /* @__PURE__ */ new Map()
  };
  if (!snapshot2 || prototype(snapshot2) !== "record") return crListReplica;
  if (Object.hasOwn(snapshot2, "tombstones") && Array.isArray(snapshot2.tombstones)) {
    for (const tombstone of snapshot2.tombstones) {
      if (crListReplica.tombstones.has(tombstone) || !isUuidV7(tombstone))
        continue;
      crListReplica.tombstones.add(tombstone);
    }
  }
  if (!Object.hasOwn(snapshot2, "values") || !Array.isArray(snapshot2.values))
    return crListReplica;
  for (const valueEntry of snapshot2.values) {
    const linkedListEntry = transformSnapshotEntryToStateEntry(
      valueEntry,
      crListReplica
    );
    if (!linkedListEntry) continue;
    void updateEntryToMaps(crListReplica, linkedListEntry);
  }
  void flattenAndLinkTrustedState(crListReplica);
  void assertListIndices(crListReplica);
  return crListReplica;
}
function __read(targetIndex, crListReplica) {
  try {
    void walkToIndex(targetIndex, crListReplica);
    return structuredClone(crListReplica?.cursor?.value);
  } catch {
    return void 0;
  }
}
function __update(listIndex, listValues, crListReplica, mode) {
  if (listIndex < 0 || listIndex > crListReplica.size)
    throw new CRListError("INDEX_OUT_OF_BOUNDS");
  if (!Array.isArray(listValues))
    throw new CRListError(
      "UPDATE_EXPECTED_AN_ARRAY",
      "`listValues` must be an Array"
    );
  if (listValues.length === 0) return false;
  const change = {};
  const delta = { values: [], tombstones: [] };
  let shiftCursor;
  for (const listValue of listValues) {
    const [cloned, copiedValue] = safeStructuredClone(listValue);
    if (!cloned) throw new CRListError("VALUE_NOT_CLONEABLE");
    const v72 = v7_default();
    const linkedListEntry = {
      uuidv7: v72,
      value: copiedValue,
      predecessor: "\0",
      index: 0,
      next: void 0,
      prev: void 0
    };
    switch (mode) {
      case "overwrite": {
        if (listIndex === crListReplica.size) {
          if (crListReplica.size === 0) {
            crListReplica.cursor = linkedListEntry;
            void updateEntryToMaps(crListReplica, linkedListEntry, delta);
            change[linkedListEntry.index] = linkedListEntry.value;
            break;
          }
          void walkToIndex(crListReplica.size - 1, crListReplica);
          if (!crListReplica.cursor) return false;
          linkedListEntry.index = crListReplica.cursor.index + 1;
          linkedListEntry.predecessor = crListReplica.cursor.uuidv7;
          insertBetween(crListReplica.cursor, linkedListEntry, void 0);
          void updateEntryToMaps(crListReplica, linkedListEntry, delta);
          crListReplica.cursor = linkedListEntry;
          change[linkedListEntry.index] = structuredClone(linkedListEntry.value);
          break;
        }
        void walkToIndex(listIndex, crListReplica);
        if (!crListReplica.cursor) return false;
        const entryToOverwrite = crListReplica.cursor;
        linkedListEntry.predecessor = entryToOverwrite.predecessor;
        linkedListEntry.index = entryToOverwrite.index;
        insertBetween(
          entryToOverwrite.prev,
          linkedListEntry,
          entryToOverwrite.next
        );
        if (entryToOverwrite.next) {
          if (entryToOverwrite.next.predecessor === entryToOverwrite.uuidv7) {
            void moveEntryToPredecessor(
              crListReplica,
              entryToOverwrite.next,
              linkedListEntry.uuidv7,
              delta
            );
          }
        }
        void updateEntryToMaps(crListReplica, linkedListEntry, delta);
        crListReplica.tombstones.add(entryToOverwrite.uuidv7);
        delta.tombstones?.push(entryToOverwrite.uuidv7);
        void deleteEntryFromMaps(crListReplica, entryToOverwrite);
        entryToOverwrite.next = void 0;
        entryToOverwrite.prev = void 0;
        crListReplica.cursor = linkedListEntry;
        change[linkedListEntry.index] = structuredClone(linkedListEntry.value);
        break;
      }
      case "after": {
        if (crListReplica.size === 0 && listIndex === 0) {
          crListReplica.cursor = linkedListEntry;
          void updateEntryToMaps(crListReplica, linkedListEntry, delta);
          change[linkedListEntry.index] = structuredClone(linkedListEntry.value);
          break;
        }
        if (listIndex === crListReplica.size) {
          void walkToIndex(crListReplica.size - 1, crListReplica);
        } else {
          void walkToIndex(listIndex, crListReplica);
        }
        if (!crListReplica.cursor) return false;
        const next = listIndex === crListReplica.size ? void 0 : crListReplica.cursor.next;
        shiftCursor = next;
        linkedListEntry.index = crListReplica.cursor.index + 1;
        linkedListEntry.predecessor = crListReplica.cursor.uuidv7;
        insertBetween(crListReplica.cursor, linkedListEntry, next);
        if (next) {
          if (next.predecessor === crListReplica.cursor.uuidv7) {
            void moveEntryToPredecessor(
              crListReplica,
              next,
              linkedListEntry.uuidv7,
              delta
            );
          }
        }
        void updateEntryToMaps(crListReplica, linkedListEntry, delta);
        crListReplica.cursor = linkedListEntry;
        change[linkedListEntry.index] = structuredClone(linkedListEntry.value);
        break;
      }
      case "before": {
        if (crListReplica.size === 0 && listIndex === 0) {
          crListReplica.cursor = linkedListEntry;
          void updateEntryToMaps(crListReplica, linkedListEntry, delta);
          change[linkedListEntry.index] = structuredClone(linkedListEntry.value);
          mode = "after";
          listIndex = linkedListEntry.index - 1;
          break;
        }
        void walkToIndex(listIndex, crListReplica);
        if (!crListReplica.cursor) return false;
        const prev = crListReplica.cursor.prev;
        shiftCursor = crListReplica.cursor;
        linkedListEntry.index = crListReplica.cursor.index;
        linkedListEntry.predecessor = prev?.uuidv7 ?? "\0";
        insertBetween(prev, linkedListEntry, crListReplica.cursor);
        if (crListReplica.cursor.predecessor === linkedListEntry.predecessor) {
          void moveEntryToPredecessor(
            crListReplica,
            crListReplica.cursor,
            linkedListEntry.uuidv7,
            delta
          );
        }
        void updateEntryToMaps(crListReplica, linkedListEntry, delta);
        crListReplica.cursor = linkedListEntry;
        change[linkedListEntry.index] = structuredClone(linkedListEntry.value);
        mode = "after";
        listIndex = linkedListEntry.index - 1;
        break;
      }
    }
    crListReplica.size = crListReplica.parentMap.size;
    listIndex++;
  }
  if (mode !== "overwrite")
    while (shiftCursor) {
      shiftCursor.index += listValues.length;
      shiftCursor = shiftCursor.next;
    }
  return { change, delta };
}
function __delete(crListReplica, startIndex, endIndex) {
  const change = {};
  const delta = { values: [], tombstones: [] };
  const listIndex = startIndex ?? 0;
  const targetEndIndex = endIndex ?? crListReplica.size;
  if (listIndex < 0 || targetEndIndex < listIndex || listIndex > crListReplica.size)
    throw new CRListError("INDEX_OUT_OF_BOUNDS");
  const deleteCount = Math.min(targetEndIndex, crListReplica.size) - listIndex;
  if (deleteCount <= 0) return false;
  void walkToIndex(listIndex, crListReplica);
  if (!crListReplica.cursor) return false;
  let current = crListReplica.cursor;
  let deleted = 0;
  while (current && deleted < deleteCount) {
    const next = current.next;
    change[current.index] = void 0;
    void deleteLinkedEntry(crListReplica, current, delta);
    current = next;
    deleted++;
  }
  crListReplica.size = crListReplica.parentMap.size;
  while (current) {
    current.index -= deleted;
    current = current.next;
  }
  return { change, delta };
}
function __merge(crListReplica, crListDelta) {
  if (!crListDelta || prototype(crListDelta) !== "record") return false;
  const newVals = [];
  const newTombsIndices = [];
  const change = {};
  let needsRelink = false;
  if (Object.hasOwn(crListDelta, "tombstones") && Array.isArray(crListDelta.tombstones)) {
    for (const tombstone of crListDelta.tombstones) {
      if (crListReplica.tombstones.has(tombstone) || !isUuidV7(tombstone))
        continue;
      crListReplica.tombstones.add(tombstone);
      const linkedListEntry = crListReplica.parentMap.get(tombstone);
      if (linkedListEntry) {
        void newTombsIndices.push(linkedListEntry.index);
        void deleteLinkedEntry(crListReplica, linkedListEntry);
        needsRelink = true;
      }
    }
  }
  if (!Object.hasOwn(crListDelta, "values") || !Array.isArray(crListDelta.values)) {
    if (newTombsIndices.length === 0) return false;
    void assertListIndices(crListReplica);
    for (const index of newTombsIndices) {
      change[index] = void 0;
    }
    return change;
  }
  for (const valueEntry of crListDelta.values) {
    if (valueEntry === null || valueEntry === void 0) continue;
    const existingEntry = crListReplica.parentMap.get(valueEntry.uuidv7);
    if (existingEntry) {
      if (crListReplica.tombstones.has(valueEntry.uuidv7) || !isUuidV7(valueEntry.predecessor) && valueEntry.predecessor !== "\0")
        continue;
      if (existingEntry.predecessor >= valueEntry.predecessor) continue;
      void moveEntryToPredecessor(
        crListReplica,
        existingEntry,
        valueEntry.predecessor
      );
      needsRelink = true;
      continue;
    }
    const linkedListEntry = transformSnapshotEntryToStateEntry(
      valueEntry,
      crListReplica
    );
    if (!linkedListEntry) continue;
    const predecessor = linkedListEntry.predecessor === "\0" ? void 0 : crListReplica.parentMap.get(linkedListEntry.predecessor);
    void updateEntryToMaps(crListReplica, linkedListEntry);
    void newVals.push(linkedListEntry);
    if (!needsRelink && linkedListEntry.predecessor === "\0") {
      if (crListReplica.size === 0) {
        crListReplica.cursor = linkedListEntry;
        crListReplica.size = crListReplica.parentMap.size;
      } else {
        needsRelink = true;
      }
    } else if (!needsRelink && predecessor && !predecessor.next) {
      linkedListEntry.prev = predecessor;
      linkedListEntry.index = predecessor.index + 1;
      predecessor.next = linkedListEntry;
      crListReplica.cursor = linkedListEntry;
      crListReplica.size = crListReplica.parentMap.size;
    } else {
      needsRelink = true;
    }
  }
  if (needsRelink) {
    void flattenAndLinkTrustedState(crListReplica);
    void assertListIndices(crListReplica);
  }
  if (newTombsIndices.length === 0 && newVals.length === 0) return false;
  for (const index of newTombsIndices) {
    change[index] = void 0;
  }
  for (const val of newVals) {
    change[val.index] = structuredClone(val.value);
  }
  return change;
}
function __acknowledge(crListReplica) {
  let largest = false;
  crListReplica.tombstones.forEach((tombstone) => {
    if (largest === false || largest < tombstone) largest = tombstone;
  });
  if (typeof largest === "string") return largest;
  return false;
}
function __garbageCollect(frontiers, crListReplica) {
  if (!Array.isArray(frontiers)) return;
  frontiers.sort();
  const smallest = frontiers.find((frontier) => isUuidV7(frontier));
  if (typeof smallest !== "string") return;
  crListReplica.tombstones.forEach((tombstone, __, tombstones) => {
    if (tombstone <= smallest) {
      tombstones.delete(tombstone);
    }
  });
}
function __snapshot(crListReplica) {
  return {
    values: Array.from(crListReplica.parentMap.values()).map(
      (linkedListEntry) => {
        if (!linkedListEntry) throw new CRListError("LIST_INTEGRITY_VIOLATION");
        return {
          uuidv7: linkedListEntry.uuidv7,
          value: structuredClone(linkedListEntry.value),
          predecessor: linkedListEntry.predecessor
        };
      }
    ),
    tombstones: Array.from(crListReplica.tombstones)
  };
}
var CRList = class {
  /**
   * Creates a replicated list from an optional detached structured-clone-compatible snapshot.
   *
   * @param snapshot - A previously emitted CRList snapshot.
   */
  constructor(snapshot2) {
    Object.defineProperties(this, {
      state: {
        value: __create(snapshot2),
        enumerable: false,
        configurable: false,
        writable: false
      },
      eventTarget: {
        value: new EventTarget(),
        enumerable: false,
        configurable: false,
        writable: false
      }
    });
    return new Proxy(this, {
      get(target, index, receiver) {
        const listIndex = indexFromPropertyKey(index);
        if (listIndex === void 0) return Reflect.get(target, index, receiver);
        return __read(listIndex, target.state);
      },
      has(target, index) {
        const listIndex = indexFromPropertyKey(index);
        if (listIndex === void 0) return Reflect.has(target, index);
        return listIndex >= 0 && listIndex < target.state.size;
      },
      set(target, index, value) {
        const listIndex = indexFromPropertyKey(index);
        if (listIndex === void 0) return false;
        try {
          const result = __update(listIndex, [value], target.state, "overwrite");
          if (!result) return false;
          const { delta, change } = result;
          if (delta)
            void target.eventTarget.dispatchEvent(
              new CustomEvent("delta", { detail: delta })
            );
          if (change)
            void target.eventTarget.dispatchEvent(
              new CustomEvent("change", { detail: change })
            );
          return true;
        } catch (error) {
          if (error instanceof CRListError) throw error;
          return false;
        }
      },
      deleteProperty(target, index) {
        const listIndex = indexFromPropertyKey(index);
        if (listIndex === void 0) return false;
        try {
          const result = __delete(target.state, listIndex, listIndex + 1);
          if (!result) return false;
          const { delta, change } = result;
          if (delta) {
            void target.eventTarget.dispatchEvent(
              new CustomEvent("delta", { detail: delta })
            );
          }
          if (change) {
            void target.eventTarget.dispatchEvent(
              new CustomEvent("change", { detail: change })
            );
          }
          return true;
        } catch (error) {
          if (error instanceof CRListError) throw error;
          return false;
        }
      },
      ownKeys(target) {
        return [
          ...Reflect.ownKeys(target),
          ...Array.from({ length: target.size }, (_, index) => String(index))
        ];
      },
      getOwnPropertyDescriptor(target, index) {
        const listIndex = indexFromPropertyKey(index);
        if (listIndex !== void 0 && listIndex < target.size) {
          return {
            value: __read(listIndex, target.state),
            writable: true,
            enumerable: true,
            configurable: true
          };
        }
        return Reflect.getOwnPropertyDescriptor(target, index);
      }
    });
  }
  /**
   * The current number of live entries.
   */
  get size() {
    return this.state.size;
  }
  /**
   * Inserts a value before an index.
   *
   * If `beforeIndex` is omitted, the value is inserted at the start of the list.
   *
   * @param value - The value to insert.
   * @param beforeIndex - The index to insert before.
   */
  prepend(value, beforeIndex) {
    const result = __update(beforeIndex ?? 0, [value], this.state, "before");
    if (!result) return;
    const { delta, change } = result;
    if (delta)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("delta", { detail: delta })
      );
    if (change)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("change", { detail: change })
      );
  }
  /**
   * Inserts a value after an index.
   *
   * If `afterIndex` is omitted, the value is appended at the end of the list.
   *
   * @param value - The value to insert.
   * @param afterIndex - The index to insert after.
   */
  append(value, afterIndex) {
    const result = __update(
      afterIndex ?? this.state.size,
      [value],
      this.state,
      "after"
    );
    if (!result) return;
    const { delta, change } = result;
    if (delta)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("delta", { detail: delta })
      );
    if (change)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("change", { detail: change })
      );
  }
  /**
   * Removes the entry at an index.
   *
   * @param index - The index to remove.
   */
  remove(index) {
    const result = __delete(this.state, index, index + 1);
    if (!result) return;
    const { delta, change } = result;
    if (delta)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("delta", { detail: delta })
      );
    if (change)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("change", { detail: change })
      );
  }
  /**
   * Applies a remote gossip delta to this list.
   *
   * Emits a `change` event when the merge changes the live projection.
   *
   * @param delta - The remote CRList delta to merge.
   */
  merge(delta) {
    const change = __merge(this.state, delta);
    if (change)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("change", { detail: change })
      );
  }
  /**
   * Emits an acknowledgement frontier for currently retained tombstones.
   */
  acknowledge() {
    const ack = __acknowledge(this.state);
    if (ack)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("ack", { detail: ack })
      );
  }
  /**
   * Garbage-collects tombstones that are covered by acknowledgement frontiers.
   *
   * @param frontiers - Replica acknowledgement frontiers.
   */
  garbageCollect(frontiers) {
    void __garbageCollect(frontiers, this.state);
  }
  /**
   * Emits the current detached structured-clone-compatible list snapshot.
   */
  snapshot() {
    const snapshot2 = __snapshot(this.state);
    if (snapshot2)
      void this.eventTarget.dispatchEvent(
        new CustomEvent("snapshot", { detail: snapshot2 })
      );
  }
  /**
   * Registers an event listener.
   *
   * @param type - The event type to listen for.
   * @param listener - The listener to register.
   * @param options - Listener registration options.
   */
  addEventListener(type, listener, options) {
    this.eventTarget.addEventListener(
      type,
      listener,
      options
    );
  }
  /**
   * Removes an event listener.
   *
   * @param type - The event type to stop listening for.
   * @param listener - The listener to remove.
   * @param options - Listener removal options.
   */
  removeEventListener(type, listener, options) {
    this.eventTarget.removeEventListener(
      type,
      listener,
      options
    );
  }
  /**
   * Returns a detached structured-clone-compatible snapshot of this list.
   *
   * Called automatically by `JSON.stringify`.
   */
  toJSON() {
    return __snapshot(this.state);
  }
  /**
   * Attempts to return this list snapshot as a JSON string.
   *
   * This can fail when list values are not JSON-compatible.
   */
  toString() {
    return JSON.stringify(this);
  }
  /**
   * Returns the Node.js console inspection representation.
   */
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON();
  }
  /**
   * Returns the Deno console inspection representation.
   */
  [/* @__PURE__ */ Symbol.for("Deno.customInspect")]() {
    return this.toJSON();
  }
  /**
   * Iterates over detached copies of the current live values in index order.
   */
  *[Symbol.iterator]() {
    for (let index = 0; index < this.size; index++) {
      const value = this[index];
      yield value;
    }
  }
  /**
   * Calls a function once for each live value copy in index order.
   *
   * Callback values are detached copies, so mutating them does not mutate the
   * list.
   *
   * @param callback - Function to call for each value copy.
   * @param thisArg - Optional `this` value for the callback.
   */
  forEach(callback, thisArg) {
    for (let index = 0; index < this.size; index++) {
      callback.call(thisArg, this[index], index, this);
    }
  }
};

// node_modules/@sovereignbase/offline-kv-store/dist/index.js
var KVStoreError = class extends Error {
  /**
   * The machine-readable error code.
   */
  code;
  /**
   * Creates a new `KVStoreError`.
   *
   * @param code The machine-readable error code.
   * @param message A human-readable detail message.
   */
  constructor(code, message) {
    const detail = message ?? code;
    super(`{@sovereignbase/offline-kv-store} ${detail}`);
    this.code = code;
    this.name = "KVStoreError";
  }
};
function isKey(value, label) {
  if (typeof value !== "string" || value.length <= 0) {
    throw new KVStoreError(
      "NAME_WAS_INVALID",
      `${label} must be a non-empty string`
    );
  }
}
var DB_NAME = "offline-kv-store";
var dbRef = null;
var dbPromise = null;
var ensureStoreChain = Promise.resolve();
function cacheDB(db) {
  db.onversionchange = () => {
    if (dbRef === db) {
      dbRef = null;
      dbPromise = null;
    }
    db.close();
  };
  dbRef = db;
  dbPromise = Promise.resolve(db);
  return db;
}
function openDB(version2, onUpgrade) {
  return new Promise((resolve, reject) => {
    const request = version2 === void 0 ? indexedDB.open(DB_NAME) : indexedDB.open(DB_NAME, version2);
    request.onupgradeneeded = () => {
      onUpgrade?.(request.result);
    };
    request.onsuccess = () => resolve(cacheDB(request.result));
    request.onerror = () => reject(new KVStoreError("DATABASE_OPEN_FAILED", request.error?.message));
    request.onblocked = (event) => reject(
      new KVStoreError(
        "DATABASE_OPEN_BLOCKED",
        `IndexedDB open blocked for "${DB_NAME}" (oldVersion=${event.oldVersion}, newVersion=${event.newVersion})`
      )
    );
  });
}
function closeDB() {
  if (dbRef) dbRef.close();
  dbRef = null;
  dbPromise = null;
}
async function resolveDB() {
  if (dbRef) return dbRef;
  if (!dbPromise) {
    dbPromise = openDB().catch((error) => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}
function assertStore(storeName) {
  const task = ensureStoreChain.then(async () => {
    const db = await resolveDB();
    if (db.objectStoreNames.contains(storeName)) return;
    const nextVersion = db.version + 1;
    closeDB();
    await openDB(nextVersion, (upgradeDb) => {
      if (!upgradeDb.objectStoreNames.contains(storeName)) {
        upgradeDb.createObjectStore(storeName, { keyPath: "key" });
      }
    });
  });
  ensureStoreChain = task.catch(() => {
  });
  return task;
}
var KVStore = class {
  /**
   * The namespace backing this store instance.
   */
  namespace;
  /**
   * A promise that fulfills after the namespace store is available.
   */
  ready;
  /**
   * Creates a new `KVStore` bound to the given namespace.
   *
   * @param namespace The object store name backing the instance.
   */
  constructor(namespace) {
    isKey(namespace, "namespace");
    this.namespace = namespace;
    this.ready = assertStore(namespace);
  }
  /**
   * Returns the value associated with the given key.
   *
   * @param key The key to look up.
   * @returns A promise that fulfills with the stored value, if any.
   */
  async get(key) {
    isKey(key, "key");
    await this.ready;
    const db = await resolveDB();
    const row = await new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(this.namespace, "readonly");
        const store = tx.objectStore(this.namespace);
        const request = store.get(key);
        tx.oncomplete = () => resolve(request.result);
        tx.onerror = () => reject(
          new KVStoreError("INDEXED_DB_TRANSACTION_FAILED", tx.error?.message)
        );
        tx.onabort = () => reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_ABORTED",
            tx.error?.message
          )
        );
      } catch (error) {
        reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_FAILED",
            error instanceof Error ? error.message : void 0
          )
        );
      }
    });
    return row?.value ?? void 0;
  }
  /**
   * Returns whether the given key exists.
   *
   * @param key The key to look up.
   * @returns A promise that fulfills with `true` if the key exists.
   */
  async has(key) {
    isKey(key, "key");
    await this.ready;
    const db = await resolveDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(this.namespace, "readonly");
        const store = tx.objectStore(this.namespace);
        const request = typeof store.getKey === "function" ? store.getKey(key) : store.get(key);
        tx.oncomplete = () => resolve(request.result !== void 0);
        tx.onerror = () => reject(
          new KVStoreError("INDEXED_DB_TRANSACTION_FAILED", tx.error?.message)
        );
        tx.onabort = () => reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_ABORTED",
            tx.error?.message
          )
        );
      } catch (error) {
        reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_FAILED",
            error instanceof Error ? error.message : void 0
          )
        );
      }
    });
  }
  /**
   * Stores a value for the given key.
   *
   * @param key The key to write.
   * @param value The value to associate with `key`.
   * @returns A promise that fulfills when the write completes.
   */
  async put(key, value) {
    isKey(key, "key");
    await this.ready;
    const db = await resolveDB();
    await new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(this.namespace, "readwrite");
        const store = tx.objectStore(this.namespace);
        const row = { key, value };
        store.put(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(
          new KVStoreError("INDEXED_DB_TRANSACTION_FAILED", tx.error?.message)
        );
        tx.onabort = () => reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_ABORTED",
            tx.error?.message
          )
        );
      } catch (error) {
        reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_FAILED",
            error instanceof Error ? error.message : void 0
          )
        );
      }
    });
  }
  /**
   * Deletes the value associated with the given key.
   *
   * @param key The key to delete.
   * @returns A promise that fulfills when the deletion completes.
   */
  async delete(key) {
    isKey(key, "key");
    await this.ready;
    const db = await resolveDB();
    await new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(this.namespace, "readwrite");
        const store = tx.objectStore(this.namespace);
        store.delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(
          new KVStoreError("INDEXED_DB_TRANSACTION_FAILED", tx.error?.message)
        );
        tx.onabort = () => reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_ABORTED",
            tx.error?.message
          )
        );
      } catch (error) {
        reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_FAILED",
            error instanceof Error ? error.message : void 0
          )
        );
      }
    });
  }
  /**
   * Deletes every value stored in the namespace.
   *
   * @returns A promise that fulfills when the namespace is cleared.
   */
  async clear() {
    await this.ready;
    const db = await resolveDB();
    await new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(this.namespace, "readwrite");
        const store = tx.objectStore(this.namespace);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(
          new KVStoreError("INDEXED_DB_TRANSACTION_FAILED", tx.error?.message)
        );
        tx.onabort = () => reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_ABORTED",
            tx.error?.message
          )
        );
      } catch (error) {
        reject(
          new KVStoreError(
            "INDEXED_DB_TRANSACTION_FAILED",
            error instanceof Error ? error.message : void 0
          )
        );
      }
    });
  }
};

// node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs
function utf8Count(str) {
  const strLength = str.length;
  let byteLength = 0;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      byteLength++;
      continue;
    } else if ((value & 4294965248) === 0) {
      byteLength += 2;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        byteLength += 3;
      } else {
        byteLength += 4;
      }
    }
  }
  return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
  const strLength = str.length;
  let offset = outputOffset;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      output[offset++] = value;
      continue;
    } else if ((value & 4294965248) === 0) {
      output[offset++] = value >> 6 & 31 | 192;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        output[offset++] = value >> 12 & 15 | 224;
        output[offset++] = value >> 6 & 63 | 128;
      } else {
        output[offset++] = value >> 18 & 7 | 240;
        output[offset++] = value >> 12 & 63 | 128;
        output[offset++] = value >> 6 & 63 | 128;
      }
    }
    output[offset++] = value & 63 | 128;
  }
}
var sharedTextEncoder = new TextEncoder();
var TEXT_ENCODER_THRESHOLD = 50;
function utf8EncodeTE(str, output, outputOffset) {
  sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8Encode(str, output, outputOffset) {
  if (str.length > TEXT_ENCODER_THRESHOLD) {
    utf8EncodeTE(str, output, outputOffset);
  } else {
    utf8EncodeJs(str, output, outputOffset);
  }
}
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
  let offset = inputOffset;
  const end = offset + byteLength;
  const units = [];
  let result = "";
  while (offset < end) {
    const byte1 = bytes[offset++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      const byte4 = bytes[offset++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode(...units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += String.fromCharCode(...units);
  }
  return result;
}
var sharedTextDecoder = new TextDecoder();
var TEXT_DECODER_THRESHOLD = 200;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
  const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
  if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}

// node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs
var ExtData = class {
  type;
  data;
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs
var DecodeError = class _DecodeError extends Error {
  constructor(message) {
    super(message);
    const proto = Object.create(_DecodeError.prototype);
    Object.setPrototypeOf(this, proto);
    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: _DecodeError.name
    });
  }
};

// node_modules/@msgpack/msgpack/dist.esm/utils/int.mjs
var UINT32_MAX = 4294967295;
function setUint64(view, offset, value) {
  const high = value / 4294967296;
  const low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
  const high = Math.floor(value / 4294967296);
  const low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
  const high = view.getInt32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
function getUint64(view, offset) {
  const high = view.getUint32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}

// node_modules/@msgpack/msgpack/dist.esm/timestamp.mjs
var EXT_TIMESTAMP = -1;
var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
function encodeTimeSpecToTimestamp({ sec, nsec }) {
  if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
    if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
      const rv = new Uint8Array(4);
      const view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
    } else {
      const secHigh = sec / 4294967296;
      const secLow = sec & 4294967295;
      const rv = new Uint8Array(8);
      const view = new DataView(rv.buffer);
      view.setUint32(0, nsec << 2 | secHigh & 3);
      view.setUint32(4, secLow);
      return rv;
    }
  } else {
    const rv = new Uint8Array(12);
    const view = new DataView(rv.buffer);
    view.setUint32(0, nsec);
    setInt64(view, 4, sec);
    return rv;
  }
}
function encodeDateToTimeSpec(date) {
  const msec = date.getTime();
  const sec = Math.floor(msec / 1e3);
  const nsec = (msec - sec * 1e3) * 1e6;
  const nsecInSec = Math.floor(nsec / 1e9);
  return {
    sec: sec + nsecInSec,
    nsec: nsec - nsecInSec * 1e9
  };
}
function encodeTimestampExtension(object) {
  if (object instanceof Date) {
    const timeSpec = encodeDateToTimeSpec(object);
    return encodeTimeSpecToTimestamp(timeSpec);
  } else {
    return null;
  }
}
function decodeTimestampToTimeSpec(data) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  switch (data.byteLength) {
    case 4: {
      const sec = view.getUint32(0);
      const nsec = 0;
      return { sec, nsec };
    }
    case 8: {
      const nsec30AndSecHigh2 = view.getUint32(0);
      const secLow32 = view.getUint32(4);
      const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
      const nsec = nsec30AndSecHigh2 >>> 2;
      return { sec, nsec };
    }
    case 12: {
      const sec = getInt64(view, 4);
      const nsec = view.getUint32(0);
      return { sec, nsec };
    }
    default:
      throw new DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
  }
}
function decodeTimestampExtension(data) {
  const timeSpec = decodeTimestampToTimeSpec(data);
  return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
  type: EXT_TIMESTAMP,
  encode: encodeTimestampExtension,
  decode: decodeTimestampExtension
};

// node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs
var ExtensionCodec = class _ExtensionCodec {
  static defaultCodec = new _ExtensionCodec();
  // ensures ExtensionCodecType<X> matches ExtensionCodec<X>
  // this will make type errors a lot more clear
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __brand;
  // built-in extensions
  builtInEncoders = [];
  builtInDecoders = [];
  // custom extensions
  encoders = [];
  decoders = [];
  constructor() {
    this.register(timestampExtension);
  }
  register({ type, encode: encode3, decode: decode2 }) {
    if (type >= 0) {
      this.encoders[type] = encode3;
      this.decoders[type] = decode2;
    } else {
      const index = -1 - type;
      this.builtInEncoders[index] = encode3;
      this.builtInDecoders[index] = decode2;
    }
  }
  tryToEncode(object, context) {
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const encodeExt = this.builtInEncoders[i];
      if (encodeExt != null) {
        const data = encodeExt(object, context);
        if (data != null) {
          const type = -1 - i;
          return new ExtData(type, data);
        }
      }
    }
    for (let i = 0; i < this.encoders.length; i++) {
      const encodeExt = this.encoders[i];
      if (encodeExt != null) {
        const data = encodeExt(object, context);
        if (data != null) {
          const type = i;
          return new ExtData(type, data);
        }
      }
    }
    if (object instanceof ExtData) {
      return object;
    }
    return null;
  }
  decode(data, type, context) {
    const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decodeExt) {
      return decodeExt(data, type, context);
    } else {
      return new ExtData(type, data);
    }
  }
};

// node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs
function isArrayBufferLike(buffer) {
  return buffer instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer;
}
function ensureUint8Array(buffer) {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer)) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else if (isArrayBufferLike(buffer)) {
    return new Uint8Array(buffer);
  } else {
    return Uint8Array.from(buffer);
  }
}

// node_modules/@msgpack/msgpack/dist.esm/Encoder.mjs
var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = class _Encoder {
  extensionCodec;
  context;
  useBigInt64;
  maxDepth;
  initialBufferSize;
  sortKeys;
  forceFloat32;
  ignoreUndefined;
  forceIntegerToFloat;
  pos;
  view;
  bytes;
  entered = false;
  constructor(options) {
    this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
    this.context = options?.context;
    this.useBigInt64 = options?.useBigInt64 ?? false;
    this.maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH;
    this.initialBufferSize = options?.initialBufferSize ?? DEFAULT_INITIAL_BUFFER_SIZE;
    this.sortKeys = options?.sortKeys ?? false;
    this.forceFloat32 = options?.forceFloat32 ?? false;
    this.ignoreUndefined = options?.ignoreUndefined ?? false;
    this.forceIntegerToFloat = options?.forceIntegerToFloat ?? false;
    this.pos = 0;
    this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
    this.bytes = new Uint8Array(this.view.buffer);
  }
  clone() {
    return new _Encoder({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      maxDepth: this.maxDepth,
      initialBufferSize: this.initialBufferSize,
      sortKeys: this.sortKeys,
      forceFloat32: this.forceFloat32,
      ignoreUndefined: this.ignoreUndefined,
      forceIntegerToFloat: this.forceIntegerToFloat
    });
  }
  reinitializeState() {
    this.pos = 0;
  }
  /**
   * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
   *
   * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
   */
  encodeSharedRef(object) {
    if (this.entered) {
      const instance = this.clone();
      return instance.encodeSharedRef(object);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.doEncode(object, 1);
      return this.bytes.subarray(0, this.pos);
    } finally {
      this.entered = false;
    }
  }
  /**
   * @returns Encodes the object and returns a copy of the encoder's internal buffer.
   */
  encode(object) {
    if (this.entered) {
      const instance = this.clone();
      return instance.encode(object);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.doEncode(object, 1);
      return this.bytes.slice(0, this.pos);
    } finally {
      this.entered = false;
    }
  }
  doEncode(object, depth) {
    if (depth > this.maxDepth) {
      throw new Error(`Too deep objects in depth ${depth}`);
    }
    if (object == null) {
      this.encodeNil();
    } else if (typeof object === "boolean") {
      this.encodeBoolean(object);
    } else if (typeof object === "number") {
      if (!this.forceIntegerToFloat) {
        this.encodeNumber(object);
      } else {
        this.encodeNumberAsFloat(object);
      }
    } else if (typeof object === "string") {
      this.encodeString(object);
    } else if (this.useBigInt64 && typeof object === "bigint") {
      this.encodeBigInt64(object);
    } else {
      this.encodeObject(object, depth);
    }
  }
  ensureBufferSizeToWrite(sizeToWrite) {
    const requiredSize = this.pos + sizeToWrite;
    if (this.view.byteLength < requiredSize) {
      this.resizeBuffer(requiredSize * 2);
    }
  }
  resizeBuffer(newSize) {
    const newBuffer = new ArrayBuffer(newSize);
    const newBytes = new Uint8Array(newBuffer);
    const newView = new DataView(newBuffer);
    newBytes.set(this.bytes);
    this.view = newView;
    this.bytes = newBytes;
  }
  encodeNil() {
    this.writeU8(192);
  }
  encodeBoolean(object) {
    if (object === false) {
      this.writeU8(194);
    } else {
      this.writeU8(195);
    }
  }
  encodeNumber(object) {
    if (!this.forceIntegerToFloat && Number.isSafeInteger(object)) {
      if (object >= 0) {
        if (object < 128) {
          this.writeU8(object);
        } else if (object < 256) {
          this.writeU8(204);
          this.writeU8(object);
        } else if (object < 65536) {
          this.writeU8(205);
          this.writeU16(object);
        } else if (object < 4294967296) {
          this.writeU8(206);
          this.writeU32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(207);
          this.writeU64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      } else {
        if (object >= -32) {
          this.writeU8(224 | object + 32);
        } else if (object >= -128) {
          this.writeU8(208);
          this.writeI8(object);
        } else if (object >= -32768) {
          this.writeU8(209);
          this.writeI16(object);
        } else if (object >= -2147483648) {
          this.writeU8(210);
          this.writeI32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(211);
          this.writeI64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      }
    } else {
      this.encodeNumberAsFloat(object);
    }
  }
  encodeNumberAsFloat(object) {
    if (this.forceFloat32) {
      this.writeU8(202);
      this.writeF32(object);
    } else {
      this.writeU8(203);
      this.writeF64(object);
    }
  }
  encodeBigInt64(object) {
    if (object >= BigInt(0)) {
      this.writeU8(207);
      this.writeBigUint64(object);
    } else {
      this.writeU8(211);
      this.writeBigInt64(object);
    }
  }
  writeStringHeader(byteLength) {
    if (byteLength < 32) {
      this.writeU8(160 + byteLength);
    } else if (byteLength < 256) {
      this.writeU8(217);
      this.writeU8(byteLength);
    } else if (byteLength < 65536) {
      this.writeU8(218);
      this.writeU16(byteLength);
    } else if (byteLength < 4294967296) {
      this.writeU8(219);
      this.writeU32(byteLength);
    } else {
      throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
    }
  }
  encodeString(object) {
    const maxHeaderSize = 1 + 4;
    const byteLength = utf8Count(object);
    this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
    this.writeStringHeader(byteLength);
    utf8Encode(object, this.bytes, this.pos);
    this.pos += byteLength;
  }
  encodeObject(object, depth) {
    const ext = this.extensionCodec.tryToEncode(object, this.context);
    if (ext != null) {
      this.encodeExtension(ext);
    } else if (Array.isArray(object)) {
      this.encodeArray(object, depth);
    } else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(object);
    } else if (typeof object === "object") {
      this.encodeMap(object, depth);
    } else {
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
    }
  }
  encodeBinary(object) {
    const size = object.byteLength;
    if (size < 256) {
      this.writeU8(196);
      this.writeU8(size);
    } else if (size < 65536) {
      this.writeU8(197);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(198);
      this.writeU32(size);
    } else {
      throw new Error(`Too large binary: ${size}`);
    }
    const bytes = ensureUint8Array(object);
    this.writeU8a(bytes);
  }
  encodeArray(object, depth) {
    const size = object.length;
    if (size < 16) {
      this.writeU8(144 + size);
    } else if (size < 65536) {
      this.writeU8(220);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(221);
      this.writeU32(size);
    } else {
      throw new Error(`Too large array: ${size}`);
    }
    for (const item of object) {
      this.doEncode(item, depth + 1);
    }
  }
  countWithoutUndefined(object, keys) {
    let count = 0;
    for (const key of keys) {
      if (object[key] !== void 0) {
        count++;
      }
    }
    return count;
  }
  encodeMap(object, depth) {
    const keys = Object.keys(object);
    if (this.sortKeys) {
      keys.sort();
    }
    const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
    if (size < 16) {
      this.writeU8(128 + size);
    } else if (size < 65536) {
      this.writeU8(222);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(223);
      this.writeU32(size);
    } else {
      throw new Error(`Too large map object: ${size}`);
    }
    for (const key of keys) {
      const value = object[key];
      if (!(this.ignoreUndefined && value === void 0)) {
        this.encodeString(key);
        this.doEncode(value, depth + 1);
      }
    }
  }
  encodeExtension(ext) {
    if (typeof ext.data === "function") {
      const data = ext.data(this.pos + 6);
      const size2 = data.length;
      if (size2 >= 4294967296) {
        throw new Error(`Too large extension object: ${size2}`);
      }
      this.writeU8(201);
      this.writeU32(size2);
      this.writeI8(ext.type);
      this.writeU8a(data);
      return;
    }
    const size = ext.data.length;
    if (size === 1) {
      this.writeU8(212);
    } else if (size === 2) {
      this.writeU8(213);
    } else if (size === 4) {
      this.writeU8(214);
    } else if (size === 8) {
      this.writeU8(215);
    } else if (size === 16) {
      this.writeU8(216);
    } else if (size < 256) {
      this.writeU8(199);
      this.writeU8(size);
    } else if (size < 65536) {
      this.writeU8(200);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(201);
      this.writeU32(size);
    } else {
      throw new Error(`Too large extension object: ${size}`);
    }
    this.writeI8(ext.type);
    this.writeU8a(ext.data);
  }
  writeU8(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setUint8(this.pos, value);
    this.pos++;
  }
  writeU8a(values) {
    const size = values.length;
    this.ensureBufferSizeToWrite(size);
    this.bytes.set(values, this.pos);
    this.pos += size;
  }
  writeI8(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setInt8(this.pos, value);
    this.pos++;
  }
  writeU16(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setUint16(this.pos, value);
    this.pos += 2;
  }
  writeI16(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setInt16(this.pos, value);
    this.pos += 2;
  }
  writeU32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setUint32(this.pos, value);
    this.pos += 4;
  }
  writeI32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setInt32(this.pos, value);
    this.pos += 4;
  }
  writeF32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setFloat32(this.pos, value);
    this.pos += 4;
  }
  writeF64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setFloat64(this.pos, value);
    this.pos += 8;
  }
  writeU64(value) {
    this.ensureBufferSizeToWrite(8);
    setUint64(this.view, this.pos, value);
    this.pos += 8;
  }
  writeI64(value) {
    this.ensureBufferSizeToWrite(8);
    setInt64(this.view, this.pos, value);
    this.pos += 8;
  }
  writeBigUint64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigUint64(this.pos, value);
    this.pos += 8;
  }
  writeBigInt64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigInt64(this.pos, value);
    this.pos += 8;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/encode.mjs
function encode2(value, options) {
  const encoder = new Encoder(options);
  return encoder.encodeSharedRef(value);
}

// node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs
function prettyByte(byte) {
  return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
}

// node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = class {
  hit = 0;
  miss = 0;
  caches;
  maxKeyLength;
  maxLengthPerKey;
  constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
    this.maxKeyLength = maxKeyLength;
    this.maxLengthPerKey = maxLengthPerKey;
    this.caches = [];
    for (let i = 0; i < this.maxKeyLength; i++) {
      this.caches.push([]);
    }
  }
  canBeCached(byteLength) {
    return byteLength > 0 && byteLength <= this.maxKeyLength;
  }
  find(bytes, inputOffset, byteLength) {
    const records = this.caches[byteLength - 1];
    FIND_CHUNK: for (const record of records) {
      const recordBytes = record.bytes;
      for (let j = 0; j < byteLength; j++) {
        if (recordBytes[j] !== bytes[inputOffset + j]) {
          continue FIND_CHUNK;
        }
      }
      return record.str;
    }
    return null;
  }
  store(bytes, value) {
    const records = this.caches[bytes.length - 1];
    const record = { bytes, str: value };
    if (records.length >= this.maxLengthPerKey) {
      records[Math.random() * records.length | 0] = record;
    } else {
      records.push(record);
    }
  }
  decode(bytes, inputOffset, byteLength) {
    const cachedValue = this.find(bytes, inputOffset, byteLength);
    if (cachedValue != null) {
      this.hit++;
      return cachedValue;
    }
    this.miss++;
    const str = utf8DecodeJs(bytes, inputOffset, byteLength);
    const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
    this.store(slicedCopyOfBytes, str);
    return str;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs
var STATE_ARRAY = "array";
var STATE_MAP_KEY = "map_key";
var STATE_MAP_VALUE = "map_value";
var mapKeyConverter = (key) => {
  if (typeof key === "string" || typeof key === "number") {
    return key;
  }
  throw new DecodeError("The type of key must be string or number but " + typeof key);
};
var StackPool = class {
  stack = [];
  stackHeadPosition = -1;
  get length() {
    return this.stackHeadPosition + 1;
  }
  top() {
    return this.stack[this.stackHeadPosition];
  }
  pushArrayState(size) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_ARRAY;
    state.position = 0;
    state.size = size;
    state.array = new Array(size);
  }
  pushMapState(size) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_MAP_KEY;
    state.readCount = 0;
    state.size = size;
    state.map = {};
  }
  getUninitializedStateFromPool() {
    this.stackHeadPosition++;
    if (this.stackHeadPosition === this.stack.length) {
      const partialState = {
        type: void 0,
        size: 0,
        array: void 0,
        position: 0,
        readCount: 0,
        map: void 0,
        key: null
      };
      this.stack.push(partialState);
    }
    return this.stack[this.stackHeadPosition];
  }
  release(state) {
    const topStackState = this.stack[this.stackHeadPosition];
    if (topStackState !== state) {
      throw new Error("Invalid stack state. Released state is not on top of the stack.");
    }
    if (state.type === STATE_ARRAY) {
      const partialState = state;
      partialState.size = 0;
      partialState.array = void 0;
      partialState.position = 0;
      partialState.type = void 0;
    }
    if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
      const partialState = state;
      partialState.size = 0;
      partialState.map = void 0;
      partialState.readCount = 0;
      partialState.type = void 0;
    }
    this.stackHeadPosition--;
  }
  reset() {
    this.stack.length = 0;
    this.stackHeadPosition = -1;
  }
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
  EMPTY_VIEW.getInt8(0);
} catch (e2) {
  if (!(e2 instanceof RangeError)) {
    throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
  }
}
var MORE_DATA = new RangeError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder = class _Decoder {
  extensionCodec;
  context;
  useBigInt64;
  rawStrings;
  maxStrLength;
  maxBinLength;
  maxArrayLength;
  maxMapLength;
  maxExtLength;
  keyDecoder;
  mapKeyConverter;
  totalPos = 0;
  pos = 0;
  view = EMPTY_VIEW;
  bytes = EMPTY_BYTES;
  headByte = HEAD_BYTE_REQUIRED;
  stack = new StackPool();
  entered = false;
  constructor(options) {
    this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
    this.context = options?.context;
    this.useBigInt64 = options?.useBigInt64 ?? false;
    this.rawStrings = options?.rawStrings ?? false;
    this.maxStrLength = options?.maxStrLength ?? UINT32_MAX;
    this.maxBinLength = options?.maxBinLength ?? UINT32_MAX;
    this.maxArrayLength = options?.maxArrayLength ?? UINT32_MAX;
    this.maxMapLength = options?.maxMapLength ?? UINT32_MAX;
    this.maxExtLength = options?.maxExtLength ?? UINT32_MAX;
    this.keyDecoder = options?.keyDecoder !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
    this.mapKeyConverter = options?.mapKeyConverter ?? mapKeyConverter;
  }
  clone() {
    return new _Decoder({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      rawStrings: this.rawStrings,
      maxStrLength: this.maxStrLength,
      maxBinLength: this.maxBinLength,
      maxArrayLength: this.maxArrayLength,
      maxMapLength: this.maxMapLength,
      maxExtLength: this.maxExtLength,
      keyDecoder: this.keyDecoder
    });
  }
  reinitializeState() {
    this.totalPos = 0;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack.reset();
  }
  setBuffer(buffer) {
    const bytes = ensureUint8Array(buffer);
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.pos = 0;
  }
  appendBuffer(buffer) {
    if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
      this.setBuffer(buffer);
    } else {
      const remainingData = this.bytes.subarray(this.pos);
      const newData = ensureUint8Array(buffer);
      const newBuffer = new Uint8Array(remainingData.length + newData.length);
      newBuffer.set(remainingData);
      newBuffer.set(newData, remainingData.length);
      this.setBuffer(newBuffer);
    }
  }
  hasRemaining(size) {
    return this.view.byteLength - this.pos >= size;
  }
  createExtraByteError(posToShow) {
    const { view, pos } = this;
    return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
  }
  /**
   * @throws {@link DecodeError}
   * @throws {@link RangeError}
   */
  decode(buffer) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decode(buffer);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      const object = this.doDecodeSync();
      if (this.hasRemaining(1)) {
        throw this.createExtraByteError(this.pos);
      }
      return object;
    } finally {
      this.entered = false;
    }
  }
  *decodeMulti(buffer) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMulti(buffer);
      return;
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      while (this.hasRemaining(1)) {
        yield this.doDecodeSync();
      }
    } finally {
      this.entered = false;
    }
  }
  async decodeAsync(stream) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decodeAsync(stream);
    }
    try {
      this.entered = true;
      let decoded = false;
      let object;
      for await (const buffer of stream) {
        if (decoded) {
          this.entered = false;
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        try {
          object = this.doDecodeSync();
          decoded = true;
        } catch (e2) {
          if (!(e2 instanceof RangeError)) {
            throw e2;
          }
        }
        this.totalPos += this.pos;
      }
      if (decoded) {
        if (this.hasRemaining(1)) {
          throw this.createExtraByteError(this.totalPos);
        }
        return object;
      }
      const { headByte, pos, totalPos } = this;
      throw new RangeError(`Insufficient data in parsing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
    } finally {
      this.entered = false;
    }
  }
  decodeArrayStream(stream) {
    return this.decodeMultiAsync(stream, true);
  }
  decodeStream(stream) {
    return this.decodeMultiAsync(stream, false);
  }
  async *decodeMultiAsync(stream, isArray) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMultiAsync(stream, isArray);
      return;
    }
    try {
      this.entered = true;
      let isArrayHeaderRequired = isArray;
      let arrayItemsLeft = -1;
      for await (const buffer of stream) {
        if (isArray && arrayItemsLeft === 0) {
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        if (isArrayHeaderRequired) {
          arrayItemsLeft = this.readArraySize();
          isArrayHeaderRequired = false;
          this.complete();
        }
        try {
          while (true) {
            yield this.doDecodeSync();
            if (--arrayItemsLeft === 0) {
              break;
            }
          }
        } catch (e2) {
          if (!(e2 instanceof RangeError)) {
            throw e2;
          }
        }
        this.totalPos += this.pos;
      }
    } finally {
      this.entered = false;
    }
  }
  doDecodeSync() {
    DECODE: while (true) {
      const headByte = this.readHeadByte();
      let object;
      if (headByte >= 224) {
        object = headByte - 256;
      } else if (headByte < 192) {
        if (headByte < 128) {
          object = headByte;
        } else if (headByte < 144) {
          const size = headByte - 128;
          if (size !== 0) {
            this.pushMapState(size);
            this.complete();
            continue DECODE;
          } else {
            object = {};
          }
        } else if (headByte < 160) {
          const size = headByte - 144;
          if (size !== 0) {
            this.pushArrayState(size);
            this.complete();
            continue DECODE;
          } else {
            object = [];
          }
        } else {
          const byteLength = headByte - 160;
          object = this.decodeString(byteLength, 0);
        }
      } else if (headByte === 192) {
        object = null;
      } else if (headByte === 194) {
        object = false;
      } else if (headByte === 195) {
        object = true;
      } else if (headByte === 202) {
        object = this.readF32();
      } else if (headByte === 203) {
        object = this.readF64();
      } else if (headByte === 204) {
        object = this.readU8();
      } else if (headByte === 205) {
        object = this.readU16();
      } else if (headByte === 206) {
        object = this.readU32();
      } else if (headByte === 207) {
        if (this.useBigInt64) {
          object = this.readU64AsBigInt();
        } else {
          object = this.readU64();
        }
      } else if (headByte === 208) {
        object = this.readI8();
      } else if (headByte === 209) {
        object = this.readI16();
      } else if (headByte === 210) {
        object = this.readI32();
      } else if (headByte === 211) {
        if (this.useBigInt64) {
          object = this.readI64AsBigInt();
        } else {
          object = this.readI64();
        }
      } else if (headByte === 217) {
        const byteLength = this.lookU8();
        object = this.decodeString(byteLength, 1);
      } else if (headByte === 218) {
        const byteLength = this.lookU16();
        object = this.decodeString(byteLength, 2);
      } else if (headByte === 219) {
        const byteLength = this.lookU32();
        object = this.decodeString(byteLength, 4);
      } else if (headByte === 220) {
        const size = this.readU16();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 221) {
        const size = this.readU32();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 222) {
        const size = this.readU16();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 223) {
        const size = this.readU32();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 196) {
        const size = this.lookU8();
        object = this.decodeBinary(size, 1);
      } else if (headByte === 197) {
        const size = this.lookU16();
        object = this.decodeBinary(size, 2);
      } else if (headByte === 198) {
        const size = this.lookU32();
        object = this.decodeBinary(size, 4);
      } else if (headByte === 212) {
        object = this.decodeExtension(1, 0);
      } else if (headByte === 213) {
        object = this.decodeExtension(2, 0);
      } else if (headByte === 214) {
        object = this.decodeExtension(4, 0);
      } else if (headByte === 215) {
        object = this.decodeExtension(8, 0);
      } else if (headByte === 216) {
        object = this.decodeExtension(16, 0);
      } else if (headByte === 199) {
        const size = this.lookU8();
        object = this.decodeExtension(size, 1);
      } else if (headByte === 200) {
        const size = this.lookU16();
        object = this.decodeExtension(size, 2);
      } else if (headByte === 201) {
        const size = this.lookU32();
        object = this.decodeExtension(size, 4);
      } else {
        throw new DecodeError(`Unrecognized type byte: ${prettyByte(headByte)}`);
      }
      this.complete();
      const stack = this.stack;
      while (stack.length > 0) {
        const state = stack.top();
        if (state.type === STATE_ARRAY) {
          state.array[state.position] = object;
          state.position++;
          if (state.position === state.size) {
            object = state.array;
            stack.release(state);
          } else {
            continue DECODE;
          }
        } else if (state.type === STATE_MAP_KEY) {
          if (object === "__proto__") {
            throw new DecodeError("The key __proto__ is not allowed");
          }
          state.key = this.mapKeyConverter(object);
          state.type = STATE_MAP_VALUE;
          continue DECODE;
        } else {
          state.map[state.key] = object;
          state.readCount++;
          if (state.readCount === state.size) {
            object = state.map;
            stack.release(state);
          } else {
            state.key = null;
            state.type = STATE_MAP_KEY;
            continue DECODE;
          }
        }
      }
      return object;
    }
  }
  readHeadByte() {
    if (this.headByte === HEAD_BYTE_REQUIRED) {
      this.headByte = this.readU8();
    }
    return this.headByte;
  }
  complete() {
    this.headByte = HEAD_BYTE_REQUIRED;
  }
  readArraySize() {
    const headByte = this.readHeadByte();
    switch (headByte) {
      case 220:
        return this.readU16();
      case 221:
        return this.readU32();
      default: {
        if (headByte < 160) {
          return headByte - 144;
        } else {
          throw new DecodeError(`Unrecognized array type byte: ${prettyByte(headByte)}`);
        }
      }
    }
  }
  pushMapState(size) {
    if (size > this.maxMapLength) {
      throw new DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
    }
    this.stack.pushMapState(size);
  }
  pushArrayState(size) {
    if (size > this.maxArrayLength) {
      throw new DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
    }
    this.stack.pushArrayState(size);
  }
  decodeString(byteLength, headerOffset) {
    if (!this.rawStrings || this.stateIsMapKey()) {
      return this.decodeUtf8String(byteLength, headerOffset);
    }
    return this.decodeBinary(byteLength, headerOffset);
  }
  /**
   * @throws {@link RangeError}
   */
  decodeUtf8String(byteLength, headerOffset) {
    if (byteLength > this.maxStrLength) {
      throw new DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
    }
    if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
      throw MORE_DATA;
    }
    const offset = this.pos + headerOffset;
    let object;
    if (this.stateIsMapKey() && this.keyDecoder?.canBeCached(byteLength)) {
      object = this.keyDecoder.decode(this.bytes, offset, byteLength);
    } else {
      object = utf8Decode(this.bytes, offset, byteLength);
    }
    this.pos += headerOffset + byteLength;
    return object;
  }
  stateIsMapKey() {
    if (this.stack.length > 0) {
      const state = this.stack.top();
      return state.type === STATE_MAP_KEY;
    }
    return false;
  }
  /**
   * @throws {@link RangeError}
   */
  decodeBinary(byteLength, headOffset) {
    if (byteLength > this.maxBinLength) {
      throw new DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
    }
    if (!this.hasRemaining(byteLength + headOffset)) {
      throw MORE_DATA;
    }
    const offset = this.pos + headOffset;
    const object = this.bytes.subarray(offset, offset + byteLength);
    this.pos += headOffset + byteLength;
    return object;
  }
  decodeExtension(size, headOffset) {
    if (size > this.maxExtLength) {
      throw new DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
    }
    const extType = this.view.getInt8(this.pos + headOffset);
    const data = this.decodeBinary(
      size,
      headOffset + 1
      /* extType */
    );
    return this.extensionCodec.decode(data, extType, this.context);
  }
  lookU8() {
    return this.view.getUint8(this.pos);
  }
  lookU16() {
    return this.view.getUint16(this.pos);
  }
  lookU32() {
    return this.view.getUint32(this.pos);
  }
  readU8() {
    const value = this.view.getUint8(this.pos);
    this.pos++;
    return value;
  }
  readI8() {
    const value = this.view.getInt8(this.pos);
    this.pos++;
    return value;
  }
  readU16() {
    const value = this.view.getUint16(this.pos);
    this.pos += 2;
    return value;
  }
  readI16() {
    const value = this.view.getInt16(this.pos);
    this.pos += 2;
    return value;
  }
  readU32() {
    const value = this.view.getUint32(this.pos);
    this.pos += 4;
    return value;
  }
  readI32() {
    const value = this.view.getInt32(this.pos);
    this.pos += 4;
    return value;
  }
  readU64() {
    const value = getUint64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readI64() {
    const value = getInt64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readU64AsBigInt() {
    const value = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return value;
  }
  readI64AsBigInt() {
    const value = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return value;
  }
  readF32() {
    const value = this.view.getFloat32(this.pos);
    this.pos += 4;
    return value;
  }
  readF64() {
    const value = this.view.getFloat64(this.pos);
    this.pos += 8;
    return value;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/decode.mjs
function decode(buffer, options) {
  const decoder = new Decoder(options);
  return decoder.decode(buffer);
}

// dist/index.js
var iceServers = [
  {
    urls: [
      "stun:stun1.l.google.com:19302",
      "stun:stun2.l.google.com:19302",
      "stun:stun3.l.google.com:19302",
      "stun:stun4.l.google.com:19302"
    ]
  }
];
function serializeDescription(description) {
  if (description.type !== "offer" && description.type !== "answer")
    throw new TypeError("BAD_DESCRIPTION_TYPE");
  if (!description.sdp) throw new TypeError("MISSING_SDP");
  return {
    type: description.type,
    sdp: description.sdp
  };
}
async function waitForIceComplete(peerConnection) {
  if (peerConnection.iceGatheringState === "complete") return;
  await new Promise((resolve) => {
    const cleanup = () => {
      peerConnection.removeEventListener(
        "icegatheringstatechange",
        onIceGatheringStateChange
      );
      peerConnection.removeEventListener("icecandidate", onIceCandidate);
      resolve();
    };
    const onIceGatheringStateChange = () => {
      if (peerConnection.iceGatheringState === "complete") cleanup();
    };
    const onIceCandidate = (event) => {
      if (!event.candidate) cleanup();
    };
    peerConnection.addEventListener(
      "icegatheringstatechange",
      onIceGatheringStateChange
    );
    peerConnection.addEventListener("icecandidate", onIceCandidate);
  });
}
function waitForIncomingDataChannel(peerConnection) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      peerConnection.removeEventListener("datachannel", onDataChannel);
      peerConnection.removeEventListener(
        "connectionstatechange",
        onConnectionStateChange
      );
    };
    const onDataChannel = (event) => {
      cleanup();
      resolve(event.channel);
    };
    const onConnectionStateChange = () => {
      if (peerConnection.connectionState === "failed" || peerConnection.connectionState === "closed") {
        cleanup();
        reject(new TypeError("CHANNEL_NOT_AVAILABLE"));
      }
    };
    peerConnection.addEventListener("datachannel", onDataChannel);
    peerConnection.addEventListener(
      "connectionstatechange",
      onConnectionStateChange
    );
  });
}
function waitForChannelOpen(channel) {
  if (channel.readyState === "open") return Promise.resolve();
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      channel.removeEventListener("open", onOpen);
      channel.removeEventListener("close", onClose);
      channel.removeEventListener("error", onError);
    };
    const onOpen = () => {
      cleanup();
      resolve();
    };
    const onClose = () => {
      cleanup();
      reject(new TypeError("CHANNEL_CLOSED"));
    };
    const onError = () => {
      cleanup();
      reject(new TypeError("CHANNEL_ERROR"));
    };
    channel.addEventListener("open", onOpen);
    channel.addEventListener("close", onClose);
    channel.addEventListener("error", onError);
  });
}
var P2PConnection = class _P2PConnection {
  static #pendingOfferorSide = /* @__PURE__ */ new Map();
  static #acceptedOffereeSide = /* @__PURE__ */ new Map();
  static async makeOffer() {
    const peerConnection = new RTCPeerConnection({
      iceServers,
      iceTransportPolicy: "all"
    });
    const channel = peerConnection.createDataChannel("data");
    const offerId = crypto.randomUUID();
    _P2PConnection.#pendingOfferorSide.set(offerId, {
      peerConnection,
      channel
    });
    await peerConnection.setLocalDescription(await peerConnection.createOffer());
    await waitForIceComplete(peerConnection);
    if (!peerConnection.localDescription)
      throw new TypeError("MISSING_LOCAL_DESCRIPTION");
    return {
      offerId,
      description: serializeDescription(peerConnection.localDescription)
    };
  }
  static async acceptOffer(offer) {
    const peerConnection = new RTCPeerConnection({
      iceServers,
      iceTransportPolicy: "all"
    });
    const channelPromise = waitForIncomingDataChannel(peerConnection);
    await peerConnection.setRemoteDescription(offer.description);
    await peerConnection.setLocalDescription(
      await peerConnection.createAnswer()
    );
    await waitForIceComplete(peerConnection);
    if (!peerConnection.localDescription)
      throw new TypeError("MISSING_LOCAL_DESCRIPTION");
    const answer = serializeDescription(peerConnection.localDescription);
    _P2PConnection.#acceptedOffereeSide.set(offer.offerId, {
      peerConnection,
      channelPromise
    });
    return {
      offeror: {
        offerId: offer.offerId,
        side: "offeror",
        answer
      },
      offeree: {
        offerId: offer.offerId,
        side: "offeree"
      }
    };
  }
  #peerConnection;
  #channelPromise;
  #channel;
  constructor(init) {
    if (init.side === "offeror") {
      const pending = _P2PConnection.#pendingOfferorSide.get(init.offerId);
      if (!pending) throw new TypeError("UNKNOWN_PEER_INIT");
      this.#peerConnection = pending.peerConnection;
      this.#channel = pending.channel;
      this.#channelPromise = Promise.resolve(pending.channel);
      _P2PConnection.#pendingOfferorSide.delete(init.offerId);
      void this.#peerConnection.setRemoteDescription(init.answer);
      return;
    }
    const accepted = _P2PConnection.#acceptedOffereeSide.get(init.offerId);
    if (!accepted) throw new TypeError("UNKNOWN_PEER_INIT");
    this.#peerConnection = accepted.peerConnection;
    this.#channelPromise = accepted.channelPromise.then((channel) => {
      this.#channel = channel;
      return channel;
    });
    _P2PConnection.#acceptedOffereeSide.delete(init.offerId);
  }
  async ready() {
    const channel = await this.#channelPromise;
    await waitForChannelOpen(channel);
  }
  async channel() {
    return await this.#channelPromise;
  }
  sendMessage(data) {
    if (!this.#channel) throw new TypeError("CALL_READY_FIRST");
    this.#channel.send(encode2(data));
  }
  onmessage(listener) {
    void this.#channelPromise.then((channel) => {
      channel.addEventListener("message", async (event) => {
        let data = event.data;
        if (data instanceof Blob) {
          data = new Uint8Array(await data.arrayBuffer());
        } else if (data instanceof ArrayBuffer) {
          data = new Uint8Array(data);
        }
        if (data instanceof Uint8Array) {
          listener(decode(data), event);
          return;
        }
        listener(data, event);
      });
    });
  }
  close() {
    this.#channel?.close();
    this.#peerConnection.close();
  }
};

// in-browser-testing-libs.js
var peer = void 0;
var messagesStore = new KVStore("messages");
var messagesElement = document.getElementById("messages");
var nameInput = document.getElementById("name");
var controlsElement = document.getElementById("controls");
var qrModeButton = document.getElementById("qrMode");
var copyPasteModeButton = document.getElementById("copyPasteMode");
var profile = await messagesStore.get("profile") ?? { name: "", demoMode: "qr" };
var demoMode = profile.demoMode ?? "qr";
nameInput.value = profile.name ?? "";
function appendMessage(message) {
  const value = message && typeof message === "object" ? `${message.name || "Anonymous"}: ${message.text || ""}` : String(message);
  messagesElement.append(document.createTextNode(value));
  messagesElement.append(document.createElement("br"));
}
function renderMessages() {
  messagesElement.textContent = "";
  for (const message of messages) {
    appendMessage(message);
  }
}
function closeQrDisplay() {
  queueMicrotask(() => {
    window.dispatchEvent(new PointerEvent("pointerup"));
    window.dispatchEvent(new MouseEvent("mouseup"));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  });
}
function setDemoMode(nextMode) {
  demoMode = nextMode;
  profile = { ...profile, demoMode: nextMode };
  messagesStore.put("profile", profile);
  qrModeButton.setAttribute("aria-pressed", String(nextMode === "qr"));
  copyPasteModeButton.setAttribute("aria-pressed", String(nextMode === "copy"));
  renderControls();
}
function renderControls() {
  if (demoMode === "qr") {
    controlsElement.innerHTML = `
      <div class="control-card">
        <h5>Step 1 (Device A)</h5>
        <p>Displays an RTCPeerConnection offer as a QR code.</p>
        <button id="makeOffer">Make an offer</button>
      </div>

      <div class="control-card">
        <h5>Step 2 (Device B)</h5>
        <p>Starts a QR scanner, processes the RTCPeerConnection offer, and displays an answer as a QR code.</p>
        <button id="acceptOffer">Accept the offer</button>
      </div>

      <div class="control-card">
        <h5>Step 3 (Device A)</h5>
        <p>Scans the QR code and completes the RTCPeerConnection setup.</p>
        <button id="finishOffer">Finish the offer</button>
      </div>
    `;
  } else {
    controlsElement.innerHTML = `
      <div class="control-card">
        <h5>Step 1 (Device A)</h5>
        <p>Create an RTCPeerConnection offer and copy it to any channel you want.</p>
        <button id="makeOffer">Make an offer</button>
        <textarea id="offerOutput" placeholder="Offer appears here." readonly></textarea>
        <div class="field-actions">
          <button id="copyOffer" class="icon-button" type="button" aria-label="Copy offer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      <div class="control-card">
        <h5>Step 2 (Device B)</h5>
        <p>Paste the offer, process it, and copy the answer back to device A.</p>
        <textarea id="offerInput" placeholder="Paste offer here."></textarea>
        <div class="field-actions">
          <button id="pasteOffer" class="icon-button" type="button" aria-label="Paste offer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 4h-3.18C15.4 2.84 14.3 2 13 2h-2c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-2H5V6h2v3h10V6h2v5h2V6a2 2 0 0 0-2-2Zm-8-1h2a1 1 0 0 1 1 1h-4a1 1 0 0 1 1-1Zm6 4H7V6h10v1Zm3 6v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2Z" />
            </svg>
            Paste
          </button>
        </div>
        <button id="acceptOffer">Accept the offer</button>
        <textarea id="answerOutput" placeholder="Answer appears here." readonly></textarea>
        <div class="field-actions">
          <button id="copyAnswer" class="icon-button" type="button" aria-label="Copy answer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      <div class="control-card">
        <h5>Step 3 (Device A)</h5>
        <p>Paste the answer and complete the RTCPeerConnection setup.</p>
        <textarea id="answerInput" placeholder="Paste answer here."></textarea>
        <div class="field-actions">
          <button id="pasteAnswer" class="icon-button" type="button" aria-label="Paste answer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 4h-3.18C15.4 2.84 14.3 2 13 2h-2c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-2H5V6h2v3h10V6h2v5h2V6a2 2 0 0 0-2-2Zm-8-1h2a1 1 0 0 1 1 1h-4a1 1 0 0 1 1-1Zm6 4H7V6h10v1Zm3 6v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2Z" />
            </svg>
            Paste
          </button>
        </div>
        <button id="finishOffer">Finish the offer</button>
      </div>
    `;
  }
  bindControlEvents();
}
function readHandshakeValue(id) {
  return JSON.parse(document.getElementById(id).value);
}
async function copyField(id) {
  const field = document.getElementById(id);
  if (!field?.value) return;
  await navigator.clipboard.writeText(field.value);
}
async function pasteField(id) {
  const field = document.getElementById(id);
  if (!field) return;
  field.value = await navigator.clipboard.readText();
}
function setupPeer(nextPeer) {
  peer = nextPeer;
  peer.onmessage((data) => {
    if (data === "connected") {
      closeQrDisplay();
      return;
    }
    if (data && typeof data === "object" && data.type === "snapshot") {
      messages.merge(data.payload);
      renderMessages();
      return;
    }
    if (data && typeof data === "object" && data.type === "delta") {
      messages.merge(data.payload);
      return;
    }
    messages.merge(data);
  });
}
function bindControlEvents() {
  document.getElementById("makeOffer").onclick = async () => {
    const offer = await P2PConnection.makeOffer();
    const value = JSON.stringify(offer);
    if (demoMode === "copy") {
      document.getElementById("offerOutput").value = value;
      return;
    }
    QR.display(value);
  };
  document.getElementById("acceptOffer").onclick = async () => {
    const offer = demoMode === "copy" ? readHandshakeValue("offerInput") : JSON.parse(await QR.scan());
    const { offeror, offeree } = await P2PConnection.acceptOffer(offer);
    setupPeer(new P2PConnection(offeree));
    const value = JSON.stringify(offeror);
    if (demoMode === "copy") document.getElementById("answerOutput").value = value;
    else QR.display(value);
    await peer.ready();
    peer.sendMessage({ type: "snapshot", payload: messages.toJSON() });
  };
  document.getElementById("finishOffer").onclick = async () => {
    const offeror = demoMode === "copy" ? readHandshakeValue("answerInput") : JSON.parse(await QR.scan());
    setupPeer(new P2PConnection(offeror));
    await peer.ready();
    closeQrDisplay();
    peer.sendMessage("connected");
    peer.sendMessage({ type: "snapshot", payload: messages.toJSON() });
  };
  if (demoMode === "copy") {
    document.getElementById("copyOffer").onclick = async () => {
      await copyField("offerOutput");
    };
    document.getElementById("pasteOffer").onclick = async () => {
      await pasteField("offerInput");
    };
    document.getElementById("copyAnswer").onclick = async () => {
      await copyField("answerOutput");
    };
    document.getElementById("pasteAnswer").onclick = async () => {
      await pasteField("answerInput");
    };
  }
}
var snapshot = void 0;
if (await messagesStore.has("messages")) {
  snapshot = await messagesStore.get("messages");
}
var messages = new CRList(snapshot);
renderMessages();
document.getElementById("sendMessage").addEventListener("click", (event) => {
  const msginput = document.getElementById("message-input");
  const text = msginput.value.trim();
  if (!text) return;
  messages.append({
    name: nameInput.value.trim() || "Anonymous",
    text
  });
  msginput.value = "";
});
messages.addEventListener("delta", ({ detail }) => {
  if (peer) peer.sendMessage({ type: "delta", payload: detail });
  messages.snapshot();
});
messages.addEventListener("change", ({ detail }) => {
  for (const value of Object.values(detail)) {
    appendMessage(value);
  }
});
messages.addEventListener("snapshot", ({ detail }) => {
  messagesStore.put("messages", detail);
});
nameInput.addEventListener("change", () => {
  profile = { ...profile, name: nameInput.value.trim() };
  messagesStore.put("profile", profile);
});
qrModeButton.addEventListener("click", () => {
  setDemoMode("qr");
});
copyPasteModeButton.addEventListener("click", () => {
  setDemoMode("copy");
});
setDemoMode(demoMode);
/*! Bundled license information:

qr/index.js:
  (*!
  Copyright (c) 2023 Paul Miller (paulmillr.com)
  The library paulmillr-qr is dual-licensed under the Apache 2.0 OR MIT license.
  You can select a license of your choice.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  *)
*/
