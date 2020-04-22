// tint
// hsl color picker by query
// requires qwik.js by query + dazon

function setStyle(h,s,l) {
  hgrad = '';
  for (i = 0; i < 360; i += 1) {
    hgrad += `, hsl(${i},${s}%,${l}%)`;
  }
  styles = `#tint-hue::-webkit-slider-runnable-track {
  background: linear-gradient(90deg${hgrad});
}
#tint-hue::-moz-range-track {
  background: linear-gradient(90deg${hgrad});
}
#tint-sat::-webkit-slider-runnable-track {
  background: linear-gradient(90deg, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%));
}
#tint-sat::-moz-range-track {
  background: linear-gradient(90deg, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%));
}
#tint-light::-webkit-slider-runnable-track {
  background: linear-gradient(90deg, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%));
}
#tint-light::-moz-range-track {
  background: linear-gradient(90deg, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%));
}`;
  q.get('#tint-styles').html(styles);
}

document.body.innerHTML += `<div class="tint-modal">
  <div class="tint-picker">
    <style id="tint-styles"></style>
    <input id="tint-hue" type="range" min="0" max="360" value="0">
    <input id="tint-sat" type="range" min="0" max="100" value="100">
    <input id="tint-light" type="range" min="0" max="100" value="50">
  </div>
    <button id="tint-done">Select</button>
</div>`

q.forAll('.tint-picker>input[type=range]',s=>{
  s.on('input',e=>{
    setStyle(q.get('#tint-hue').value,q.get('#tint-sat').value,q.get('#tint-light').value);
  });
});

let moving = false;
let mx = 0;
let my = 0;

q.get('.tint-modal').style.top='0px';
q.get('.tint-modal').style.left='0px';

q.get('.tint-modal').on('mousedown',e=>{
  moving = true;
  mx = -parseInt(e.target.style.left.substr(0,e.target.style.left.length-2))+e.clientX;
  my = -parseInt(e.target.style.top.substr(0,e.target.style.top.length-2))+e.clientY;
});
q.get('.tint-modal>.tint-picker').on('mousedown',e=>{e.stopPropagation()});
window.addEventListener('mouseup',e=>{
  moving = false;
});
window.addEventListener('mousemove',e=>{
  if (moving) {
    q.get('.tint-modal').style.left=(e.clientX-mx)+"px";
    q.get('.tint-modal').style.top=(e.clientY-my)+"px";
  }
});
q.get('#tint-done').on('click',e=>{
  e = new Event('tintdone');
  window.dispatchEvent(e);
});
class tint {
  static open(inp="hsl(0,100%,50%)") {
    let s = [0,100,50];
    try {
      s=inp.substr(4,inp.length-1).split(',').map(x=>parseInt(x.replace('%','')));
    }
    catch(e) {
      s=[0,100,50];
    }
    finally {
      q.get('#tint-hue').value=s[0];
      q.get('#tint-sat').value=s[1];
      q.get('#tint-light').value=s[2];
      q.get('.tint-modal').style.display='block';
      setStyle(s[0],s[1],s[2]);
    }
  }
  static close() {
    q.get('.tint-modal').style.display='none';
  }
  static get() {
    return 'hsl(' +
        q.get('#tint-hue').value + ',' +
        q.get('#tint-sat').value + '%,' +
        q.get('#tint-light').value + '%' + ')';
  }
}
