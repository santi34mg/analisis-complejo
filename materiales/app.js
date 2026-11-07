'use strict';
const $=s=>document.querySelector(s), root=$('#workspace');
let state={known:[],attempts:{},done:[],notes:{}};
let storageOK=true;
try{const saved=JSON.parse(localStorage.getItem('plano-v1'));if(saved&&Array.isArray(saved.known)&&Array.isArray(saved.done)&&saved.attempts&&saved.notes)state=saved;}catch{storageOK=false;}
let tab='cards',chapter=0,ci=0,onlyPending=false,revealed=false,qi=0,mode='all',quizQueue=[],answered=false,lab='residues';
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const filter=arr=>arr.filter(x=>!chapter||x.ch===chapter);
function save(){try{localStorage.setItem('plano-v1',JSON.stringify(state));}catch{storageOK=false;}}
function ref(s){return `<a class="ref" href="../AnalisisComplejoUM-17deAgosto.pdf#page=${pages[s]}" target="_blank" rel="noopener">Consultar §${s} · PDF p. ${pages[s]} ↗</a>`;}
function shuffle(a){return [...a].sort(()=>Math.random()-.5);}
$('#tabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(!b)return;tab=b.dataset.tab;$('#tabs').querySelectorAll('button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-current',x===b?'page':'false');});render();};
function render(){({cards:renderCards,quiz:renderQuiz,exercises:renderExercises,labs:renderLabs})[tab]();}
function renderCards(message=''){
 const list=filter(cards).filter(c=>!onlyPending||!state.known.includes(c.id));
 ci=Math.min(ci,Math.max(0,list.length-1));
 const c=list[ci];
 root.innerHTML=`<div class="section-head"><div><h2>Tarjetas de repaso</h2><p class="sub">Clic para dar vuelta. Arrastrá a la izquierda para revisar o a la derecha si ya la sabés.</p></div><button class="btn secondary" id="pending">${onlyPending?'Ver todas':'Solo pendientes'}</button></div>
 ${c?`<div class="flash-deck">
 <div class="swipe-indicators" aria-hidden="true"><span class="swipe-label review-label">← Revisar</span><span class="swipe-label learned-label">Aprendida →</span></div>
 <div class="flash-card ${revealed?'is-flipped':''}" tabindex="0" role="button" aria-label="${escapeHTML(c.title)}. Enter o espacio: dar vuelta. Flecha izquierda: revisar. Flecha derecha: aprendida." aria-pressed="${revealed}" aria-describedby="card-help">
 <div class="flash-rotator">
 <div class="flash-face flash-front panel" aria-hidden="${revealed}"><span class="eyebrow">CAPÍTULO ${c.ch} · TARJETA ${ci+1} DE ${list.length}${state.known.includes(c.id)?' · APRENDIDA':''}</span><h3>${mathHTML(c.title)}</h3><span class="flip-hint">Clic para ver la respuesta ↻</span></div>
 <div class="flash-face flash-back panel" aria-hidden="${!revealed}"><span class="eyebrow">RESPUESTA · CAPÍTULO ${c.ch}</span><h3>${mathHTML(c.title)}</h3><div class="answer">${mathHTML(c.answer)}</div><div class="example">${mathHTML(c.example)}</div>${cardDiagramMarkup(c)}<span class="flip-hint">Clic para volver a la pregunta ↻</span></div>
 </div></div></div>
 <div class="flash-meta">${ref(c.section)}<p id="card-help" class="sub">También podés usar Enter para girar y las flechas ← / → para clasificar.</p></div>`:`<div class="empty panel">No quedan tarjetas pendientes en este capítulo. Podés volver a verlas todas.</div>`}
 <p class="card-status sub" role="status">${escapeHTML(message)}</p>`;
 $('#pending').onclick=()=>{onlyPending=!onlyPending;ci=0;revealed=false;renderCards();};
 if(!c)return;
 const board=$('.flash-card'),deck=$('.flash-deck');
 let start=null,dx=0,dy=0,moved=false,suppressClick=false,settling=false;
 const flip=()=>{
  if(settling)return;
  revealed=!revealed;
  board.classList.toggle('is-flipped',revealed);
  board.setAttribute('aria-pressed',String(revealed));
  board.setAttribute('aria-label',(revealed?c.answer+' '+c.example+' '+(cardDiagrams[c.id]?.caption||''):c.title)+'. Enter o espacio: dar vuelta. Flecha izquierda: revisar. Flecha derecha: aprendida.');
  $('.flash-front').setAttribute('aria-hidden',String(revealed));
  $('.flash-back').setAttribute('aria-hidden',String(!revealed));
 };
 const resetDrag=()=>{
  start=null;dx=0;dy=0;
  board.classList.remove('is-held');deck.classList.remove('is-held','toward-review','toward-learned');
  board.style.removeProperty('--drag-x');board.style.removeProperty('--drag-angle');
 };
 const classify=(learned)=>{
  if(settling)return;
  settling=true;
  const hadFocus=document.activeElement===board;
  if(learned){if(!state.known.includes(c.id))state.known.push(c.id);}
  else state.known=state.known.filter(id=>id!==c.id);
  save();
  // Al quitar una pendiente, la siguiente ocupa su lugar. El repaso vuelve a circular.
  ci=onlyPending&&learned?ci:(ci+1)%list.length;
  revealed=false;
  deck.classList.add(learned?'toward-learned':'toward-review');
  board.classList.add(learned?'exit-right':'exit-left');
  const next=()=>{
   if(!board.isConnected)return;
   renderCards(learned?'Tarjeta marcada como aprendida.':'Tarjeta guardada para revisar.');
   if(hadFocus)(document.querySelector('.flash-card')||$('#pending')).focus({preventScroll:true});
  };
  window.setTimeout(next,180);
 };
 board.onclick=()=>{if(suppressClick){suppressClick=false;return;}flip();};
 board.onkeydown=e=>{
  if(e.key==='Enter'||e.key===' '){e.preventDefault();flip();}
  else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();classify(e.key==='ArrowRight');}
 };
 board.onpointerdown=e=>{
  if(settling||start||!e.isPrimary||e.button!==0)return;
  start={x:e.clientX,y:e.clientY,id:e.pointerId};moved=false;suppressClick=false;
  board.classList.add('is-held');deck.classList.add('is-held');
  board.setPointerCapture(e.pointerId);
 };
 board.onpointermove=e=>{
  if(!start||e.pointerId!==start.id)return;
  dx=e.clientX-start.x;dy=e.clientY-start.y;
  if(Math.hypot(dx,dy)>8)moved=true;
  if(Math.abs(dx)<Math.abs(dy)&&Math.abs(dx)<12)return;
  board.style.setProperty('--drag-x',dx+'px');
  board.style.setProperty('--drag-angle',Math.max(-14,Math.min(14,dx/22))+'deg');
  deck.classList.toggle('toward-review',dx<0);deck.classList.toggle('toward-learned',dx>0);
 };
 board.onpointerup=e=>{
  if(!start||e.pointerId!==start.id)return;
  const distance=e.clientX-start.x,vertical=e.clientY-start.y;
  const threshold=Math.min(100,board.getBoundingClientRect().width*.24);
  suppressClick=moved||Math.hypot(distance,vertical)>8;
  const accepted=Math.abs(distance)>=threshold&&Math.abs(distance)>Math.abs(vertical)*1.2;
  resetDrag();
  if(accepted)classify(distance>0);
 };
 board.onpointercancel=()=>{suppressClick=true;resetDrag();};
 board.onlostpointercapture=()=>{if(start){suppressClick=moved;resetDrag();}};
}
function renderQuiz(){if(!quizQueue.length){quizQueue=shuffle(filter(questions).filter(q=>mode==='all'||q.type===mode));qi=0;}answered=false;
const q=quizQueue[qi],attempted=Object.values(state.attempts),right=attempted.filter(x=>x.correct).length;
root.innerHTML=`<div class="section-head"><div><h2>Preguntas</h2><p class="sub">Cada respuesta incluye una explicación. Las preguntas aparecen en orden aleatorio.</p></div><span class="badge">Últimas respuestas: ${right}/${attempted.length} correctas</span></div><div class="chips">${[['all','Todo'],['vf','Verdadero / falso'],['theory','Opción múltiple · teoría'],['calc','Opción múltiple · cálculo']].map(([v,t])=>`<button data-mode="${v}" class="${mode===v?'selected':''}">${t}</button>`).join('')}</div>${q?`<div class="quiz-box panel"><span class="eyebrow">PREGUNTA ${qi+1} / ${quizQueue.length} · CAPÍTULO ${q.ch}</span><div class="progress"><span style="width:${qi/quizQueue.length*100}%"></span></div><h3>${mathHTML(q.prompt)}</h3><div class="options">${q.options.map((o,i)=>`<button class="option" data-option="${i}"><span class="letter">${String.fromCharCode(65+i)}</span>${mathHTML(o)}</button>`).join('')}</div><div id="feedback" role="status"></div>${ref(q.section)}<div class="actions" id="quiz-actions"></div></div>`:'<div class="empty panel">No hay preguntas de este tipo en el capítulo seleccionado. Elegí otro tipo o todos los capítulos.</div>'}`;
root.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;quizQueue=[];renderQuiz();});if(!q)return;
root.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const n=+b.dataset.option,correct=n===q.correct;state.attempts[q.id]={correct,choice:n};save();root.querySelectorAll('[data-option]').forEach(x=>{x.disabled=true;if(+x.dataset.option===q.correct)x.classList.add('correct');else if(x===b)x.classList.add('wrong');});$('#feedback').innerHTML=`<div class="feedback ${correct?'':'error'}"><strong>${correct?'Correcto.':'Incorrecto.'}</strong> ${mathHTML(q.explanation)}</div>`;$('#quiz-actions').innerHTML=`<button class="btn" id="advance">${qi===quizQueue.length-1?'Terminar ronda':'Siguiente pregunta →'}</button>`;$('#advance').onclick=()=>{if(qi<quizQueue.length-1){qi++;renderQuiz();}else{root.innerHTML=`<div class="panel empty"><h2>Ronda completada.</h2><p>En esta selección: ${quizQueue.filter(x=>state.attempts[x.id]?.correct).length} de ${quizQueue.length} respuestas correctas.</p><button class="btn" id="again">Practicar otra vez</button></div>`;$('#again').onclick=()=>{quizQueue=[];renderQuiz();};}};});}
function renderExercises(){const list=filter(exercises);root.innerHTML=`<div class="section-head"><div><h2>Ejercicios</h2><p class="sub">Cada ejercicio tiene una pista y una solución para consultar después de resolverlo.</p></div><button class="btn secondary" id="print">Imprimir lista</button></div><div class="exercise-grid">${list.map((e,i)=>`<article class="panel exercise"><div class="meta"><span class="eyebrow">EJERCICIO ${i+1} · CAP. ${e.ch}</span><span class="badge">${e.level}</span></div><h3>${mathHTML(e.title)}</h3><p>${mathHTML(e.prompt)}</p><label class="note-label" for="note-${e.id}">Notas</label><textarea id="note-${e.id}" data-note="${e.id}" placeholder="Escribí tus notas…">${escapeHTML(state.notes[e.id]||'')}</textarea><details><summary>Ver pista</summary><p>${mathHTML(e.hint)}</p></details><details><summary>Ver solución explicada</summary><p>${mathHTML(e.solution)}</p></details>${ref(e.section)}<label><input type="checkbox" data-done="${e.id}" ${state.done.includes(e.id)?'checked':''}> Lo resolví y lo entiendo</label></article>`).join('')}</div>`;
root.querySelectorAll('[data-done]').forEach(x=>x.onchange=()=>{state.done=x.checked?[...state.done,x.dataset.done]:state.done.filter(id=>id!==x.dataset.done);save();});root.querySelectorAll('[data-note]').forEach(x=>x.oninput=()=>{state.notes[x.dataset.note]=x.value;save();});$('#print').onclick=()=>window.print();}
let residueSelection='opposite';
const labs=[{id:'residues',ch:4,title:'Residuos e índice'},{id:'cauchy',ch:3,title:'Fórmula de Cauchy'},{id:'conformal',ch:2,title:'Conformidad local'},{id:'convergence',ch:1,title:'Convergencia uniforme'},{id:'rouche',ch:4,title:'Teorema de Rouché'},{id:'maximum',ch:4,title:'Media y máximo'}];
function renderLabs(){const available=labs.filter(x=>!chapter||x.ch===chapter);if(!available.some(x=>x.id===lab))lab=available[0].id;
root.innerHTML=`<div class="section-head"><div><h2>Visualizaciones</h2><p class="sub">Mové los controles para ver cómo cambia cada ejemplo.</p></div></div><div class="chips">${available.map(l=>`<button data-lab="${l.id}" class="${l.id===lab?'selected':''}">${l.title}</button>`).join('')}</div><div class="panel"><div class="lab-layout"><div><div class="lab-view" id="plot"></div><div class="legend" id="legend"></div></div><div class="controls" id="controls"></div></div><details class="lab-notes"><summary>Explicación y referencias</summary><div id="lab-description" class="lab-copy"></div></details></div>`;
root.querySelectorAll('[data-lab]').forEach(b=>b.onclick=()=>{lab=b.dataset.lab;renderLabs();});({residues:residueLab,cauchy:cauchyLab,conformal:conformalLab,convergence:convergenceLab,rouche:roucheLab,maximum:maximumLab})[lab]();}
function slider(id,label,min,max,value,step='.01'){return `<label for="${id}">${label}: <output id="${id}-value">${value}</output></label><input id="${id}" type="range" min="${min}" max="${max}" value="${value}" step="${step}">`;}
function bind(draw){
 const update=()=>{
  draw();
  renderMathWithin($('#controls'));renderMathWithin($('#legend'));renderMathWithin($('#lab-description'));
 };
 $('#controls').querySelectorAll('input,select').forEach(x=>x.oninput=()=>{
  const o=$('#'+x.id+'-value');if(o)o.textContent=x.value;update();
 });
 update();
 return update;
}
function svg(body,label){$('#plot').innerHTML=`<svg viewBox="0 0 560 360" role="img" aria-label="${label}">${body}</svg>`;}
function grid(scale=70){let b='';for(let i=-3;i<=3;i++){b+=`<path d="M${280+i*scale} 15V345 M20 ${180+i*scale}H540" stroke="#dce3d5"/>`;}return b+`<path d="M20 180H540M280 15V345" stroke="#9eb2a1"/><text x="525" y="173" font-size="12" fill="#64736b">Re</text><text x="288" y="25" font-size="12" fill="#64736b">Im</text>`;}
const point=(x,y,label,color='#b75732',scale=70)=>`<circle cx="${280+x*scale}" cy="${180-y*scale}" r="5" fill="${color}"/><text x="${290+x*scale}" y="${170-y*scale}" font-size="13" fill="${color}">${label}</text>`;
function path(points,color,width=2){return `<path d="${points.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}"/>`;}
function residueLab(){
 $('#controls').innerHTML=`<h3>Función y contorno</h3><label for="residue-function">Función</label>
 <select id="residue-function">${residueExamples.map(f=>`<option value="${f.id}" ${f.id===residueSelection?'selected':''}>${escapeHTML(f.label)}</option>`).join('')}</select>
 <div id="selected-function" class="residue-function"></div>
 ${slider('center','Centro: parte real',-2,2,0)}${slider('center-im','Centro: parte imaginaria',-2,2,0)}${slider('radius','Radio R',.2,2.2,1.4)}
 <div class="contour-options"><div><label for="orientation">Orientación</label><select id="orientation"><option value="1" selected>Antihoraria (+)</option><option value="-1">Horaria (−)</option></select></div><div><label for="turns">Vueltas</label><select id="turns"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option></select></div></div>
 <div class="formula" id="result" role="status" aria-live="polite"></div>`;
 const plot=$('#plot');
 plot.classList.add('residue-interactive');
 plot.insertAdjacentHTML('afterend','<p class="sub contour-drag-help">Arrastrá el círculo para mover su centro.</p>');
 let contourView=null,drag=null;
 $('#legend').insertAdjacentHTML('afterend','<details class="lab-notes residue-notes"><summary>Ver residuos e índices</summary><div id="residue-details"></div></details>');
 const update=bind(()=>{
  residueSelection=$('#residue-function').value;
  const example=residueExamples.find(f=>f.id===residueSelection);
  const x=+$('#center').value,y=+$('#center-im').value,r=+$('#radius').value,o=+$('#orientation').value,turns=+$('#turns').value;
  const result=evaluateResidueContour(example,{x,y,r,orientation:o,turns});
  // La escala depende solo del radio: no cambia mientras se arrastra el centro.
  const scale=Math.min(70,142/(2+r));
  contourView={scale,x,y,r};
  const cx=280+x*scale,cy=180-y*scale;
  const markers=result.points.map(p=>{
   const px=280+p.x*scale,py=180-p.y*scale;
   const color=p.removable?'#64736b':p.onContour?'#a33325':p.index?'#174c40':'#b75732';
   const marker=p.removable?`<circle cx="${px}" cy="${py}" r="6" fill="#f0f3e9" stroke="${color}" stroke-width="2"/>`:`<path d="M${px-5} ${py-5}L${px+5} ${py+5}M${px-5} ${py+5}L${px+5} ${py-5}" stroke="${color}" stroke-width="2.5"/>`;
   return marker+`<text x="${px+10}" y="${py-10}" font-size="13" fill="${color}">${escapeHTML(p.name)}</text>`;
  }).join('');
  svg(grid(scale)+`<circle class="residue-contour" cx="${cx}" cy="${cy}" r="${r*scale}" fill="#dce9b9" fill-opacity=".4" stroke="${result.boundary?'#a33325':'#174c40'}" stroke-width="2"/><circle pointer-events="none" cx="${cx}" cy="${cy}" r="2.5" fill="#64736b"/><text pointer-events="none" x="${cx}" y="${cy-r*scale-10}" text-anchor="middle" fill="#174c40" font-size="14">${o===1?'↶':'↷'} γ · ${turns} ${turns===1?'vuelta':'vueltas'}</text>`+`<g pointer-events="none">${markers}</g>`+`<path d="M35 330H${35+scale}" stroke="#64736b"/><text x="35" y="350" fill="#64736b" font-size="11">1 unidad</text>`,
   `Contorno circular con centro (${x}, ${y}), radio ${r}, ${turns} vueltas ${o===1?'antihorarias':'horarias'}. ${result.boundary?'Hay un polo sobre el contorno.':''}`);
  $('#selected-function').innerHTML=mathFormula(example.tex);
  $('#result').innerHTML=result.boundary?'Polo sobre γ: integral no definida.':mathFormula(String.raw`\oint_\gamma f(z)\,dz=${residuePiTex(result.integral)}`);
  $('#legend').innerHTML='<span class="inside-pole">× Polo interior</span><span class="outside-pole">× Polo exterior</span><span>○ Punto removible (extendido)</span>';
  const rows=result.points.map(p=>`<tr><td>${mathFormula(p.tex)}</td><td>${p.removable?'Removible':p.order===1?'Polo simple':'Polo doble'}</td><td>${mathFormula(p.resTex)}</td><td>${p.index===null?'No definido':mathFormula(String(p.index))}</td></tr>`).join('');
  $('#residue-details').innerHTML=result.points.length?`<div class="residue-table-wrap"><table class="residue-table"><caption>Residuos e índices de los puntos señalados</caption><thead><tr><th>Punto</th><th>Tipo</th><th>Residuo</th><th>Índice</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<p class="sub residue-no-poles">Esta función no tiene polos.</p>';
  $('#lab-description').innerHTML=`<p>${mathHTML(example.explanation)}</p><p><strong>Probá:</strong> ${mathHTML(example.try)}</p><p class="residue-rule">${mathFormula(String.raw`\oint_\gamma f(z)\,dz=2\pi i\sum_a\operatorname{Ind}(\gamma,a)\operatorname{Res}(f,a)`)}<br>El índice cuenta las vueltas con signo. Si un polo cae sobre el contorno, la integral ordinaria no está definida.</p>${ref('4.1')}`;
 });
 // El contenedor conserva la captura aunque el SVG se redibuje en cada movimiento.
 const viewPoint=e=>{
  const bounds=plot.querySelector('svg').getBoundingClientRect();
  const unit=Math.min(bounds.width/560,bounds.height/360);
  if(!unit)return null;
  return {x:(e.clientX-bounds.left-(bounds.width-560*unit)/2)/unit,
          y:(e.clientY-bounds.top-(bounds.height-360*unit)/2)/unit};
 };
 const move=e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const p=viewPoint(e);if(!p)return;
  const limit=value=>Math.round(Math.max(-2,Math.min(2,value))*100)/100;
  $('#center').value=limit(drag.x+(p.x-drag.start.x)/drag.scale);
  $('#center-im').value=limit(drag.y-(p.y-drag.start.y)/drag.scale);
  for(const id of ['center','center-im'])$('#'+id+'-value').textContent=$('#'+id).value;
  update();
 };
 const finish=e=>{
  if(!drag||e.pointerId!==drag.id)return;
  drag=null;plot.classList.remove('is-dragging');
  if(plot.hasPointerCapture(e.pointerId))plot.releasePointerCapture(e.pointerId);
 };
 plot.onpointerdown=e=>{
  if(drag||!e.isPrimary||e.button!==0)return;
  const p=viewPoint(e);if(!p)return;
  const {scale,x,y,r}=contourView;
  if(Math.hypot(p.x-(280+x*scale),p.y-(180-y*scale))>r*scale+9)return;
  e.preventDefault();
  drag={id:e.pointerId,start:p,scale,x,y};
  plot.setPointerCapture(e.pointerId);plot.classList.add('is-dragging');
 };
 plot.onpointermove=move;
 plot.onpointerup=e=>{move(e);finish(e);};
 plot.onpointercancel=finish;
 plot.onlostpointercapture=finish;

}
function cauchyLab(){$('#controls').innerHTML=`<h3>Fórmula integral de Cauchy</h3><p class="sub">f(z)=z²+1 · γ: |z|=2, antihorario</p>${slider('a','Punto a sobre el eje real',-2.8,2.8,.7)}<div class="formula" id="result"></div>`;$('#lab-description').innerHTML=`<p><strong>Fórmula integral de Cauchy.</strong> Dentro del círculo, ∮ f(z)/(z−a) dz = 2πi f(a). Fuera, el integrando es holomorfo en todo el disco y la integral vale cero. Sobre el círculo hay una singularidad y la integral ordinaria no está definida.</p>${ref('3.2')}`;bind(()=>{const a=+$('#a').value;svg(grid(55)+`<circle cx="280" cy="180" r="110" fill="#dce9b9" fill-opacity=".4" stroke="#174c40" stroke-width="2"/>`+point(a,0,'a','#b75732',55),'Punto a respecto de un círculo de radio dos');$('#result').innerHTML=Math.abs(Math.abs(a)-2)<1e-8?'a ∈ γ: no definida':mathFormula(String.raw`\oint_\gamma\frac{z^2+1}{z-a}\,dz=${Math.abs(a)<2?(2*(a*a+1)).toFixed(3)+'\\pi i':'0'}`);$('#legend').textContent='Verde: círculo |z|=2 · Naranja: punto a';});}
function conformalLab(){$('#controls').innerHTML=`<h3>Conformidad de z²</h3>${slider('base','Punto real a',0,1.5,.8)}${slider('epsilon','Escala ε',.02,.4,.12)}<div class="formula" id="result"></div>`;$('#lab-description').innerHTML=`<p><strong>Conformidad local.</strong> Se muestran las imágenes de dos segmentos perpendiculares z=a+t y z=a+it, con |t|≤ε, mediante f(z)=z². Si a≠0, sus tangentes en f(a) siguen siendo perpendiculares; al reducir ε se ve la aproximación lineal. En a=0, f′(a)=0: los segmentos se pliegan sobre el eje real y la conformidad falla.</p>${ref('2.3')}`;bind(()=>{const a=+$('#base').value,e=+$('#epsilon').value;let p=[],q=[];const s=110/Math.max(2*a*e,e*e);for(let j=0;j<=100;j++){let t=-e+2*e*j/100;p.push([280+(2*a*t+t*t)*s,180]);q.push([280-t*t*s,180-2*a*t*s]);}svg(grid()+path(p,'#174c40',4)+path(q,'#b75732',3)+point(0,0,'f(a)'),'Imágenes bajo z cuadrado de dos segmentos perpendiculares');$('#result').innerHTML=mathFormula(a===0?String.raw`f'(0)=0`:String.raw`f'(a)=${(2*a).toFixed(2)}\ne0`)+(a===0?' · punto crítico':'');$('#legend').innerHTML='<span><i class="dot"></i>Imagen de a+t</span><span><i class="dot orange"></i>Imagen de a+it</span>';});}
function convergenceLab(){$('#controls').innerHTML=`<h3>Convergencia de zⁿ</h3><p class="sub">fₙ(z)=zⁿ · corte radial x∈[0,1]</p>${slider('n','Exponente n',1,100,8,'1')}${slider('r','Radio compacto r',.1,.99,.8)}<div class="formula" id="result"></div>`;$('#lab-description').innerHTML=`<p><strong>Convergencia localmente uniforme.</strong> En |z|&lt;1, zⁿ→0 puntualmente, pero sup |zⁿ|=1 para todo n: no hay convergencia uniforme en el disco abierto completo. En cada disco compacto |z|≤r&lt;1, el máximo es rⁿ→0. El punto x=1 se dibuja solo como referencia de frontera; no pertenece al disco abierto.</p>${ref('1.4')}${ref('3.4')}`;bind(()=>{const n=+$('#n').value,r=+$('#r').value;let p=[];for(let k=0;k<=250;k++){let x=k/250;p.push([50+450*x,305-260*x**n]);}svg(`<rect x="50" y="35" width="${450*r}" height="270" fill="#e1ebc8"/><path d="M50 35V305H515" fill="none" stroke="#9eb2a1"/>${path(p,'#174c40',3)}<path d="M${50+450*r} 35V305" stroke="#b75732" stroke-dasharray="5 5"/><circle cx="500" cy="45" r="5" fill="#f0f3e9" stroke="#174c40"/><text x="45" y="327" font-size="13">0</text><text x="495" y="327" font-size="13">1</text><text x="${50+450*r}" y="347" font-size="13">r=${r}</text><text x="20" y="50" font-size="13">1</text>`,'Curva de x elevado a n entre cero y uno');$('#result').innerHTML=mathFormula(String.raw`\sup_{|z|\le r}|z^n|=r^n=${mathNumber(r**n)}`);$('#legend').textContent='Zona verde: compacto |z|≤r · Curva: xⁿ';});}
function roucheLab(){$('#controls').innerHTML=`<h3>Conteo de ceros con Rouché</h3><p class="sub">p(z) = z⁵ + b z + 1 · |z|=1</p>${slider('b','Coeficiente b',0,5,3)}<div class="formula" id="result"></div>`;$('#lab-description').innerHTML=`<p><strong>Teorema de Rouché.</strong> Comparamos f(z)=bz con g(z)=z⁵+1. En el borde, |g|≤2 y |f|=b. Si b&gt;2, la desigualdad estricta garantiza exactamente un cero dentro, contando multiplicidades. Si b≤2, esta comparación deja de certificar el resultado; no significa automáticamente que cambie la cantidad de ceros. El dibujo muestra las imágenes del borde en el plano de valores.</p>${ref('4.3')}`;bind(()=>{const b=+$('#b').value;let p=[],q=[];const s=145/(b+2);for(let k=0;k<=400;k++){let t=2*Math.PI*k/400;p.push([280+s*(Math.cos(5*t)+b*Math.cos(t)+1),180-s*(Math.sin(5*t)+b*Math.sin(t))]);q.push([280+s*b*Math.cos(t),180-s*b*Math.sin(t)]);}svg(grid()+path(q,'#b75732',1.5)+path(p,'#174c40',2)+point(0,0,'0'),'Imagen del círculo unidad bajo el polinomio y bajo b por z');$('#result').innerHTML=b>2?mathFormula(String.raw`2<b`)+': 1 cero en '+mathFormula('|z|<1'):mathFormula(String.raw`b\le2`)+': comparación no concluyente';$('#legend').innerHTML='<span><i class="dot"></i>p(eⁱᵗ)</span><span><i class="dot orange"></i>b eⁱᵗ</span>';});}
function maximumLab(){$('#controls').innerHTML=`<h3>Media y módulo máximo</h3><p class="sub">f(z)=1+z² · círculo |z|=r</p>${slider('mean-r','Radio r',.1,1.5,1)}${slider('samples','Muestras equiespaciadas N',3,40,8,'1')}<div class="formula" id="result"></div>`;$('#lab-description').innerHTML=`<p><strong>Propiedad de la media y máximo.</strong> El círculo del plano de entrada se transforma en un círculo centrado en 1, de radio r². El promedio de sus valores complejos es f(0)=1; para este polinomio, las N muestras equiespaciadas ya dan ese promedio exactamente cuando N≥3. El máximo de |f| en el disco es 1+r² y se alcanza en su borde. El promedio de los módulos es otra cantidad.</p>${ref('4.4')}`;bind(()=>{const r=+$('#mean-r').value,n=+$('#samples').value,s=55;let points='';for(let k=0;k<n;k++){let t=4*Math.PI*k/n;points+=`<circle cx="${280+s*(1+r*r*Math.cos(t))}" cy="${180-s*r*r*Math.sin(t)}" r="4" fill="#b75732"/>`;}svg(grid(s)+`<circle cx="335" cy="180" r="${s*r*r}" fill="none" stroke="#174c40" stroke-width="2"/>`+points+point(1,0,'media = 1','#174c40',s),'Valores de uno más z cuadrado sobre un círculo y su media');$('#result').innerHTML='Media = '+mathFormula('1')+' · '+mathFormula(String.raw`\max|f|=${(1+r*r).toFixed(2)}`);$('#legend').textContent='Naranja: valores muestreados · Verde: media compleja';});}
render();

// Un solo cambio visual por cuadro; el scroll conserva su comportamiento nativo.
const landing=document.querySelector('.landing');
if(landing&&typeof window.requestAnimationFrame==='function'){
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let scrollFrame=0;
 const updateLanding=()=>{
  scrollFrame=0;
  const progress=motion.matches?0:Math.min(1,Math.max(0,window.scrollY/landing.offsetHeight));
  landing.style.setProperty('--departure',progress.toFixed(3));
 };
 const queueLanding=()=>{if(!scrollFrame)scrollFrame=window.requestAnimationFrame(updateLanding);};
 window.addEventListener('scroll',queueLanding,{passive:true});
 window.addEventListener('resize',queueLanding);
 motion.addEventListener('change',queueLanding);
 updateLanding();
}
