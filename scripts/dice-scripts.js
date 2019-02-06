let consoleDiv, consoleButton, speakButton;
let numDiceModalInput, numDiceSubmit, numDiceButtonCustom, numDiceModal, diceSidesModalInput, diceSidesSubmit, diceSidesButtonCustom, diceSidesModal;
let numDiceDiv, numDiceButtonPlus, diceSidesDiv, diceSidesButtonPlus;
let output, rollButton, resetButton, historyText, numDiceRolled, clearHistory, downloadHistory, notes, clearNotes, downloadNotes, clearMods, downloadMods, uploadMods;
let modifierForm, modifierInput, advantageSelect, attributeSelect1, attributeSelect2;
let consoleInput, consoleRollButton;

let isSpeak = false;

let modNames = ['str', 'dex', 'con', 'int', 'wis', 'cha', 'prf', 'spl', 'itv'];

$(document).ready(function() {
	consoleDiv = $('#consoleDiv');
	consoleButton = $('#consoleButton');
	speakButton = $('#speakButton');

	numDiceModalInput = $('#numDiceModalInput');
	numDiceSubmit = $('#numDiceSubmit');
	numDiceButtonCustom = $('#numDiceButtonCustom');
	numDiceModal = $('#numDiceModal');
	diceSidesModalInput = $('#diceSidesModalInput');
	diceSidesSubmit = $('#diceSidesSubmit');
	diceSidesButtonCustom = $('#diceSidesButtonCustom');
	diceSidesModal = $('#diceSidesModal');

	numDiceDiv = $('#numDiceDiv');
	numDiceButtonPlus = $('#numDiceButtonPlus');
	diceSidesDiv = $('#diceSidesDiv');
	diceSidesButtonPlus = $('#diceSidesButtonPlus');

	output = $('#output');
	rollButton = $('#rollButton');
	resetButton = $('#resetButton');
	historyText = $('#historyText');
	numDiceRolled = $('#numDiceRolled');
	clearHistory = $('#clearHistory');
	downloadHistory = $('#downloadHistory');
	notes = $('#notes');
	clearNotes = $('#clearNotes');
	downloadNotes = $('#downloadNotes');
	clearMods = $('#clearMods');
	downloadMods = $('#downloadMods');
	uploadMods = $('#uploadMods');

	modifierForm = $('#modifierForm');
	modifierInput = $('#modifierInput');
	advantageSelect = $('#advantageSelect');
	attributeSelect1 = $('#attributeSelect1');
	attributeSelect2 = $('#attributeSelect2');

	consoleInput = $('#consoleInput');
	consoleRollButton = $('#consoleRollButton');


// ---------------- get url params ----------------
//atob decodes base 64
	let url = new URL(window.location.href);
	let m = url.searchParams.get("m");
	if(m) {
		m = atob(m).split(' ');
		for(let i=0; i<m.length; i++) {
			$('#'+modNames[i]).val(m[i] || 0);
		}
	}

	// let n = url.searchParams.get("n");
	// if(n=="1") {
	// 	$('#nightButton').click();
	// }

	//update params
	updateParams();

// ---------------- update display of console, speak button, night ----------------

	consoleDiv.css('display','none');
	consoleButton.on('click', function() {
		consoleDiv.css('display', consoleDiv.css('display')=='none'?'':'none');
	});

	speakButton.on('click', function() {
		speakButton.html(isSpeak?"Speak Roll Results <i class='fas fa-volume-up'></i>":"Don't Speak Roll Results <i class='fas fa-volume-off'></i>");
		isSpeak = !isSpeak;		
	});

	$('#nightButton').on('click', function() {
		handleNight(); //in common.js
		$('#titleImg').prop('src', isNight ? 'img/d20-white.svg' : 'img/d20.svg');
	});

// ---------------- update num dice and dice sides on modal submit ----------------

	numDiceSubmit.on('click', function() {
		let verifiedInput = Math.min(Math.max(numDiceModalInput.val(),6),999);
		numDiceButtonCustom.html(verifiedInput);
		numDiceModalInput.val(verifiedInput);
		numDiceModal.modal('hide');
		numDiceDiv.children()[5].click();
	});

	diceSidesSubmit.on('click', function() {
		let verifiedInput = Math.min(Math.max(diceSidesModalInput.val(),2),999);
		diceSidesButtonCustom.html('D' + verifiedInput);
		diceSidesModalInput.val(verifiedInput);
		diceSidesModal.modal('hide');
		diceSidesDiv.children()[5].click();
	});

// ---------------- set active class on num dice and dice sides button click ----------------

	numDiceDiv.children().on('click', function() {
		if($(this).html() == '+') {
			return;			
		} 
		numDiceDiv.children().removeClass('active');
		$(this).addClass('active');
		//can only roll with advantage or disadvantage if rolling 1 die
		if($(this).html()!='1') {
			advantageSelect.val('0');
		}
		advantageSelect.prop('disabled',($(this).html()!='1') );
	});

	diceSidesDiv.children().on('click', function() {
		if($(this).html() != '+') {
			diceSidesDiv.children().removeClass('active');
			$(this).addClass('active');			
		}
		//can only add initiative, proficiency, or spell damage if rolling a d20
		attributeSelect2.prop('disabled',($(this).contents()[1]==undefined || $(this).contents()[1].textContent!='D20') );
		
	});

// ---------------- when modal opens focus the input ----------------

	numDiceModal.on('shown.bs.modal', function () {
		numDiceModalInput.focus();
		numDiceModalInput.select();
	});
	diceSidesModal.on('shown.bs.modal', function () {
		diceSidesModalInput.focus();
		diceSidesModalInput.select();
	});

// ---------------- on enter click submit ----------------

	numDiceModalInput.keydown(function(event) {
		if(event.which == 13) {
			numDiceSubmit.click();
		}
	});

	diceSidesModalInput.keydown(function(event) {
		if(event.which == 13) {
			diceSidesSubmit.click();
		}
	});

// ---------------- console input and button ----------------

	consoleInput.keydown(function(event) {
		if(event.which == 13) {
			doConsoleRoll(consoleInput.val() );
		}
	});

	consoleRollButton.on('click', function() {
		doConsoleRoll(consoleInput.val() );
	});
	

// ---------------- roll and reset buttons onclick ----------------

	rollButton.on('click', function() {	
		doRolls();
	});

	resetButton.on('click', function() {
		modifierInput.val(0);
		advantageSelect.val(0);
		attributeSelect1.val('non');
		attributeSelect2.val('non');
		$('input[name=plusMinusRadio]').val(['+']);
	});

// ---------------- clear and download history, notes, and mods, copy url, upload mods ----------------

	clearHistory.on('click', function() {
		historyText.val('');
		numDiceRolled.html('0');
	});

	downloadHistory.on('click', function() {
		downloadFile('History:\r\nYou rolled ' + numDiceRolled.html() + ' dice.\r\n' + historyText.val().replace(/\r?\n/g, '\r\n'), 
			'history ' + getFormattedDate(), 'downloadHistoryLink');
	});

	clearNotes.on('click', function() {
		notes.val('');
	});

	downloadNotes.on('click', function() {
		downloadFile('Notes:\r\n' + notes.val().replace(/\r?\n/g, '\r\n'), 
			'notes ' + getFormattedDate(), 'downloadNotesLink');
	});

	$('#copyUrl').on('click', function() {
		updateParams();
		copyUrl();
	});

	clearMods.on('click', function() {
		$('#modModal input[type=number]').val('0');
		updateParams();
	});

	downloadMods.on('click', function() {
		let modText = '';
		for(let i=0; i<modNames.length; i++) {
			modText += '\r\n' + modNames[i] + ': ' + $('#'+modNames[i]).val();
		}
		updateParams();
		downloadFile('Mods:\r\n' + window.location.href + modText, 'modifiers ' + getFormattedDate(), 'downloadModsLink')
	});

	uploadMods.on('click', function() {
		$('#fileInput').click();
	});

	$("#fileInput").change(function() {
		if(!window.FileReader) { 
			return; //browser not supported TODO: error alert
		}
		let input = $('#fileInput').get(0);
		let reader = new FileReader();
		if(input.files.length) { //file exists
			let textFile = input.files[0];
			reader.readAsText(textFile);
			$(reader).on('load', processFile);
			//TODO: fix not updating. for now must click the button again
		}
	});

	$('#modModal input[type=number]').on('change', function() {
		updateParams();
	});


}); //end doc ready



