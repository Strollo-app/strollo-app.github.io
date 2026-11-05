/* Modelo 3D esquemático de la Süleymaniye (escala aproximada en metros).
   Eje z: + hacia el patio (noroeste), - hacia la qibla y el jardín (sureste). Eje x: - hacia el Cuerno de Oro (noreste). */
window.STROLLO3D=window.STROLLO3D||{};
window.STROLLO3D.suleymaniye=function(T,scene){
  const M=(c,o)=>new T.MeshLambertMaterial(Object.assign({color:c},o||{}));
  const stone=M(0xE4DCCB),stone2=M(0xC9BEA9),lead=M(0x7C8B98),green=M(0x9DBB84),grass=M(0xAEBB9C),water=M(0x7FA7BE),dark=M(0x6E6459),gold=M(0xC9A24A),floor=M(0xC8B9A0),red=M(0xB4553A);
  const shell=[],inner=[];
  const add=(g,m,x,y,z,arr)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);scene.add(o);if(arr)arr.push(o);return o};
  const box=(w,h,d,m,x,y,z,arr)=>add(new T.BoxGeometry(w,h,d),m,x,y+h/2,z,arr);
  const cyl=(r,h,m,x,y,z,seg,arr)=>add(new T.CylinderGeometry(r,r,h,seg||24),m,x,y+h/2,z,arr);
  const dome=(r,m,x,y,z,arr)=>add(new T.SphereGeometry(r,32,16,0,Math.PI*2,0,Math.PI/2),m,x,y,z,arr);
  const semi=(r,m,x,y,z,rot,arr)=>{const o=add(new T.SphereGeometry(r,32,16,0,Math.PI,0,Math.PI/2),m,x,y,z,arr);o.rotation.y=rot;return o};
  // suelo, colina y agua
  add(new T.BoxGeometry(260,2,260),grass,0,-1,10);
  add(new T.BoxGeometry(120,2,260),water,-150,-14,10);
  add(new T.BoxGeometry(70,14,260),M(0xB9C3AB),-92,-8,10);
  // jardín y cementerio (detrás de la qibla)
  box(64,0.4,44,green,0,0,-52);
  for(let i=0;i<14;i++){const x=-28+((i*17)%56),z=-34-((i*11)%34);cyl(0.5,4,dark,x,0,z,6);add(new T.ConeGeometry(1.4,6,8),M(0x5E7A4C),x,6,z)}
  // sala de oración
  const wallH=22;
  const walls=[box(58,wallH,1.6,stone,0,0,-28.2,shell),box(58,wallH,1.6,stone,0,0,28.2,shell),box(1.6,wallH,58,stone,-28.2,0,0,shell),box(1.6,wallH,58,stone,28.2,0,0,shell)];
  box(58,0.3,58,floor,0,0,0,inner); // alfombra
  add(new T.BoxGeometry(58,1,58),stone2,0,wallH+0.5,0,shell); // tejado plano lateral
  box(30,11,30,stone,0,wallH,0,shell); // torre central
  cyl(14,3.5,stone,0,wallH+11,0,32,shell);
  const mainDome=dome(13.6,lead,0,wallH+14.5,0,shell);
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2;box(1,1.6,0.4,stone2,Math.cos(a)*14.05,wallH+11.6,Math.sin(a)*14.05,shell)} // ventanas del tambor
  semi(13,lead,0,wallH+11,-15,0,shell);semi(13,lead,0,wallH+11,15,Math.PI,shell); // semicúpulas en el eje
  [-1,1].forEach(sx=>{for(let i=0;i<5;i++)dome(4.2,lead,sx*21.5,wallH+1,-20+i*10,shell)}); // cupulitas laterales
  [[-22,-22],[22,-22],[-22,22],[22,22]].forEach(([x,z])=>dome(5,lead,x,wallH+1,z,shell));
  // interior: pilares, columnas, mihrab, minbar, lámparas
  [[-10,-10],[10,-10],[-10,10],[10,10]].forEach(([x,z])=>box(4.5,wallH+10,4.5,stone2,x,0,z,inner));
  [[-17,-4],[-17,4],[17,-4],[17,4]].forEach(([x,z])=>cyl(1.1,wallH-2,red,x,0,z,16,inner));
  box(4,9,1.2,M(0xF2EEE6),0,0,-27,inner);box(2.4,6,0.4,gold,0,1,-26.3,inner);
  box(1.6,7,6,M(0xF2EEE6),5,0,-24,inner);
  add(new T.TorusGeometry(9,0.25,6,48),dark,0,6,0,inner).rotation.x=Math.PI/2;
  // patio
  box(1.4,9,46,stone,-28.3,0,52,shell);box(1.4,9,46,stone,28.3,0,52,shell);box(58,9,1.4,stone,0,0,74.6,shell);
  box(58,0.3,46,stone2,0,0,52);
  [[0,30.5],[0,73.5]].forEach(([x,z])=>{for(let i=0;i<9;i++)dome(2.6,lead,-24+i*6,9,z)});
  [-1,1].forEach(sx=>{for(let i=0;i<7;i++)dome(2.6,lead,sx*25.5,9,35+i*6)});
  for(let i=0;i<9;i++){cyl(0.45,6,red,-24+i*6,0,33.3,8);cyl(0.45,6,red,-24+i*6,0,70.7,8)}
  box(5,1.4,3.5,stone2,0,0,52);
  box(4,8,1.6,stone,0,0,75.2);dome(2.4,lead,0,8,75.2);
  // minaretes: dos altos junto a la sala, dos bajos al fondo del patio
  const minaret=(x,z,h,balc)=>{cyl(2.2,4,stone2,x,0,z,12);cyl(1.5,h,stone,x,4,z,12);for(let i=1;i<=balc;i++)cyl(2.5,0.7,stone2,x,4+h*(0.45+0.5*i/(balc+0.6)),z,12);add(new T.ConeGeometry(1.7,9,12),lead,x,4+h+4.5,z);cyl(0.15,3,gold,x,4+h+8.5,z,6)};
  minaret(-29.5,29.5,62,3);minaret(29.5,29.5,62,3);minaret(-29.5,75.5,46,2);minaret(29.5,75.5,46,2);
  // tumbas
  const turbe=(r,h,x,z)=>{cyl(r,h,stone,x,0,z,8);cyl(r+2.2,0.5,stone2,x,0,z,8);for(let i=0;i<16;i++){const a=i/16*Math.PI*2;cyl(0.3,h*0.7,stone2,x+Math.cos(a)*(r+1.8),0,z+Math.sin(a)*(r+1.8),6)}add(new T.CylinderGeometry(r+2.4,r+2.4,0.5,16),lead,x,h*0.7,z);dome(r*0.82,lead,x,h,z)};
  turbe(7,10,7,-50);turbe(4.5,7,-15,-44);
  // terraza (noreste) y madrasas (suroeste)
  box(14,0.6,90,stone2,-44,0,8);for(let i=0;i<10;i++)box(0.3,1.1,0.3,dark,-50.8,0.6,-36+i*9.5);
  box(16,7,92,stone2,46,0,8);for(let i=0;i<9;i++)dome(2.8,lead,46,7,-32+i*10);
  // tumba de Sinan (esquina norte)
  box(5,2.2,5,stone,-40,0,84);box(1.2,1.6,1.2,M(0xF2EEE6),-40,2.2,84);
  return {target:[0,14,8],radius:230,azimuth:-0.75,elevation:0.5,
    pins:{avlu:[0,4,52],columnas:[-10,26,-10],cupula:[0,52,0],mihrab:[0,12,-27],lamparas:[9,9,6],turbe:[7,19,-50],hurrem:[-15,15,-44],sinan:[-40,6,84],terraza:[-44,3,22]},
    shell,inner};
};
