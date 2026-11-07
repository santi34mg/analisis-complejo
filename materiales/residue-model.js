'use strict';
// Datos exactos de los ejemplos; re/im son las partes del residuo, no del polo.
const residueExamples=[
 {id:'opposite',label:'1/(z² − 1) · residuos opuestos',tex:String.raw`\frac1{z^2-1}`,
  points:[{x:-1,y:0,name:'−1',tex:'-1',order:1,re:-.5,im:0,resTex:String.raw`-\frac12`},{x:1,y:0,name:'1',tex:'1',order:1,re:.5,im:0,resTex:String.raw`\frac12`}],
  explanation:'Los polos simples tienen residuos opuestos. Si el contorno encierra ambos, sus contribuciones se cancelan; si encierra solo uno, la integral no es cero.',
  try:'Con centro 0 y radio 1.4 se cancelan. Mové el centro real a 1 y reducí el radio a 0.6 para encerrar solo el polo 1.'},
 {id:'simple',label:'1/z · un polo simple',tex:String.raw`\frac1z`,
  points:[{x:0,y:0,name:'0',tex:'0',order:1,re:1,im:0,resTex:'1'}],
  explanation:'El residuo en 0 es 1. Cada vuelta antihoraria suma 2πi; una vuelta horaria resta 2πi. El radio no cambia la integral mientras el origen siga dentro.',
  try:'Dejá el origen dentro y cambiá el número de vueltas. Después mové el círculo para dejarlo fuera.'},
 {id:'double-zero',label:'1/z² · polo doble, residuo cero',tex:String.raw`\frac1{z^2}`,
  points:[{x:0,y:0,name:'0',tex:'0',order:2,re:0,im:0,resTex:'0'}],
  explanation:'Hay un polo doble, pero no hay término 1/z en Laurent. Por eso la integral es cero incluso al rodear el polo. Tener un polo adentro no garantiza una integral distinta de cero.',
  try:'Compará con 1/z usando el mismo círculo. Ambas funciones tienen un polo en 0, pero sus residuos son distintos.'},
 {id:'double-nonzero',label:'eᶻ/z² · polo doble, residuo 1',tex:String.raw`\frac{e^z}{z^2}`,
  points:[{x:0,y:0,name:'0',tex:'0',order:2,re:1,im:0,resTex:'1'}],
  explanation:'El desarrollo eᶻ/z² = z⁻² + z⁻¹ + 1/2 + … tiene coeficiente 1 en z⁻¹. La integral coincide con la de 1/z para cualquier contorno que evite 0, aunque el polo sea doble.',
  try:'Alterná con 1/z² y con 1/z sin mover el círculo: el residuo, no el orden del polo, determina la contribución.'},
 {id:'imaginary',label:'1/(z² + 1) · residuos imaginarios',tex:String.raw`\frac1{z^2+1}`,
  points:[{x:0,y:-1,name:'−i',tex:'-i',order:1,re:0,im:.5,resTex:String.raw`\frac i2`},{x:0,y:1,name:'i',tex:'i',order:1,re:0,im:-.5,resTex:String.raw`-\frac i2`}],
  explanation:'Los polos están en ±i y sus residuos son imaginarios opuestos. Encerrar solo i da una integral real positiva; encerrar ambos da cero.',
  try:'Elegí centro real 0, centro imaginario 1 y radio 0.6: queda solo i adentro. Invertí la orientación para cambiar el signo.'},
 {id:'same-sign',label:'z/(z² + 1) · residuos que se suman',tex:String.raw`\frac z{z^2+1}`,
  points:[{x:0,y:-1,name:'−i',tex:'-i',order:1,re:.5,im:0,resTex:String.raw`\frac12`},{x:0,y:1,name:'i',tex:'i',order:1,re:.5,im:0,resTex:String.raw`\frac12`}],
  explanation:'Los polos siguen en ±i, pero ahora ambos residuos valen 1/2. Al encerrar ambos, las contribuciones se suman en lugar de cancelarse.',
  try:'Compará con 1/(z²+1), manteniendo centro 0 y radio 1.4: los mismos polos no implican la misma integral.'},
 {id:'removable',label:'sin(z)/z, f(0)=1 · removible',tex:String.raw`f(z)=\begin{cases}\frac{\sin z}{z}&z\ne0\\1&z=0\end{cases}`,
  points:[{x:0,y:0,name:'0 (removible)',tex:'0',order:0,re:0,im:0,resTex:'0',removable:true}],
  explanation:'Se usa la extensión f(0)=1. La función resultante es entera: 0 no es un polo y la integral sobre cualquier lazo es cero, incluso si el contorno pasa por 0.',
  try:'Poné el centro real en 1 y el radio en 1: el origen queda sobre el círculo y la integral sigue estando definida gracias a la extensión.'},
 {id:'entire',label:'z² · sin singularidades',tex:'z^2',points:[],
  explanation:'La función es entera y tiene primitiva z³/3 en todo ℂ. No hay polos ni contribuciones: la integral sobre cualquier lazo cerrado es cero.',
  try:'Cambiá centro, radio, orientación y vueltas. La integral sigue siendo cero.'}
];
function evaluateResidueContour(example,{x=0,y=0,r=1.4,orientation=1,turns=1}={}){
 const winding=orientation*turns;
 const points=example.points.map(p=>{
  const distance=Math.hypot(p.x-x,p.y-y);
  const onContour=Math.abs(distance-r)<1e-8;
  return {...p,onContour,index:onContour?null:distance<r?winding:0};
 });
 const boundary=points.some(p=>p.onContour&&!p.removable);
 const sum=points.reduce((s,p)=>{
  if(p.removable||p.index===null)return s;
  return {re:s.re+p.index*p.re,im:s.im+p.index*p.im};
 },{re:0,im:0});
 // ∮f dz = 2πi (a+ib) = π(-2b+2ai).
 return {points,boundary,sum,integral:boundary?null:{re:sum.im===0?0:-2*sum.im,im:sum.re===0?0:2*sum.re}};
}
function residuePiTex(value){
 if(!value)return String.raw`\text{no definida}`;
 const part=(coefficient,imaginary)=>{
  const abs=Math.abs(coefficient);
  return (abs===1?'':String(abs))+String.raw`\pi`+(imaginary?' i':'');
 };
 let tex=value.re?(value.re<0?'-':'')+part(value.re,false):'';
 if(value.im)tex+=(value.im<0?'-':tex?'+':'')+part(value.im,true);
 return tex||'0';
}
if(typeof module!=='undefined')module.exports={residueExamples,evaluateResidueContour,residuePiTex};