//https://stackoverflow.com/questions/19038919/is-it-possible-to-upload-a-text-file-to-input-in-html-js?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function processFile(e) {
	let file = e.target.result, results;
	if(file && file.length) {
		results = file.split("\r\n");
		for(let i=2; i<results.length-1; i++) {
			if(results[i].trim() != "") {
				//index 5 is 6th character, which is number after 3 char abrev and then colon and space. 4 is length which is max for -999
				$('#'+modNames[i-2]).val(parseInt(results[i].substr(5,4) ) );
			}
		}
	updateParams();
	}
}

// ---------------- utility ----------------
function updateParams() {
	let m = '';
	for(let i=0; i<modNames.length-1; i++) {
		m += $('#'+modNames[i]).val() + ' ';
	}
	m += $('#'+modNames[modNames.length-1]).val();
	//btoa encodes base 64
	m = btoa(m);
	history.replaceState({}, "", "?m=" + m);
}

function getNumDice() {
	for(let i=0; i<6; i++) {
		if(numDiceDiv.children()[i].classList.contains('active') ) {
			return parseInt(numDiceDiv.children()[i].innerHTML);
		}
	}
}

function getDiceSides() {
	if(diceSidesButtonCustom[0].classList.contains('active') ) {
		return diceSidesButtonCustom[0].innerHTML.replace('D','');
	}
	for(let i=0; i<6; i++) {
		if(diceSidesDiv.children()[i].classList.contains('active') ) {
			return diceSidesDiv.children()[i].innerHTML.split('>')[1].replace('D','');
		}
	}
}

