let seeBowlButton = document.getElementById("seeBowl");

let tabUrl = new URL(window.location.href);
console.log(tabUrl)

if (tabUrl.host == "chatgpt.com"){
    seeBowlButton.style.display="block";
}