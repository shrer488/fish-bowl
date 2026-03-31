const url = new URL(window.location.href);
console.log(url)

const sendButton = document.getElementById('composer-submit-button')



//need to add a mutation observer thing to check if the sendButton exists and is clicked
// console.log(sendButton.dataset)
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


