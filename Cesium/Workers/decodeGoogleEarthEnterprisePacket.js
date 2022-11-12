/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.99
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
define(["./RuntimeError-f0dada00","./defaultValue-135942ca","./createTaskProcessorWorker"],(function(e,t,n){"use strict";function i(t,n){if(i.passThroughDataForTesting)return n;const r=t.byteLength;if(0===r||r%4!=0)throw new e.RuntimeError("The length of key must be greater than 0 and a multiple of 4.");const a=new DataView(n),o=a.getUint32(0,!0);if(1953029805===o||2917034100===o)return n;const s=new DataView(t);let l=0;const c=n.byteLength,d=c-c%8,f=r;let h,u=8;for(;l<d;)for(u=(u+8)%24,h=u;l<d&&h<f;)a.setUint32(l,a.getUint32(l,!0)^s.getUint32(h,!0),!0),a.setUint32(l+4,a.getUint32(l+4,!0)^s.getUint32(h+4,!0),!0),l+=8,h+=24;if(l<c)for(h>=f&&(u=(u+8)%24,h=u);l<c;)a.setUint8(l,a.getUint8(l)^s.getUint8(h)),l++,h++}function r(e,t){return 0!=(e&t)}i.passThroughDataForTesting=!1;const a=[1,2,4,8];function o(e,t,n,i,r,a){this._bits=e,this.cnodeVersion=t,this.imageryVersion=n,this.terrainVersion=i,this.imageryProvider=r,this.terrainProvider=a,this.ancestorHasTerrain=!1,this.terrainState=void 0}o.clone=function(e,n){return t.defined(n)?(n._bits=e._bits,n.cnodeVersion=e.cnodeVersion,n.imageryVersion=e.imageryVersion,n.terrainVersion=e.terrainVersion,n.imageryProvider=e.imageryProvider,n.terrainProvider=e.terrainProvider):n=new o(e._bits,e.cnodeVersion,e.imageryVersion,e.terrainVersion,e.imageryProvider,e.terrainProvider),n.ancestorHasTerrain=e.ancestorHasTerrain,n.terrainState=e.terrainState,n},o.prototype.setParent=function(e){this.ancestorHasTerrain=e.ancestorHasTerrain||this.hasTerrain()},o.prototype.hasSubtree=function(){return r(this._bits,16)},o.prototype.hasImagery=function(){return r(this._bits,64)},o.prototype.hasTerrain=function(){return r(this._bits,128)},o.prototype.hasChildren=function(){return r(this._bits,15)},o.prototype.hasChild=function(e){return r(this._bits,a[e])},o.prototype.getChildBitmask=function(){return 15&this._bits};var s={},l={};var c=(e,t,n,i)=>{let r=65535&e|0,a=e>>>16&65535|0,o=0;for(;0!==n;){o=n>2e3?2e3:n,n-=o;do{r=r+t[i++]|0,a=a+r|0}while(--o);r%=65521,a%=65521}return r|a<<16|0};const d=new Uint32Array((()=>{let e,t=[];for(var n=0;n<256;n++){e=n;for(var i=0;i<8;i++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t})());var f=(e,t,n,i)=>{const r=d,a=i+n;e^=-1;for(let n=i;n<a;n++)e=e>>>8^r[255&(e^t[n])];return-1^e};const h=15,u=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),w=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),b=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),m=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]);var g={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const k=c,_=f,p=function(e,t){let n,i,r,a,o,s,l,c,d,f,h,u,w,b,m,g,k,_,p,y,v,E,x,R;const A=e.state;n=e.next_in,x=e.input,i=n+(e.avail_in-5),r=e.next_out,R=e.output,a=r-(t-e.avail_out),o=r+(e.avail_out-257),s=A.dmax,l=A.wsize,c=A.whave,d=A.wnext,f=A.window,h=A.hold,u=A.bits,w=A.lencode,b=A.distcode,m=(1<<A.lenbits)-1,g=(1<<A.distbits)-1;e:do{u<15&&(h+=x[n++]<<u,u+=8,h+=x[n++]<<u,u+=8),k=w[h&m];t:for(;;){if(_=k>>>24,h>>>=_,u-=_,_=k>>>16&255,0===_)R[r++]=65535&k;else{if(!(16&_)){if(0==(64&_)){k=w[(65535&k)+(h&(1<<_)-1)];continue t}if(32&_){A.mode=12;break e}e.msg="invalid literal/length code",A.mode=30;break e}p=65535&k,_&=15,_&&(u<_&&(h+=x[n++]<<u,u+=8),p+=h&(1<<_)-1,h>>>=_,u-=_),u<15&&(h+=x[n++]<<u,u+=8,h+=x[n++]<<u,u+=8),k=b[h&g];n:for(;;){if(_=k>>>24,h>>>=_,u-=_,_=k>>>16&255,!(16&_)){if(0==(64&_)){k=b[(65535&k)+(h&(1<<_)-1)];continue n}e.msg="invalid distance code",A.mode=30;break e}if(y=65535&k,_&=15,u<_&&(h+=x[n++]<<u,u+=8,u<_&&(h+=x[n++]<<u,u+=8)),y+=h&(1<<_)-1,y>s){e.msg="invalid distance too far back",A.mode=30;break e}if(h>>>=_,u-=_,_=r-a,y>_){if(_=y-_,_>c&&A.sane){e.msg="invalid distance too far back",A.mode=30;break e}if(v=0,E=f,0===d){if(v+=l-_,_<p){p-=_;do{R[r++]=f[v++]}while(--_);v=r-y,E=R}}else if(d<_){if(v+=l+d-_,_-=d,_<p){p-=_;do{R[r++]=f[v++]}while(--_);if(v=0,d<p){_=d,p-=_;do{R[r++]=f[v++]}while(--_);v=r-y,E=R}}}else if(v+=d-_,_<p){p-=_;do{R[r++]=f[v++]}while(--_);v=r-y,E=R}for(;p>2;)R[r++]=E[v++],R[r++]=E[v++],R[r++]=E[v++],p-=3;p&&(R[r++]=E[v++],p>1&&(R[r++]=E[v++]))}else{v=r-y;do{R[r++]=R[v++],R[r++]=R[v++],R[r++]=R[v++],p-=3}while(p>2);p&&(R[r++]=R[v++],p>1&&(R[r++]=R[v++]))}break}}break}}while(n<i&&r<o);p=u>>3,n-=p,u-=p<<3,h&=(1<<u)-1,e.next_in=n,e.next_out=r,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=r<o?o-r+257:257-(r-o),A.hold=h,A.bits=u},y=(e,t,n,i,r,a,o,s)=>{const l=s.bits;let c,d,f,g,k,_,p=0,y=0,v=0,E=0,x=0,R=0,A=0,T=0,U=0,S=0,Z=null,D=0;const I=new Uint16Array(16),O=new Uint16Array(16);let B,N,C,M=null,L=0;for(p=0;p<=h;p++)I[p]=0;for(y=0;y<i;y++)I[t[n+y]]++;for(x=l,E=h;E>=1&&0===I[E];E--);if(x>E&&(x=E),0===E)return r[a++]=20971520,r[a++]=20971520,s.bits=1,0;for(v=1;v<E&&0===I[v];v++);for(x<v&&(x=v),T=1,p=1;p<=h;p++)if(T<<=1,T-=I[p],T<0)return-1;if(T>0&&(0===e||1!==E))return-1;for(O[1]=0,p=1;p<h;p++)O[p+1]=O[p]+I[p];for(y=0;y<i;y++)0!==t[n+y]&&(o[O[t[n+y]]++]=y);if(0===e?(Z=M=o,_=19):1===e?(Z=u,D-=257,M=w,L-=257,_=256):(Z=b,M=m,_=-1),S=0,y=0,p=v,k=a,R=x,A=0,f=-1,U=1<<x,g=U-1,1===e&&U>852||2===e&&U>592)return 1;for(;;){B=p-A,o[y]<_?(N=0,C=o[y]):o[y]>_?(N=M[L+o[y]],C=Z[D+o[y]]):(N=96,C=0),c=1<<p-A,d=1<<R,v=d;do{d-=c,r[k+(S>>A)+d]=B<<24|N<<16|C|0}while(0!==d);for(c=1<<p-1;S&c;)c>>=1;if(0!==c?(S&=c-1,S+=c):S=0,y++,0==--I[p]){if(p===E)break;p=t[n+o[y]]}if(p>x&&(S&g)!==f){for(0===A&&(A=x),k+=v,R=p-A,T=1<<R;R+A<E&&(T-=I[R+A],!(T<=0));)R++,T<<=1;if(U+=1<<R,1===e&&U>852||2===e&&U>592)return 1;f=S&g,r[f]=x<<24|R<<16|k-a|0}}return 0!==S&&(r[k+S]=p-A<<24|64<<16|0),s.bits=x,0},{Z_FINISH:v,Z_BLOCK:E,Z_TREES:x,Z_OK:R,Z_STREAM_END:A,Z_NEED_DICT:T,Z_STREAM_ERROR:U,Z_DATA_ERROR:S,Z_MEM_ERROR:Z,Z_BUF_ERROR:D,Z_DEFLATED:I}=g,O=12,B=30,N=e=>(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24);function C(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const M=e=>{if(!e||!e.state)return U;const t=e.state;return e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=1,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new Int32Array(852),t.distcode=t.distdyn=new Int32Array(592),t.sane=1,t.back=-1,R},L=e=>{if(!e||!e.state)return U;const t=e.state;return t.wsize=0,t.whave=0,t.wnext=0,M(e)},F=(e,t)=>{let n;if(!e||!e.state)return U;const i=e.state;return t<0?(n=0,t=-t):(n=1+(t>>4),t<48&&(t&=15)),t&&(t<8||t>15)?U:(null!==i.window&&i.wbits!==t&&(i.window=null),i.wrap=n,i.wbits=t,L(e))},P=(e,t)=>{if(!e)return U;const n=new C;e.state=n,n.window=null;const i=F(e,t);return i!==R&&(e.state=null),i};let z,V,H=!0;const j=e=>{if(H){z=new Int32Array(512),V=new Int32Array(32);let t=0;for(;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(y(1,e.lens,0,288,z,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;y(2,e.lens,0,32,V,0,e.work,{bits:5}),H=!1}e.lencode=z,e.lenbits=9,e.distcode=V,e.distbits=5},K=(e,t,n,i)=>{let r;const a=e.state;return null===a.window&&(a.wsize=1<<a.wbits,a.wnext=0,a.whave=0,a.window=new Uint8Array(a.wsize)),i>=a.wsize?(a.window.set(t.subarray(n-a.wsize,n),0),a.wnext=0,a.whave=a.wsize):(r=a.wsize-a.wnext,r>i&&(r=i),a.window.set(t.subarray(n-i,n-i+r),a.wnext),(i-=r)?(a.window.set(t.subarray(n-i,n),0),a.wnext=i,a.whave=a.wsize):(a.wnext+=r,a.wnext===a.wsize&&(a.wnext=0),a.whave<a.wsize&&(a.whave+=r))),0};l.inflateReset=L,l.inflateReset2=F,l.inflateResetKeep=M,l.inflateInit=e=>P(e,15),l.inflateInit2=P,l.inflate=(e,t)=>{let n,i,r,a,o,s,l,c,d,f,h,u,w,b,m,g,C,M,L,F,P,z,V=0;const H=new Uint8Array(4);let Y,G;const Q=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;n=e.state,n.mode===O&&(n.mode=13),o=e.next_out,r=e.output,l=e.avail_out,a=e.next_in,i=e.input,s=e.avail_in,c=n.hold,d=n.bits,f=s,h=l,z=R;e:for(;;)switch(n.mode){case 1:if(0===n.wrap){n.mode=13;break}for(;d<16;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(2&n.wrap&&35615===c){n.check=0,H[0]=255&c,H[1]=c>>>8&255,n.check=_(n.check,H,2,0),c=0,d=0,n.mode=2;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&c)<<8)+(c>>8))%31){e.msg="incorrect header check",n.mode=B;break}if((15&c)!==I){e.msg="unknown compression method",n.mode=B;break}if(c>>>=4,d-=4,P=8+(15&c),0===n.wbits)n.wbits=P;else if(P>n.wbits){e.msg="invalid window size",n.mode=B;break}n.dmax=1<<n.wbits,e.adler=n.check=1,n.mode=512&c?10:O,c=0,d=0;break;case 2:for(;d<16;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(n.flags=c,(255&n.flags)!==I){e.msg="unknown compression method",n.mode=B;break}if(57344&n.flags){e.msg="unknown header flags set",n.mode=B;break}n.head&&(n.head.text=c>>8&1),512&n.flags&&(H[0]=255&c,H[1]=c>>>8&255,n.check=_(n.check,H,2,0)),c=0,d=0,n.mode=3;case 3:for(;d<32;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}n.head&&(n.head.time=c),512&n.flags&&(H[0]=255&c,H[1]=c>>>8&255,H[2]=c>>>16&255,H[3]=c>>>24&255,n.check=_(n.check,H,4,0)),c=0,d=0,n.mode=4;case 4:for(;d<16;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}n.head&&(n.head.xflags=255&c,n.head.os=c>>8),512&n.flags&&(H[0]=255&c,H[1]=c>>>8&255,n.check=_(n.check,H,2,0)),c=0,d=0,n.mode=5;case 5:if(1024&n.flags){for(;d<16;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}n.length=c,n.head&&(n.head.extra_len=c),512&n.flags&&(H[0]=255&c,H[1]=c>>>8&255,n.check=_(n.check,H,2,0)),c=0,d=0}else n.head&&(n.head.extra=null);n.mode=6;case 6:if(1024&n.flags&&(u=n.length,u>s&&(u=s),u&&(n.head&&(P=n.head.extra_len-n.length,n.head.extra||(n.head.extra=new Uint8Array(n.head.extra_len)),n.head.extra.set(i.subarray(a,a+u),P)),512&n.flags&&(n.check=_(n.check,i,u,a)),s-=u,a+=u,n.length-=u),n.length))break e;n.length=0,n.mode=7;case 7:if(2048&n.flags){if(0===s)break e;u=0;do{P=i[a+u++],n.head&&P&&n.length<65536&&(n.head.name+=String.fromCharCode(P))}while(P&&u<s);if(512&n.flags&&(n.check=_(n.check,i,u,a)),s-=u,a+=u,P)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=8;case 8:if(4096&n.flags){if(0===s)break e;u=0;do{P=i[a+u++],n.head&&P&&n.length<65536&&(n.head.comment+=String.fromCharCode(P))}while(P&&u<s);if(512&n.flags&&(n.check=_(n.check,i,u,a)),s-=u,a+=u,P)break e}else n.head&&(n.head.comment=null);n.mode=9;case 9:if(512&n.flags){for(;d<16;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(c!==(65535&n.check)){e.msg="header crc mismatch",n.mode=B;break}c=0,d=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=O;break;case 10:for(;d<32;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}e.adler=n.check=N(c),c=0,d=0,n.mode=11;case 11:if(0===n.havedict)return e.next_out=o,e.avail_out=l,e.next_in=a,e.avail_in=s,n.hold=c,n.bits=d,T;e.adler=n.check=1,n.mode=O;case O:if(t===E||t===x)break e;case 13:if(n.last){c>>>=7&d,d-=7&d,n.mode=27;break}for(;d<3;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}switch(n.last=1&c,c>>>=1,d-=1,3&c){case 0:n.mode=14;break;case 1:if(j(n),n.mode=20,t===x){c>>>=2,d-=2;break e}break;case 2:n.mode=17;break;case 3:e.msg="invalid block type",n.mode=B}c>>>=2,d-=2;break;case 14:for(c>>>=7&d,d-=7&d;d<32;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if((65535&c)!=(c>>>16^65535)){e.msg="invalid stored block lengths",n.mode=B;break}if(n.length=65535&c,c=0,d=0,n.mode=15,t===x)break e;case 15:n.mode=16;case 16:if(u=n.length,u){if(u>s&&(u=s),u>l&&(u=l),0===u)break e;r.set(i.subarray(a,a+u),o),s-=u,a+=u,l-=u,o+=u,n.length-=u;break}n.mode=O;break;case 17:for(;d<14;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(n.nlen=257+(31&c),c>>>=5,d-=5,n.ndist=1+(31&c),c>>>=5,d-=5,n.ncode=4+(15&c),c>>>=4,d-=4,n.nlen>286||n.ndist>30){e.msg="too many length or distance symbols",n.mode=B;break}n.have=0,n.mode=18;case 18:for(;n.have<n.ncode;){for(;d<3;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}n.lens[Q[n.have++]]=7&c,c>>>=3,d-=3}for(;n.have<19;)n.lens[Q[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,Y={bits:n.lenbits},z=y(0,n.lens,0,19,n.lencode,0,n.work,Y),n.lenbits=Y.bits,z){e.msg="invalid code lengths set",n.mode=B;break}n.have=0,n.mode=19;case 19:for(;n.have<n.nlen+n.ndist;){for(;V=n.lencode[c&(1<<n.lenbits)-1],m=V>>>24,g=V>>>16&255,C=65535&V,!(m<=d);){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(C<16)c>>>=m,d-=m,n.lens[n.have++]=C;else{if(16===C){for(G=m+2;d<G;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(c>>>=m,d-=m,0===n.have){e.msg="invalid bit length repeat",n.mode=B;break}P=n.lens[n.have-1],u=3+(3&c),c>>>=2,d-=2}else if(17===C){for(G=m+3;d<G;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}c>>>=m,d-=m,P=0,u=3+(7&c),c>>>=3,d-=3}else{for(G=m+7;d<G;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}c>>>=m,d-=m,P=0,u=11+(127&c),c>>>=7,d-=7}if(n.have+u>n.nlen+n.ndist){e.msg="invalid bit length repeat",n.mode=B;break}for(;u--;)n.lens[n.have++]=P}}if(n.mode===B)break;if(0===n.lens[256]){e.msg="invalid code -- missing end-of-block",n.mode=B;break}if(n.lenbits=9,Y={bits:n.lenbits},z=y(1,n.lens,0,n.nlen,n.lencode,0,n.work,Y),n.lenbits=Y.bits,z){e.msg="invalid literal/lengths set",n.mode=B;break}if(n.distbits=6,n.distcode=n.distdyn,Y={bits:n.distbits},z=y(2,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,Y),n.distbits=Y.bits,z){e.msg="invalid distances set",n.mode=B;break}if(n.mode=20,t===x)break e;case 20:n.mode=21;case 21:if(s>=6&&l>=258){e.next_out=o,e.avail_out=l,e.next_in=a,e.avail_in=s,n.hold=c,n.bits=d,p(e,h),o=e.next_out,r=e.output,l=e.avail_out,a=e.next_in,i=e.input,s=e.avail_in,c=n.hold,d=n.bits,n.mode===O&&(n.back=-1);break}for(n.back=0;V=n.lencode[c&(1<<n.lenbits)-1],m=V>>>24,g=V>>>16&255,C=65535&V,!(m<=d);){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(g&&0==(240&g)){for(M=m,L=g,F=C;V=n.lencode[F+((c&(1<<M+L)-1)>>M)],m=V>>>24,g=V>>>16&255,C=65535&V,!(M+m<=d);){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}c>>>=M,d-=M,n.back+=M}if(c>>>=m,d-=m,n.back+=m,n.length=C,0===g){n.mode=26;break}if(32&g){n.back=-1,n.mode=O;break}if(64&g){e.msg="invalid literal/length code",n.mode=B;break}n.extra=15&g,n.mode=22;case 22:if(n.extra){for(G=n.extra;d<G;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}n.length+=c&(1<<n.extra)-1,c>>>=n.extra,d-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=23;case 23:for(;V=n.distcode[c&(1<<n.distbits)-1],m=V>>>24,g=V>>>16&255,C=65535&V,!(m<=d);){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(0==(240&g)){for(M=m,L=g,F=C;V=n.distcode[F+((c&(1<<M+L)-1)>>M)],m=V>>>24,g=V>>>16&255,C=65535&V,!(M+m<=d);){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}c>>>=M,d-=M,n.back+=M}if(c>>>=m,d-=m,n.back+=m,64&g){e.msg="invalid distance code",n.mode=B;break}n.offset=C,n.extra=15&g,n.mode=24;case 24:if(n.extra){for(G=n.extra;d<G;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}n.offset+=c&(1<<n.extra)-1,c>>>=n.extra,d-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg="invalid distance too far back",n.mode=B;break}n.mode=25;case 25:if(0===l)break e;if(u=h-l,n.offset>u){if(u=n.offset-u,u>n.whave&&n.sane){e.msg="invalid distance too far back",n.mode=B;break}u>n.wnext?(u-=n.wnext,w=n.wsize-u):w=n.wnext-u,u>n.length&&(u=n.length),b=n.window}else b=r,w=o-n.offset,u=n.length;u>l&&(u=l),l-=u,n.length-=u;do{r[o++]=b[w++]}while(--u);0===n.length&&(n.mode=21);break;case 26:if(0===l)break e;r[o++]=n.length,l--,n.mode=21;break;case 27:if(n.wrap){for(;d<32;){if(0===s)break e;s--,c|=i[a++]<<d,d+=8}if(h-=l,e.total_out+=h,n.total+=h,h&&(e.adler=n.check=n.flags?_(n.check,r,h,o-h):k(n.check,r,h,o-h)),h=l,(n.flags?c:N(c))!==n.check){e.msg="incorrect data check",n.mode=B;break}c=0,d=0}n.mode=28;case 28:if(n.wrap&&n.flags){for(;d<32;){if(0===s)break e;s--,c+=i[a++]<<d,d+=8}if(c!==(4294967295&n.total)){e.msg="incorrect length check",n.mode=B;break}c=0,d=0}n.mode=29;case 29:z=A;break e;case B:z=S;break e;case 31:return Z;default:return U}return e.next_out=o,e.avail_out=l,e.next_in=a,e.avail_in=s,n.hold=c,n.bits=d,(n.wsize||h!==e.avail_out&&n.mode<B&&(n.mode<27||t!==v))&&K(e,e.output,e.next_out,h-e.avail_out),f-=e.avail_in,h-=e.avail_out,e.total_in+=f,e.total_out+=h,n.total+=h,n.wrap&&h&&(e.adler=n.check=n.flags?_(n.check,r,h,e.next_out-h):k(n.check,r,h,e.next_out-h)),e.data_type=n.bits+(n.last?64:0)+(n.mode===O?128:0)+(20===n.mode||15===n.mode?256:0),(0===f&&0===h||t===v)&&z===R&&(z=D),z},l.inflateEnd=e=>{if(!e||!e.state)return U;let t=e.state;return t.window&&(t.window=null),e.state=null,R},l.inflateGetHeader=(e,t)=>{if(!e||!e.state)return U;const n=e.state;return 0==(2&n.wrap)?U:(n.head=t,t.done=!1,R)},l.inflateSetDictionary=(e,t)=>{const n=t.length;let i,r,a;return e&&e.state?(i=e.state,0!==i.wrap&&11!==i.mode?U:11===i.mode&&(r=1,r=k(r,t,n,0),r!==i.check)?S:(a=K(e,t,n,n),a?(i.mode=31,Z):(i.havedict=1,R))):U},l.inflateInfo="pako inflate (from Nodeca project)";var Y={};const G=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);Y.assign=function(e){const t=Array.prototype.slice.call(arguments,1);for(;t.length;){const n=t.shift();if(n){if("object"!=typeof n)throw new TypeError(n+"must be non-object");for(const t in n)G(n,t)&&(e[t]=n[t])}}return e},Y.flattenChunks=e=>{let t=0;for(let n=0,i=e.length;n<i;n++)t+=e[n].length;const n=new Uint8Array(t);for(let t=0,i=0,r=e.length;t<r;t++){let r=e[t];n.set(r,i),i+=r.length}return n};var Q={};let W=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){W=!1}const X=new Uint8Array(256);for(let e=0;e<256;e++)X[e]=e>=252?6:e>=248?5:e>=240?4:e>=224?3:e>=192?2:1;X[254]=X[254]=1,Q.string2buf=e=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(e);let t,n,i,r,a,o=e.length,s=0;for(r=0;r<o;r++)n=e.charCodeAt(r),55296==(64512&n)&&r+1<o&&(i=e.charCodeAt(r+1),56320==(64512&i)&&(n=65536+(n-55296<<10)+(i-56320),r++)),s+=n<128?1:n<2048?2:n<65536?3:4;for(t=new Uint8Array(s),a=0,r=0;a<s;r++)n=e.charCodeAt(r),55296==(64512&n)&&r+1<o&&(i=e.charCodeAt(r+1),56320==(64512&i)&&(n=65536+(n-55296<<10)+(i-56320),r++)),n<128?t[a++]=n:n<2048?(t[a++]=192|n>>>6,t[a++]=128|63&n):n<65536?(t[a++]=224|n>>>12,t[a++]=128|n>>>6&63,t[a++]=128|63&n):(t[a++]=240|n>>>18,t[a++]=128|n>>>12&63,t[a++]=128|n>>>6&63,t[a++]=128|63&n);return t};Q.buf2string=(e,t)=>{const n=t||e.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(e.subarray(0,t));let i,r;const a=new Array(2*n);for(r=0,i=0;i<n;){let t=e[i++];if(t<128){a[r++]=t;continue}let o=X[t];if(o>4)a[r++]=65533,i+=o-1;else{for(t&=2===o?31:3===o?15:7;o>1&&i<n;)t=t<<6|63&e[i++],o--;o>1?a[r++]=65533:t<65536?a[r++]=t:(t-=65536,a[r++]=55296|t>>10&1023,a[r++]=56320|1023&t)}}return((e,t)=>{if(t<65534&&e.subarray&&W)return String.fromCharCode.apply(null,e.length===t?e:e.subarray(0,t));let n="";for(let i=0;i<t;i++)n+=String.fromCharCode(e[i]);return n})(a,r)},Q.utf8border=(e,t)=>{(t=t||e.length)>e.length&&(t=e.length);let n=t-1;for(;n>=0&&128==(192&e[n]);)n--;return n<0||0===n?t:n+X[e[n]]>t?n:t};const q=l,J=Y,$=Q,ee={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},te=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0},ne=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1},ie=Object.prototype.toString,{Z_NO_FLUSH:re,Z_FINISH:ae,Z_OK:oe,Z_STREAM_END:se,Z_NEED_DICT:le,Z_STREAM_ERROR:ce,Z_DATA_ERROR:de,Z_MEM_ERROR:fe}=g;function he(e){this.options=J.assign({chunkSize:65536,windowBits:15,to:""},e||{});const t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new te,this.strm.avail_out=0;let n=q.inflateInit2(this.strm,t.windowBits);if(n!==oe)throw new Error(ee[n]);if(this.header=new ne,q.inflateGetHeader(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=$.string2buf(t.dictionary):"[object ArrayBuffer]"===ie.call(t.dictionary)&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(n=q.inflateSetDictionary(this.strm,t.dictionary),n!==oe)))throw new Error(ee[n])}function ue(e,t){const n=new he(t);if(n.push(e),n.err)throw n.msg||ee[n.err];return n.result}he.prototype.push=function(e,t){const n=this.strm,i=this.options.chunkSize,r=this.options.dictionary;let a,o,s;if(this.ended)return!1;for(o=t===~~t?t:!0===t?ae:re,"[object ArrayBuffer]"===ie.call(e)?n.input=new Uint8Array(e):n.input=e,n.next_in=0,n.avail_in=n.input.length;;){for(0===n.avail_out&&(n.output=new Uint8Array(i),n.next_out=0,n.avail_out=i),a=q.inflate(n,o),a===le&&r&&(a=q.inflateSetDictionary(n,r),a===oe?a=q.inflate(n,o):a===de&&(a=le));n.avail_in>0&&a===se&&n.state.wrap>0&&0!==e[n.next_in];)q.inflateReset(n),a=q.inflate(n,o);switch(a){case ce:case de:case le:case fe:return this.onEnd(a),this.ended=!0,!1}if(s=n.avail_out,n.next_out&&(0===n.avail_out||a===se))if("string"===this.options.to){let e=$.utf8border(n.output,n.next_out),t=n.next_out-e,r=$.buf2string(n.output,e);n.next_out=t,n.avail_out=i-t,t&&n.output.set(n.output.subarray(e,e+t),0),this.onData(r)}else this.onData(n.output.length===n.next_out?n.output:n.output.subarray(0,n.next_out));if(a!==oe||0!==s){if(a===se)return a=q.inflateEnd(this.strm),this.onEnd(a),this.ended=!0,!0;if(0===n.avail_in)break}}return!0},he.prototype.onData=function(e){this.chunks.push(e)},he.prototype.onEnd=function(e){e===oe&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=J.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},s.Inflate=he,s.inflate=ue,s.inflateRaw=function(e,t){return(t=t||{}).raw=!0,ue(e,t)},s.ungzip=ue,s.constants=g;const we=Uint16Array.BYTES_PER_ELEMENT,be=Int32Array.BYTES_PER_ELEMENT,me=Uint32Array.BYTES_PER_ELEMENT,ge={METADATA:0,TERRAIN:1,DBROOT:2};ge.fromString=function(e){return"Metadata"===e?ge.METADATA:"Terrain"===e?ge.TERRAIN:"DbRoot"===e?ge.DBROOT:void 0};const ke=1953029805,_e=2917034100;return n((function(t,n){const r=ge.fromString(t.type);let a=t.buffer;i(t.key,a);const l=function(t){const n=new DataView(t);let i=0;const r=n.getUint32(i,!0);if(i+=me,r!==ke&&r!==_e)throw new e.RuntimeError("Invalid magic");const a=n.getUint32(i,r===ke);i+=me;const o=new Uint8Array(t,i),l=s.inflate(o);if(l.length!==a)throw new e.RuntimeError("Size of packet doesn't match header");return l}(a);a=l.buffer;const c=l.length;switch(r){case ge.METADATA:return function(t,n,i){const r=new DataView(t);let a=0;const s=r.getUint32(a,!0);if(a+=me,32301!==s)throw new e.RuntimeError("Invalid magic");const l=r.getUint32(a,!0);if(a+=me,1!==l)throw new e.RuntimeError("Invalid data type. Must be 1 for QuadTreePacket");const c=r.getUint32(a,!0);if(a+=me,2!==c)throw new e.RuntimeError("Invalid QuadTreePacket version. Only version 2 is supported.");const d=r.getInt32(a,!0);a+=be;const f=r.getInt32(a,!0);if(a+=be,32!==f)throw new e.RuntimeError("Invalid instance size.");const h=r.getInt32(a,!0);a+=be;const u=r.getInt32(a,!0);a+=be;const w=r.getInt32(a,!0);if(a+=be,h!==d*f+a)throw new e.RuntimeError("Invalid dataBufferOffset");if(h+u+w!==n)throw new e.RuntimeError("Invalid packet offsets");const b=[];for(let e=0;e<d;++e){const e=r.getUint8(a);++a,++a;const t=r.getUint16(a,!0);a+=we;const n=r.getUint16(a,!0);a+=we;const i=r.getUint16(a,!0);a+=we,a+=we,a+=we,a+=be,a+=be,a+=8;const s=r.getUint8(a++),l=r.getUint8(a++);a+=we,b.push(new o(e,t,n,i,s,l))}const m=[];let g=0;function k(e,t,n){let i=!1;if(4===n){if(t.hasSubtree())return;i=!0}for(let r=0;r<4;++r){const a=e+r.toString();if(i)m[a]=null;else if(n<4)if(t.hasChild(r)){if(g===d)return void console.log("Incorrect number of instances");const e=b[g++];m[a]=e,k(a,e,n+1)}else m[a]=null}}let _=0;const p=b[g++];""===i?++_:m[i]=p;return k(i,p,_),m}(a,c,t.quadKey);case ge.TERRAIN:return function(t,n,i){const r=new DataView(t),a=function(t){for(let i=0;i<4;++i){const i=r.getUint32(t,!0);if(t+=me,(t+=i)>n)throw new e.RuntimeError("Malformed terrain packet found.")}return t};let o=0;const s=[];for(;s.length<5;){const e=o;o=a(o);const n=t.slice(e,o);i.push(n),s.push(n)}return s}(a,c,n);case ge.DBROOT:return n.push(a),{buffer:a}}}))}));