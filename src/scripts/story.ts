// @ts-nocheck
/* Scroll-linked story: a tennis ball, two rackets and six projects, all driven by one pure function of scroll position.
   Timings live in ../config/timeline.ts. Ported from the approved prototype; it is plain DOM + canvas on purpose.
   Runs only when <html> has the "js" class, which the layout adds unless the visitor prefers reduced motion or asked for ?plain. */
import { T } from '../config/timeline';

const stageEl = document.getElementById('stage');
const live = document.documentElement.classList.contains('js');
  
  function sNow(){var r=stageEl.getBoundingClientRect();return -r.top/innerHeight*100}
  if(live){
    stageEl.classList.add('live');
    var bw=document.querySelector('.ballwrap'),seam=document.getElementById('seam'),cv=document.querySelector('.air'),
        bsh=document.querySelector('.bshadow'),fill=document.querySelector('.fill'),hero=document.getElementById('hero'),
        fw=document.getElementById('firstwrap'),fw2=document.getElementById('secondwrap'),fw3=document.getElementById('thirdwrap'),fw4=document.getElementById('fourthwrap'),fw5=document.getElementById('fifthwrap'),fw6=document.getElementById('sixthwrap'),fw7=document.getElementById('seventhwrap'),rain=document.querySelector('.rain'),rkEl=document.querySelector('.racket'),
        idx=document.querySelector('.index'),motifEl=document.querySelector('.motif'),
        ctx=cv.getContext('2d');
    var cl=function(v,a,b){return Math.min(b,Math.max(a,v))};
    var ph=function(p,a,b){return cl((p-a)/(b-a),0,1)};
    var ease=function(t){return t*t*(3-2*t)};
    var N=220,pts=[];
    for(var i=0;i<=N;i++){var u=i/N*Math.PI*2,x=Math.sin(u)+.4*Math.sin(3*u),y=Math.cos(u)-.4*Math.cos(3*u),z=.72*Math.cos(2*u),n=Math.sqrt(x*x+y*y+z*z);
      pts.push([x/n,y/n,z/n])}
    function seamPath(th){
      var c=Math.cos(th),s=Math.sin(th),d='',on=false;
      for(var i=0;i<pts.length;i++){var P=pts[i],y2=P[1]*c-P[2]*s,z2=P[1]*s+P[2]*c;
        if(z2>.03){d+=(on?'L':'M')+(50+50*P[0]).toFixed(1)+' '+(50-50*y2).toFixed(1);on=true}else on=false}
      return d}
    var NP=150,air=[],seed=7;
    function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
    for(var i=0;i<NP;i++){var th=rnd()*Math.PI*2;
      air.push({c:Math.cos(th),s:Math.sin(th),rho:1.12+Math.pow(rnd(),2.4)*2.4,phi:rnd(),w:.7+rnd()*1.6,y:rnd()<.22})}
    var dpr=1,CW=0,CH=0;
    function sizeCanvas(){dpr=Math.min(2,devicePixelRatio||1);CW=innerWidth;CH=innerHeight;
      cv.width=CW*dpr;cv.height=CH*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      if(rain){rain.width=CW*dpr;rain.height=CH*dpr}}
    sizeCanvas();
    function drawAir(r,Zb,cx,cy,q,vis){
      ctx.clearRect(0,0,CW,CH);if(vis<=.01)return;
      var F=Math.hypot(CW,CH)/2*1.12*1.1,len=2+.6*Zb,flow=q*9;
      var g=ctx.createRadialGradient(cx,cy,r*.9,cx,cy,r*2.3);
      g.addColorStop(0,'rgba(216,234,74,'+(.16*vis)+')');g.addColorStop(1,'rgba(216,234,74,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*2.3,0,Math.PI*2);ctx.fill();
      ctx.lineCap='round';
      for(var i=0;i<NP;i++){var P=air[i],u=(P.phi+flow*(.6+P.w*.4))%1,du=.16;
        var dz=u*len,dz2=(u+du)*len;
        var k1=r/(1+dz*r/F),k2=r/(1+dz2*r/F);
        var x1=cx+P.c*P.rho*k1,y1=cy+P.s*P.rho*k1,x2=cx+P.c*P.rho*k2,y2=cy+P.s*P.rho*k2;
        if((x1<-60&&x2<-60)||(x1>CW+60&&x2>CW+60)||(y1<-60&&y2<-60)||(y1>CH+60&&y2>CH+60))continue;
        var a=vis*Math.pow(1-u,1.2)*ease(Math.min(1,u/.05))*.55;
        ctx.strokeStyle=P.y?'rgba(216,234,74,'+a+')':'rgba(244,247,242,'+a*.8+')';
        ctx.lineWidth=Math.max(.8,Math.min(4,k1*.03*P.w));
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
    }
    function reveal(el,t){
      el.style.visibility=t>0?'visible':'hidden';
      el.style.setProperty('--chalk',ph(t,0,.5));el.style.setProperty('--media',ph(t,.15,.85));
      el.style.setProperty('--l1',ph(t,.1,.45));el.style.setProperty('--l2',ph(t,.2,.55));
      el.style.setProperty('--l3',ph(t,.3,.65));el.style.setProperty('--l4',ph(t,.4,.75));
    }
    // three cartoon hops, each with the classic beats: crouch, stretch off the floor, hang time, squash on landing, jiggle
    var HOPS=3,HOP_UP=[260,200,150],LAND_Z=[-1000,-2400,-4600];
    function punt(t){
      var k=Math.min(HOPS-1,Math.floor(t*HOPS)),v=t*HOPS-k;
      var z0=k?LAND_Z[k-1]:0,z1=LAND_Z[k],z=z0,y=0,sy=1,rx=0,rz=0;
      if(v<.22){                                   // anticipation: sink into a crouch
        var c=ease(v/.22);sy=1-.17*c;y=14*c;rx=-5*c;
      }else if(v<.82){                             // flight: parabola, stretched when fast, round at the top
        var w=(v-.22)/.6,b=ease(Math.min(1,w/.12));
        var st=Math.pow(Math.abs(1-2*w),1.2),syF=1+.15*st;
        sy=.83+(syF-.83)*b;y=14*(1-b)+(-HOP_UP[k]*4*w*(1-w))*b;
        z=z0+(z1-z0)*(w*(.8+.2*w));rx=12*Math.sin(Math.PI*w);
      }else{                                       // landing: hard squash, spring back past neutral, wobble
        var m=(v-.82)/.18,d=Math.exp(-5*m)*Math.cos(9*m);
        sy=1-.22*d;y=12*d;z=z1;rx=-3*d;rz=(k%2?-1:1)*2.4*Math.exp(-5*m)*Math.sin(m*22);
      }
      return {z:z,y:y,rx:rx,rz:rz,sx:1/Math.sqrt(sy),sy:sy,op:1-ease(ph(t,.8,.985))}}
    // damped spring, overshoots ~9% then settles
    function spring(w){return w>=1?1:w<=0?0:1-Math.exp(-6.5*w)*Math.cos(7.5*w)}
    var sr=document.getElementById('a2');
    var qr=document.getElementById('a3'),cardRight=0,cardMidY=0;
    var tr=document.getElementById('a5'),ps=document.getElementById('a6'),trTop=0,trLeft=0,trW=0,DMAX=0,psTop=0,psLeft=0,psW=0,psH=0,DMAX2=0;
    function geo(){cardRight=qr.offsetLeft+qr.offsetWidth;cardMidY=qr.offsetTop+qr.offsetHeight/2;
      trTop=tr.offsetTop;trLeft=tr.offsetLeft;trW=tr.offsetWidth;DMAX=innerHeight-trTop+90;
      psTop=ps.offsetTop;psLeft=ps.offsetLeft;psW=ps.offsetWidth;psH=ps.offsetHeight;DMAX2=innerHeight-psTop+110}
    geo();
    // the card takes the hit: a brief squash, then it is launched left, tumbling, and leaves the screen
    function knock(kt){
      var sq=ease(ph(kt,0,.08))*(1-ease(ph(kt,.08,.2))),m=ph(kt,.08,1),e=1-Math.pow(1-m,3);
      var x=-(cardRight+160)*e,y=-70*Math.sin(Math.PI*Math.min(1,m*1.3)),rz=-26*e;
      return 'translate3d('+x+'px,'+y+'px,0) rotate('+rz+'deg) scale('+(1-.07*sq)+',1)'}
    // the second ball: flies in from the right, hits the card, drops, bounces three times to centre, then the camera zooms in
    function ballB(s,vw,vh,cx,cy){
      if(s>=T.out4[0]-2)return ballC(s,vw,vh,cx,cy);
      var r=Math.max(40,Math.min(vw,vh)*.075),groundY=vh*.74,yb=groundY-r,hitBX=cardRight+r*.9,hitY=cardMidY;
      var o={r:r,x:cx,y:yb,rot:0,sx:1,sy:1,lift:0,sh:0,vis:true,speed:0,hitX:cardRight,hitY:hitY};
      var xs=vw+r*2.5,f=ph(s,T.fly[0],T.fly[1]),rotHit=-(xs-hitBX)/r*57.3;
      if(s<T.bounce2[0]){
        var e=f*f;o.x=xs+(hitBX-xs)*e;o.y=hitY-22*(1-f);o.rot=-(xs-o.x)/r*57.3;o.speed=2*f;o.vis=f>0;return o}
      var tau=ph(s,T.bounce2[0],T.bounce2[1]);
      if(tau<1||s<T.zoom2[0]){
        var H=[.26*vh,.15*vh,.07*vh],h0=Math.max(30,yb-hitY);
        var D=[Math.sqrt(h0),2*Math.sqrt(H[0]),2*Math.sqrt(H[1]),2*Math.sqrt(H[2])],tot=D[0]+D[1]+D[2]+D[3];
        var pos=tau*tot,i=0,acc=0;while(i<3&&pos>acc+D[i]){acc+=D[i];i++}
        var u=ph(pos,acc,acc+D[i]),y,c=0,st=0;
        if(i===0){y=hitY+(yb-hitY)*u*u;c=u>.92?(u-.92)/.08:0;st=.1*u}
        else{y=yb-H[i-1]*4*u*(1-u);c=Math.max(0,1-Math.min(u,1-u)/.1);st=.12*Math.pow(Math.abs(1-2*u),1.2)}
        if(tau>=1){y=yb;c=0;st=0}
        var sy=1+st-.22*c;
        o.x=hitBX+(cx-hitBX)*Math.pow(tau,.9);o.y=y+r*(1-sy);o.sy=sy;o.sx=1/Math.sqrt(sy);o.lift=yb-y;
        o.sh=ease(ph(tau,0,.08));o.rot=rotHit-(hitBX-o.x)/r*57.3;return o}
      var z=ph(s,T.zoom2[0],T.zoom2[1]),re=Math.hypot(vw,vh)/2*1.12;
      o.r=r*Math.pow(re/r,ease(z));o.y=yb+(cy-yb)*ease(z);o.x=cx;o.rot=rotHit-(hitBX-cx)/r*57.3;
      o.sh=1-ease(ph(z,0,.3));o.vis=s<T.fillIn2[1]+3;return o}
    // racket geometry: grip pivots near the bottom right, the head meets the ball at its hanging spot
    function rkGeom(vw,vh,cx){var Px=vw*.78,Py=vh*1.03,Bx=cx,By=vh*.46,dx=Bx-Px,dy=By-Py,R=Math.hypot(dx,dy);
      return {Px:Px,Py:Py,Bx:Bx,By:By,R:R,sc:R/170,hit:Math.atan2(dx,-dy)*57.2958}}
    function racketPose(s,vw,vh,cx){
      var g=rkGeom(vw,vh,cx),tau=ph(s,T.swing[0],T.swing[1]),a,gHit=(g.hit+112)/137,uHit=(ph(T.hit,T.swing[0],T.swing[1])-.35)/.65;
      var k=Math.log(1-cl(gHit,.02,.98))/Math.log(1-uHit);
      if(tau<.35)a=-130+18*ease(tau/.35);else a=-112+137*(1-Math.pow(1-(tau-.35)/.65,k));
      var op=ease(ph(s,T.swing[0]-10,T.swing[0]))*(1-ease(ph(s,T.hit+10,T.hit+28)));
      return {g:g,a:a,op:op}}
    // the third ball moment: zoom out to the ball hanging mid-air, the racket hits it, it flies off to the upper right
    function ballC(s,vw,vh,cx,cy){
      var r3=Math.max(40,Math.min(vw,vh)*.075),re=Math.hypot(vw,vh)/2*1.12,g=rkGeom(vw,vh,cx),rot0=ballB(T.zoom2[1],vw,vh,cx,cy).rot;
      var o={r:r3,x:cx,y:g.By,rot:rot0,sx:1,sy:1,lift:0,sh:0,vis:s<T.flight[1]+2,speed:0,hitX:0,hitY:0};
      var z=ph(s,T.zoomOut2[0],T.zoomOut2[1]);
      if(s<T.flight[0]){
        o.r=re*Math.pow(r3/re,ease(z));o.y=cy+(g.By-cy)*ease(z);
        if(z>=1)o.y=g.By-5*Math.sin((s-T.zoomOut2[1])*.3);          // hangs, bobbing slightly
        return o}
      var f=ph(s,T.flight[0],T.flight[1]),hr=g.hit*Math.PI/180,dx=Math.cos(hr),dy=Math.sin(hr),dist=1100*(f*(2-f));
      o.x=g.Bx+dx*dist;o.y=g.By+dy*dist;o.r=r3*(1-.45*f);
      var pulse=1-ease(ph(s,T.hit,T.hit+5));o.sy=1+.22*pulse;o.sx=1-.14*pulse;
      o.rot=rot0-(dist/r3)*57.3;return o}
    // the shower: balls rain onto Triton; each hit jolts the card and together they push it down out of the viewport.
    // Everything is a pure function of scroll position, so scrubbing back and forth is exact.
    var rctx=rain.getContext('2d'),sprite=document.createElement('canvas'),balls=[],hits=[];
    (function(){sprite.width=sprite.height=256;var g=sprite.getContext('2d');
      var gr=g.createRadialGradient(100,84,10,128,128,150);gr.addColorStop(0,'#E4F55C');gr.addColorStop(.7,'#D3E440');gr.addColorStop(1,'#B9CA2C');
      g.fillStyle=gr;g.beginPath();g.arc(128,128,128,0,Math.PI*2);g.fill();
      g.save();g.beginPath();g.arc(128,128,128,0,Math.PI*2);g.clip();
      g.strokeStyle='#F4F7F2';g.lineWidth=10;g.lineCap='round';
      g.beginPath();g.moveTo(-15,46);g.bezierCurveTo(92,97,92,159,-15,210);g.stroke();
      g.beginPath();g.moveTo(271,46);g.bezierCurveTo(164,97,164,159,271,210);g.stroke();g.restore()})();
    var DUR=.22,AFTER=.14;
    function Dfun(pp){return DMAX*Math.pow(ph(pp,.18,1.18),1.8)}
    function buildRain(){
      var vw=innerWidth,vh=innerHeight,vm=Math.min(vw,vh),R0=vm*.065,N=Math.round(cl(vw*vh/17000,40,92)),sd=23;
      function rr(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
      balls=[];hits=[];
      for(var i=0;i<N;i++){
        var R=R0*(.8+rr()*.4),d=rr()*.9,onCard=rr()<.78&&d+DUR<.95;
        var x=onCard?trLeft+R+rr()*(trW-2*R):R+rr()*(vw-2*R);
        var b={x:x,R:R,d:d,hit:onCard,y0:-R*2-rr()*vh*.3,H:vh*.05*(.6+rr()*.8),vx:(rr()-.5)*R*5,spin:(rr()-.5)*900,amp:5+rr()*6};
        balls.push(b);if(onCard)hits.push(b)}
      balls.sort(function(a,b){return a.d-b.d})}
    buildRain();
    // one frame of the shower; also moves Triton (it is the thing being hit)
    function rainFrame(s){
      var vw=innerWidth,vh=innerHeight,pp=ph(s,T.rain[0],T.rain[1])*1.45;
      rctx.setTransform(dpr,0,0,dpr,0,0);rctx.clearRect(0,0,CW,CH);
      var on=s>=T.rain[0]-1&&s<T.rain[1]+4;rain.style.visibility=on?'visible':'hidden';
      var D=Dfun(pp),shake=0;
      for(var k=0;k<hits.length;k++){var dt=pp-(hits[k].d+DUR);if(dt>0&&dt<.12)shake+=hits[k].amp*Math.exp(-dt*35)*Math.sin(dt*125)}
      var prog=ph(pp,.18,1.18);
      tr.style.transform=s>=T.rain[0]-1?'translateY('+(D+shake)+'px) rotate('+(5*ph(pp,.4,1.18))+'deg)':'none';
      if(D>=DMAX-2)fw5.style.visibility='hidden';
      if(!on)return;
      for(var i=0;i<balls.length;i++){var b=balls[i],u=ph(pp,b.d,b.d+DUR);if(u<=0)continue;
        var x=b.x,y,rot=b.spin*u,sx=1,sy=1;
        if(!b.hit){y=b.y0+(vh+b.R*2-b.y0)*u*u}
        else{
          var imp=trTop+Dfun(b.d+DUR)-b.R*.95;
          if(u<1)y=b.y0+(imp-b.y0)*u*u;
          else{var w=(pp-(b.d+DUR))/AFTER;y=imp+4*b.H*w*(w-1);x=b.x+b.vx*w;rot+=b.spin*w*.5;
            var c=Math.max(0,1-w/.12);sy=1-.2*c;sx=1+.14*c;y+=b.R*(1-sy)}}
        if(y>vh+b.R*3)continue;
        rctx.save();rctx.translate(x,y);rctx.scale(sx,sy);rctx.rotate(rot*Math.PI/180);rctx.drawImage(sprite,-b.R,-b.R,b.R*2,b.R*2);rctx.restore()}
    }
    // PintOS: falls in from above like a heavy object, bouncing to rest
    function bounceEase(t){var n=7.5625,d=2.75;
      if(t<1/d)return n*t*t;if(t<2/d){t-=1.5/d;return n*t*t+.75}if(t<2.5/d){t-=2.25/d;return n*t*t+.9375}t-=2.625/d;return n*t*t+.984375}
    function dropState(t){
      var e=bounceEase(t),sq=0,IMP=[.3636,.7273,.9091],AMP=[.11,.055,.025];
      for(var i=0;i<3;i++)sq+=AMP[i]*Math.exp(-Math.pow((t-IMP[i])/.03,2));
      var sy=1-sq;return {y:-(innerHeight*.95)*(1-e),sx:1/Math.sqrt(sy),sy:sy}}
    // three overhead smashes on PintOS. Racket pivots at the top right; the card is knocked down a step each time
    var SWS=1735,SWL=22,HT=.52,STEPS=[.2,.46,1],TILT=[2,5,11];
    function Hk(k){return SWS+SWL*k+SWL*HT}
    function cardTarget(k){return {tx:psLeft+psW*.5,ty:psTop+(k?STEPS[k-1]*DMAX2:0)+psH*.3}}
    function knockState(s){
      var D=0,rot=0,pulse=0;
      for(var k=0;k<3;k++){
        var t=ph(s,Hk(k),Hk(k)+(k<2?9:12)),e=k<2?1+2.2*Math.pow(t-1,3)+1.2*Math.pow(t-1,2):1-Math.pow(1-t,3);
        D+=(STEPS[k]-(k?STEPS[k-1]:0))*DMAX2*e;rot+=(TILT[k]-(k?TILT[k-1]:0))*Math.min(1,t*1.5);
        pulse+=Math.exp(-Math.pow((s-Hk(k))/2.2,2))}
      return {D:D,rot:rot,sx:1+.04*pulse,sy:1-.07*pulse}}
    function racketPoseCard(s,vw,vh){
      var k=cl(Math.floor((s-SWS)/SWL),0,2),S=SWS+SWL*k,tau=ph(s,S,S+SWL),T0=cardTarget(k);
      var Px=vw*.86,Py=-vh*.04,dx=T0.tx-Px,dy=T0.ty-Py,R=Math.hypot(dx,dy),ah=Math.atan2(dx,-dy)*57.2958,ae=ah-14,a;
      var gHit=cl((ah+62)/(ae+62),.02,.98),kk=Math.log(1-gHit)/Math.log(1-(HT-.3)/.32);
      if(tau<.3)a=-72+10*ease(tau/.3);
      else if(tau<.62){var u=(tau-.3)/.32;a=-62+(ae+62)*(1-Math.pow(1-u,kk))}
      else a=ae+(-72-ae)*ease(ph(tau,.62,1));
      return {g:{Px:Px,Py:Py,sc:R/170},a:a,op:(s>=SWS-2&&s<=SWS+SWL*3+2)?1:0}}
    function drawBursts(s,vw,vh){
      var r=Math.min(vw,vh)*.075;
      for(var k=0;k<3;k++){var bt=ph(s,Hk(k),Hk(k)+10);if(bt<=0||bt>=1)continue;var T0=cardTarget(k);
        for(var j=0;j<10;j++){var an=j/10*Math.PI*2+.3,r0=r*(.7+.5*bt),r1=r0+r*(.5+.6*bt);
          ctx.strokeStyle='rgba(216,234,74,'+(1-bt)*.9+')';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();
          ctx.moveTo(T0.tx+Math.cos(an)*r0,T0.ty+Math.sin(an)*r0);ctx.lineTo(T0.tx+Math.cos(an)*r1,T0.ty+Math.sin(an)*r1);ctx.stroke()}}}
    // little puffs of court dust where the ball touches down (before the next project)
    function drawDust(s,vw,vh,cx,groundY,rb){
      var L=16,STR=[1,1,.8];
      for(var k=0;k<3;k++){
        var s0=T.bounce[0]+k/3*(T.bounce[1]-T.bounce[0]),tt=(s-s0)/L;
        if(tt<=0||tt>=1)continue;
        var x0=cx+(vw/2+3*rb+60)*Math.pow(k/3,1.15),y0=groundY,st=STR[k];
        // flat ring pushed out along the floor
        ctx.strokeStyle='rgba(244,247,242,'+(.55*(1-tt)*st)+')';ctx.lineWidth=2.2;
        ctx.beginPath();ctx.ellipse(x0,y0,rb*(.5+1.9*tt)*st,rb*(.1+.4*tt)*st,0,0,Math.PI*2);ctx.stroke();
        for(var j=0;j<16;j++){
          var h1=Math.sin((j+1)*12.9898+k*4.1)*43758.5453,h2=Math.sin((j+1)*78.233+k*9.7)*12543.123;
          h1-=Math.floor(h1);h2-=Math.floor(h2);
          var a=-Math.PI*(.08+.84*(j+.5*h1)/16)+(h2-.5)*.2,sp=(1.6+2.8*h2)*st;
          var px=x0+Math.cos(a)*sp*rb*tt*1.5,py=Math.min(y0+rb*.12,y0+Math.sin(a)*sp*rb*tt*1.5+rb*4.2*tt*tt);
          var rad=Math.max(.8,(2.6+3.4*h1)*(rb/55)*(1-.5*tt));
          ctx.fillStyle=(j%3?'rgba(244,247,242,':'rgba(216,234,74,')+(Math.pow(1-tt,.9)*.95)+')';
          ctx.beginPath();ctx.arc(px,py,rad,0,Math.PI*2);ctx.fill()}}}
    // dust where the card slams down on each backward hop; positions come from the same perspective maths as the CSS
    function drawCardDust(s,vw,vh){
      var L=15,P=900,ox=vw/2,oy=vh*.4,STR=[1,.9,.8];
      for(var k=0;k<HOPS;k++){
        var s0=T.away[0]+(k+.82)/HOPS*(T.away[1]-T.away[0]),tt=(s-s0)/L;
        if(tt<=0||tt>=1)continue;
        var f=P/(P-LAND_Z[k]),uu=36+60*f,st=STR[k];
        var bx=sr.offsetLeft+sr.offsetWidth/2,by=sr.offsetTop+sr.offsetHeight;
        var x0=ox+(bx-ox)*f,y0=oy+(by-oy)*f,W=sr.offsetWidth*f;
        ctx.strokeStyle='rgba(244,247,242,'+(.5*(1-tt)*st)+')';ctx.lineWidth=2.2;
        ctx.beginPath();ctx.ellipse(x0,y0,W*(.45+.3*tt),uu*(.1+.3*tt),0,0,Math.PI*2);ctx.stroke();
        for(var j=0;j<22;j++){
          var h1=Math.sin((j+1)*12.9898+k*5.3)*43758.5453,h2=Math.sin((j+1)*78.233+k*7.1)*12543.123;
          h1-=Math.floor(h1);h2-=Math.floor(h2);
          var sx0=x0+(h1-.5)*W,a=-Math.PI*(.12+.76*(j+.5*h2)/22)+(h2-.5)*.2,sp=(1.4+2.6*h2)*st;
          var px=sx0+Math.cos(a)*sp*uu*tt*1.4,py=Math.min(y0+uu*.1,y0+Math.sin(a)*sp*uu*tt*1.4+uu*4*tt*tt);
          var rad=Math.max(.9,(2.4+3*h1)*(uu/55)*(1-.5*tt));
          ctx.fillStyle=(j%3?'rgba(244,247,242,':'rgba(216,234,74,')+(Math.pow(1-tt,.9)*.95)+')';
          ctx.beginPath();ctx.arc(px,py,rad,0,Math.PI*2);ctx.fill()}}}
    // dust where the second ball lands on each of its three bounces (and where it finally settles)
    function drawDustB(s,vw,vh,cx){
      if(s<T.bounce2[0]||s>T.bounce2[1]+16)return;
      var r=Math.max(40,Math.min(vw,vh)*.075),groundY=vh*.74,yb=groundY-r,hitBX=cardRight+r*.9,hitY=cardMidY;
      var H=[.26*vh,.15*vh,.07*vh],h0=Math.max(30,yb-hitY);
      var D=[Math.sqrt(h0),2*Math.sqrt(H[0]),2*Math.sqrt(H[1]),2*Math.sqrt(H[2])],tot=D[0]+D[1]+D[2]+D[3];
      var cum=0,STR=[.8,1,.75,.5],L=14;
      for(var k=0;k<4;k++){
        cum+=D[k];var ta=cum/tot,s0=T.bounce2[0]+ta*(T.bounce2[1]-T.bounce2[0]),tt=(s-s0)/L;
        if(tt<=0||tt>=1)continue;
        var x0=hitBX+(cx-hitBX)*Math.pow(ta,.9),y0=groundY,st=STR[k],uu=r;
        ctx.strokeStyle='rgba(244,247,242,'+(.55*(1-tt)*st)+')';ctx.lineWidth=2.2;
        ctx.beginPath();ctx.ellipse(x0,y0,uu*(.5+1.9*tt)*st,uu*(.1+.4*tt)*st,0,0,Math.PI*2);ctx.stroke();
        for(var j=0;j<16;j++){
          var h1=Math.sin((j+1)*12.9898+k*6.7)*43758.5453,h2=Math.sin((j+1)*78.233+k*3.9)*12543.123;
          h1-=Math.floor(h1);h2-=Math.floor(h2);
          var a=-Math.PI*(.08+.84*(j+.5*h1)/16)+(h2-.5)*.2,sp=(1.6+2.8*h2)*st;
          var px=x0+Math.cos(a)*sp*uu*tt*1.5,py=Math.min(y0+uu*.12,y0+Math.sin(a)*sp*uu*tt*1.5+uu*4.2*tt*tt);
          var rad=Math.max(.8,(2.6+3.4*h1)*(uu/55)*(1-.5*tt));
          ctx.fillStyle=(j%3?'rgba(244,247,242,':'rgba(216,234,74,')+(Math.pow(1-tt,.9)*.95)+')';
          ctx.beginPath();ctx.arc(px,py,rad,0,Math.PI*2);ctx.fill()}}}
    // impact where the racket strikes the hanging ball: a shock ring, yellow rays and a spray of sparks
    function drawHit(s,vw,vh,cx){
      var tt=(s-T.hit)/18;if(tt<=0||tt>=1)return;
      var g=rkGeom(vw,vh,cx),r=Math.max(40,Math.min(vw,vh)*.075),dx=g.Px-g.Bx,dy=g.Py-g.By,dl=Math.hypot(dx,dy);
      var x0=g.Bx+dx/dl*r*.85,y0=g.By+dy/dl*r*.85,e=1-Math.pow(1-tt,3);
      ctx.strokeStyle='rgba(244,247,242,'+(.8*(1-tt))+')';ctx.lineWidth=3.5*(1-tt)+1;
      ctx.beginPath();ctx.arc(x0,y0,r*(.3+1.5*e),0,Math.PI*2);ctx.stroke();
      for(var j=0;j<12;j++){var an=j/12*Math.PI*2+.2,r0=r*(.55+.9*e),r1=r0+r*(.35+.6*e);
        ctx.strokeStyle='rgba(216,234,74,'+(1-tt)*.95+')';ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();
        ctx.moveTo(x0+Math.cos(an)*r0,y0+Math.sin(an)*r0);ctx.lineTo(x0+Math.cos(an)*r1,y0+Math.sin(an)*r1);ctx.stroke()}
      for(var k=0;k<20;k++){
        var h1=Math.sin((k+1)*12.9898)*43758.5453,h2=Math.sin((k+1)*78.233)*12543.123;h1-=Math.floor(h1);h2-=Math.floor(h2);
        var an2=k/20*Math.PI*2+h1*.4,sp=(2.2+3*h2)*r*e,px=x0+Math.cos(an2)*sp,py=y0+Math.sin(an2)*sp+r*1.2*tt*tt;
        ctx.fillStyle=(k%3?'rgba(244,247,242,':'rgba(216,234,74,')+((1-tt)*.95)+')';
        ctx.beginPath();ctx.arc(px,py,Math.max(.8,(2+2.6*h1)*(r/55)*(1-.6*tt)),0,Math.PI*2);ctx.fill()}}
    // finale: a ball rolls across the floor and the closing words appear behind it
    function ballRoll(s,vw,vh){
      var r=Math.max(40,Math.min(vw,vh)*.075),R=ph(s,T.roll7[0],T.roll7[1]),x=-r*1.6+(vw+r*3.2)*R;
      return {r:r,x:x,y:vh*.74-r,rot:x/r*57.3,sx:1,sy:1,lift:0,sh:ease(ph(R,0,.04))*(1-ease(ph(R,.96,1))),vis:R>0&&R<1,speed:0,hitX:0,hitY:0}}
    function drawRollTrail(s,vw,vh){
      var R=ph(s,T.roll7[0],T.roll7[1]);if(R<=0||R>=1)return;
      var r=Math.max(40,Math.min(vw,vh)*.075),x=-r*1.6+(vw+r*3.2)*R,gy=vh*.74;
      for(var i=0;i<14;i++){
        var tx=x-r*(1.05+.5*i);if(tx<-10||tx>vw+10)continue;
        var h=Math.sin((i+1)*37.7)*9301.3;h-=Math.floor(h);var f=1-i/14;
        ctx.fillStyle=(i%3?'rgba(244,247,242,':'rgba(216,234,74,')+(.7*f)+')';
        ctx.beginPath();ctx.arc(tx,gy-r*(.05+.45*h*(1-f)),Math.max(.8,r*.07*f+1),0,Math.PI*2);ctx.fill()}}
    // speed lines behind the incoming ball, and a burst where it connects
    function drawFx(s,B){
      if(!B)return;
      if(B.speed>0.02){
        var len=B.r*7*B.speed;
        for(var i=0;i<4;i++){var yy=B.y+(i-1.5)*B.r*.5,x0=B.x+B.r*.9,g=ctx.createLinearGradient(x0,0,x0+len,0);
          g.addColorStop(0,'rgba(244,247,242,'+(.55*Math.min(1,B.speed))+')');g.addColorStop(1,'rgba(244,247,242,0)');
          ctx.strokeStyle=g;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x0+len,yy);ctx.stroke()}}
      var bt=ph(s,T.knock[0],T.knock[0]+14);
      if(bt>0&&bt<1){
        for(var j=0;j<10;j++){var an=j/10*Math.PI*2+.3,r0=B.r*(.9+.5*bt),r1=r0+B.r*(.5+.6*bt);
          ctx.strokeStyle='rgba(216,234,74,'+(1-bt)*.9+')';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();
          ctx.moveTo(B.hitX+Math.cos(an)*r0,B.hitY+Math.sin(an)*r0);ctx.lineTo(B.hitX+Math.cos(an)*r1,B.hitY+Math.sin(an)*r1);ctx.stroke()}}
    }
    function intro(){
      var total=stageEl.offsetHeight-innerHeight,s=sNow();
      var vw=innerWidth,vh=innerHeight,cx=vw/2,cy=vh*.5,d=bw.offsetWidth;
      var h=ph(s,T.heroOut[0],T.heroOut[1]);hero.style.opacity=1-h;hero.style.transform='translateY('+(-40*h)+'px)';
      hero.style.visibility=h>=1?'hidden':'visible';

      var q=ph(s,T.roll[0],T.roll[1]),rs=Math.max(4,Math.min(vw,vh)*.008),re=Math.hypot(vw,vh)/2*1.12;
      var rb=Math.max(34,Math.min(vw,vh)*.085),groundY=vh*.74,yb=groundY-rb;
      var z=ph(s,T.zoomOut[0],T.zoomOut[1]),t=ph(s,T.bounce[0],T.bounce[1]);
      var r,x=cx,y=cy,lift=0,H=1,sx=1,sy=1,rot=0;
      if(z<=0){r=rs*Math.pow(re/rs,ease(q))}
      else{r=re*Math.pow(rb/re,ease(z));y=cy+(yb-cy)*z*z}          // zooms out while dropping to the floor
      if(t>0){
        r=rb;x=cx+(vw/2+3*rb+60)*Math.pow(t,1.15);
        var k=Math.min(2,Math.floor(t*3)),u=t*3-k;H=[.30,.21,.13][k]*vh;lift=4*u*(1-u)*H;y=yb-lift;
        var edge=Math.min(u,1-u),c=Math.max(0,1-edge/.09);            // squash on contact
        sx=1+.2*c;sy=1-.24*c;y+=r*(1-sy);rot=t*360*3.2;
      }
      var B=s>=T.fly[0]-1?ballB(s,vw,vh,cx,cy):null;
      if(s>=T.roll7[0]-2)B=ballRoll(s,vw,vh);
      if(B){r=B.r;x=B.x;y=B.y;sx=B.sx;sy=B.sy;rot=B.rot;lift=B.lift;H=.3*vh}
      seam.setAttribute('d',seamPath(q*Math.PI*2*3.6));
      var vis=B?B.vis:(s>T.roll[0]-3&&s<T.reveal2[0]+4&&x<vw+r*2+10);
      bw.style.visibility=vis?'visible':'hidden';
      bw.style.transform='translate('+(x-d/2)+'px,'+(y-d/2)+'px) scale('+(2*r/d*sx)+','+(2*r/d*sy)+') rotate('+rot+'deg)';

      var Zb=re*1.1/Math.max(r,1);
      drawAir(r,Zb,cx,cy,q,(s<T.fillIn[1]&&s>T.roll[0]-3?1:0)*ease(ph(s,T.roll[0]-3,T.roll[0]+25))*(1-ease(ph(s,300,340))));

      drawFx(s,B);
      drawRollTrail(s,vw,vh);
      drawDust(s,vw,vh,cx,groundY,rb);
      drawCardDust(s,vw,vh);
      drawDustB(s,vw,vh,cx);
      drawHit(s,vw,vh,cx);
      drawBursts(s,vw,vh);
      // contact shadow while it bounces
      var sOp=B?B.sh*(vis?1:0):ease(ph(z,.55,1))*(1-ease(ph(t,.82,1)))*(vis?1:0);
      bsh.style.visibility=sOp>.01?'visible':'hidden';bsh.style.opacity=sOp*(1-.45*(lift/(H||1)));
      var sw=(B?B.r:rb)*2.2*(1-.35*(lift/(.3*vh)));
      bsh.style.transform='translate('+(x-50)+'px,'+(groundY-50+3)+'px) scale('+(sw/100)+','+(sw/100*.24)+')';

      // yellow takes the screen, Interim shows, then the colour lets go as the ball shrinks
      var f=Math.max(ph(s,T.fillIn[0],T.fillIn[1])*(1-ph(s,T.fillOut[0],T.fillOut[1])),ph(s,T.fillIn2[0],T.fillIn2[1])*(1-ph(s,T.fillOut2[0],T.fillOut2[1])));
      fill.style.opacity=f;fill.style.visibility=f>0?'visible':'hidden';
      reveal(fw,ph(s,T.reveal1[0],T.reveal1[1]));
      var fo=1-ph(s,T.out1[0],T.out1[1]);fw.style.opacity=fo;if(fo<=0)fw.style.visibility='hidden';
      reveal(fw2,ph(s,T.reveal2[0],T.reveal2[1]));
      var at=ph(s,T.away[0],T.away[1]);
      if(at>0){var m=punt(at);
        sr.style.transform='translate3d(0,'+m.y+'px,'+m.z+'px) rotateX('+m.rx+'deg) rotate('+m.rz+'deg) scale('+m.sx+','+m.sy+')';
        fw2.style.opacity=m.op;if(at>=1||m.op<=0)fw2.style.visibility='hidden'}
      else{sr.style.transform='none';fw2.style.opacity=1}
      var w=ph(s,T.slide[0],T.slide[1]);
      if(w>0){var X=vw*1.1,e=spring(w),v=(spring(Math.min(1,w+.01))-spring(Math.max(0,w-.01)))/.02;
        fw3.style.visibility='visible';
        fw3.style.transform='translate3d('+((1-e)*X)+'px,0,0) skewX('+cl(v*1.6,-12,12)+'deg) scaleX('+(1+Math.min(.08,Math.abs(v)*.012))+')'}
      else{fw3.style.visibility='hidden';fw3.style.transform='translate3d('+(vw*1.1)+'px,0,0)'}
      var kt=ph(s,T.knock[0],T.knock[1]);
      if(kt>0){qr.style.transform=knock(kt);if(kt>=1)fw3.style.visibility='hidden'}else qr.style.transform='none';
      reveal(fw4,ph(s,T.reveal4[0],T.reveal4[1]));
      var fo4=1-ph(s,T.out4[0],T.out4[1]);fw4.style.opacity=fo4;if(fo4<=0)fw4.style.visibility='hidden';
      var rp=s>=SWS-12?racketPoseCard(s,vw,vh):racketPose(s,vw,vh,cx),G=rp.g;
      rkEl.style.width=(100*G.sc)+'px';rkEl.style.height=(300*G.sc)+'px';
      rkEl.style.transform='translate('+(G.Px-50*G.sc)+'px,'+(G.Py-300*G.sc)+'px) rotate('+rp.a+'deg)';
      rkEl.style.opacity=rp.op;rkEl.style.visibility=rp.op>.01?'visible':'hidden';
      reveal(fw5,ph(s,T.reveal5[0],T.reveal5[1]));
      rainFrame(s);
      var dp=ph(s,T.drop6[0],T.drop6[1]);
      var kd=knockState(s);
      if(dp>0){var ds=dropState(dp);fw6.style.visibility=kd.D>=DMAX2-2?'hidden':'visible';
        ps.style.transform='translate3d(0,'+(ds.y+kd.D)+'px,0) rotate('+kd.rot+'deg) scale('+(ds.sx*kd.sx)+','+(ds.sy*kd.sy)+')'}
      else{fw6.style.visibility='hidden';ps.style.transform='none'}
      var Rr=ph(s,T.roll7[0],T.roll7[1]);
      reveal(fw7,s>=T.roll7[0]?1:0);
      fw7.style.clipPath=Rr>=1?'none':'inset(-30px '+(100-cl((B&&s>=T.roll7[0]-2?B.x:0)/vw*100,0,100))+'% -30px 0)';

      idx.classList.toggle('wait',scrollY<total+vh*.7);
      motifEl.classList.add('pre');
    }
    var iraf=0;function iq(){if(!iraf)iraf=requestAnimationFrame(function(){iraf=0;intro()})}
    addEventListener('scroll',iq,{passive:true});addEventListener('resize',function(){sizeCanvas();geo();buildRain();iq()});intro();
  }
