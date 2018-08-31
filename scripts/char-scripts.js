/*TODO:

text file has mean and std dev



add console
option to chose to roll one stat at a time?

option to choose:
numStats = 6;
numRolls = 4;
numDropped = 1;
diceSides = 6;
show method character was created in download file

*/

let characters = [];
let night = false;
let odds = [1,4,10,21,38,62,91,122,148,167,172,160,131,94,54,21];

function Character() {
	this.stats = [];
	this.statTotal = 0;
	this.modTotal = 0;
	for(let i = 0; i < 6; i++) { //6 stats
		let newStat = new Stat();
		this.stats.push(newStat);
		this.statTotal += newStat.value;
		this.modTotal += newStat.mod;
	}
}

function Stat() { //rolls is array of 4 dice results
	this.rolls = [];
	for(let i = 0; i < 4; i++) { //4 rolls take highest 3
		this.rolls.push(getRoll(6) );
	}
	this.value = 0;
	for(let i = 0, minIdx = this.rolls.indexOf(Math.min.apply(Math, this.rolls) ); i < 4; i++) {
		if(i != minIdx) {
			this.value += this.rolls[i];
		}
	}
	this.mod = getStatMod(this.value);
}

function getStatMod(stat) {
	for(let i = 3, j = -4; ; i+=2, j++) {
		if(i >= stat) {
			return j;
		}
	}
}

function getDieCode(roll) {
	return "&#98" + (55 + roll);
}

function getDiceCodes(rolls) {
	let diceCodes = "";
	for(let i = 0; i < rolls.length; i++) {
		diceCodes += getDieCode(rolls[i]) + " ";
	}
	return diceCodes;
}

window.onload = function() {
		
	document.getElementById("download").onclick = function() {
		console.log('downloading...');
		if(characters.length == 0) {
			return;
		}
		data = [];
		let currentChar = characters[characters.length-1];
		data.push(document.getElementById("nameInput").value + "\r\n");
		for(let i = 0; i < currentChar.stats.length; i++) {
			data.push(document.getElementById("stat" + (i+1) + "Mod").value + ": ");
			for(let j = 0; j < currentChar.stats[i].rolls.length; j++) {
				data.push(currentChar.stats[i].rolls[j].toString());
				if(j < currentChar.stats[i].rolls.length-1) {
					data.push(",");
				}
			}
			data.push("\tVal: " + currentChar.stats[i].value + "\tMod: " + currentChar.stats[i].mod );
			data.push("\r\n");
		}
		data.push("\r\nTotal:\t\tVal: " + currentChar.statTotal + "\tMod: " + currentChar.modTotal);
		
		properties = {type: 'plain/text'};
		try {
			file = new File(data, "stats.txt", properties);
		} catch (e) {
			file = new Blob(data, properties);
		}

		document.getElementById("downloadLink").download = "Character-" + document.getElementById("nameInput").value + ".txt";
		document.getElementById("downloadLink").href = URL.createObjectURL(file);
		document.getElementById("downloadLink").click();
	}
	
	document.getElementById("genButton").onclick = function() {
		resetStats();
		document.getElementById("nameInput").value = "";
		characters.push(new Character() );
		let currentChar = characters[characters.length-1];
		for(let i = 0; i < 6; i++) {
			document.getElementById("stat" + (i+1) ).innerHTML = getDiceCodes(currentChar.stats[i].rolls) + "<br><b>" + currentChar.stats[i].value + "</b><br>" + (currentChar.stats[i].mod > 0 ? "+" : "") + currentChar.stats[i].mod;
		}
		document.getElementById("statsInfoStdDev").innerHTML = "Deviation:<br><b>" + Math.round(stdDev(statsToValues(currentChar.stats))*100)/100 + "</b><br>" + Math.round(stdDev(statsToMods(currentChar.stats))*100)/100;
		document.getElementById("statsInfoAvg").innerHTML = "Mean:<br><b>" + Math.round(currentChar.statTotal*100/6)/100 + "</b><br>" + Math.round(currentChar.modTotal*100/6)/100;
		document.getElementById("statsInfo").innerHTML = "Total:<br><b>" + currentChar.statTotal+ "</b><br>" + currentChar.modTotal;
		document.getElementById("numChars").innerHTML = characters.length + " character" + (characters.length > 1 ? "s" : "") + " generated";
		
		let numbers = [];
		for(let i = 0; i < 6; i++) {
			numbers.push(parseInt(currentChar.stats[i].value));
		}
		numbers.sort(sortNumber);
		document.getElementById("numbersInput").value = numbers.join(", ");
		// makeChart();
	}
	
	function sortNumber(a,b) {
		return a - b;
	}
	
	document.getElementById("genButton").click();
	
	let statMods = document.getElementsByClassName("statMod");
	for(let i = 0; i < statMods.length; i++) {
		statMods[i].onclick = statMods[i].onfocus = function(evt) {
			for(let j = 0; j < 6; j++) {
				evt.target.options[j+1].disabled = false;			
			}
			for(let j = 0; j < 6; j++) {
				let idx = document.getElementById("stat" + (j+1) + "Mod").selectedIndex;
				if(idx != 0) {
					evt.target.options[idx].disabled = true;
				}
			}
		}
	}
	
	document.getElementById("copyButton").onclick = function() {
		let numInput = document.getElementById("numbersInput");
		numInput.focus();
		numInput.setSelectionRange(0, numInput.value.length);
		document.execCommand("copy");
	}
	
	document.getElementById("resetStat").onclick = function() {
		resetStats();
	}
	
	document.getElementById("nightMode").onclick = function() {
		night = !night;
		
		let nightTheme = document.getElementById("nightTheme");
		nightTheme.href = night ? "styles/night.css" : "";
		// makeChart();
		$('#titleImg').prop('src', night ? 'img/d20-white.svg' : 'img/d20.svg');
		$('select').css('color', night ? '#fff' : '#333');
		$('input').css('color', night ? '#fff' : '#333');
		// document.getElementById("titleImg").src = night ? "dice/d20-light.svg" : "dice/d20-dark.svg";
	}
	
	document.getElementById("fullscreen").onclick = function() {
		toggleFullscreen();
	}
	
}





function statsToValues(stats) {
	let vals = [];
	for(let i = 0; i < stats.length; i++) {
		vals[i] = stats[i].value;
	}
	return vals;
}

function statsToMods(stats) {
	let mods = [];
	for(let i = 0; i < stats.length; i++) {
		mods[i] = stats[i].mod;
	}
	return mods;
}

function stdDev(array) { //standard deviation
	let sum = 0, len = array.length;
	for(let i = 0; i < len; i++) {
		sum += array[i];
	}
	let mean = sum / len;
	let devs = 0;
	for(let i = 0; i < len; i++) {
		devs += Math.pow(array[i] - mean, 2);
	}
	return Math.sqrt(devs / (len - 1) );	
}

function resetStats() {
	let statMods = document.getElementsByClassName("statMod");
	for(let i = 0; i < statMods.length; i++) {
		statMods[i].selectedIndex = 0;
	}
}



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