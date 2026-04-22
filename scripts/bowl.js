
const url = new URL(window.location.href); 

setTimeout(() => {
    // CREATING WATER BOWL
    const chatArea = document.querySelector("body");
    let normalFish = chrome.runtime.getURL("images/guppy.png");
    let grass = chrome.runtime.getURL("images/grass.svg");
    

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
    // Michael helped with this one. I was having issues with selecting the chat text area due to no specific class name, so he used aria-label to target it. When pressing send button he used closest to the button name.    
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

    //short length characters
    if(char<=25){
        waterUsed = waterUsed + 2;
        showWaterDecrease(5); // the numbers that we are sending here is not accurate to how much water is decreasing, but it gives users idea to if it is high or low
    } 
    
    //medium length characters
    else if(char>25 && char<=45) {
        waterUsed = waterUsed + 4;
        showWaterDecrease(10);
    } 
    
    //long length characters
    else if(char>45) {
        waterUsed = waterUsed + 6;
        showWaterDecrease(15);
    }

    waterBudget = waterBudget - waterUsed;
    fishReaction(waterBudget);
    waterLevel.style.height = `${waterBudget}%`;
    console.log(waterLevel)

    if(waterBudget>35){
        fish.style.top = `${80-waterBudget+30}%`; // this was for making the fish move a level down based on the amount of water in the bowl (i.e. height of water). Here it is subtracted by 80 at first because we have defined water budget initially as 80. This does mean that if we change the initial water budget at the top, we will have to come down here and change this number. Not the most flexible but it works!
    }
    else{
        fish.style.top = `${80-waterBudget+10}%`;
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

// Moving fish in the bowl
function moveFish(){
    let fish = document.querySelector(".fish");
    fish.classList.add('applyFishMove');
}

// Fish's reaction in different states
function fishReaction(count){
    // Changing fish expressions
    let normalFish = chrome.runtime.getURL("images/guppy.png");
    let scaredFish = chrome.runtime.getURL("images/guppy-scared.png");
    let cryFish = chrome.runtime.getURL("images/guppy-cry.png");
    

    // Cry mode
   if(count <= 25){
    fish.src = cryFish;
    fish.classList.remove('applyFishMove');
    fish.classList.add('applyFishShake'); // this is when fish starts swimming frantically
    }

    else if(count > 25 && count <= 65){
        fish.src = scaredFish;
        fishCommentary("I am scared.."); // this is the text that is shown behind the bowl
    }

    else if(count > 65 && count <= 75){
        fish.src = normalFish;
    }
}

// Fish's death
function guppyDeath(){
    // Dead mode
        console.log("your fish is dead!");
        let deadFishImage = chrome.runtime.getURL("../images/guppy-dead.png");
        let bowlArea = document.querySelector('.bowlArea');

        let deadFish = `
        <p class="guppyDeath">Guppy died!</p>
        `
        bowlArea.insertAdjacentHTML("afterbegin",deadFish); 
        fish.src = deadFishImage;
        fish.classList.remove('applyFishShake');
        fish.classList.add('deadFishPosition');
    
}


// Function for notification that pops up below the bowl to show how much water has been used.
function showWaterDecrease(waterUsed){
    let waterDecrease =`
    <li class="waterNotif">-${waterUsed}</li>
    `

    let bowlArea = document.querySelector('.fishBowl');
    bowlArea.insertAdjacentHTML("afterbegin",waterDecrease);

    let Notif = bowlArea.querySelector(".waterNotif")
    Notif.classList.add('.applywaterNotifAppear');
    Notif.addEventListener('animationend', () => {
    Notif.classList.remove('.applywaterNotifAppear');
    }, { once: true }); // this is for making animation to appear just once

        setTimeout(() => {
            document.querySelector(".waterNotif").remove(); // we want this message to be shown once and go away
        }, 1500);
}

// Fish's "I'm scared" commentary
function fishCommentary(said){
    let comment = 
    `
    <p class="comment">${said}</p>
    `
    let bowlArea = document.querySelector('.bowlArea');
     bowlArea.insertAdjacentHTML("afterbegin",comment); 

     setTimeout(()=>{
        document.querySelector(".comment").remove();
     }, 1000);

}

}, 3000)