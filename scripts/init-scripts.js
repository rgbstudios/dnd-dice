/* TODO
add info that describes how to use
use select list to reemember whose turn it is
type in roll result if players want to roll their own dice
click reload results to create the initiative list again with your typed values
option for submit button on character div so that you only need one, so it doesnt make a new one just clears it

*/

$(document).ready(function() {
	$('#newCharButton').on('click', function() {
		$('#charsDiv').append('	<div class="charDiv"><button class="btn btn-sm btn-danger delete-char-button"><i class="fas fa-times"></i> Remove</button> Character Name: <input type="text" class="form-control input-sm char-name-input" value="Character 1"> Initiative Bonus <input type="number" class="form-control input-sm init-bonus-input" value="0"><br><br><button class="btn btn-sm btn-primary roll-char-button"><i class="fas fa-dice"></i> Roll</button> Roll Result: <input type="number" class="form-control input-sm roll-result-output" value="0"> Total Result: <input disabled type="number" class="form-control input-sm total-result-output" value=""></div>');});

	$('#deleteAllButton').on('click', function() {
		$('#charsDiv').html('');
	});



});


function rollChar() {

}