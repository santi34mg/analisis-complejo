const {test}=require('node:test');
const assert=require('node:assert/strict');
const {residueExamples,evaluateResidueContour,residuePiTex}=require('../materiales/residue-model.js');
const katex=require('../materiales/vendor/katex/katex.min.js');
const evaluate=(id,options)=>evaluateResidueContour(residueExamples.find(f=>f.id===id),options);

test('residuos opuestos se cancelan; uno solo contribuye con el signo correcto',()=>{
 assert.deepEqual(evaluate('opposite').integral,{re:0,im:0});
 assert.deepEqual(evaluate('opposite',{x:1,r:.6}).integral,{re:0,im:1});
 assert.deepEqual(evaluate('opposite',{x:-1,r:.6}).integral,{re:0,im:-1});
});
test('orden del polo y residuo son propiedades distintas',()=>{
 assert.deepEqual(evaluate('simple').integral,{re:0,im:2});
 assert.deepEqual(evaluate('double-zero').integral,{re:0,im:0});
 assert.deepEqual(evaluate('double-nonzero').integral,{re:0,im:2});
});
test('residuos imaginarios producen integrales reales',()=>{
 assert.deepEqual(evaluate('imaginary',{y:1,r:.6}).integral,{re:1,im:0});
 assert.deepEqual(evaluate('imaginary',{y:-1,r:.6}).integral,{re:-1,im:0});
 assert.deepEqual(evaluate('imaginary').integral,{re:0,im:0});
});
test('mismos polos con distintos residuos dan otra integral',()=>{
 assert.deepEqual(evaluate('same-sign').integral,{re:0,im:2});
 assert.deepEqual(evaluate('same-sign',{y:1,r:.6}).integral,{re:0,im:1});
});
test('orientación y vueltas cambian el índice y el resultado',()=>{
 const result=evaluate('simple',{orientation:-1,turns:3});
 assert.equal(result.points[0].index,-3);
 assert.deepEqual(result.integral,{re:0,im:-6});
 assert.equal(evaluate('simple',{x:2,r:.6,turns:3}).points[0].index,0);
});
test('un polo sobre el contorno impide la integral ordinaria',()=>{
 const result=evaluate('opposite',{r:1});
 assert.equal(result.boundary,true);
 assert.equal(result.integral,null);
 assert(result.points.every(p=>p.index===null));
 assert.equal(evaluate('simple',{x:.6,y:.8,r:1}).boundary,true);
 assert.equal(evaluate('simple',{r:.2}).boundary,false);
});
test('la extensión removible permite que el contorno pase por el origen',()=>{
 const result=evaluate('removable',{x:1,r:1});
 assert.equal(result.points[0].onContour,true);
 assert.equal(result.points[0].index,null);
 assert.equal(result.boundary,false);
 assert.deepEqual(result.integral,{re:0,im:0});
 assert.deepEqual(evaluate('entire',{x:2,y:2,r:.2,turns:3}).integral,{re:0,im:0});
});
test('todas las funciones y resultados producen TeX válido',()=>{
 for(const example of residueExamples){
  katex.renderToString(example.tex,{throwOnError:true,strict:'error'});
  for(const pole of example.points)katex.renderToString(pole.resTex,{throwOnError:true,strict:'error'});
  for(const options of [{},{x:1,r:.6},{y:1,r:.6},{x:2,r:1,orientation:-1,turns:3}]){
   const result=evaluateResidueContour(example,options);
   katex.renderToString(residuePiTex(result.integral),{throwOnError:true,strict:'error'});
  }
 }
 assert.equal(residuePiTex({re:1,im:-2}),String.raw`\pi-2\pi i`);
 assert.equal(residuePiTex({re:0,im:0}),'0');
});
