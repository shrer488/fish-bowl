
const url = new URL(window.location.href);
console.log(url)

const sendButton = document.getElementById('button')
console.log(document)



setTimeout(() => {

    // CREATING WATER BOWL
    const chatArea = document.querySelector("body");
    const fishImg = chrome.runtime.getURL("/images/fish-swimming.gif");
    console.log(chrome.runtime.getURL("images/fish-swimming.gif"));

    let fishBowl = `
    <ul class="fishBowl">
        
        <li class ="fish">
        <img src="${fishImg}" alt="fish">
        </li>
    </ul>
    <div class="mask-source"></div>
    `;

    //checking if chatArea even exists
    if (chatArea) {
        chatArea.insertAdjacentHTML("afterbegin", fishBowl);
        defaultWaterLine();
    } 
    else {
        console.log("chatArea not found");
    }


    
    
    
    // TESTING IF USER HAS SENT A PROMPT


	document.querySelector('div[aria-label="Chat with ChatGPT"]').addEventListener('keydown', (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
            //here event.key is checking if enter was clicked and !event.shiftKey is checking if shift key was not clicked. In chat you can get to another line in the text box by pressing shift+enter so it is brought in combination, this function checks only the enter key press without the combination of shift key 
			console.log('Visitor pressed return!')
            waterLevelCalculator(charCounter());
		}

        if(event.key){
            let char = charCounter();
            console.log(char);
        }
	})


	// Watch on the whole doc, since the button is added/removed:
	document.addEventListener('click', (event) => {
		// But only mind clicks within the one we care about:
		if (event.target.closest('button[aria-label="Send prompt"]')) {
			console.log('Visitor clicked send button!');
            // let characters = charCounter();
            waterLevelCalculator(charCounter());
            // charReset(charCounter());
		}
	}, true) // "Capture" phase since they probably use `stopPropagation()` somewhere!



}, 3000)


let waterUsed = 0
let waterBudget = 200

function waterLevelCalculator(char){
    waterUsed = waterUsed + 10; //increased by 10 because we are increasing the token rate by 10l
    let remainingWater = waterBudget-waterUsed;
    console.log('waterUsed = ', waterUsed)
    console.log('remainingWater = ', remainingWater);

    let bowlBody = document.querySelector('.fishBowl')
    const count = document.querySelectorAll('.fishBowl li').length;
    console.log(count);
    const secondLi = bowlBody.querySelector('li:nth-last-child(2)'); // second child cause the first child is the fish lol
    // const thirdLi = bowlBody.querySelector('li:nth-child(3)'); // second child cause the first child is the fish lol
    
    console.log(secondLi)
    
    if(char<30){
        secondLi.remove();
    }

    else if(char>30){
        secondLi.remove();
        secondLi.remove();
        secondLi.remove();
        secondLi.remove();
        secondLi.remove();

        // thirdLi.remove();
    }
    

}


// DEFAULT WATER LEVEL
function defaultWaterLine(){
    let bowlBody = document.querySelector('.fishBowl')
    console.log(bowlBody)
    
    //looped to add water level according to how much water budget we assign
    for(let i=0; i <(waterBudget/10); i++){
        bowlBody.insertAdjacentHTML("afterbegin",`<li></li>`);
    }
    
}


let char = 0;
// CHARACTER COUNTER
function charCounter(){
    char = char + 1;
    return char;
    
}

function charReset(char){
    char = 0;
}



//adding waterbowl
// let fishBowl = document.createElement('ul')
// console.log(fishBowl)

// const field = document.getElementsByTagName('main')

// document.body.appendChild(fishBowl)
// let waterLevel =`
//        <p>hello</p>
//         ` 

// fishBowl.insertAdjacentHTML('beforeend', waterLevel)
// let chatArea =document.querySelector('div[aria-label="Chat with ChatGPT"]');
// document.getElementById("parentElementId").appendChild(waterLevel);




// function bowlRefill(){
//         let waterLevel =`
//         <li class='waterLevel'>
//         </li>
//         `
//         let msgValue=10

//         for(let i=0; i< waterBudget; i+msgValue){
//             fishBowl.insertAdjacentHTML('beforeend', waterLevel)
//             console.log(i)
//         }
// }



// const tokenBudget = 300;
// let totalToken=0;

// for (let newToken=0; totalToken < tokenBudget; newToken++) {
//     totalToken = totalToken+10;
//     console.log("The number is " + i);
// }
// let userBudget = tokenBudget-totalToken;
// console.log(userBudget);




// let messege = 10;
// if user sends token then their total token is subtracted by 10;
// now new total token = total token - message
// at first total token = 300
// so total token = token budget
// now user starts using ai
// so total token = total token - message
// this loops everytime user sends message
// so for how long?
// if user sends message then this subtraction function is called
// so subtraction function is (total token = total token - message)
// for now to test lets say user sends 10 messages









// console.log(document.getElementsByTagName('div[aria-label="Chat with ChatGPT"]'))



// console.log(sendButton.dataset)
// sendButton.addEventListener('click', ()=>{
//     console.log('clicked')
// })

// console.log(document.querySelector('div[aria-label="Chat with ChatGPT"]'))
// document.querySelector('div[aria-label="Chat with ChatGPT"]').addEventListener('keydown', (event) => {
// 	if (event.key === 'Enter') {
// 		console.log('Visitor pressed return when typing!')
// 	}
// })

// document.querySelector('div[aria-label="Send prompt"]').addEventListener('click', (event) => {
// 	console.log('Visitor clicked send button!')
// })


// MutationObserver CODE 

// const observer = new MutationObserver(() => {
//   console.log("something changed in page");
    
// });

// let newDoc = document.querySelector('div[aria-label="Chat with ChatGPT"]')

// observer.observe(newDoc, {
//   childList: true,
//   subtree: true,
// }); 


// -----
//need to add a mutation observer thing to check if the sendButton exists and is clicked

// window.addEventListener('load', function () {
//     const textfield = document.getElementById('prompt-textarea')
//     console.log(textfield)

// //     textfield.addEventListener("keydown", () => {
// //   console.log("Key pressed");
// //     });

// // const buttons = document.getElementsByTagName('button')
// // sendButton.addEventListener('keydown',(event)=>{
// //     if(event.key =='Enter'){
// //         console.log('pressed');
// //     }
// // })
  
    
// })


// -----






if (url.host == "chatgpt.com"){
    console.log("CHAT")
}

else if (url.host == "claude.ai"){
    console.log("CLAUDE")
}

else if (url.host == "gemini.google.com"){
    console.log("GEMINI")

}


