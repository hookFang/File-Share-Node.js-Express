// Code reffered from https://www.w3schools.com/howto/howto_js_copy_clipboard.asp

function copyText(copyFileID) {
  var temp = document.createElement("input");
  temp.setAttribute("value", document.domain + "/download/" + copyFileID);
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  alert("Download Link Copied");
}
