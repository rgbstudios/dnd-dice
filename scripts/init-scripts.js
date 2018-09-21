/* TODO
add info that describes how to use
use select list to reemember whose turn it is
type in roll result if players want to roll their own dice
click reload results to create the initiative list again with your typed values
option for submit button on character div so that you only need one, so it doesnt make a new one just clears it

display num characters?

NEED: error checking for invalid inputs

clear button: clears roll and total

roll remaining option?

tiebreaker options: listed first, random, higher roll, higher mod

chould changing the init bonus auto refresh/change the total result?
*/

class Character {
  constructor(name, mod, roll) {
    this.name = name;
    this.mod = parseInt(mod);
    this.roll = parseInt(roll);
  }
}

$(document).ready(function() {
	$('#newCharButton').on('click', function() {
		$('#charsDiv').append('	<div class="charDiv"><button onclick="$(this).parent().remove();" class="btn btn-sm btn-danger delete-char-button"><i class="fas fa-times"></i> Remove</button> Character Name: <input type="text" class="form-control input-sm char-name-input" value="Character 1"> Initiative Bonus <input type="number" class="form-control input-sm init-bonus-input" value="0"><br><br><button onclick="rollChar($(this) )" class="btn btn-sm btn-primary roll-char-button"><i class="fas fa-dice"></i> Roll</button> Roll Result: <input type="number" class="form-control input-sm roll-result-output" value=""> Total Result: <input disabled type="number" class="form-control input-sm total-result-output" value=""></div>');});

	$('#deleteAllButton').on('click', function() {
		$('#charsDiv').html('');
	});

	$('#rollAllButton').on('click', function() {
		$('.roll-char-button').click();
		$('#reloadResultsButton').click();
	});
	$('#clearAllButton').on('click', function() {
		$('.roll-result-output').val('');
		$('.total-result-output').val('');
	});

	$('#reloadResultsButton').on('click', function() {
		//get character info
		let characters = [];
		let charDivs = document.getElementsByClassName('charDiv');
		for(let i=0; i<charDivs.length; i++) {
			let cur = charDivs[i];
			characters.push(new Character( getChildWithClass(cur, 'char-name-input').value, getChildWithClass(cur, 'init-bonus-input').value, getChildWithClass(cur, 'roll-result-output').value ) );
		}

		//update result select with characters sorted by roll total
		characters.sort(function(a, b) { //sort largest to smallest
			return (b.roll+b.mod) - (a.roll+a.mod);
		});
		console.log(characters);
		$('#resultSelect').empty();
		for(let i=0; i<characters.length; i++) {
			//todo add more than name
			$('#resultSelect').append('<option>' + characters[i].name + ': ' + (characters[i].roll+characters[i].mod) + ' (' + characters[i].roll + ' + ' + characters[i].mod + ')' + '</option>');
		}


	});



});



function getChildWithClass(elem, classtoFind) {
	for (let i=0; i <elem.childNodes.length; i++) {
		if(elem.childNodes[i].classList && elem.childNodes[i].classList.contains(classtoFind) ) {
			return elem.childNodes[i];
		}
	}
	return -1;
}


//$(this).parent().find('.roll-result-output').val(getRoll(20) );

function rollChar(elm) {
	let result = getRoll(20);
	elm.parent().find('.roll-result-output').val(result );
	elm.parent().find('.total-result-output').val(result + parseInt(elm.parent().find('.init-bonus-input').val() ) );
	
}