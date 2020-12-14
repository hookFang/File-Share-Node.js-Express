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

function openForm(formID) {
  document.getElementById(formID).style.display = "flex";
}

function closeForm(formID) {
  document.getElementById(formID).style.display = "none";
}

function deleteFile(fileID) {
  // Get the checkbox
  console.log(fileID);

  fetch("/deleteAPI/" + fileID, { method: "DELETE" })
    .then(function (response) {
      if (response.ok) {
        console.log("File Deleted Succesfully");
        location.reload();
        return;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      console.log(error);
    });
}
