
const url = new URL(window.location.href);


setTimeout(() => {

    // CREATING WATER BOWL
    const chatArea = document.querySelector("body");
    let normalFish = chrome.runtime.getURL("images/guppy.png");
    let grass = chrome.runtime.getURL("images/grass.svg");
    // let seeBowl = document.getElementById("seeBowl");
    // console.log(seeBowl);
    

    let fishBowl = `
    <div class="bowlArea applyBowlAppear">
    
        <ul class="fishBowl">
        
            <li>
            <div class="waterTop"></div>
            <img class="fish" src="${normalFish}" alt="fish">
            <img class="grass" src="${grass}" alt="bowl-decorations">
            </li>
        </ul>
    
    </div>
    `;
    
    if (chatArea) {
        chatArea.insertAdjacentHTML("afterbegin", fishBowl); //adding fishbowl
        defaultWaterLine();
    } 
    else {
        console.log("chatArea not found");
    }

    
    // making the fish move around the bowl
    moveFish();

    
    
    
    // TESTING IF USER HAS SENT A PROMPT

    let char = 0;
    let fish = document.querySelector(".fish");
    
    // we used aria-label to target the chat box area
    let textArea = document.querySelector('div[aria-label="Chat with ChatGPT"] p');

	document.querySelector('div[aria-label="Chat with ChatGPT"]').addEventListener('keydown', (event) => {
        
        if(event.key){
            char = textArea.textContent.length;
            console.log(char);

            //here event.key is checking if enter was clicked and !event.shiftKey is checking if shift key was not clicked. In chat you can get to another line in the text box by pressing shift+enter so it is brought in combination, this function checks only the enter key press without the combination of shift key 
            if (event.key === "Enter" && !event.shiftKey) {
                moveBowl();
                // fish.classList.add('applyInitialFishShake');
                waterLevelCalculator(char);
                

            }
        }
	})


	// Watch on the whole doc, since the button is added/removed:
	document.addEventListener('click', (event) => {
		// But only mind clicks within the one we care about:
		if (event.target.closest('button[aria-label="Send prompt"]')) {
            char = textArea.textContent.length;
            moveBowl();
                // fish.classList.add('applyInitialFishShake');
            waterLevelCalculator(char);
		}
	}, true) // "Capture" phase since they probably use `stopPropagation()` somewhere!


}, 3000)



// WATER IN THE BOWL
let waterUsed = 0
let waterBudget = 650


// calculating the water level
function waterLevelCalculator(char){
    // console.log("char =", char)
    let bowlBody = document.querySelector('.fishBowl')
    const count = document.querySelectorAll('.fishBowl li').length;
    let secondLi = bowlBody.querySelector('li:nth-last-child(2)'); // second child cause the first child is the fish lol
    

    if(char<=25){
        waterUsed = waterUsed + 10;
        console.log("char<25 and list count=",count);
        showWaterDecrease(10);
         for (let i = 0; i < 2; i++) {
            console.log("count =",count);
            if (count!=1){
            secondLi.remove();
            secondLi = bowlBody.querySelector('li:nth-last-child(2)'); // second 
            fishReaction(count);
            }

            else{
            guppyDeath();
            }
        }

    }

    else if(char>25 && char<=45){
        waterUsed = waterUsed + 20;
        console.log("char<45 and list count=",count);
        showWaterDecrease(20);

        for (let i = 0; i < 6; i++) {
            console.log("count =",count);
            if (count!=1){
            secondLi.remove();
            secondLi = bowlBody.querySelector('li:nth-last-child(2)'); // second 
            fishReaction(count);
            }
            else{
            guppyDeath();
            }
        }
    }

    else if(char>45){
        waterUsed=waterUsed+30;
        console.log("char>75 and list count=",count);
        showWaterDecrease(30);

        for (let i = 0; i < 10; i++) {
            if (count!=1){
                console.log("count =",count);
                secondLi.remove();
                secondLi = bowlBody.querySelector('li:nth-last-child(2)'); // second 
                fishReaction(count);
            }

            else{
            guppyDeath();
            }
        }
    }
    
    let remainingWater = waterBudget-waterUsed;
    console.log('waterUsed = ', waterUsed)
    console.log('remainingWater = ', remainingWater);
    

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


// Moving bowl function
// for shaking the bowl when water level decreases
function moveBowl(){
    let bowlArea = document.querySelector('.fishBowl');

    //adding the shake animation function to the fishbowl
    bowlArea.classList.add('applyShake');

    // to make the shake animation happen only once, removed the applyShake function (the animation function) and added {once:true} which basically checks if the animation happened once.
    bowlArea.addEventListener('animationend', () => {
    bowlArea.classList.remove('applyShake');
    }, { once: true });
}

function moveFish(){
    let fish = document.querySelector(".fish");
    console.log(fish);
    fish.classList.add('applyFishMove');
}



function fishReaction(count){
    // Changing fish expressions
    let normalFish = chrome.runtime.getURL("images/guppy.png");
    let scaredFish = chrome.runtime.getURL("images/guppy-scared.png");
    let cryFish = chrome.runtime.getURL("images/guppy-cry.png");
    let fish = document.querySelector(".fish");
    // console.log(fish.src);
    fish.classList.remove('applyInitialFishShake');
    

    // number of water level is 65, if we subtract the fish then it is 64.
    // we want the fish to have 4 modes normal-scared-cry-dead
    // dead is final stage so we want it to have 3 modes
    // now we divide 64 by 3 => 21.33 ~ 22
    // so x < 22 < 54(it was supposed to be 44 but thought users needed to see the impact early on) < 64
    // which means:
    
    if(count==64 || count==65 || count==66){
        firstShock(fish);   
    }

    // Cry mode
    if(count<=22){
        fish.src = cryFish;
        fish.classList.remove('applyFishMove');
        fish.classList.add('applyFishShake');
    }

    // Scared mode
    else if(count<=60){
        fish.src = scaredFish;
    }
    
    else if(count<64){
        fish.src = normalFish;
    }
}


function firstShock(fish){
    let scaredFish = chrome.runtime.getURL("images/guppy-scared.png");
    let normalFish = chrome.runtime.getURL("images/guppy.png");
    fish.src=scaredFish;
    fish.classList.add('applyInitialFishShake');
    fish.addEventListener('animationend', () => {
    fish.classList.remove('applyInitialFishShake');
    fish.src=normalFish;
    }, { once: true });
}

function guppyDeath(){
    // Dead mode
        console.log("your fish is dead!");
        let deadFishImage = chrome.runtime.getURL("images/guppy-dead.png");
        let bowlArea = document.querySelector('.bowlArea');

        let deadFish = `
        <p>Guppy died!</p>
        `
        bowlArea.insertAdjacentHTML("afterbegin",deadFish); 
        fish.src = deadFishImage;
        fish.classList.remove('applyFishShake');
        fish.classList.add('deadFishPosition');
    
}

function showWaterDecrease(waterUsed){
    let waterDecrease =`
    <p class="waterNotif">-${waterUsed}</p>
    `
    let bowlArea = document.querySelector('.bowlArea');
    bowlArea.insertAdjacentHTML("afterbegin",waterDecrease); 

    let Notif = bowlArea.querySelector(".waterNotif")
    Notif.classList.add('.applywaterNotifAppear');
    Notif.addEventListener('animationend', () => {
    Notif.classList.remove('.applywaterNotifAppear');
    }, { once: true });

        setTimeout(() => {
            document.querySelector(".waterNotif").remove();
        }, 2000);
}