let attr2Names = {'non':'','prf':'proficiency','exp':'expertise','spl':'spell atk','itv':'initiative'}

function getModifier() {
	return $('input[name=plusMinusRadio]:checked').val()=="+" ? -(-modifierInput.val() ) : -modifierInput.val();
}
function getAdvantage() {
	return advantageSelect.val();
}
function getAttribute1(name=attributeSelect1.val() ) {
	return name=='non' ? 0 : parseInt($('#'+name).val() );
}
function getAttribute1Name() {
	return attributeSelect1.val();
}
function getAttribute2(name=attributeSelect2.val() ) {
	return name=='non' ? 0 : name=='exp' ? 2*parseInt($('#prf').val() ) : parseInt($('#'+name).val() );
}
function getAttribute2Name() {
	return attr2Names[attributeSelect2.val()];
}

function display(text) {
	output.prop('disabled',false);
	output.val(text);
	output.prop('disabled',true);
}

// ---------------- function for rolling dice ----------------
//advantage is 0 if none, 1 if advantage, -1 if disadvantage. values are strings
function doRolls(numDice = getNumDice(), diceSides = getDiceSides(), advantage = getAdvantage(), modifier = getModifier(), attr1 = getAttribute1(), attr1Name = getAttribute1Name(), attr2 = getAttribute2(), attr2Name = getAttribute2Name() ) {
	let result = 0, rolls = [];

	if(numDice==1 && advantage!='0') {
		rolls.push(getRoll(diceSides) );
		rolls.push(getRoll(diceSides) );
		result += advantage=='1' ? Math.max(rolls[0], rolls[1]) : Math.min(rolls[0], rolls[1]);
	}
	else{
		for(let i=0; i<numDice; i++) {
			rolls.push(getRoll(diceSides) );
			result += rolls[i];
		}		
	}

	result += modifier + attr1 + attr2;

	let rollText = 'Rolled ' + numDice + ' D' + diceSides + (advantage==0 ? '' : advantage=='1' ? ' (advantage)' : ' (disadvantage)') + 
		(modifier==0 ? '' : modifier>0 ? ' +' + modifier : ' ' + modifier) +
		(attr1Name=='non' ? '' : ' +' + attr1Name + '(' + attr1 + ')') + 
		(attr2Name=='' ? '' : ' +' + attr2Name + '(' + attr2 + ')') + 
		': ' + result;

		let rollTextwithRolls = rollText + '  |  Rolls: ' + rolls;

	display(rollTextwithRolls);
	historyText.val(historyText.val() + '\n' + rollTextwithRolls);
	numDiceRolled.html(parseInt(numDiceRolled.html() )+ (numDice==1 && advantage!='0' ? 2 : numDice) );
	if(isSpeak) {
		talk(rollText + '... Rolls were ' + rolls);
	}
}







// ----------------  ----------------



/*


todo: make upload modifiers work
make roll console, speak results, work



todo: fix youve rolled 1 dice into '1 die'

make speak a checkbox not button
change modifier plus minus to just typing in + or - and no radio buttons

add multiple roll consoles option



add info modal with how advantage works, that expertiece is double proficiency, and about rolling for initiative, to attack against AC, and for damage
mention that dnd is (c) wizards of the coast and we do not own any of their assets
option to click to roll die by itself
menton that modifiers are stored in the website url 
add alerts for copying
restyle sharethis for night?
sticky head? footer?
find delimeter other than 'a' for url params
fix upload file not updating
add help and info modals
update github project

todo: dynamiclly change text on select options to show the value in parentheses being added for modifiers
todo: sticky footer with rolls

todo: add favicon generator
*/

// ----------------  ----------------
