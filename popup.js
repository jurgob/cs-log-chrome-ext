let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  const script = `
  function levelStr(lev){
    if(lev === 30)
      return "INFO"
    else if(lev === 40)
      return "WARN"
    else if (lev === 50)
      return "ERROR"
  }

  let colors = {
      "INFO": "#149DA0",
      "WARN": "#D18BE1",
      "ERROR": "#860303",
      "DEBUG": "#B2B200"
  }

  var logLinesEls = document.querySelectorAll('dl.truncate-by-height')
  var logLines = [].slice.call(logLinesEls).map(el => el.children[1].innerText).map(j => JSON.parse(j))
  logLinesEls.forEach((el, idx) => {
    let parentEl = el.parentElement.parentElement
    parentEl.className ="";
    let logLine = logLines[idx]
    const levelString = levelStr(logLine.level)
    const firstEl ="<div style='color:"+colors[levelString]+"'>"+levelString+": "+logLine.msg+"</div>";
  	parentEl.innerHTML = firstEl + "<pre>"+JSON.stringify(logLine, '  ', '  ')+"<pre>";
  })
`


  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: script});
  });
};