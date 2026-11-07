const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const katex=require(path.join(root,'materiales/vendor/katex/katex.min.js'));
const context=vm.createContext({katex});
for(const file of ['math.js','content.js','card-diagrams.js'])vm.runInContext(fs.readFileSync(path.join(root,'materiales',file),'utf8'),context);
const run=code=>vm.runInContext(code,context);

test('todas las expresiones se componen con la versión local de KaTeX',()=>{
 const entries=run('mathNotation');
 for(const {plain,tex} of entries){
  assert(plain&&tex);
  assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'error'}),plain);
 }
});

test('todos los contenidos y diagramas se pueden renderizar',()=>{
 assert.doesNotThrow(()=>run(`
  for(const item of [...cards,...questions,...exercises]){
   for(const value of Object.values(item)){
    if(typeof value==='string')mathHTML(value);
    if(Array.isArray(value))value.forEach(mathHTML);
   }
  }
  for(const drawing of Object.values(cardDiagrams))mathHTML(drawing.caption);
 `));
});

test('Cauchy, residuos, raíces y sumas tienen estructura matemática, con MathML',()=>{
 for(const source of ['∮γ f(z)/(z−a) dz = 2πi f(a)','Res(f,a) = lim(z→a) (z−a)f(z)','|z| = √(x² + y²)','∑ desde n=0 de zⁿ = 1/(1−z)']){
  context.source=source;
  const html=run('mathHTML(source)');
  assert.match(html,/class="katex"/);
  assert.match(html,/<math/);
  assert.match(html,/<annotation encoding="application\/x-tex">/);
 }
 assert.match(run(`mathHTML('∮γ f(z)/(z−a) dz = 2πi f(a)')`),/<mfrac>/);
 assert.match(run(`mathHTML('|z| = √(x² + y²)')`),/<msqrt>/);
});

test('el texto ajeno a las fórmulas se escapa y los datos originales se conservan',()=>{
 assert.equal(run(`mathHTML('<img src=x onerror="alert(1)">')`),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
 const original=run('JSON.stringify(cards)');
 run('cards.forEach(c=>mathHTML(c.answer))');
 assert.equal(run('JSON.stringify(cards)'),original);
 assert.equal(run(`mathHTML('−16')`),run(`mathFormula('-16')`));
 assert.equal(run(`mathHTML('n=16')`),'n=16');
});

test('los valores pequeños usan potencias de diez',()=>{
 assert.match(run('mathFormula(mathNumber(1e-20))'),/10/);
 assert.equal(run('mathNumber(1e-20)'),String.raw`1.00\times10^{-20}`);
});

test('las fuentes y scripts necesarios están en el repositorio',()=>{
 const base=path.join(root,'materiales/vendor/katex');
 const css=fs.readFileSync(path.join(base,'katex.min.css'),'utf8');
 for(const [,font] of css.matchAll(/url\(([^)]+)\)/g))assert(fs.existsSync(path.join(base,font)),font);
 const html=fs.readFileSync(path.join(root,'materiales/index.html'),'utf8');
 assert(html.indexOf('vendor/katex/katex.min.js')<html.indexOf('src="math.js"'));
 assert(html.indexOf('src="math.js"')<html.indexOf('src="app.js"'));
 assert(fs.existsSync(path.join(base,'LICENSE')));
});
