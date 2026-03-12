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
const _audioCtx=new(window.AudioContext||window.webkitAudioContext)();

function _playClick(){
  const osc=_audioCtx.createOscillator();
  const gain=_audioCtx.createGain();
  osc.connect(gain);
  gain.connect(_audioCtx.destination);
  osc.frequency.setValueAtTime(600,_audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200,_audioCtx.currentTime+0.08);
  gain.gain.setValueAtTime(0.3,_audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001,_audioCtx.currentTime+0.08);
  osc.start(_audioCtx.currentTime);
  osc.stop(_audioCtx.currentTime+0.08);
}

function _moveCircle(){
  const maxX=_gameArea.clientWidth-72;
  const maxY=_gameArea.clientHeight-72;
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
  if(!_g){alert("Game over. Click Reset.");return;}
  _playClick();
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
      _bestResultText.textContent=`Your best result is ${bestTime.toFixed(3)} s. That is only ${diff.toFixed(3)} s away from the perfect 5 seconds!`;
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
  const text=encodeURIComponent("Check out my result in the 5 in 5 game!");
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`);
};

// =============== Space Game ===============
let _sc=0, _ss=null;
let _sp=0, _sg=true;
const _pressesText=document.getElementById("presses");
const _timeSpaceText=document.getElementById("timeSpace");
const _timesSpaceList=document.getElementById("timesSpace");
const _spaceInput=document.getElementById("spaceInput");
const _resultsSpace=[];

function _renderTimesSpace(){
  _timesSpaceList.innerHTML="";
  let bestIndex=-1, bestDiff=Infinity;
  _resultsSpace.forEach((time,i)=>{
    const diff=Math.abs(_t-time);
    if(diff<bestDiff){bestDiff=diff;bestIndex=i;}
  });
  _resultsSpace.forEach((time,i)=>{
    const li=document.createElement("li");
    const diff=Math.abs(_t-time);
    li.textContent=(i+1)+" — "+time.toFixed(3)+" s (Δ "+diff.toFixed(3)+" s)";
    if(i===bestIndex){li.classList.add("best");li.textContent+=" ⭐";}
    _timesSpaceList.appendChild(li);
  });
}

function _handleSpace(){
  if(_nameModal.style.display==="block") return;
  if(!_sg){alert("Game over. Click Reset.");return;}
  _playClick();
  _animateTitleClick();
  if(_sc===0){_ss=Date.now();}
  _sc++;
  _pressesText.textContent=_sc;
  if(_sc===5){
    const endTime=Date.now();
    const totalTime=(endTime-_ss)/1000;
    _timeSpaceText.textContent=totalTime.toFixed(3);
    _resultsSpace.push(totalTime);
    _renderTimesSpace();
    _sc=0; _pressesText.textContent=0; _ss=null;
    _spaceInput.setSelectionRange(0,0);
    _sp++;
    if(_sp>=_m){
      _sg=false;
      let bestTime=_resultsSpace.reduce((b,curr)=>Math.abs(_t-curr)<Math.abs(_t-b)?curr:b,_resultsSpace[0]);
      const diff=Math.abs(_t-bestTime);
      _bestResultText.textContent=`Your best result is ${bestTime.toFixed(3)} s. That is only ${diff.toFixed(3)} s away from the perfect 5 seconds!`;
      _overlay.style.display="block";
      _sharePopup.style.display="block";
    }
  }
}

_spaceInput.addEventListener("keydown",(e)=>{
  if(e.code==="Space"){
    e.preventDefault();
    _handleSpace();
  }
});

document.getElementById("resetBtnSpace").addEventListener("click",()=>{
  _sc=0; _ss=null; _resultsSpace.length=0; _sp=0; _sg=true;
  _pressesText.textContent=0; _timeSpaceText.textContent="0.000"; _timesSpaceList.innerHTML="";
});

// =============== Ime igrača ===============
const _nameModal=document.getElementById("nameModal");
const _nameInput=document.getElementById("nameInput");
const _playerName=document.getElementById("playerName");

function _showNameModal(){
  _nameInput.value="";
  _nameModal.style.display="block";
  _nameInput.focus();
}

function _saveName(){
  const name=_nameInput.value.trim();
  if(!name) return;
  sessionStorage.setItem("playerName",name);
  _playerName.textContent=name;
  _nameModal.style.display="none";
}

document.getElementById("saveNameBtn").addEventListener("click",_saveName);
_nameInput.addEventListener("keydown",(e)=>{if(e.key==="Enter")_saveName();});
document.getElementById("changeNameBtn").addEventListener("click",_showNameModal);

const _savedName=sessionStorage.getItem("playerName");
if(_savedName){
  _playerName.textContent=_savedName;
} else {
  _showNameModal();
}

// =============== Tabs ===============
document.querySelectorAll(".tabBtn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tabBtn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tabPanel").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-"+btn.dataset.tab).classList.add("active");
    if(btn.dataset.tab==="space") _spaceInput.focus();
    if(btn.dataset.tab!=="space") _spaceInput.blur();
  });
});
document.getElementById("tab-game").classList.add("active");

document.getElementById("tab-space").addEventListener("click",(e)=>{
  if(e.target!==_spaceInput) _spaceInput.focus();
});

// =============== Init ===============
_moveCircle();

})();
