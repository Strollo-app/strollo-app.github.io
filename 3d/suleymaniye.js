/* Maqueta 3D de la Süleymaniye (escala aproximada en metros).
   Eje z: + hacia el patio (noroeste), - hacia la qibla y el jardín (sureste). Eje x: - hacia el Cuerno de Oro (noreste). */
window.STROLLO3D=window.STROLLO3D||{};
window.STROLLO3D.suleymaniye=function(T,scene){
  /* ---- texturas procedurales ---- */
  const tex=(w,h,draw,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx||1,ry||1);t.anisotropy=4;return t};
  const ashlar=(g,w,h)=>{g.fillStyle='#E2D7C2';g.fillRect(0,0,w,h);const rows=8,rh=h/rows;
    for(let r=0;r<rows;r++){const off=(r%2)*w/8;for(let x=-w/4;x<w;x+=w/4){const v=200+Math.floor(Math.random()*30);g.fillStyle=`rgb(${v+18},${v+8},${v-12})`;g.fillRect(x+off+1,r*rh+1,w/4-2,rh-2)}}
    g.strokeStyle='rgba(120,105,85,.35)';g.lineWidth=1.2;for(let r=0;r<=rows;r++){g.beginPath();g.moveTo(0,r*rh);g.lineTo(w,r*rh);g.stroke()}
    for(let i=0;i<900;i++){g.fillStyle=`rgba(90,75,55,${Math.random()*.06})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}};
  const leadT=(g,w,h)=>{g.fillStyle='#7F8C96';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=w/16){g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x,0,2,h);g.fillStyle='rgba(0,0,0,.10)';g.fillRect(x+w/16-2,0,2,h)}
    for(let y=0;y<h;y+=h/10){g.fillStyle='rgba(0,0,0,.07)';g.fillRect(0,y,w,1.5)}};
  const stoneTex=tex(256,256,ashlar,1,1),leadTex=tex(256,256,leadT,1,1),stoneSmall=tex(256,256,ashlar,1,1);
  const M=(c,o)=>new T.MeshLambertMaterial(Object.assign({color:c},o||{}));
  const S=(o)=>new T.MeshStandardMaterial(Object.assign({roughness:.9,metalness:0},o));
  const stoneM=(rx,ry)=>{const t=stoneTex.clone();t.needsUpdate=true;t.repeat.set(rx,ry);return S({map:t,color:0xffffff})};
  const stone=S({map:stoneSmall,color:0xffffff}),stone2=S({color:0xD3C7B1}),lead=S({map:leadTex,color:0xffffff,roughness:.55,metalness:.35,flatShading:true}),
    green=M(0x8FAE75),grass=M(0x9EAD8C),water=S({color:0x5E8FAA,roughness:.25,metalness:.1}),dark=M(0x4B4136),gold=S({color:0xD4AF37,roughness:.3,metalness:.9}),
    marble=S({color:0xEDE7DC,roughness:.6}),win=M(0x2F3438),red=S({color:0xA8503A,roughness:.6}),roof=M(0xB0573B),cypress=M(0x405B35),street=M(0xB8AE9C),plane=M(0x5C7A44);
  const shell=[],inner=[];
  const add=(g,m,x,y,z,arr,noShadow)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);if(!noShadow){o.castShadow=true;o.receiveShadow=true}scene.add(o);if(arr)arr.push(o);return o};
  const box=(w,h,d,m,x,y,z,arr,ns)=>add(new T.BoxGeometry(w,h,d),m,x,y+h/2,z,arr,ns);
  const cyl=(r,h,m,x,y,z,seg,arr,r2)=>add(new T.CylinderGeometry(r2==null?r:r2,r,h,seg||24),m,x,y+h/2,z,arr);
  const dome=(r,m,x,y,z,arr,seg)=>add(new T.SphereGeometry(r,seg||24,10,0,Math.PI*2,0,Math.PI/2),m,x,y,z,arr);
  const alem=(x,y,z,s,arr)=>{s=s||1;cyl(0.12*s,1.4*s,gold,x,y,z,6,arr);add(new T.SphereGeometry(0.35*s,8,6),gold,x,y+1.5*s,z,arr);add(new T.TorusGeometry(0.45*s,0.1*s,6,12,Math.PI*1.4),gold,x,y+2.3*s,z,arr)};
  // ventana en arco (oscura, ligeramente saliente) orientada según la normal de la pared
  const archWin=(x,y,z,w,h,ry,arr)=>{const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(-w/2,h-w/2);sh.absarc(0,h-w/2,w/2,Math.PI,0,true);sh.lineTo(w/2,0);sh.lineTo(-w/2,0);
    const o=add(new T.ShapeGeometry(sh),win,x,y,z,arr,true);o.rotation.y=ry;return o};

  /* ---- terreno, colina y ciudad ---- */
  add(new T.BoxGeometry(420,2,420),grass,0,-1,10,null);
  add(new T.BoxGeometry(160,2,420),water,-230,-22,10,null,true);
  const slope=add(new T.BoxGeometry(130,2,420),M(0x93A27F),-140,-11,10);slope.rotation.z=-0.17;
  // calles
  box(10,0.2,420,street,-60,0,10,null,true);box(10,0.2,420,street,62,0,10,null,true);box(420,0.2,10,street,0,0,108,null,true);box(420,0.2,10,street,0,0,-86,null,true);
  // manzanas de casas con tejados rojos
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const house=(x,z)=>{const w=6+rnd()*8,d=6+rnd()*8,h=6+rnd()*10;box(w,h,d,M([0xE9E1D2,0xE3D2B8,0xD9C9B0,0xEFE8DC][Math.floor(rnd()*4)]),x,0,z);const r=add(new T.ConeGeometry(Math.max(w,d)*0.72,3,4),roof,x,h+1.5,z);r.rotation.y=Math.PI/4};
  for(let i=0;i<70;i++){const side=Math.floor(rnd()*4);let x,z;
    if(side===0){x=72+rnd()*100;z=-140+rnd()*280}else if(side===1){x=-120+rnd()*180;z=118+rnd()*60}else if(side===2){x=-50+rnd()*110;z=-96-rnd()*60}else{x=-118+rnd()*40;z=-140+rnd()*280}
    if(x<-75&&x>-125)house(x,z);else if(x>=-50||x<=-125)house(x,z)}
  // árboles
  const tree=(x,z,cyp)=>{cyl(0.4,cyp?3:4,dark,x,0,z,6);if(cyp)add(new T.ConeGeometry(1.5,8,8),cypress,x,7,z);else add(new T.SphereGeometry(3.2,8,6),plane,x,6.5,z)};

  /* ---- jardín y cementerio (detrás de la qibla) ---- */
  box(66,0.4,46,green,0,0,-53,null,true);
  for(let i=0;i<22;i++){const x=-30+((i*23)%60),z=-33-((i*13)%38);if(Math.abs(x-7)<10&&Math.abs(z+50)<10)continue;if(Math.abs(x+15)<7&&Math.abs(z+44)<7)continue;tree(x,z,true)}
  for(let i=0;i<40;i++){const x=-30+((i*37)%60),z=-32-((i*17)%40);box(0.4,1.2,0.25,marble,x,0,z)} // lápidas
  box(66,3,0.8,stone2,0,0,-76.2);

  /* ---- sala de oración ---- */
  const H=24,hw=29;
  const wallMatX=stoneM(6,2.5),wallMatZ=stoneM(6,2.5);
  [box(58,H,1.6,wallMatX,0,0,-hw+0.8,shell),box(58,H,1.6,wallMatX,0,0,hw-0.8,shell),box(1.6,H,58,wallMatZ,-hw+0.8,0,0,shell),box(1.6,H,58,wallMatZ,hw-0.8,0,0,shell)];
  box(58,0.3,58,S({color:0xA9483A,roughness:1}),0,0,0,inner); // alfombra roja
  add(new T.BoxGeometry(58,1,58),stone2,0,H+0.5,0,shell);
  // ventanas: dos filas en cada muro + fila alta
  [[-hw-0.05,Math.PI*1.5,'x'],[hw+0.05,Math.PI/2,'x'],[-hw-0.05,Math.PI,'z'],[hw+0.05,0,'z']].forEach(([p,ry,ax])=>{
    for(let i=0;i<7;i++){const t=-21+i*7;[[3,4.6,2.2],[10.5,4,2],[17.5,3.4,1.7]].forEach(([y,h,w])=>{if(ax==='x')archWin(p,y,t,w,h,ry,shell);else archWin(t,y,p,w,h,ry,shell)})}});
  // torre central, contrafuertes y torrecillas
  const tw=32,th=12;box(tw,th,tw,stoneM(4,1.4),0,H,0,shell);
  for(let i=0;i<5;i++){const t=-12+i*6;archWin(t,H+3,tw/2+0.05,2,6,0,shell);archWin(t,H+3,-tw/2-0.05,2,6,Math.PI,shell);archWin(tw/2+0.05,H+3,t,2,6,Math.PI/2,shell);archWin(-tw/2-0.05,H+3,t,2,6,-Math.PI/2,shell)}
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{const x=sx*(tw/2+1.5),z=sz*(tw/2+1.5);cyl(2.6,th+5,stone2,x,H,z,8,shell);dome(2.4,lead,x,H+th+5,z,shell,12);alem(x,H+th+7.3,z,0.6,shell)});
  // tambor con ventanas y gran cúpula
  cyl(14.2,4.5,stoneM(10,0.6),0,H+th,0,32,shell);
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2;archWin(Math.sin(a)*14.25,H+th+0.6,Math.cos(a)*14.25,1.2,3.2,a,shell)}
  dome(13.9,lead,0,H+th+4.5,0,shell,32);alem(0,H+th+4.5+13.9,0,1.8,shell);
  // semicúpulas en el eje de la qibla
  [[-1,0],[1,Math.PI]].forEach(([sz,rot])=>{const o=add(new T.SphereGeometry(13,24,10,0,Math.PI,0,Math.PI/2),lead,0,H+th-1,sz*16,shell);o.rotation.y=sz<0?Math.PI:0;
    box(28,th-1,1,stoneM(3,1),0,H,sz*(tw/2+0.6),shell)});
  // cupulitas laterales sobre las galerías interiores
  [-1,1].forEach(sx=>{for(let i=0;i<5;i++){const z=-20+i*10;cyl(3.6,1.6,stone2,sx*21.5,H+1,z,12,shell);dome(3.6,lead,sx*21.5,H+2.6,z,shell,16);alem(sx*21.5,H+6.2,z,0.45,shell)}});
  // galerías exteriores de dos pisos a los lados (noreste y suroeste)
  [-1,1].forEach(sx=>{const x=sx*(hw+3.2);box(5,0.6,56,stone2,x,0,0);for(let i=0;i<14;i++){const z=-26+i*4;cyl(0.35,5.5,marble,x+sx*2.1,0.6,z,8);cyl(0.3,4.5,marble,x+sx*2.1,7,z,8)}
    box(5.2,0.8,56,stone2,x,6.1,0);box(5.2,0.6,56,lead,x,11.5,0)});
  /* ---- interior ---- */
  [[-10.5,-10.5],[10.5,-10.5],[-10.5,10.5],[10.5,10.5]].forEach(([x,z])=>box(5,H+12,5,stone2,x,0,z,inner));
  [[-17,-5],[-17,5],[17,-5],[17,5]].forEach(([x,z])=>cyl(1.2,H-3,S({color:0x9A6B5A,roughness:.4}),x,0,z,16,inner));
  box(5,10,1.2,marble,0,0,-27.4,inner);const mih=new T.Shape();mih.moveTo(-1.3,0);mih.lineTo(-1.3,4.5);mih.absarc(0,4.5,1.3,Math.PI,0,true);mih.lineTo(1.3,0);
  add(new T.ShapeGeometry(mih),S({color:0x8E7A5A}),0,1,-26.75,inner,true);
  const mb=box(1.8,7,7,marble,5.5,0,-23.5,inner);add(new T.ConeGeometry(1.4,3,4),lead,5.5,8.5,-26,inner).rotation.y=Math.PI/4;
  add(new T.TorusGeometry(9.5,0.2,6,64),dark,0,5.5,0,inner,true).rotation.x=Math.PI/2;
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;add(new T.SphereGeometry(0.35,6,4),S({color:0xFFE7A8,emissive:0x8a6a20}),Math.cos(a)*9.5,5.1,Math.sin(a)*9.5,inner,true)}
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2+Math.PI/4;add(new T.SphereGeometry(0.45,8,6),marble,Math.cos(a)*9.5,4.4,Math.sin(a)*9.5,inner,true)} // huevos de avestruz

  /* ---- patio ---- */
  box(1.4,9,46,stoneM(4,0.8),-28.3,0,52,shell);box(1.4,9,46,stoneM(4,0.8),28.3,0,52,shell);box(58,9,1.4,stoneM(5,0.8),0,0,74.6,shell);
  box(55,0.3,43,marble,0,0,52,null,true);
  for(let i=0;i<5;i++)for(let j=0;j<4;j++)box(9.5,0.32,9.5,S({color:(i+j)%2?0xE4DCCE:0xF2ECE2,roughness:.5}),-21+i*10.5,0,37+j*10,null,true);
  // pórtico con cupulitas y columnas
  const portico=(x1,z1,x2,z2,n)=>{for(let i=0;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t;cyl(0.5,7,i%3===0?S({color:0x9B4A3B,roughness:.35}):S({color:0xD9CEC4,roughness:.4}),x,0,z,10);if(i<n){const mx=x+(x2-x1)/n/2,mz=z+(z2-z1)/n/2;box(Math.abs(x2-x1)>1?(x2-x1)/n:3.6,1.4,Math.abs(z2-z1)>1?(z2-z1)/n:3.6,stone2,mx,7,mz);dome(2.4,lead,mx,8.4,mz,null,12)}}};
  portico(-24,33,24,33,8);portico(-24,71,24,71,8);portico(-25.5,36,-25.5,68,6);portico(25.5,36,25.5,68,6);
  box(5.2,1.2,3.6,marble,0,0,52);box(4.4,0.3,2.8,water,0,1.2,52,null,true);
  box(6,10,2,stone2,0,0,75.4);dome(2.6,lead,0,10,75.4,null,12);archWin(0,0,76.45,3,7,0);
  /* ---- minaretes ---- */
  const minaret=(x,z,h,balc)=>{cyl(2.4,5,stone2,x,0,z,12);cyl(1.6,h,stoneM(1,6),x,5,z,12,null,1.45);
    for(let i=1;i<=balc;i++){const y=5+h*(0.42+0.52*i/(balc+0.5));cyl(2.7,0.8,stone2,x,y,z,16);cyl(2.75,0.9,S({color:0xE6DED0}),x,y+0.8,z,16,null,2.7)}
    add(new T.ConeGeometry(1.75,10,12),lead,x,5+h+5,z);alem(x,5+h+10,z,0.9)};
  minaret(-29.5,29.5,66,3);minaret(29.5,29.5,66,3);minaret(-29.5,75.5,50,2);minaret(29.5,75.5,50,2);
  /* ---- mausoleos ---- */
  const turbe=(r,h,x,z)=>{cyl(r,h,stoneM(3,1),x,0,z,8);for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;archWin(x+Math.sin(a)*r*0.93,2,z+Math.cos(a)*r*0.93,1.6,4,a)}
    cyl(r+2.4,0.5,stone2,x,0,z,8);for(let i=0;i<16;i++){const a=i/16*Math.PI*2;cyl(0.3,h*0.62,marble,x+Math.cos(a)*(r+1.9),0.5,z+Math.sin(a)*(r+1.9),6)}
    add(new T.CylinderGeometry(r+2.6,r+2.6,0.6,16),lead,x,h*0.66,z);cyl(r*0.84,1.2,stone2,x,h,z,16);dome(r*0.84,lead,x,h+1.2,z,null,20);alem(x,h+1.2+r*0.84,z,0.8)};
  turbe(7,10,7,-50);turbe(4.6,7.5,-15,-44);
  /* ---- terraza y madrasas ---- */
  box(14,0.6,92,marble,-44,0,8,null,true);for(let i=0;i<13;i++)box(0.25,1.1,0.25,dark,-50.8,0.6,-38+i*7.5);for(let i=0;i<6;i++)tree(-38,-34+i*14,false);
  [-1,1].forEach(k=>{const z=k>0?30:-14;box(15,7,40,stoneM(4,0.8),48,0,z);for(let i=0;i<4;i++){dome(2.8,lead,48,7,z-15+i*10,null,12);alem(48,9.8,z-15+i*10,0.4)}for(let i=0;i<8;i++)archWin(40.45,2,z-17+i*5,1.4,3,-Math.PI/2)});
  /* ---- tumba de Sinan ---- */
  box(6,1.6,6,stone,-40,0,84);box(3.2,0.4,3.2,marble,-40,1.6,84);box(1,1.8,1,marble,-40,2,84);add(new T.SphereGeometry(0.7,10,8),marble,-40,4.3,84);
  return {target:[0,14,8],radius:230,azimuth:-0.75,elevation:0.5,shadow:160,
    earth:'https://earth.google.com/web/@41.01604,28.96399,60a,420d,35y,320h,60t,0r',
    pins:{avlu:[0,4,52],columnas:[-10.5,30,-10.5],cupula:[0,57,0],mihrab:[0,12,-27],lamparas:[9.5,9,0],turbe:[7,20,-50],hurrem:[-15,15,-44],sinan:[-40,7,84],terraza:[-44,3,22]},
    shell,inner};
};
