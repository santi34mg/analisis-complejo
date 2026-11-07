'use strict';
// Las expresiones se mantienen junto a su escritura original para conservar los
// textos accesibles, las notas y el contenido de estudio independientes de KaTeX.
// Se elige siempre la coincidencia más larga, sin transformar texto del usuario.
const mathNotation = String.raw`
∑ sup |fₙ| :: \sum_{n=0}^\infty\sup|f_n|
|z|ⁿ :: |z|^n
|z|² :: |z|^2
z⁵+1 :: z^5+1
f(z)=eᶻ/z² :: f(z)=\frac{e^z}{z^2}
f(z)=eᶻ :: f(z)=e^z
f(z)=z :: f(z)=z
f′ :: f'
∮ f(z)/(z−a) dz = 2πi f(a) :: \oint_\gamma\frac{f(z)}{z-a}\,dz=2\pi i\,f(a)
|z| ≤ r :: |z|\le r
1/(z²+1) :: \frac1{z^2+1}
z³/3 :: \frac{z^3}{3}
±i :: \pm i
z̄ = x − iy :: \bar z=x-iy
|z| = √(x² + y²) :: |z|=\sqrt{x^2+y^2}
z·z̄ = |z|² :: z\bar z=|z|^2
z = x + iy :: z=x+iy
z = 3 − 4i :: z=3-4i
z̄ = 3 + 4i :: \bar z=3+4i
|z| = 5 :: |z|=5
z = r eⁱᶿ :: z=re^{i\theta}
r = |z| > 0 :: r=|z|>0
θ + 2kπ, k ∈ ℤ :: \theta+2k\pi,\quad k\in\mathbb Z
r eⁱᶿ ≠ 0 :: re^{i\theta}\ne0
r^(1/n) exp(i(θ + 2kπ)/n), k = 0,…,n−1 :: \sqrt[n]{r}\,\exp\!\left(\frac{i(\theta+2k\pi)}{n}\right),\quad k=0,\ldots,n-1
r^(1/n) :: \sqrt[n]{r}
|z| < 1 :: |z|<1
|z| ≤ 1 :: |z|\le1
1 ≤ |z| ≤ 2 :: 1\le|z|\le2
ℂ ∖ {0} :: \mathbb C\setminus\{0\}
fₙ(z) → f(z) :: f_n(z)\to f(z)
sup sobre el dominio de |fₙ − f| → 0 :: \sup_{z\in\Omega}|f_n(z)-f(z)|\to0
zⁿ → 0 :: z^n\to0
|z| ≤ r < 1 :: |z|\le r<1
∑ sup_K |fₙ| < ∞ :: \sum_{n=0}^{\infty}\sup_{z\in K}|f_n(z)|<\infty
∑ zⁿ :: \sum_{n=0}^{\infty}z^n
∑ rⁿ = 1/(1−r) :: \sum_{n=0}^{\infty}r^n=\frac{1}{1-r}
(f(z+h)−f(z))/h :: \frac{f(z+h)-f(z)}{h}
h → 0 :: h\to0
f = u + iv :: f=u+iv
uₓ = vᵧ :: u_x=v_y
uᵧ = −vₓ :: u_y=-v_x
f′(a) ≠ 0 :: f'(a)\ne0
a ≠ 0 :: a\ne0
exp(ℓ(z)) = z :: \exp(\ell(z))=z
ℓ′(z) = 1/z :: \ell'(z)=\frac1z
Log z = ln|z| + i Arg z :: \operatorname{Log}z=\ln|z|+i\operatorname{Arg}z
Arg ∈ (−π,π) :: \operatorname{Arg}\in(-\pi,\pi)
ℂ ∖ (−∞,0] :: \mathbb C\setminus(-\infty,0]
∮ dz/z = 2πi :: \oint\frac{dz}{z}=2\pi i
γ:[a,b]→ℂ :: \gamma:[a,b]\to\mathbb C
∫γ f(z) dz = ∫ₐᵇ f(γ(t)) γ′(t) dt :: \int_\gamma f(z)\,dz=\int_a^b f(\gamma(t))\gamma'(t)\,dt
|∫γ f(z) dz| ≤ longitud(γ) · supγ |f| :: \left|\int_\gamma f(z)\,dz\right|\le\operatorname{longitud}(\gamma)\,\sup_{z\in\gamma}|f(z)|
∮γ f(z)/(z−a) dz = 2πi f(a) :: \oint_\gamma\frac{f(z)}{z-a}\,dz=2\pi i\,f(a)
∮γ f(z)/(z−a)^(n+1) dz = (2πi/n!) f⁽ⁿ⁾(a) :: \oint_\gamma\frac{f(z)}{(z-a)^{n+1}}\,dz=\frac{2\pi i}{n!}f^{(n)}(a)
f⁽ⁿ⁾(a)/n! :: \frac{f^{(n)}(a)}{n!}
|f| ≤ M :: |f|\le M
|z−a| = R :: |z-a|=R
|f⁽ⁿ⁾(a)| ≤ n! M/Rⁿ :: |f^{(n)}(a)|\le\frac{n!\,M}{R^n}
R → ∞ :: R\to\infty
f′ = 0 :: f'=0
fₙ′ → f′ :: f_n'\to f'
(z−a)⁻¹ :: (z-a)^{-1}
Res(f,a) = lim(z→a) (z−a)f(z) :: \operatorname{Res}(f,a)=\lim_{z\to a}(z-a)f(z)
Res(f,a) = 1/(m−1)! · [d^(m−1)/dz^(m−1) ((z−a)^m f(z))] en z=a :: \operatorname{Res}(f,a)=\frac{1}{(m-1)!}\left[\frac{d^{m-1}}{dz^{m-1}}\big((z-a)^m f(z)\big)\right]_{z=a}
Ind(γ,a) = (1/(2πi)) ∮γ dz/(z−a) :: \operatorname{Ind}(\gamma,a)=\frac{1}{2\pi i}\oint_\gamma\frac{dz}{z-a}
∮γ f dz = 2πi ∑ Ind(γ,a) Res(f,a) :: \oint_\gamma f(z)\,dz=2\pi i\sum_a\operatorname{Ind}(\gamma,a)\operatorname{Res}(f,a)
|g| < |f| :: |g|<|f|
f+g :: f+g
f(a) = (1/2π) ∫₀²π f(a+reⁱᵗ) dt :: f(a)=\frac{1}{2\pi}\int_0^{2\pi}f(a+re^{it})\,dt
Δu = uₓₓ + uᵧᵧ = 0 :: \Delta u=u_{xx}+u_{yy}=0
u+iv :: u+iv
u=x²−y² :: u=x^2-y^2
v=2xy :: v=2xy
f(z)=z̄ :: f(z)=\bar z
h̄/h :: \frac{\bar h}{h}
f(z)=z² :: f(z)=z^2
F(γ(b))−F(γ(a)) :: F(\gamma(b))-F(\gamma(a))
|z|=1 :: |z|=1
1/z²+1/z :: \frac1{z^2}+\frac1z
z⁻¹ :: z^{-1}
f′=0 :: f'=0
ln|z| :: \ln|z|
(1+i)/(1−i) :: \frac{1+i}{1-i}
(1+i)/(1+i) :: \frac{1+i}{1+i}
(1+i)²/2 = 2i/2 = i :: \frac{(1+i)^2}{2}=\frac{2i}{2}=i
z³=8 :: z^3=8
2, −1+i√3, −1−i√3 :: 2,\;-1+i\sqrt3,\;-1-i\sqrt3
2, −2, 0 :: 2,\;-2,\;0
8, 8i, −8 :: 8,\;8i,\;-8
2, 2i, −2 :: 2,\;2i,\;-2
2π/3 :: \frac{2\pi}{3}
4π/3 :: \frac{4\pi}{3}
Im z > 0 :: \operatorname{Im}z>0
f′(1+i)=2+2i :: f'(1+i)=2+2i
f′(1+i) :: f'(1+i)
f′(z)=2z :: f'(z)=2z
f(z)=|z|² :: f(z)=|z|^2
u=x²+y² :: u=x^2+y^2
v=0 :: v=0
x=y=0 :: x=y=0
|h|²/h=h̄→0 :: \frac{|h|^2}{h}=\bar h\to0
Log(−i) :: \operatorname{Log}(-i)
3πi/2 :: \frac{3\pi i}{2}
−πi/2 :: -\frac{\pi i}{2}
πi/2 :: \frac{\pi i}{2}
−π/2 :: -\frac{\pi}{2}
∮γ eᶻ/z dz :: \oint_\gamma\frac{e^z}{z}\,dz
|z|=2 :: |z|=2
2πi e⁰ = 2πi :: 2\pi i\,e^0=2\pi i
∮γ eᶻ/z³ dz :: \oint_\gamma\frac{e^z}{z^3}\,dz
2πi f″(0)/2! = πi :: \frac{2\pi i}{2!}f''(0)=\pi i
|f|≤M :: |f|\le M
|z|=R :: |z|=R
|f′(0)| ≤ MR :: |f'(0)|\le MR
|f′(0)| ≤ M/R :: |f'(0)|\le\frac MR
|f′(0)| = M/R :: |f'(0)|=\frac MR
|f′(0)| ≤ M² :: |f'(0)|\le M^2
0<r<1 :: 0<r<1
|z|≤r :: |z|\le r
|zⁿ| :: |z^n|
rⁿ→0 :: r^n\to0
Res(eᶻ/z²,0) :: \operatorname{Res}\!\left(\frac{e^z}{z^2},0\right)
eᶻ/z² = z⁻² + z⁻¹ + 1/2 + … :: \frac{e^z}{z^2}=\frac1{z^2}+\frac1z+\frac12+\cdots
Res(1/(z²+1),i) :: \operatorname{Res}\!\left(\frac1{z^2+1},i\right)
lim(z→i) 1/(z+i) = 1/(2i) :: \lim_{z\to i}\frac1{z+i}=\frac1{2i}
∮ dz/(z²+1) :: \oint\frac{dz}{z^2+1}
1/(2i) :: \frac1{2i}
z⁵+3z+1 :: z^5+3z+1
|z|<1 :: |z|<1
|z⁵+1|≤2<3=|3z| :: |z^5+1|\le2<3=|3z|
x²+y² :: x^2+y^2
−2xy :: -2xy
x+y :: x+y
vᵧ=2x :: v_y=2x
vₓ=2y :: v_x=2y
v=2xy+C :: v=2xy+C
(3+4i)/(1−2i) :: \frac{3+4i}{1-2i}
1+2i :: 1+2i
−5+10i :: -5+10i
−1+2i :: -1+2i
|3+4i|/|1−2i|=5/√5 :: \frac{|3+4i|}{|1-2i|}=\frac5{\sqrt5}
−16 = 16 exp(iπ) :: -16=16e^{i\pi}
π/4+kπ/2, k=0,1,2,3 :: \frac\pi4+\frac{k\pi}2,\quad k=0,1,2,3
√2(1+i), √2(−1+i), √2(−1−i), √2(1−i) :: \sqrt2(1+i),\;\sqrt2(-1+i),\;\sqrt2(-1-i),\;\sqrt2(1-i)
A={z: 1<|z|≤2} :: A=\{z:1<|z|\le2\}
1<|z|<2 :: 1<|z|<2
1≤|z|≤2 :: 1\le|z|\le2
|z|=2 :: |z|=2
fₙ(z)=zⁿ :: f_n(z)=z^n
D={|z|<1} :: D=\{z:|z|<1\}
|z|≤r<1 :: |z|\le r<1
sup_D |zⁿ|=1 :: \sup_{z\in D}|z^n|=1
f(x+iy)=x²−y²+i2xy :: f(x+iy)=x^2-y^2+2ixy
uₓ=2x=vᵧ :: u_x=2x=v_y
uᵧ=−2y=−vₓ :: u_y=-2y=-v_x
f′=uₓ+ivₓ=2x+2iy=2z :: f'=u_x+iv_x=2x+2iy=2z
2x=2y=0 :: 2x=2y=0
Log(i)+Log(i)=iπ :: \operatorname{Log}(i)+\operatorname{Log}(i)=i\pi
Log(i)+Log(i) :: \operatorname{Log}(i)+\operatorname{Log}(i)
Log(i·i) :: \operatorname{Log}(i\cdot i)
Log(−1) :: \operatorname{Log}(-1)
a=1+i :: a=1+i
f′(a)=2+2i :: f'(a)=2+2i
|2+2i|=2√2 :: |2+2i|=2\sqrt2
arg(2+2i)=π/4 :: \arg(2+2i)=\frac\pi4
∮γ z̄ dz :: \oint_\gamma\bar z\,dz
γ(t)=eⁱᵗ :: \gamma(t)=e^{it}
0≤t≤2π :: 0\le t\le2\pi
z̄=e⁻ⁱᵗ :: \bar z=e^{-it}
γ′(t)=ieⁱᵗ :: \gamma'(t)=ie^{it}
z̄ dz=i dt :: \bar z\,dz=i\,dt
∮ eᶻ/(z−1)³ dz :: \oint\frac{e^z}{(z-1)^3}\,dz
2πi f″(1)/2! = πie :: \frac{2\pi i}{2!}f''(1)=\pi i e
|f′(a)|≤M/R :: |f'(a)|\le\frac MR
R→∞ :: R\to\infty
f′(a)=0 :: f'(a)=0
∑ desde n=0 de zⁿ = 1/(1−z) :: \sum_{n=0}^\infty z^n=\frac1{1-z}
∑ sup |zⁿ|=∑rⁿ<∞ :: \sum_{n=0}^\infty\sup_{|z|\le r}|z^n|=\sum_{n=0}^\infty r^n<\infty
1/(1−z) :: \frac1{1-z}
∑ desde n=1 de n zⁿ⁻¹ = 1/(1−z)² :: \sum_{n=1}^\infty nz^{n-1}=\frac1{(1-z)^2}
sin(z)/z=1−z²/6+… :: \frac{\sin z}{z}=1-\frac{z^2}{6}+\cdots
exp(1/z)=1+1/z+1/(2z²)+… :: e^{1/z}=1+\frac1z+\frac1{2z^2}+\cdots
sin(z)/z :: \frac{\sin z}{z}
1/z³ :: \frac1{z^3}
exp(1/z) :: e^{1/z}
∮ eᶻ/z² dz :: \oint\frac{e^z}{z^2}\,dz
Res(eᶻ/z²,0)=1 :: \operatorname{Res}\!\left(\frac{e^z}{z^2},0\right)=1
∫ de −∞ a ∞ de dx/(1+x²) :: \int_{-\infty}^\infty\frac{dx}{1+x^2}
Res(1/(1+z²),i)=1/(2i) :: \operatorname{Res}\!\left(\frac1{1+z^2},i\right)=\frac1{2i}
πR/(R²−1)→0 :: \frac{\pi R}{R^2-1}\to0
1/n→0∈ℂ :: \frac1n\to0\in\mathbb C
1−1/n :: 1-\frac1n
1/n :: \frac1n
f(z)=z²+1 :: f(z)=z^2+1
|z|≤1 :: |z|\le1
|z²+1|≤|z|²+1≤2 :: |z^2+1|\le|z|^2+1\le2
z=±1 :: z=\pm1
f(0)=1 :: f(0)=1
Re z>0 :: \operatorname{Re}z>0
u(x,y)=eˣ cos y :: u(x,y)=e^x\cos y
vᵧ=uₓ :: v_y=u_x
vₓ=−uᵧ :: v_x=-u_y
vᵧ=eˣ cos y :: v_y=e^x\cos y
v=eˣ sin y+C(x) :: v=e^x\sin y+C(x)
C′(x)=0 :: C'(x)=0
v=eˣ sin y+C :: v=e^x\sin y+C
f(z)=eᶻ+iC :: f(z)=e^z+iC
f(z) = 1/(z² − 1) :: f(z)=\frac1{z^2-1}
f(z)=1+z² :: f(z)=1+z^2
p(z) = z⁵ + b z + 1 :: p(z)=z^5+bz+1
x∈[0,1] :: x\in[0,1]
z=a+t :: z=a+t
z=a+it :: z=a+it
|t|≤ε :: |t|\le\varepsilon
a≠0 :: a\ne0
a=0 :: a=0
f′(a)=0 :: f'(a)=0
f(z)=bz :: f(z)=bz
g(z)=z⁵+1 :: g(z)=z^5+1
|g|≤2 :: |g|\le2
|f|=b :: |f|=b
b>2 :: b>2
b≤2 :: b\le2
f(0)=1 :: f(0)=1
N≥3 :: N\ge3
1+r² :: 1+r^2
−π < Arg z < π :: -\pi<\operatorname{Arg}z<\pi
Δu=0 :: \Delta u=0
uₓₓ=2 :: u_{xx}=2
uᵧᵧ=−2 :: u_{yy}=-2
u=x²−y² :: u=x^2-y^2
f(z)=1+z² :: f(z)=1+z^2
|f(z)| ≤ 2 :: |f(z)|\le2
f(±1) = 2 :: f(\pm1)=2
|g(z)| < |f(z)| :: |g(z)|<|f(z)|
f(z)+g(z) :: f(z)+g(z)
|g(z)| :: |g(z)|
|f(z)| :: |f(z)|
2π/5 :: \frac{2\pi}{5}
ℂ :: \mathbb C
Ω :: \Omega
C¹ :: C^1
C² :: C^2
C∞ :: C^\infty
z̄ :: \bar z
z² :: z^2
zⁿ :: z^n
rⁿ :: r^n
r² :: r^2
xⁿ :: x^n
x²−y² :: x^2-y^2
f′(a) :: f'(a)
fₙ :: f_n
eᶻ/z² :: \frac{e^z}{z^2}
eᶻ :: e^z
e² :: e^2
e²ⁱᵗ :: e^{2it}
eⁱᵗ :: e^{it}
1/z² :: \frac1{z^2}
1/z :: \frac1z
√5 :: \sqrt5
√2 :: \sqrt2
2πi :: 2\pi i
4πi :: 4\pi i
−2πi :: -2\pi i
2π :: 2\pi
πi :: \pi i
π/4 :: \frac\pi4
−1/2 :: -\frac12
1/2 :: \frac12
−1 :: -1
−i :: -i
2+2i :: 2+2i
1+2i :: 1+2i
2i :: 2i
2xy :: 2xy
3z :: 3z
n=1 :: n=1
n = 1 :: n=1
n=2 :: n=2
n=0 :: n=0
a=1 :: a=1
a=0 :: a=0
`.trim().split('\n').map(row=>{
 const [plain,tex]=row.split(' :: ');
 return {plain,tex};
}).sort((a,b)=>b.plain.length-a.plain.length);
function mathNumber(value,digits=3){
 const [mantissa,exponent]=Number(value).toPrecision(digits).split('e');
 return exponent===undefined?mantissa:String.raw`${mantissa}\times10^{${Number(exponent)}}`;
}
const mathCache=new Map();
function mathFormula(tex,display=false){
 const key=(display?'D:':'I:')+tex;
 if(!mathCache.has(key)){
  const html=katex.renderToString(tex,{displayMode:display,output:'htmlAndMathml',throwOnError:true,trust:false,strict:'error'});
  mathCache.set(key,`<span class="${display?'math-display':'math-inline'}">${html}</span>`);
 }
 return mathCache.get(key);
}
function mathHTML(value){
 const source=String(value);
 if(/^(?:[-−]?\d+(?:\.\d+)?|i|π)$/.test(source))return mathFormula(source.replace('−','-').replace('π',String.raw`\pi`));
 let result='',plain='',pos=0;
 const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 while(pos<source.length){
  const match=mathNotation.find(item=>source.startsWith(item.plain,pos)&&!( /\d$/.test(item.plain)&&/\d/.test(source[pos+item.plain.length]||'') ));
  if(match){
   result+=escape(plain)+mathFormula(match.tex,match.plain.length>65);plain='';pos+=match.plain.length;
  }else{plain+=source[pos++];}
 }
 return result+escape(plain);
}
// Aplicar solo a textos explicativos de los laboratorios, nunca a campos de
// entrada, SVG ni a fórmulas que ya fueron compuestas.
function renderMathWithin(element){
 if(!element)return;
 for(const child of [...element.childNodes]){
  if(child.nodeType===3){
   const source=child.textContent;
   if(!mathNotation.some(item=>source.includes(item.plain)))continue;
   const template=document.createElement('template');
   template.innerHTML=mathHTML(source);
   child.replaceWith(template.content.cloneNode(true));
  }else if(child.nodeType===1&&!['SVG','MATH','TEXTAREA','INPUT','SELECT','SCRIPT','STYLE'].includes(child.tagName.toUpperCase())&&!child.classList.contains('math-inline')&&!child.classList.contains('math-display')){
   renderMathWithin(child);
  }
 }
}
