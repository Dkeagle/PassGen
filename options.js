const strLowercase = "abcdefghijklmnopqrstuvwxyz";
const strNumbers = "0123456789";
const strSymbols = "[&~\"#\'{([|`_\\^@)°\]=+}^¨$£¤*µ%,?;.:\/!§-]";
const strUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function copy(output, errorLog){
	// Reset the errorLog, in case it have been used before
	errorLog.innerHTML = "";

	// Check the output is not empty or on default text
	if(output.value == ""){
		errorLog.innerHTML = "Need to generate a password first!";
	}

	// Select the password
	output.select();
	output.setSelectionRange(0, 99999);
	
	// Copy it to the user's clipboard
	document.execCommand("copy");
	
	// Remove selection
	output.setSelectionRange(0, 0);
}

function generate(output){
	// Declaration of global str
	let str = "";

	// Load configuration from Chrome sync storage
	chrome.storage.sync.get(['PassGenLength'], function(e){
		let passLength = e.PassGenLength; 
		chrome.storage.sync.get(['PassGenNumbers'], function(e){
			let bNumbers = e.PassGenNumbers; 
			chrome.storage.sync.get(['PassGenSymbols'], function(e){
				let bSymbols = e.PassGenSymbols; 
				chrome.storage.sync.get(['PassGenUppercase'], function(e){
					let bUppercase = e.PassGenUppercase; 

					// Create the empty string used for generation
					let possChars = "";

					// Add the strings to the list of possibles characters
					if(bNumbers) possChars += strNumbers;
					if(bSymbols) possChars += strSymbols;
					if(bUppercase) possChars += strUppercase;
					possChars += strLowercase;

					// Loop on the length needed
					for (let i = 0; i < passLength; i++) {
						str += possChars[Math.floor(Math.random() * (possChars.length))];
					}
					
					// Return the final str
					output.value = str;
				});
			});
		});
	});
}

window.onload = function(){
	// Grab every input and buttons in the form
	let lengthInput = document.getElementById("lengthInput");
	let lengthOutput = document.getElementById("lengthOutput");
	let numbersInput = document.getElementById("numbersInput");
	let symbolsInput = document.getElementById("symbolsInput");
	let uppercaseInput = document.getElementById("uppercaseInput");
	
	let genButton = document.getElementById("genButton");
	let genOutput = document.getElementById("genOutput");
	let copyButton = document.getElementById("copyButton");

	// Update the options page, based on the stored value
	chrome.storage.sync.get(['PassGenLength'], function(e){ lengthInput.value = e.PassGenLength; lengthOutput.value = e.PassGenLength; });
	chrome.storage.sync.get(['PassGenNumbers'], function(e){ numbersInput.checked = e.PassGenNumbers; });
	chrome.storage.sync.get(['PassGenSymbols'], function(e){ symbolsInput.checked = e.PassGenSymbols; });
	chrome.storage.sync.get(['PassGenUppercase'], function(e){ uppercaseInput.checked = e.PassGenUppercase; });
	
	// Update the length output in realtime too
	lengthOutput.innerHTML = lengthInput.value;
	lengthInput.addEventListener("input", function(){
		lengthOutput.innerHTML = lengthInput.value;
	});

	// Update them in the storage everytime they're edited
	lengthInput.addEventListener("input", function(){
		chrome.storage.sync.set({PassGenLength: lengthInput.value});
	});
	numbersInput.addEventListener("change", function(){
		chrome.storage.sync.set({PassGenNumbers: numbersInput.checked});
	});
	symbolsInput.addEventListener("change", function(){
		chrome.storage.sync.set({PassGenSymbols: symbolsInput.checked});
	});
	uppercaseInput.addEventListener("change", function(){
		chrome.storage.sync.set({PassGenUppercase: uppercaseInput.checked});
	});

	// Handle the buttons
	genButton.addEventListener("click", () => {generate(genOutput)});
	copyButton.addEventListener("click", () => {copy(genOutput, errorLog)});
}