//api isn't https... :(
//http://www.dnd5eapi.co/docs/
//http://www.dnd5eapi.co/api/spells
//https://github.com/adrpadua/5e-database/blob/master/5e-SRD-Spells.json
//https://github.com/adrpadua/5e-srd-api
//https://rgbstudios.org/dnd-dice/spell.html
//TODO: change linear search to binary search
//TODO: update url with spell name before copy
let results, input;
let resultData = {};
let spellNames = [];

function getData() {
  try {
  $.ajax({
      // url: 'http://www.dnd5eapi.co/api/spells',
      url: 'https://raw.githubusercontent.com/rgbstudios/dnd-dice/master/data/spells.json',
      dataType: 'json',
      method: 'GET',
      success: function(data){
        resultData = data.results;
    		// console.log(resultData);
    		doSearch(input.val() );

        //NOTE: this part slows down page load
        for(let i=0; i<resultData.length; i++) {
          spellNames[i] = resultData[i].name;
        }
        // console.log(spellNames);

        makeTypeAhead();
        $('#input').select();

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

// function getSpellData(spellUrl) {
function getSpellData(num) {
  try {
  $.ajax({
      // url: spellUrl,
      url: 'https://raw.githubusercontent.com/rgbstudios/dnd-dice/master/data/spells/' + num + '.json',
      dataType: 'json',
      method: 'GET',
      success: function(data) {
      	console.log(data);
       	for(item in data) {
          if(item=='_id' || item=='url' || item=='index') {
            continue; //skip id and url
          }
    			let itemDescription = ' ';
    			if(data[item][0] && data[item][0].name) {
    				for(let i=0; i<data[item].length; i++) {
    					itemDescription += data[item][i].name + (i==data[item].length-1 ? '' : ', ');
          			}
    			} else {
    	     	itemDescription = (data[item].name ? data[item].name : data[item]).toString();
            itemDescription = itemDescription.replace('phb ',''); //page number fix
    			}
          itemDescription = itemDescription.split('â€™').join('\''); //fix apostrophie that wasn't escaped properly in api
          itemDescription = itemDescription.split('â€œ').join('\''); //fix apostrophie that wasn't escaped properly in api
    			itemDescription = itemDescription.split('â€�').join('\''); //fix apostrophie that wasn't escaped properly in api
          itemDescription = itemDescription.split(',-').join('<br>').split('.,').join('.<br>');
   	    	results.html(results.html() + '<p style="text-align:left !important;">' + item.replace('_',' ').replace('desc','description').capitalize() + ': ' + itemDescription + '</p>');
        	}
        },
      error: function(e){
        console.warn(e);
      }
    });
    } catch(e) {
      console.warn(e);
    }
}

function doSearch(term) {
    $('#input').typeahead('close');
    for(idx in resultData) {
    	if(resultData[idx].name.toLowerCase().replace(' ','').indexOf(term.toLowerCase().replace(' ','') ) != -1) {
    		results.html('<b style="display:inline-block;" class="spell-name"> <i class="fas fa-book"></i> ' + resultData[idx].name + '</b><hr>');
    		// getSpellData(resultData[idx].url);
	        let tmpArr = resultData[idx].url.split('/');
	        let num = tmpArr[tmpArr.length-1];
	        getSpellData(num);
	        $('#input').val(resultData[idx].name);
	    	history.replaceState({}, '', '?q=' + resultData[idx].name);
	    	document.title = resultData[idx].name + ' - Spell Searcher';
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

  $('#nightButton').on('click', function() {
    handleNight(); //in common.js
    $('#titleImg').prop('src', isNight ? 'img/d8-white.svg' : 'img/d8.svg');
  });

  //get url params
  let url = new URL(window.location.href);
  let q = url.searchParams.get('q');
  input.val(q || 'magic missile');

  if(url.searchParams.get('n')=='1') { // if night in url
    url.searchParams.delete('n');
    history.replaceState({}, '', '?' + url.searchParams.toString() ); // remove from url
    $('#nightButton').click(); // then set night
  }

  getData();

  $('#search').on('click', function() {
  	doSearch(input.val() );
  });

  input.on('keydown', function(e) {
  	if(e.keyCode == 13) { //enter
  		doSearch(input.val() );
  	}
  });

  // input.select();

});

//-------- typeahead --------
function makeTypeAhead() {

  //http://twitter.github.io/typeahead.js/examples/
  let substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      let matches, substringRegex;
      matches = [];
      substrRegex = new RegExp(q, 'i');
      $.each(strs, function(i, str) {
        if (substrRegex.test(str) ) {
          matches.push(str);
        }
      });
      cb(matches);
    };
  };

  $('#input').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'spells',
    source: substringMatcher(spellNames)
  });


  $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
    doSearch(suggestion); //search suggestion when selected
    // console.log('Selection: ' + suggestion);
  });

}
