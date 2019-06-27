let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  const script = `
  function formatLogs() {
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

    function getLogLinesElements(){
      return [].slice.call(document.querySelectorAll(".kbnDocTable__row"))
    }


    const logLinesElements = getLogLinesElements()
    logLinesElements.forEach((el, idx) => {
      let logLine = el.querySelector(".source").children[1].innerText
      logLine = JSON.parse(logLine)
      const levelString = levelStr(logLine.level)

      const logLineMsgElement ="<div style='color:"+colors[levelString]+"'>"+levelString+": "+logLine.msg+"</div>";
      const elementBunyanLogRow = document.createElement("div")
      elementBunyanLogRow.className="bunyanLogRow"
      elementBunyanLogRow.innerHTML = logLineMsgElement + "<pre>"+JSON.stringify(logLine, '  ', '  ')+"<pre>"
      el.children[2].appendChild(elementBunyanLogRow)
      el.children[2].children[0].style.display = 'none';
      el.children[2].children[1].style.display = 'none';

    })
  }

  formatLogs()
`


  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: script});
  });
};