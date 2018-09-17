//TODO: url param
let results, input, isNight;
let resultData = {};

function getData(term) {
  try {
  $.ajax({
      url: 'http://www.dnd5eapi.co/api/spells',
      dataType: 'json',
      method: 'GET',
      success: function(data){
        resultData = data.results;
		console.log(resultData);
		doSearch(input.val() );

      },
      error: function(e){
        console.warn('Error retrieving data');
        console.warn(e);
      }
    });
    } catch(e) {
      console.warn('Caught error');
      console.warn(e);
    }
}

function getSpellData(spellUrl) {
  console.log('searching url: ' + spellUrl);
  try {
  $.ajax({
      url: spellUrl,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
      	console.log(data);
      	for(item in data) {
			let itemDescription = ' ';
			if(data[item][0] && data[item][0].name) {
				for(let i=0; i<data[item].length; i++) {
					itemDescription += data[item][i].name + (i==data[item].length-1 ? '' : ', ');
      			}
			} else {
	      		itemDescription = (data[item].name ? data[item].name : data[item]).toString();
			}
			itemDescription = itemDescription.replace('â€™', '\''); //fix apostrophie that wasn't escaped properly in api
	    	results.html(results.html() + '<p>' + item.replace('_',' ').capitalize() + ' : ' + itemDescription + '</p>');    			
    	}
      },
      error: function(e){
        console.warn('Error retrieving spell data');
        console.warn(e);
      }
    });
    } catch(e) {
      console.warn('Caught error getting spell data');
      console.warn(e);
    }
}

function doSearch(term) {
    for(idx in resultData) {
    	if(resultData[idx].name.toLowerCase().replace(' ','').indexOf(term.toLowerCase().replace(' ','') ) != -1) {
    		results.html('<p class="text-center">' + resultData[idx].name + '</p><hr>');
    		getSpellData(resultData[idx].url);
    		history.replaceState({}, '', '?q=' + term);
    		return;
    	}
    }
    results.html('No results found...');
}

//https://stackoverflow.com/questions/2332811/capitalize-words-in-string
String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

$(function() {
  results = $('#results');
  input = $('#input');
  nightButton = $('#nightButton');

  //get url params
  let url = new URL(window.location.href);
  let q = url.searchParams.get('q');
  input.val(q || 'magic missile');

  input.select();
  //search
  getData();

  $('#search').on('click', function() {
  	doSearch(input.val() );
  });

  input.on('keydown', function(e) {
  	if(e.keyCode == 13) { //enter
  		doSearch(input.val() );
  	}
  });

  nightButton.on('click', function() {
    if(!isNight) {
      nightButton.html("Day Theme <i class='fas fa-sun'></i>");
      $('#nightTheme').prop('href', 'styles/night.css');
      $('#titleImg').prop('src', 'img/d20-white.svg');
    } else {
      nightButton.html("Night Theme <i class='fas fa-moon'></i>");
      $('#nightTheme').prop('href', '');
      $('#titleImg').prop('src', 'img/d20.svg');
    }
    isNight = !isNight;
  });


});
