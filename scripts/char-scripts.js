/*TODO:

option to choose:
numStats = 6;
numRolls = 4;
numDropped = 1;
diceSides = 6;
enter your own mod table option
show method character was created in download file
--------

create and download X characters input
speak option
show percentile option
roll one at a time animation?
share rolls and url to load specific rolls, stats, and name


change checkbox to fontawesome checkbox (like on songssearcher)
percentile option
download table img option
text file has mean and std dev
*/

let characters = [];
let odds = [1,4,10,21,38,62,91,122,148,167,172,160,131,94,54,21];
let modNames = ['str', 'dex', 'con', 'int', 'wis', 'cha', 'prf', 'spl', 'itv'];

function Character(givenRolls) {
	this.stats = [];
	this.statTotal = 0;
	this.modTotal = 0;
	for(let i=0; i<6; i++) { //6 stats
		let newStat;
		if(givenRolls) {
			newStat = new Stat(givenRolls[i]);
		} else {
			newStat = new Stat(false);
		}
		this.stats.push(newStat);
		this.statTotal += newStat.value;
		this.modTotal += newStat.mod;
	}
}

function Stat(givenRolls) { //rolls is array of 4 dice results
	if(givenRolls) {
		this.rolls = givenRolls;
	} else {
		this.rolls = [];
		for(let i=0; i<4; i++) { //4 rolls take highest 3
			this.rolls.push(getRoll(6) );
		}		
	}
	this.value = 0;
	for(let i=0, minIdx=this.rolls.indexOf(Math.min.apply(Math, this.rolls) ); i<4; i++) {
		if(i != minIdx) {
			this.value += this.rolls[i];
		}
	}
	this.mod = getStatMod(this.value);
}

function getStatMod(stat) {
	for(let i=3, j=-4; ; i+=2, j++) {
		if(i >= stat) {
			return j;
		}
	}
}

function getDieCode(roll) {
	return '&#98' + (55 + roll);
}
function getDieUnicode(roll){
	return ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'][roll-1];
}

function getDiceCodes(rolls) {
	let diceCodes = '';
	for(let i=0; i<rolls.length; i++) {
		diceCodes += getDieCode(rolls[i]) + ' ';
	}
	return diceCodes;
}

