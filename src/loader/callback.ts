



function getScripts() {
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', 'http://127.0.0.1:3005/urls',false);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();
  var raw = xhttp.responseText;
  console.log(`raw=${raw}`);
  var response = JSON.parse(xhttp.responseText);
  console.log(JSON.stringify(response));
  return response;
}

//http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
function loadjscssfile(filename, filetype){
    let fileref;
  if (filetype=="js"){ //if filename is a external JavaScript file
      fileref=document.createElement('script')
      fileref.setAttribute("type","text/javascript")
      fileref.setAttribute("src", filename)
  }
  else if (filetype=="css"){ //if filename is an external CSS file
      fileref=document.createElement("link")
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("href", filename)
  }
  if (typeof fileref!="undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref)
}

window.addEventListener('load',function (event) {
    let scripts = getScripts();
    scripts.urls.array.forEach(element => {
        console.log(`urls: ${element}`)
    });
});

