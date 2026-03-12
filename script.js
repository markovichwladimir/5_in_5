(function(){
"use strict";

// =============== Promenljive ===============
let _c=0, _s=null;
const _t=5, _m=5;
let _p=0, _g=true;
const _circle=document.getElementById("circle");
const _clicksText=document.getElementById("clicks");
const _timeText=document.getElementById("time");
const _gameArea=document.getElementById("gameArea");
const _timesList=document.getElementById("times");
const _overlay=document.getElementById("overlay");
const _sharePopup=document.getElementById("sharePopup");
const _bestResultText=document.getElementById("bestResultText");
const _results=[];

// =============== Funkcije ===============
function _moveCircle(){
  const maxX=_gameArea.clientWidth-60;
  const maxY=_gameArea.clientHeight-60;
  _circle.style.left=Math.random()*maxX+"px";
  _circle.style.top=Math.random()*maxY+"px";
}

function _renderTimes(){
  _timesList.innerHTML="";
  let bestIndex=-1, bestDiff=Infinity;
  _results.forEach((time,i)=>{
    const diff=Math.abs(_t-time);
    if(diff<bestDiff){bestDiff=diff;bestIndex=i;}
  });
  _results.forEach((time,i)=>{
    const li=document.createElement("li");
    const diff=Math.abs(_t-time);
    li.textContent=(i+1)+" — "+time.toFixed(3)+" s (Δ "+diff.toFixed(3)+" s)";
    if(i===bestIndex){li.classList.add("best");li.textContent+=" ⭐";}
    _timesList.appendChild(li);
  });
}

function _animateTitleClick(){
  document.querySelectorAll(".pulse").forEach(num=>{
    num.style.animation="pulseClick 0.3s";
    num.addEventListener("animationend",()=>{
      num.style.animation="pulseAnim 1s infinite";
    },{once:true});
  });
}

// =============== Eventi ===============
_circle.addEventListener("click",()=>{
  if(!_g){alert("Igra je završena. Kliknite Reset.");return;}
  _animateTitleClick();
  if(_c===0){_s=Date.now();}
  _c++;
  _clicksText.textContent=_c;
  if(_c===5){
    const endTime=Date.now();
    const totalTime=(endTime-_s)/1000;
    _timeText.textContent=totalTime.toFixed(3);
    _results.push(totalTime);
    _renderTimes();
    _moveCircle();
    _c=0; _clicksText.textContent=0; _s=null;
    _p++;
    if(_p>=_m){
      _g=false;
      let bestTime=_results.reduce((b,curr)=>Math.abs(_t-curr)<Math.abs(_t-b)?curr:b,_results[0]);
      const diff=Math.abs(_t-bestTime);
      _bestResultText.textContent=`Vaš najbolji rezultat je ${bestTime.toFixed(3)} s. To je samo ${diff.toFixed(3)} s od idealnih 5 sekundi!`;
      _overlay.style.display="block";
      _sharePopup.style.display="block";
    }
  }
});

document.getElementById("resetBtn").addEventListener("click",()=>{
  _c=0; _s=null; _results.length=0; _p=0; _g=true;
  _clicksText.textContent=0; _timeText.textContent="0.000"; _timesList.innerHTML="";
  _moveCircle();
});

document.getElementById("closePopup").onclick=()=>{
  _overlay.style.display="none";
  _sharePopup.style.display="none";
};

document.getElementById("facebookShare").onclick=()=>{
  const url=encodeURIComponent(window.location.href);
  const text=encodeURIComponent("Pogledajte moj rezultat u 5 in 5 igri!");
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`);
};

// =============== Init ===============
_moveCircle();

})();