window.onload = function() {
		
	$('#download').on('click',function() {
		if(characters.length == 0) {
			return -1;
		}
		data = [];
		let currentChar = characters[characters.length-1];
		data.push($('#nameInput').val() + '\r\n');
		for(let i=0; i<currentChar.stats.length; i++) {
			data.push($('#stat' + (i+1) + 'Mod').val() + ': ');
			for(let j=0; j<currentChar.stats[i].rolls.length; j++) {
				if($('#enableUnicodeCheckbox').is(':checked') ) {
					data.push(getDieUnicode(currentChar.stats[i].rolls[j]) );					
				} else {
					data.push(currentChar.stats[i].rolls[j].toString() );
				}

				if(j < currentChar.stats[i].rolls.length-1) {
					data.push(',');
				}
			}
			data.push('\tVal: ' + currentChar.stats[i].value + '\tMod: ' + currentChar.stats[i].mod);
			data.push('\r\n');
		}
		data.push('\r\nTotal:\t\tVal: ' + currentChar.statTotal + '\tMod: ' + currentChar.modTotal);
		data.push('\r\n\r\nLink:\t\t' + getRollLink() );

		if(allAreSelected() ) {
			data.push('\r\nRoll with your stats: http://rgbstudios.org/dnd-dice' + getDieRollerParams() );			
		}

		
		properties = {type: 'plain/text'};
		try {
			file = new File(data, 'stats.txt', properties);
		} catch (e) {
			file = new Blob(data, properties);
		}

		$('#downloadLink').prop('download', 'Character - ' + $('#nameInput').val() + '.txt');
		$('#downloadLink').prop('href', URL.createObjectURL(file) );
		document.getElementById('downloadLink').click(); //idk why this doesn't work with jquery selector
	});
	
	$('#genButton').on('click', function() {
		resetStats();
		$('#openButton').css('display', 'none');
		$('#nameInput').val('');
		characters.push(new Character() );
		
		if($('#displayRollingCheckbox').is(':checked') ) {
			displayRolling();
		} else {
			displayRolls();			
		}

		//if loaded from roll params earlier, remove alert and url param
		$('#givenRollsAlert').css('display', 'none');
		history.replaceState({}, "", "?r=");

		$('#historyText').val($('#historyText').val() + prettyPrint(characters[characters.length-1]) );

	});
	
	
	let statMods = $('.statMod');
	for(let i=0; i<statMods.length; i++) {
		statMods[i].onclick = statMods[i].onfocus = function(evt) {
			for(let j=0; j<6; j++) {
				evt.target.options[j+1].disabled = false;			
			}
			let allSelected = true;
			for(let j=0; j<6; j++) {
				let idx = $('#stat' + (j+1) + 'Mod').prop('selectedIndex');
				let isThis = $('#stat' + (j+1) + 'Mod').is($(this) ); //don't count this element's current selection
				if(idx != 0 && ! isThis) {
					evt.target.options[idx].disabled = true;
				}
				if(idx == 0) {
					allSelected = false;
				}
			}

			$('#openButton').css('display', allSelected ? '' : 'none');

		}
	}

	$('#openButton').on('click', function() {
		window.open('index.html' + getDieRollerParams() );
	});
	
	$('#copyButton').on('click', function() {
		let numInput = $('#numbersInput');
		numInput.select();
		document.execCommand('copy');
	});
	
	$('#resetStat').on('click', function() {
		resetStats();
	});

	$('#nightButton').on('click', function() {
		handleNight(); //in common.js
		$('#titleImg').prop('src', isNight ? 'img/d6-white.svg' : 'img/d6.svg');
		$('select').css('color', isNight ? '#fff' : '#333');
		$('input').css('color', isNight ? '#fff' : '#333');
		$('button:not(.close):not(.btn-primary):not(.btn-info)').css('color', isNight ? '#fff' : '#333');
		$('button:not(.close):not(.btn-primary):not(.btn-info)').css('background-color', isNight ? '#333' : '#fff');
		$('.list-group-item').css('background-color', isNight ? '#333' : '#fff');
		$('.list-group-item').css('color', isNight ? '#fff' : '#333');
		makeChart();	
	});
	
	$('#fullscreen').on('click', function() {
		toggleFullscreen();
	});

	$('#clearHistory').on('click', function() {
		$('#historyText').val('');
	});

	$('#downloadHistory').on('click', function() {
		downloadFile('History:\r\n' + $('#numChars').html() + '.\r\n\r\n' + $('#historyText').val().replace(/\r?\n/g, '\r\n'), 
			'history ' + getFormattedDate(), 'downloadHistoryLink');
	});

	$('#copyLinkButton').on('click', function() {
		copyUrl(getRollLink() );
	});

	let url = new URL(window.location.href);
	// let n = url.searchParams.get("n");
	// if(n=="1") {
	// 	$('#nightButton').click();
	// }

	let r = url.searchParams.get('r');
	if(r) {
		r = atob(r);
		console.log(r);


		let givenRolls = [];
		let idx = 0;
		for(let i=0; i<6; i++) {
			let tmp = [];
			for(let j=0; j<4; j++) {
				tmp[j] = parseInt(r.charAt(idx++) );
			}
			givenRolls.push(tmp);
		}

		resetStats();

		let statMods = $('.statMod');
		for(let i=0; i<statMods.length; i++) {
			statMods[i].selectedIndex = parseInt(r.charAt(idx++) );
		}

		$('#nameInput').val(r.substring(idx) );


		characters.push(new Character(givenRolls) );

		$('#openButton').css('display', 'none');
		
		displayRolls();
		console.log(characters[0]);

		$('#givenRollsAlertSpan').html('Loaded rolls from url'); //add window.location.href?
		$('#givenRollsAlert').css('display', 'inline-block');

	} else {
		$('#genButton').click();
		$('#openButton').css('display', 'none');
	}


}

function prettyPrint(character) {
	let str = 'mod total: ' + character.modTotal + ' | ' +
		'value total: ' + character.statTotal;

	for(let i=0; i<6; i++) {
		str += '\r\nmod: ' + character.stats[i].mod + (character.stats[i].mod<0?'':' ') + ' | value: ' + character.stats[i].value + (character.stats[i].value>9?'':' ') + ' | rolls: ' + character.stats[i].rolls;
	}

	str +='\r\nmean: ' + Math.round(character.statTotal*100/6)/100 +
		'\r\ndeviation: ' + Math.round(stdDev(statsToValues(character.stats) )*100)/100;

	return str + '\r\n\r\n';
}


function displayRolling() {
	$('.statDiv h4').css('display', 'none');
	$('#statsInfo').css('display', 'none');
	$('#statsInfoAvg').css('display', 'none');
	$('#statsInfoStdDev').css('display', 'none');
	let intvl = setInterval(function() {
		$('.statRolls').each(function(idx) {
			$(this).html(getDiceCodes([getRoll(6),getRoll(6),getRoll(6),getRoll(6)]) );
		});
	}, 100);
	setTimeout(function() {
		clearInterval(intvl);
		$('.statDiv h4').css('display', '');
		$('#statsInfo').css('display', '');
		$('#statsInfoAvg').css('display', '');
		$('#statsInfoStdDev').css('display', '');
		displayRolls();
	}, 1000);
}

