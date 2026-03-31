const url = new URL(window.location.href);
console.log(url)

const sendButton = document.getElementById('composer-submit-button')
const primaryButton = document.querySelector('[data-type="unified-composer"]');
console.log(primaryButton.dataset)

console.log(sendButton.dataset)
sendButton.addEventListener('click', ()=>{
    console.log('clicked')
})




if (url.host == "chatgpt.com"){
    console.log("CHAT")
}

else if (url.host == "claude.ai"){
    console.log("CLAUDE")
}

else if (url.host == "gemini.google.com"){
    console.log("GEMINI")

}


