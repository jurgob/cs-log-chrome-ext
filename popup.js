let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  const script = `
  var logLinesEls = document.querySelectorAll('dl.truncate-by-height')
  var logLines = [].slice.call(logLinesEls).map(el => el.children[1].innerText).map(j => JSON.parse(j))
  logLinesEls.forEach((el, idx) => {
    let parentEl = el.parentElement.parentElement
    parentEl.className ="";
  	parentEl.innerHTML = "<div></div><pre>"+JSON.stringify(logLines[idx], '  ', '  ')+"<pre>";
  })
`


  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: script});
  });
};