function displayRolls() {
	let currentChar = characters[characters.length-1];

	for(let i=0; i<6; i++) {
		$('#stat' + (i+1) + 'rolls').html(getDiceCodes(currentChar.stats[i].rolls) + '<br>');
		$('#stat' + (i+1) ).html('<b>' + currentChar.stats[i].value + '</b><br>' + (currentChar.stats[i].mod > 0 ? '+' : '') + currentChar.stats[i].mod);

	}

	$('#statsInfoStdDev').html('Deviation:<br><b>' + Math.round(stdDev(statsToValues(currentChar.stats))*100)/100 + '</b><br>' + Math.round(stdDev(statsToMods(currentChar.stats))*100)/100);
	$('#statsInfoAvg').html('Mean:<br><b>' + Math.round(currentChar.statTotal*100/6)/100 + '</b><br>' + Math.round(currentChar.modTotal*100/6)/100);
	$('#statsInfo').html('Total:<br><b>' + currentChar.statTotal+ '</b><br>' + currentChar.modTotal);
	$('#numChars').html(characters.length + ' character' + (characters.length > 1 ? 's' : '') + ' generated');
	
	let numbers = [];
	for(let i=0; i<6; i++) {
		numbers.push(parseInt(currentChar.stats[i].value) );
	}
	numbers.sort( (a,b)=>a-b );
	$('#numbersInput').val(numbers.join(', ') );
	makeChart();

}

function getRollLink() {
	//url params
	let r = '';
	for(let i=0; i<6; i++) {
		for(let j=0; j<4; j++) {
			//no need to delimit since all possible vals 1-6 are 1 digit
			r += characters[characters.length-1].stats[i].rolls[j];
		}
	}
	for(let i=0; i<6; i++) {
		//these values are also 1-7 so one digit
		r += $('#stat' + (i+1) + 'Mod').prop('selectedIndex');
	}
	r += $('#nameInput').val();
	r = btoa(r); //encode base64
	return window.location.href.split('char.html')[0] + 'char.html' + '?r=' + r;
}

//todo: add this?
function downloadMany(num) {
	for(let i=0; i<num; i++) {
		$('#genButton').click();
		$('#download').click();
	}
}

function allAreSelected() {
	for(let i=0; i<6; i++) {
		if($('#stat'+(i+1)+'Mod').prop('selectedIndex') < 1) {
			return false;
		}
	}
	return true;
}

function getDieRollerParams() {
	
	let m = '';
	for(let i=0; i<6; i++) {
		let j;
		for(j=0	; j<6; j++) {

			// console.log($('#stat' + (j+1) + 'Mod').val() );
			// console.log(modNames[$('#stat' + (j+1) + 'Mod').prop('selectedIndex')-1] );
			// console.log($('#stat' + (j+1) + 'Mod').val().toString().toLowerCase() );
			if(modNames[$('#stat' + (j+1) + 'Mod').prop('selectedIndex')-1] == modNames[i]) { //found elem
				break;
			}
		}
		m += characters[characters.length-1].stats[j].mod + ' ';
	}
	m += '0 0 0';
	m = btoa(m); //encode base 64
	return '?m=' + m;
}




function statsToValues(stats) {
	let vals = [];
	for(let i=0; i<stats.length; i++) {
		vals[i] = stats[i].value;
	}
	return vals;
}

function statsToMods(stats) {
	let mods = [];
	for(let i=0; i<stats.length; i++) {
		mods[i] = stats[i].mod;
	}
	return mods;
}

function stdDev(array) { //standard deviation
	let sum = 0, len = array.length;
	for(let i=0; i<len; i++) {
		sum += array[i];
	}
	let mean = sum / len;
	let devs = 0;
	for(let i=0; i<len; i++) {
		devs += Math.pow(array[i]-mean, 2);
	}
	return Math.sqrt(devs / (len-1) );	
}

function resetStats() {
	let statMods = $('.statMod');
	for(let i=0; i<statMods.length; i++) {
		statMods[i].selectedIndex = 0;
	}
}

//todo: use this
function percentile(num) {
	num -= 3;
	let val=0;
	for(i=0; i<num; i++) {
		val += odds[i];
	}
	val += Math.ceil(odds[num]/2);
	val /= 1296;
	return val;
}