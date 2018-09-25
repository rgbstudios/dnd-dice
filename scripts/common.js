let isNight;

function handleNight() {
  if(!isNight) {
    $('#nightButton').html("Day Theme <i class='fas fa-sun'></i>");
    $('#nightTheme').prop('href', 'styles/night.css');
    // $('#titleImg').prop('src', 'img/d20-white.svg');
  } else {
    $('#nightButton').html("Night Theme <i class='fas fa-moon'></i>");
    $('#nightTheme').prop('href', '');
    // $('#titleImg').prop('src', 'img/d20.svg');
  }
  isNight = !isNight;
}

function copyUrl(url = window.location.href) {
    let tmp = $('<input type="text">').appendTo(document.body);
    tmp.val(url);
    tmp.select();
    document.execCommand('copy');
    tmp.remove();
	//todo: display toast for copied sucessfully
}

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


// side menu
function openNav() {
	$('#sideNav').css('width', '250px');
	$('#menuButton').css('display', 'none');
}
function closeNav() {
	$('#sideNav').css('width', '0px');
	$('#menuButton').css('display', '');
}
