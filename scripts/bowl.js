
const url = new URL(window.location.href); 

setTimeout(() => {
    // CREATING WATER BOWL
    const chatArea = document.querySelector("body");
    let normalFish = chrome.runtime.getURL("images/guppy.png");
    let grass = chrome.runtime.getURL("images/grass.svg");
    let waterNotif

    let fishBowl = `
    <div class="bowlArea applyBowlAppear">
        <ul class="fishBowl">
            <li class="water">
                <div class="waterTop"></div>
                <div class="waterLevel"></div>
            </li>
            <li class="innerBowl">
                <img class="fish" src="${normalFish}" alt="fish">
                <img class="grass" src="${grass}" alt="bowl-decorations">
            </li>
        </ul>
    </div>
    `;


    // WATER IN THE BOWL
    let waterUsed = 0;
    let waterBudget = 80;
    let waterLevel;
    
    let char = 0;
    let fish;
    
    // ADDING FISH BOWL
    if (chatArea) {
        chatArea.insertAdjacentHTML("afterbegin", fishBowl);
    } 
    else {
        console.log("chatArea not found");
    }

    waterLevel = document.querySelector('.waterLevel');
    fish = document.querySelector(".fish");

    // DEFAULT WATER LINE
    // using percentage to show the height of the water level based on the water budget, right now it is 80% because I did not want the water to be all the way to the top.
    waterLevel.style.height = `${waterBudget}%`;


    
    // making the fish move around the bowl
    moveFish();

    
    
    
    // TESTING IF USER HAS SENT A PROMPT    
    // we used aria-label to target the chat box area
    let textArea = document.querySelector('div[aria-label="Chat with ChatGPT"] p');

	document.querySelector('div[aria-label="Chat with ChatGPT"]').addEventListener('keydown', (event) => {
        
        if(event.key){
            // this code checks the length of the content in the text area
            char = textArea.textContent.length;

            //here event.key is checking if enter was clicked and !event.shiftKey is checking if shift key was not clicked. In chat you can get to another line in the text box by pressing shift+enter so it is brought in combination, this function checks only the enter key press without the combination of shift key 
            if (event.key === "Enter" && !event.shiftKey) {
                moveBowl();
                if (waterBudget > 10) { //here if the water level is less than 10 then guppy dies
                    waterLevelCalculator(char);
                } else {
                    guppyDeath();
                }
            }
        }
	})


	// Watch on the whole doc, since the button is added/removed:
	document.addEventListener('click', (event) => {
		// But only mind clicks within the one we care about:
		if (event.target.closest('button[aria-label="Send prompt"]')) {
            char = textArea.textContent.length;
            moveBowl();

            if (event.key === "Enter" && !event.shiftKey) {
                moveBowl();
                if (waterBudget > 10) {
                    waterLevelCalculator(char);
                } else {
                    guppyDeath();
                }
            }
		}
	}, true) // "Capture" phase since they probably use `stopPropagation()` somewhere!

// calculating the water level
function waterLevelCalculator(char){
    if(char<=25){
        waterUsed = waterUsed + 2;
        showWaterDecrease(5);
    } else if(char>25 && char<=45) {
        waterUsed = waterUsed + 4;
        showWaterDecrease(10);
    } else if(char>45) {
        waterUsed = waterUsed + 6;
        showWaterDecrease(15);
    }

    waterBudget = waterBudget - waterUsed;
    fishReaction(waterBudget);
    waterLevel.style.height = `${waterBudget}%`;
    // fish.style.top = `${10 + waterUsed}%`;
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

        // setTimeout(() => {
        //     document.querySelector(".waterNotif").remove();
        // }, 2000);
}

}, 3000)