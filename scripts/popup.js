seeBowlButton = document.getElementById("seeBowl");

let url = new URL(window.location.href);
console.log(url)

if (url.host == "chatgpt.com"){
    seeBowlButton.style.display="block";
}