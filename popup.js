const displayCustomLog = document.getElementById('displayCustomLog');
const displayOriginal = document.getElementById('displayOriginal');
const displayOnlyShort = document.getElementById('displayOnlyShort');
const displayOnlyBunyan = document.getElementById('displayOnlyBunyan');
const displayOnlyAll = document.getElementById('displayOnlyAll');
const displayLogPopUp = document.getElementById('displayLogPopUp');
const logPopUpHideDetails = document.getElementById('logPopUpHideDetails');
const logPopUpShowDetails = document.getElementById('logPopUpShowDetails');
chrome.storage.sync.get('color', function(data) {
  // changeColor.style.backgroundColor = data.color;
  // changeColor.setAttribute('value', data.color);
});


const commonScript = `
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

    function renderLogLineEl(logLine) {
      const levelString = levelStr(logLine.level)
      const logLineMsgElement ="<div style='color:"+colors[levelString]+"'>"+levelString+": "+logLine.msg+"</div>";
      const elementBunyanLogRow = document.createElement("div")
      elementBunyanLogRow.className="bunyanLogRow"
      elementBunyanLogRow.innerHTML = '<div class="logLineShort">' + logShortRender(logLine) + '</div><div class="logLineExtended" >' +logLineMsgElement + "<pre>"+JSON.stringify(logLine, '  ', '  ')+"<pre></div>"
      return elementBunyanLogRow
    }

    function showCustomLogs(){
      const logLinesElements = getLogLinesElements()
      logLinesElements.forEach((el, idx) => {
        let logLine = el.querySelector(".source").children[1].innerText
        logLine = JSON.parse(logLine)
        if(!el.children[2].children[2]){

          el.children[2].appendChild(renderLogLineEl(logLine))
        } else {
          el.children[2].children[2].style.display = null;
        }
        el.children[2].children[0].style.display = 'none';
        el.children[2].children[1].style.display = 'none';

      })
    }


    function showOriginalLogs(){
      const logLinesElements = getLogLinesElements()
      logLinesElements.forEach((el, idx) => {
        el.children[2].children[0].style.display = null;
        el.children[2].children[1].style.display = null;
        el.children[2].children[2].style.display = 'none';
      })
    }

    function logShortRender(logLine){
      if(logLine._audit)
      return logShortRenderAccess(logLine)
    }

    function logShortRenderAccess(logLine){
      return "ACCESS:" + " " + logLine.res.statusCode+ " " +logLine.latency + "ms  " +logLine.req.method + " "+logLine.req.url
    }

    function customLoginDisplayDetails(showDetails) {
      const displayValue = showDetails ? null :'none'
      const els = document.querySelectorAll('#logPopUp .logLineExtended')
      return [].slice.call(els)
        .forEach(el => {
          el.style.display = displayValue
        })
    }

    function displayCustomLogsPartial(type) {

      let displays = [null, null]
      if (type === 'both'){
        displays = [null, null]
      } else if(type === 'short') {
        displays = [null, 'none']
      } else if(type === 'bunyan') {
        displays = ['none', null]
      }


      const logLinesElements = getLogLinesElements()
      logLinesElements.forEach((el, idx) => {
        const customLogEl = el.children[2].children[2]
        customLogEl.querySelector('.logLineShort').style.display = displays[0];
        customLogEl.querySelector('.logLineExtended').style.display = displays[1];
      })
    }


    function displayLogPopUp(){
      const logPopup = document.createElement("div")
      logPopup.id = "logPopUp"

      logPopup.style.position = 'absolute';
      logPopup.style.top = '100px';
      logPopup.style.left = '220px';
      logPopup.style.width = '100%';
      logPopup.style.border = '1px solid black';
      logPopup.style.backgroundColor = '#ddd';
      logPopup.style.zIndex = '10000';
      logPopup.innerHTML="<table><thead><th></th><th>Time</th><th>Log</th></thead><tbody></tbody></table>"

      document.querySelector('body').appendChild(logPopup)

      const logLinesElements = getLogLinesElements()
      const logLines = logLinesElements.map(el => JSON.parse( el.querySelector(".source").children[1].innerText ) )
      const tbody = logPopup.querySelector('tbody');
      logLines
        .sort((a, b) => a.time < b.time  )
        .forEach((logLine, idx) => {
          const logLineEl = document.createElement("tr")
          logLineEl.innerHTML = "<td style='padding: 5px' ><button>V</button></td><td style='white-space: nowrap; padding: 5px' >"+logLine.time+"</td><td>"+renderLogLineEl(logLine).innerHTML+"</td>"
          tbody.appendChild(logLineEl)
        })

    }

`


function executeScriptOnPage(code){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: code});
  });

}

executeScriptOnPage(commonScript)

displayCustomLog.onclick = function(element) {
  const displayCustomLogScript = `
    showCustomLogs()
  `
  executeScriptOnPage(displayCustomLogScript);

};
displayOriginal.onclick = function(element) {
  const script = `
    showOriginalLogs()
  `
  executeScriptOnPage(script);
}

displayOnlyShort.onclick = function(element) {
  executeScriptOnPage(`displayCustomLogsPartial('short')`);
}
displayOnlyBunyan.onclick = function(element) {
  executeScriptOnPage(`displayCustomLogsPartial('bunyan')`);
}
displayOnlyAll.onclick = function(element) {
  executeScriptOnPage(`displayCustomLogsPartial('both')`);
}

displayLogPopUp.onclick = function(element) {
  executeScriptOnPage(`displayLogPopUp()`);
}

logPopUpHideDetails.onclick = function(element) {
  executeScriptOnPage(`customLoginDisplayDetails(false)`);
}
logPopUpShowDetails.onclick = function(element) {
  executeScriptOnPage(`customLoginDisplayDetails(true)`);
}

