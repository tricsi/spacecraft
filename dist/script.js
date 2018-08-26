var T3D,Game;!function(t){t.RAD_SCALE=Math.PI/180;class e{constructor(t,e,s){this.x=0,this.y=0,this.z=0,this.set(t,e,s)}set(t,s,r){return t instanceof e?(this.x=t.x,this.y=t.y,this.z=t.z,this):("number"==typeof t&&(this.x=t),"number"==typeof s&&(this.y=s),"number"==typeof r&&(this.z=r),this)}max(){return Math.max(this.x,this.y,this.z)}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}distance(t){return Math.sqrt((this.x-t.x)*(this.x-t.x)+(this.y-t.y)*(this.y-t.y)+(this.z-t.z)*(this.z-t.z))}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}cross(t){let e=this.x,s=this.y,r=this.z,i=t.x,a=t.y,n=t.z;return this.x=s*n-r*a,this.y=r*i-e*n,this.z=e*a-s*i,this}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}scale(t){return this.x*=t instanceof e?t.x:t,this.y*=t instanceof e?t.y:t,this.z*=t instanceof e?t.z:t,this}normalize(){var t=this.length();return t>0&&this.scale(1/t),this}clone(){return new e(this.x,this.y,this.z)}invert(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}toArray(){return[this.x,this.y,this.z]}}t.Vec3=e;class s{constructor(t){this.data=t||[0,0,0,0,0,0,0,0,0]}transpose(){const t=this.data,e=t[1],s=t[2],r=t[5];return t[1]=t[3],t[2]=t[6],t[3]=e,t[5]=t[7],t[6]=s,t[7]=r,this}}t.Mat3=s;class r{constructor(t){this.data=t||[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}clone(){return new r(this.data)}multiply(t){const e=this.data,s=e[0],r=e[1],i=e[2],a=e[3],n=e[4],o=e[5],h=e[6],c=e[7],l=e[8],u=e[9],m=e[10],f=e[11],d=e[12],p=e[13],v=e[14],x=e[15],g=t[0],y=t[1],w=t[2],z=t[3],T=t[4],A=t[5],b=t[6],D=t[7],M=t[8],S=t[9],R=t[10],E=t[11],F=t[12],P=t[13],k=t[14],L=t[15];return this.data=[s*g+r*T+i*M+a*F,s*y+r*A+i*S+a*P,s*w+r*b+i*R+a*k,s*z+r*D+i*E+a*L,n*g+o*T+h*M+c*F,n*y+o*A+h*S+c*P,n*w+o*b+h*R+c*k,n*z+o*D+h*E+c*L,l*g+u*T+m*M+f*F,l*y+u*A+m*S+f*P,l*w+u*b+m*R+f*k,l*z+u*D+m*E+f*L,d*g+p*T+v*M+x*F,d*y+p*A+v*S+x*P,d*w+p*b+v*R+x*k,d*z+p*D+v*E+x*L],this}scale(t){return this.multiply([t.x,0,0,0,0,t.y,0,0,0,0,t.z,0,0,0,0,1])}translate(t){return this.multiply([1,0,0,0,0,1,0,0,0,0,1,0,t.x,t.y,t.z,1])}rotateX(t){const e=Math.cos(t),s=Math.sin(t);return this.multiply([1,0,0,0,0,e,s,0,0,-s,e,0,0,0,0,1])}rotateY(t){const e=Math.cos(t),s=Math.sin(t);return this.multiply([e,0,-s,0,0,1,0,0,s,0,e,0,0,0,0,1])}rotateZ(t){const e=Math.cos(t),s=Math.sin(t);return this.multiply([e,s,0,0,-s,e,0,0,0,0,1,0,0,0,0,1])}rotate(t){return this.rotateX(t.x).rotateY(t.y).rotateZ(t.z)}perspective(t,e,s,r){const i=Math.tan(.5*Math.PI-.5*t),a=1/(s-r);return this.multiply([i/e,0,0,0,0,i,0,0,0,0,(s+r)*a,-1,0,0,s*r*a*2,0])}invert(){const t=this.data,e=t[0],r=t[1],i=t[2],a=t[4],n=t[5],o=t[6],h=t[8],c=t[9],l=t[10],u=l*n-o*c,m=-l*a+o*h,f=c*a-n*h,d=e*u+r*m+i*f;if(!d)return null;const p=1/d;return new s([u*p,(-l*r+i*c)*p,(o*r-i*n)*p,m*p,(l*e-i*h)*p,(-o*e+i*a)*p,f*p,(-c*e+r*h)*p,(n*e-r*a)*p])}}t.Mat4=r;class i{constructor(t,e){this.transform=t,this.scale=e||t.scale}getTranslate(){let t=this.transform.translate.clone(),e=this.transform.parent;for(;e;)t.scale(e.scale).add(e.translate),e=e.parent;return t}getScale(){let t=this.scale.clone().scale(.5),e=this.transform.parent;for(;e;)t.scale(e.scale),e=e.parent;return t}}t.Collider=i;t.Sphere=class extends i{intersect(t){let e=null,s=this.getTranslate(),r=t.getTranslate(),i=s.distance(r),a=this.getScale().max()+t.getScale().max();return i<a&&(e=r.sub(s).normalize().scale(a-i)),e}};t.Box=class extends i{intersect(t){let s=this.getTranslate(),r=this.getScale(),i=t.getTranslate(),a=t.getScale().max(),n=new e(Math.max(s.x-r.x,Math.min(i.x,s.x+r.x)),Math.max(s.y-r.y,Math.min(i.y,s.y+r.y)),Math.max(s.z-r.z,Math.min(i.z,s.z+r.z))),o=n.distance(i),h=null;return o<a&&(h=i.sub(n).normalize().scale(a-o)),h}};class a{constructor(t=[]){this.translate=new e(t[0]||0,t[1]||0,t[2]||0),this.rotate=new e(t[3]||0,t[4]||0,t[5]||0),this.scale=new e(t[6]||1,t[7]||1,t[8]||1)}matrix(e){return(e=e||new r).scale(this.scale).rotate(this.rotate.clone().scale(t.RAD_SCALE)).translate(this.translate),this.parent?this.parent.matrix(e):e}}t.Transform=a;t.Camera=class{constructor(t=1,s=45,r=.1,i=100){this.rotate=new e,this.position=new e,this.fov=s,this.aspect=t,this.near=r,this.far=i}transform(t){return t.matrix().rotate(this.rotate.clone().invert()).translate(this.position.clone().invert())}perspective(){return(new r).perspective(this.fov,this.aspect,this.near,this.far)}};class n extends e{constructor(){super(...arguments),this.faces=[]}addFace(t){return this.faces.push(t),this}}class o{constructor(t,e,s){this.verts=[],this.normals=[],t.addFace(this),e.addFace(this),s.addFace(this),this.verts.push(t,e,s),this.normal=e.clone().sub(t).cross(s.clone().sub(t)).normalize()}calcNormals(t){return this.verts.forEach((e,s)=>{let r;e.faces.forEach(e=>{this.normal.dot(e.normal)>t&&(r=r?r.add(e.normal):e.normal.clone())}),this.normals.push(r?r.normalize():this.normal)}),this}pushVerts(t){return this.verts.forEach(e=>{t.push(...e.toArray())}),this}pushNormals(t){return this.normals.forEach(e=>{t.push(...e.toArray())}),this}}t.Mesh=class{constructor(e,s,r=[],i=0,a=360){if(s<2)return;r.length<2&&(r=this.sphere(r.length>0?r[0]+2:Math.ceil(s/2)+1));const n=this.createVerts(s,r,0,a),o=this.createFaces(n,s,r.length/2),h=Math.cos(i*t.RAD_SCALE),c=[],l=[];o.forEach(t=>{t.calcNormals(h).pushVerts(c).pushNormals(l)}),this.verts=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.verts),e.bufferData(e.ARRAY_BUFFER,new Float32Array(c),e.STATIC_DRAW),this.normals=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.normals),e.bufferData(e.ARRAY_BUFFER,new Float32Array(l),e.STATIC_DRAW),this.length=c.length/3}sphere(t){const e=[];if(t<3)return;let s=Math.PI/(t-1);for(let r=1;r<t-1;r++){let t=s*r;e.push(Math.sin(t)/2),e.push(Math.cos(t)/2)}return e}createVerts(e,s,r,i){r*=t.RAD_SCALE;let a=[],o=((i*=t.RAD_SCALE)-r)/e;a.push(new n(0,.5,0)),a.push(new n(0,-.5,0));for(let t=0;t<e;t++){let e=o*t+r,i=Math.cos(e),h=Math.sin(e);for(let t=0;t<s.length;t+=2){let e=new n(i,0,h);e.scale(s[t]).y=s[t+1],a.push(e)}}return a}createFaces(t,e,s){const r=[];let i;for(let a=1;a<e;++a){i=a*s+2,r.push(new o(t[0],t[i],t[i-s])),r.push(new o(t[1],t[i-1],t[i+s-1]));for(let e=0;e<s-1;e++){let a=i+e;r.push(new o(t[a+1],t[a-s],t[a])),r.push(new o(t[a-s+1],t[a-s],t[a+1]))}}r.push(new o(t[0],t[2],t[i])),r.push(new o(t[1],t[i+s-1],t[s+1]));for(let e=0;e<s-1;e++){let s=i+e;r.push(new o(t[e+3],t[s],t[e+2])),r.push(new o(t[s+1],t[s],t[e+3]))}return r}};t.Item=class{constructor(t,e,s){this.childs=[],this.active=!0,this.mesh=t,this.color=e,this.transform=new a(s)}add(t){return this.childs.push(t),t.transform.parent=this.transform,this}};t.Shader=class{constructor(t,e,s){this.attribs={},this.location={},this.gl=t,this.program=t.createProgram(),this.indices=t.createBuffer();const r=this.program;t.attachShader(r,this.create(t.VERTEX_SHADER,e)),t.attachShader(r,this.create(t.FRAGMENT_SHADER,s)),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)||(console.log(t.getProgramInfoLog(r)),t.deleteProgram(r))}create(t,e){const s=this.gl,r=s.createShader(t);return s.shaderSource(r,e),s.compileShader(r),s.getShaderParameter(r,s.COMPILE_STATUS)||console.log(s.getShaderInfoLog(r)),r}attrib(t,e,s){const r=this.gl;this.location[t]||(this.location[t]=r.getAttribLocation(this.program,t));const i=this.location[t];return r.bindBuffer(r.ARRAY_BUFFER,e),r.enableVertexAttribArray(i),r.vertexAttribPointer(i,s,r.FLOAT,!1,0,0),this}uniform(t,e){const s=this.gl;this.location[t]||(this.location[t]=s.getUniformLocation(this.program,t));const r=this.location[t];if("number"==typeof e)return s.uniform1f(r,e),this;switch(e.length){case 2:s.uniform2fv(r,e);break;case 3:s.uniform3fv(r,e);break;case 4:s.uniform4fv(r,e);break;case 9:s.uniformMatrix3fv(r,!1,e);break;case 16:s.uniformMatrix4fv(r,!1,e)}return this}}}(T3D||(T3D={})),function(t){t.Hero=class extends T3D.Item{init(){const t=this.transform;t.translate.set(0,2,2),t.rotate.set(0,0,0),this.active=!0,this.transform=t,this.collider=new T3D.Sphere(t),this.x=0,this.rad=.4,this.acc=-.02,this.speed=new T3D.Vec3,this.speedTime=0,this.scale=.8,this.scaleTime=0,this.tokens=0}left(){this.x>=0&&this.x--}right(){this.x<=0&&this.x++}jump(){this.collide&&(this.acc=.065)}boost(){this.speedTime=75}dash(){this.scaleTime=40}update(){if(this.speed.z+=((this.active?this.speedTime?.12:.07:0)-this.speed.z)/20,this.speedTime-=this.speedTime>0?1:0,this.scale+=((this.scaleTime?.6:.8)-this.scale)/5,this.scaleTime-=this.scaleTime>0?1:0,!this.active)return;this.acc-=this.acc>-.02?.01:0;let t=this.transform.translate,e=this.scale,s=this.transform.rotate;s.z=90+25*(t.x-this.x),s.y=(s.y+100*this.speed.z)%360,this.speed.y+=this.acc,t.x+=(this.x-t.x)/7,t.y+=this.speed.y,t.z-=t.z/30,this.active=t.y>-10,this.transform.scale.set(e,e,e)}}}(Game||(Game={})),function(t){t.Map=class{constructor(t,e){this.config=t.match(/.{1,4}/g),this.seed=e}init(){t.Rand.seed=this.seed,this.count=0,this.last=0,this.update()}update(){if(--this.count>0)return;let e;do{e=t.Rand.get(this.config.length-1,0,!0)}while(e==this.last);this.row=this.config[e].split("").map(t=>parseInt(t,16)),this.count=this.row.shift(),this.last=e}}}(Game||(Game={})),function(t){t.Platform=class extends T3D.Item{update(t){let e=this.transform.translate,s=this.token.transform.rotate;e.z+=t;let r=e.z>2;r&&(e.z-=11);let i=1;return e.z<-8?i=e.z+9:e.z>1&&(i=2-e.z),this.transform.scale.set(i,i,i),s.y=(s.y+1.5)%360,r}intersect(t,e=!1){let s,r=this.token,i=this.fence;if(r.active&&r.collider.intersect(t.collider)&&(r.active=!1,t.tokens++),i.active&&(s=i.collider.intersect(t.collider))&&(e&&s.x&&t.jump(),t.transform.translate.add(s),t.speed.y+=s.y),this.active)return(s=this.collider.intersect(t.collider))&&(e&&s.x&&t.jump(),t.transform.translate.add(s),t.speed.y+=s.y),s}}}(Game||(Game={})),function(t){t.Scene=class extends T3D.Item{constructor(e,s){super(),this.map=s,this.hero=new t.Hero(new T3D.Mesh(e,10),[.9,.9,.9,10]),this.add(this.hero),this.platforms=[];let r=new T3D.Mesh(e,4,[.55,.5,.65,.4,.65,-.4,.55,-.5]),i=new T3D.Mesh(e,12,[.4,.5,.5,.4,.5,-.4,.4,-.5],30),a=new T3D.Mesh(e,9,[.45,.3,.45,.5,.5,.5,.5,-.5,.45,-.5,.45,-.3],30),n=[.3,.3,1,30],o=[1,1,.3,30],h=[1,.3,.3,0];for(let e=0;e<33;e++){let e=new t.Platform(r,n),s=new T3D.Item(a,o,[,1,,90,,,.5,.1,.5]),c=new T3D.Item(i,h,[,1.8,,,,,,1.5]);s.collider=new T3D.Sphere(s.transform),c.collider=new T3D.Box(c.transform),e.collider=new T3D.Box(e.transform),e.token=s,e.fence=c,e.add(s).add(c),this.platforms.push(e),this.add(e)}this.init()}init(){this.row=9,this.distance=0,this.hero.init(),this.map.init();let t=0;for(let e=-9;e<2;e++)for(let s=-1;s<=1;s++){let r=this.platforms[t++];r.transform.rotate.y=45,r.transform.translate.set(s,-1,e),r.fence.active=r.token.active=!1,r.active=!0}}input(t){const e=this.hero;if(e.active)switch(t){case 37:e.left();break;case 39:e.right();break;case 38:e.jump();break;case 40:e.dash();break;case 32:e.boost()}else 32===t&&this.init()}updateRow(t){this.row-=t,this.row<=-.5&&(this.row+=11),this.index=3*Math.round(this.row)+Math.round(this.hero.transform.translate.x)+1}getIndex(t=0){let e=this.platforms.length,s=this.index+t;return s<0?s+e:s>=e?s-e:s}update(){this.hero.update();let t=!1,e=this.hero,s=e.speed.z;this.platforms.forEach((e,r)=>{if(e.update(s)){let s=this.map.row[r%3];e.active=(1&s)>0,e.transform.translate.y=(2&s)>0?0:-1,e.token.active=(4&s)>0,e.token.transform.rotate.y=0,e.fence.active=(8&s)>0,t=!0}}),t&&this.map.update(),this.distance+=s,this.updateRow(s),e.collide=this.platforms[this.getIndex()].intersect(e),[-3,3,-1,1,-2,2,-4,4].forEach(t=>{let s=this.getIndex(t);this.platforms[s].intersect(e,1==t||-1==t)})}}}(Game||(Game={})),function(t){function e(t,e){return(e||document).querySelector(t)}function s(t,e,s){t.addEventListener(e,s,!1)}t.fullscreen=function(){document.webkitFullscreenElement?document.webkitExitFullscreen&&(document.webkitExitFullscreen(),document.exitPointerLock()):(document.documentElement.webkitRequestFullscreen(),i.requestPointerLock())};class r{static get(t=1,e=0,s=!0){r.seed=(9301*r.seed+49297)%233280;let i=e+r.seed/233280*(t-e);return s?Math.round(i):i}}r.seed=Math.random(),t.Rand=r;let i=e("#game"),a=e("#hud"),n=i.getContext("webgl"),o=new t.Scene(n,new t.Map("1393411135103015471740504515",42)),h=new T3D.Camera(i.width/i.height),c={position:new T3D.Vec3(5,15,3),ambient:[.2,.2,.2],diffuse:[.8,.8,.8],specular:[.8,.8,.8]},l=new T3D.Shader(n,"precision mediump float;attribute vec3 aPos, aNorm;uniform mat4 uWorld, uProj;uniform mat3 uInverse;uniform float uStroke;varying vec4 vPos;varying vec3 vNorm;void main(void) {vec3 pos = aPos + (aNorm * uStroke);vPos = uWorld * vec4(pos, 1.0);vNorm = uInverse * aNorm;gl_Position = uProj * vPos;}","precision mediump float;uniform mat4 uWorld;uniform vec4 uColor;uniform vec3 uLight;uniform vec3 uAmbient;uniform vec3 uDiffuse;uniform vec3 uSpecular;uniform float uLevels;varying vec4 vPos;varying vec3 vNorm;void main(void) {vec3 lightDir = normalize(uLight - vPos.xyz);vec3 normal = normalize(vNorm);vec3 eyeDir = normalize(-vPos.xyz);vec3 reflectionDir = reflect(-lightDir, normal);float specularWeight = 0.0;if (uColor.w > 0.0) { specularWeight = pow(max(dot(reflectionDir, eyeDir), 0.0), uColor.w); }float diffuseWeight = max(dot(normal, lightDir), 0.0);vec3 weight = uAmbient + uSpecular * specularWeight  + uDiffuse * diffuseWeight;vec3 color = uColor.xyz * weight;if (uLevels > 1.0) { color = floor(color * uLevels) * (1.0 / uLevels); }gl_FragColor = vec4(color, 1);}");function u(){i.width=i.clientWidth,i.height=i.clientHeight,h.aspect=i.width/i.height,n.viewport(0,0,i.width,i.height)}function m(t,e=0){t.childs.forEach(t=>{m(t,e)});t.transform.scale;if(!t.active||!t.mesh)return;let s=t.transform.matrix().invert();s&&(n.cullFace(e>0?n.FRONT:n.BACK),n.useProgram(l.program),l.attrib("aPos",t.mesh.verts,3).attrib("aNorm",t.mesh.normals,3).uniform("uWorld",h.transform(t.transform).data).uniform("uProj",h.perspective().data).uniform("uInverse",s.transpose().data).uniform("uColor",e?[0,0,0,1]:t.color).uniform("uLight",c.position.clone().sub(h.position).toArray()).uniform("uAmbient",c.ambient).uniform("uDiffuse",c.diffuse).uniform("uSpecular",c.specular).uniform("uStroke",e||0).uniform("uLevels",e?0:5),n.drawArrays(n.TRIANGLES,0,t.mesh.length))}function f(){requestAnimationFrame(f),o.update(),n.clear(n.COLOR_BUFFER_BIT),m(o),m(o,.02),a.textContent=`Distance: ${o.distance.toFixed(2)}\nTokens: ${o.hero.tokens}`}s(window,"load",()=>{h.position.set(0,.7,5),h.rotate.x=-.85,n.clearColor(0,0,0,0),n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),u(),function(){let t=0,e=0,r=[],i=!1;s(document,"touchstart",s=>{let r=s.touches[0];t=r.clientX,e=r.clientY,i=!0}),s(document,"touchmove",s=>{if(!i)return;let a=s.touches[0];!r[39]&&a.clientX-t>20?(r[39]=!0,o.input(39),i=!1):!r[37]&&a.clientX-t<-20?(r[37]=!0,o.input(37),i=!1):!r[40]&&a.clientY-e>20?(r[40]=!0,o.input(40),i=!1):!r[38]&&a.clientY-e<-20&&(r[38]=!0,o.input(38),i=!1)}),s(document,"touchend",t=>{i&&(r[32]=!0,o.input(32)),r[32]=r[37]=r[38]=r[39]=r[40]=i=!1}),s(document,"keydown",t=>{o.input(t.keyCode)}),s(window,"resize",u)}(),f()})}(Game||(Game={}));