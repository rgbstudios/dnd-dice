function getRoll(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

function talk(words) {
	let synth = window.speechSynthesis;
	if('speechSynthesis' in window) {
		let msg = new SpeechSynthesisUtterance(words);
		msg.rate = 1;
		msg.pitch = 1;
		synth.speak(msg);
	}
}

function downloadFile(str, fileName, linkName) {
	let data = [];
	data.push(str);

	properties = {type: 'plain/text'};
	try {
		file = new File(data, fileName + '.txt', properties);
	} catch (e) {
		file = new Blob(data, properties);
	}
	document.getElementById(linkName).download = fileName + '.txt';
	document.getElementById(linkName).href = URL.createObjectURL(file);
	document.getElementById(linkName).click();
}

function getFormattedDate() {
	let today = new Date();
	let day = today.getDate();
	let mon = today.getMonth()+1; //Jan is 0
	day = day < 10 ? "0" + day : day;
	mon = mon < 10 ? "0" + mon : mon;
	return mon + "-" + day + "-" + today.getFullYear();	
}

//https://stackoverflow.com/questions/3900701/onclick-go-full-screen?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function toggleFullscreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {  
      document.documentElement.requestFullScreen();  
    } else if (document.documentElement.mozRequestFullScreen) {  
      document.documentElement.mozRequestFullScreen();  
    } else if (document.documentElement.webkitRequestFullScreen) {  
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    }  
  } else {  
    if (document.cancelFullScreen) {  
      document.cancelFullScreen();  
    } else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
    } else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
    }  
  }  
}