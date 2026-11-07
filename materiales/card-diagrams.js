'use strict';
// Diagramas vectoriales de apoyo. Las claves corresponden a los IDs estables de content.js.
const cardDiagrams = (() => {
 const line=(x1,y1,x2,y2,cls='')=>`<path class="${cls}" d="M${x1} ${y1}L${x2} ${y2}"/>`;
 const text=(x,y,t,cls='')=>`<text class="${cls}" x="${x}" y="${y}">${t}</text>`;
 const dot=(x,y,t='',cls='')=>`<circle class="point ${cls}" cx="${x}" cy="${y}" r="4"/>${t?text(x+9,y-8,t,cls):''}`;
 const circle=(x,y,r,cls='')=>`<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
 const axes=(x=160,y=100)=>line(30,y,360,y,'axis')+line(x,15,x,170,'axis')+text(350,y-8,'Re','muted')+text(x+8,24,'Im','muted');
 const disk=(x=180,y=94,r=65)=>circle(x,y,r,'area');
 const arrow=(x,y,cls='')=>`<path class="${cls}" d="M${x-5} ${y-5}L${x} ${y}L${x+5} ${y-5}"/>`;
 const plot=(fn,x0,y0,w,h,cls='')=>{
  const points=Array.from({length:101},(_,i)=>{const x=i/100;return `${i?'L':'M'}${x0+x*w} ${y0-fn(x)*h}`;});
  return `<path class="${cls}" d="${points.join(' ')}"/>`;
 };
 const diagrams={};
 const add=(id,caption,body)=>diagrams[id]={caption,body};
 add('c0','El conjugado refleja el punto sobre el eje real; ambos tienen el mismo módulo.',
  axes(110,90)+line(110,90,155,150)+line(110,90,155,30,'accent')+line(155,30,155,150,'dashed muted')+dot(155,150,'3 − 4i')+dot(155,30,'3 + 4i','accent')+text(51,133,'|z| = 5')+text(245,94,'reflejo','muted'));
 add('c1','El módulo r es la distancia al origen y θ es el ángulo con el eje real positivo.',
  axes(135,125)+line(135,125,265,40)+dot(265,40,'z = r eⁱᶿ')+`<path class="accent" d="M178 125A43 43 0 0 0 171 101"/>`+text(181,115,'θ','accent')+text(194,73,'r'));
 const roots=Array.from({length:5},(_,k)=>{const a=2*Math.PI*k/5,x=160+65*Math.cos(a),y=93-65*Math.sin(a);return line(160,93,x,y,'muted dashed')+dot(x,y);}).join('');
 add('c2','Ejemplo: las cinco raíces de 1 están sobre el círculo unidad, separadas por 2π/5.',
  circle(160,93,65)+roots+text(250,65,'w⁵ = 1')+text(250,95,'|w| = 1')+text(250,125,'Δθ = 2π/5'));
 add('c3','Para cada punto del abierto hay un disco pequeño que queda completamente adentro.',
  `<path class="area dashed" d="M75 50C110 10 205 25 235 60S300 115 250 149S120 174 80 130S45 80 75 50Z"/>`+circle(163,91,30,'accent dashed')+dot(163,91,'a')+line(163,91,193,91,'accent')+text(198,80,'r','accent')+text(285,75,'Ω'));
 add('c4','El anillo 1 ≤ |z| ≤ 2 contiene sus bordes y está acotado: es compacto.',
  circle(175,95,68,'area')+circle(175,95,34,'hole')+line(175,95,243,95,'accent')+text(250,100,'2')+text(180,85,'1')+dot(175,95)+text(270,140,'bordes incluidos','muted'));
 add('c5','ℂ sin el origen sigue siendo conexo: se puede rodear el punto que falta.',
  axes(175,96)+circle(175,96,5,'hole accent')+dot(90,96,'a')+dot(260,96,'b')+`<path d="M90 96Q175 -15 260 96"/>`+text(141,155,'0 excluido','accent'));
 const convergence=axes(55,150)+plot(x=>x,55,150,265,110,'muted')+plot(x=>x**4,55,150,265,110)+plot(x=>x**16,55,150,265,110,'accent')+text(313,172,'1')+text(44,38,'1')+text(95,45,'n = 1, 4, 16')+text(170,130,'n crece →','accent');
 add('c6','En cada x < 1, xⁿ tiende a cero, pero cerca de 1 los valores siguen siendo próximos a 1.',convergence);
 add('c8','La derivada compleja debe dar el mismo resultado al acercarse por cualquier dirección.',
  axes(180,105)+dot(180,105,'a')+line(80,105,168,105)+line(180,168,180,117,'accent')+line(260,25,192,93,'dashed')+text(42,90,'h real')+text(196,158,'h imaginario','accent')+text(275,49,'otro h','muted'));
 add('c10','Una biholomorfía tiene una inversa holomorfa que recupera cada punto del dominio.',
  `<ellipse class="area" cx="85" cy="92" rx="49" ry="64"/><ellipse class="area" cx="305" cy="92" rx="59" ry="45"/><path d="M140 65Q195 25 243 65M235 56L243 65L231 67M243 123Q195 165 140 123M149 120L140 123L144 133"/>`+dot(85,92,'z')+dot(305,92,'f(z)')+text(174,38,'f')+text(169,169,'f⁻¹'));
 add('c11','Multiplicar por f′(a) ≠ 0 gira y escala las direcciones, conservando su ángulo.',
  line(60,135,60,55)+line(60,135,130,135,'accent')+`<path class="muted" d="M60 118H77V135"/>`+text(78,70,'90°')+text(167,94,'f′(a) →')+line(270,135,310,66)+line(270,135,339,175,'accent')+`<path class="muted" d="M278 121L292 129L284 143"/>`+text(310,119,'90°'));
 add('c12','La rama principal corta el semieje real no positivo para elegir −π < Arg z < π.',
  axes(175,95)+line(30,95,175,95,'accent thick')+circle(175,95,5,'hole accent')+dot(268,45,'z')+line(175,95,268,45)+text(40,125,'corte','accent')+text(207,150,'−π < Arg z < π'));
 add('c13','Después de una vuelta, el punto vuelve al inicio pero un argumento continuo aumentó 2π.',
  circle(170,95,63)+dot(233,95)+dot(170,95,'0','accent')+`<path class="accent" d="M233 95A63 63 0 1 0 170 158M159 151L170 158L160 164"/>`+text(254,78,'θ = 0')+text(254,108,'θ = 2π')+text(254,138,'mismo z','muted'));
 add('c14','La parametrización recorre γ; γ′(t) indica la dirección y la velocidad del recorrido.',
  `<path d="M45 135C95 135 92 40 165 65S270 135 345 45"/>`+dot(182,73,'γ(t)')+line(182,73,245,105,'accent')+`<path class="accent" d="M232 93L245 105L230 106"/>`+text(240,80,'γ′(t)','accent')+text(43,161,'γ(a)')+text(308,31,'γ(b)'));
 add('c15','La cota ML multiplica una cota M de |f| sobre el camino por su longitud L.',
  `<path d="M50 120C105 15 195 170 290 60"/>`+text(105,57,'longitud L')+text(225,109,'|f| ≤ M','accent')+text(85,165,'|∫γ f dz| ≤ M · L'));
 const cauchy=disk()+dot(180,94,'centro')+dot(208,116,'a','accent')+text(264,49,'γ ↶')+text(270,95,'f holomorfa')+text(270,119,'en el disco','muted');
 add('c16','El punto a debe estar dentro de γ y f debe ser holomorfa también en el interior.',cauchy);
 add('c17','La misma circunferencia permite recuperar f(a) y todas sus derivadas a partir del borde.',
  disk(125,92,62)+dot(125,92,'a','accent')+text(213,67,'f(a), f′(a), f″(a), …')+line(182,92,245,92)+text(210,126,'valores en γ → derivadas'));
 add('c19','Con una cota M fija en el borde, un radio R mayor da una cota M/R menor para |f′(a)|.',
  circle(150,95,32,'dashed')+circle(150,95,68)+dot(150,95,'a')+line(150,95,218,95,'accent')+text(182,86,'R','accent')+text(250,75,'|f| ≤ M en el borde')+text(250,111,'|f′(a)| ≤ M/R'));
 add('c21','El residuo es solo el coeficiente de (z−a)⁻¹; los demás términos no contribuyen a la integral circular.',
  text(34,55,'Laurent alrededor de a')+text(25,98,'… + a₋₂/(z−a)² +')+`<rect class="area" x="204" y="75" width="100" height="37" rx="5"/>`+text(214,99,'a₋₁/(z−a)')+text(311,99,'+ a₀ + …')+line(254,114,254,141,'accent')+text(210,163,'residuo: a₋₁','accent'));
 add('c23','Para un círculo antihorario el índice es 1 en el interior y 0 en el exterior.',
  circle(155,95,66)+dot(155,95,'índice 1')+dot(300,95,'índice 0','accent')+text(114,24,'γ ↶'));
 add('c24','En un contorno simple antihorario se suman los residuos de los polos interiores.',
  disk(175,95,69)+dot(148,72,'a₁','accent')+dot(192,122,'a₂','accent')+dot(311,73,'a₃','muted')+text(267,123,'a₃ no entra','muted')+text(53,178,'∮γ f dz = 2πi (Res(f,a₁) + Res(f,a₂))'));
 add('c25','La clasificación depende de cuántos términos de potencias negativas tiene Laurent.',
  line(132,35,132,147,'axis')+line(264,35,264,147,'axis')+text(18,45,'Removible')+text(164,45,'Polo')+text(292,45,'Esencial')+text(39,91,'0')+text(153,91,'finitos')+text(293,91,'infinitos')+text(32,133,'sin(z)/z','muted')+text(166,133,'1/z²','muted')+text(290,133,'exp(1/z)','muted')+text(58,174,'Número de términos con exponentes negativos'));
 add('c27','Los ceros 1/n se acumulan en 0. Si 0 está dentro del dominio, la función debe ser idénticamente nula.',
  `<rect class="area dashed" x="40" y="25" width="325" height="120" rx="45"/>`+line(64,102,343,102,'axis')+dot(85,102,'0','accent')+Array.from({length:9},(_,i)=>dot(85+235/(i+1),102)).join('')+text(220,75,'1/n → 0')+text(55,171,'El punto de acumulación está en Ω'));
 add('c28','Sobre el borde, f(z)+g(z) queda a distancia |g(z)| < |f(z)| de f(z), sin alcanzar el origen.',
  dot(58,100,'0')+line(58,100,235,100,'dashed')+circle(235,100,54,'area')+dot(235,100,'f(z)')+dot(265,70,'f(z)+g(z)','accent')+line(235,100,265,70,'accent')+text(112,130,'|f(z)|')+text(292,145,'radio |g(z)|')+text(62,175,'El disco no contiene 0; z recorre el borde.'));
 add('c29','Para f(z)=1+z² en |z|≤1, el máximo del módulo vale 2 y se alcanza en z=±1, sobre el borde.',
  disk(165,95,63)+dot(102,95,'−1','accent')+dot(228,95,'1','accent')+text(268,82,'f(±1) = 2')+text(268,112,'|f(z)| ≤ 2')+text(117,177,'disco |z| ≤ 1','muted'));
 const meanPoints=Array.from({length:8},(_,k)=>dot(170+63*Math.cos(2*Math.PI*k/8),95-63*Math.sin(2*Math.PI*k/8),'','accent')).join('');
 add('c30','Para f(z)=1+z² sobre |z|=1, los valores rodean su promedio complejo f(0)=1.',
  circle(170,95,63)+meanPoints+dot(170,95,'media = 1')+text(270,73,'valores de f(z)','accent')+text(270,106,'no de |f(z)|')+text(106,177,'plano de valores de f','muted'));
 add('c31','Una primitiva hace que la integral entre dos puntos no dependa del camino.',
  dot(65,100,'a')+dot(305,100,'b')+`<path d="M65 100Q175 -15 305 100"/><path class="accent" d="M65 100Q175 210 305 100"/>`+text(143,49,'camino 1')+text(140,155,'camino 2','accent')+text(107,100,'∫ = F(b) − F(a)'));
 const harmonic=(()=>{let body='';const project=(x,y)=>[190+42*x+20*y,92+12*y-10*(x*x-y*y)];for(let k=-2;k<=2;k+=.5){for(const swap of [false,true]){let d='';for(let i=0;i<=50;i++){let t=-2+4*i/50,[x,y]=swap?project(k,t):project(t,k);d+=(i?'L':'M')+x+' '+y;}body+=`<path class="${swap?'accent':'muted'}" d="${d}"/>`;}}return body;})();
 add('c32','La gráfica de u=x²−y² es una silla: uₓₓ=2 y uᵧᵧ=−2, por eso Δu=0.',harmonic+text(40,176,'u(x,y) = x² − y² · vista en perspectiva'));
 const levels=(()=>{let body=axes(190,94);for(const c of [-1,-.5,.5,1]){for(const sign of [-1,1]){let d='';for(let k=0;k<=50;k++){const t=-1.5+3*k/50;const x=c>0?sign*Math.sqrt(t*t+c):t;const y=c>0?t:sign*Math.sqrt(t*t-c);d+=(k?'L':'M')+(190+x*42)+' '+(94-y*42);}body+=`<path d="${d}"/>`;}
 let d='';for(let k=0;k<=50;k++){const x=.25+1.4*k/50;d+=(k?'L':'M')+(190+x*42)+' '+(94-c/(2*x)*42);}body+=`<path class="accent" d="${d}"/>`; }return body;})();
 add('c33','Para f(z)=z², u=x²−y² y v=2xy. Sus curvas de nivel se cruzan perpendicularmente fuera de 0.',levels+text(34,178,'u constante')+text(233,178,'v constante','accent'));
 return diagrams;
})();
function cardDiagramMarkup(card){
 const drawing=cardDiagrams[card.id];
 if(!drawing)return '';
 const caption=drawing.caption.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<figure class="card-diagram"><svg viewBox="0 0 400 190" role="img" aria-label="${caption}">${drawing.body}</svg><figcaption>${mathHTML(drawing.caption)}</figcaption></figure>`;
}
