//TODO: Vince
//take input str
//int immediatly after 'D' or 'd' with or wihtou whitespace between is diceSides. between 2-999
//int immedatly before is numDice, if none then default 1. between 1-999
//if + or - followed immedatly by an int -999-999 then that is the modifier, if not, 0
//if (advantage) or (disadvantage) case-insensitive appear in parentheses anywhere, make advantage '1' or '-1' respectively. if not '0'. strings.
//attr1Name is first appearance of str, dex, con, int, wis, cha case-insensitive. does not need a + - or parentheses. attr1Name is lowercase string
//if none then attr1Name is 'non'
//attr1 is getAttribute1(attr1Name)
//do same for attr2Name and attr2 except with  'prf' or 'proficiency' is 'prf' 'exp' or 'expertise' is 'exp',
// 'spl' or 'spell atk' is 'spl', and 'itv' or 'initiative' is 'itv'
function doConsoleRoll(str) {
  const input = str.toLowerCase();
  let numDice = 1;
  let diceSides = 2;
  let advantage = 0;
  let modifier = 0;
  let attr1Name = 'non';
  let attr2Name;
  
  if(/^([2-9]|([1-9][0-9][0-9]?))?\s?d\s?([2-9]|([1-9][0-9][0-9]?))\s?((\+|\-)[1-9][0-9]?[0-9]?)?\s?(\(str\)|\(dex\)|\(con\)|\(int\)|\(wis\)|\(cha\))?\s?(\(prf\)|\(exp\)|\(spl\)|\(itv\))?$/.test(input) ||
  /^1?\s?d\s?([2-9]|([1-9][0-9][0-9]?))\s?((\+|\-)[1-9][0-9]?[0-9]?)?\s?(\(adv\)|\(advantage\)|\(dis\)|\(disadvantage\)|)?\s?(\(str\)|\(dex\)|\(con\)|\(int\)|\(wis\)|\(cha\))?\s?(\(prf\)|\(exp\)|\(spl\)|\(itv\))?$/.test(input)) {
    let tokens = input.match(/^[1-9][0-9]?[0-9]?d\s?/);
    if(tokens != null) {
      numDice = tokens[0].replace('d', '').replace(' ', '');
    }
    tokens = input.match(/d\s?(([1-9][0-9][0-9]?)|[2-9])/);
    diceSides = tokens[0].replace('d', '');
    tokens = input.match(/(\+|\-)[1-9][0-9]?[0-9]?/)
    if(tokens != null) {
      modifier = tokens[0].replace('+', '').replace(' ', '');
    }
    tokens = input.match(/\(advantage\)|\(adv\)|\(disadvantage\)|\(dis\)/);
    if(tokens != null) {
      if(/adv/.test(tokens[0])) {
        advantage = 1;
      } else if (/dis/.test(tokens[0])) {
        advantage = -1;
      }
    }
    tokens = input.match(/\(str\)|\(dex\)|\(con\)|\(int\)|\(wis\)|\(cha\)/);
    if(tokens != null) {
      if(/str/.test(tokens[0])) {
        attr1Name = 'str';
      } else if (/dex/.test(tokens[0])) {
        attr1Name = 'dex';
      } else if (/con/.test(tokens[0])) {
        attr1Name = 'con';
      } else if (/int/.test(tokens[0])) {
        attr1Name = 'int';
      } else if (/wis/.test(tokens[0])) {
        attr1Name = 'wis';
      } else if (/cha/.test(tokens[0])) {
        attr1Name = 'cha';
      }
    }
    tokens = input.match(/\(prf\)|\(exp\)|\(spl\)|\(itv\)/);
    if(tokens != null) {
      if(/prf/.test(tokens[0])) {
        attr2Name = 'prf';
      } else if (/exp/.test(tokens[0])) {
        attr2Name = 'exp';
      } else if (/spl/.test(tokens[0])) {
        attr2Name = 'spl';
      } else if (/itv/.test(tokens[0])) {
        attr2Name = 'itv';
      }
    }
    doRolls(parseInt(numDice), parseInt(diceSides), parseInt(advantage), parseInt(modifier), getAttribute1(attr1Name), attr1Name, getAttribute1(attr2Name), attr2Name);
    console.log(output.val());
  }
  else {
    console.log('ERROR: Input not recognized');
    console.log('USAGE:');
    console.log("  [NUMDICE]d[NUMSIDES] [MODIFIER] [ADVANTAGE] [ATTRIBUTE1] [ATTRIBUTE2]");
    console.log("  REQUIRED -")
    console.log("    NUMSIDES - An integer between 2 and 999 inclusive.\n      The number of sides on each dice.");
    console.log("  OPTIONAL -")
    console.log("    NUMDICE - An integer between 1 and 999 inclusive.\n     The number of dice to roll. Default: 1.");
    console.log("    MODIFIER - An integer between 0 and 999 inclusive preceded by a '+' or a '-' for positive and negative respectively.\n      A fixed ammount to add or subtract from the final roll result.");
    console.log("    ADVANTAGE - \n      To use the advantage option NUMDICE must be 1");
    console.log("    ATTRIBUTE1 - ");
    console.log("    ATTRIBUTE2 - ");
  }
}

//eg roll 1 20 +2 -adv -str -spl
function advancedConsole(str) {
  const input = str.trim();
  if(/^roll /.test(input)) {
    if(/^roll [2-9][0-9]?[0-9]? ([2-9]|([1-9][0-9][0-9]?))( ((\+|\-)?(([1-9][0-9]?[0-9]?)|0))?)?( (\-str|\-dex|\-con|\-int|\-wis|\-cha))?( (\-prf|\-exp|\-spl|\-itv))?$/.test(input)) {
      let numDice = 1;
      let numSides = 2;
      let modifier = 0;
      const advantage = 0;
      let attr1Name = 'non';
      let attr2Name;
      const fields = input.split(' ');
      console.log(fields); 
      numDice = parseInt(fields[1]);
      numSides = parseInt(fields[2]);
      if(fields[3].match(/[0-9]/)) {
        modifier = fields[3].replace("+", "");
      }
      let token = input.match(/(\-str|\-dex|\-con|\-int|\-wis|\-cha)/);
      if(token != null) {
        attr1Name = token[0].replace("-", "");
      }
      token = input.match(/(\-prf|\-exp|\-spl|\-itv)/);
      if(token != null) {
        attr2Name = token[0].replace("-", "");
      }
      doRolls(parseInt(numDice), parseInt(numSides), parseInt(advantage), parseInt(modifier), getAttribute1(attr1Name), attr1Name, getAttribute1(attr2Name), attr2Name);
      console.log(output.val());
    } else if (/^roll 1 ([2-9]|([1-9][0-9][0-9]?))( ((\+|\-)?(([1-9][0-9]?[0-9]?)|0))?)?( (\-adv|\-dis))?( (\-str|\-dex|\-con|\-int|\-wis|\-cha))?( (\-prf|\-exp|\-spl|\-itv))?$/.test(input)) {
      let numDice = 1;
      let numSides = 2;
      let modifier = 0;
      let advantage = 0;
      let attr1Name = 'non';
      let attr2Name;
      const fields = input.split(' ');
      console.log(fields); 
      numDice = parseInt(fields[1]);
      numSides = parseInt(fields[2]);
      if(fields[3].match(/[0-9]/)) {
        modifier = fields[3].replace("+", "");
      }
      let token = input.match(/(\-adv|\-dis)/);
      if(token != null) {
        if(token[0] == "-adv") {
          advantage = 1;
        } else {
          advantage = -1;
        }
      }
      token = input.match(/(\-str|\-dex|\-con|\-int|\-wis|\-cha)/);
      if(token != null) {
        attr1Name = token[0].replace("-", "");
      }
      token = input.match(/(\-prf|\-exp|\-spl|\-itv)/);
      if(token != null) {
        attr2Name = token[0].replace("-", "");
      }
      doRolls(parseInt(numDice), parseInt(numSides), parseInt(advantage), parseInt(modifier), getAttribute1(attr1Name), attr1Name, getAttribute1(attr2Name), attr2Name);
      console.log(output.val());
    } else if (/^roll \-\-help$/.test(input)) {
      console.log("roll: Rolls a number of dice");
      console.log("USAGE:");
      console.log("  roll [NUMDICE] [NUMSIDES] [MODIFIER] [ADVANTAGE] [ATTRIBUTE] [BONUS]");
      console.log("  REQUIRED -");
      console.log("    NUMDICE - An integer between 1 and 999 inclusive.");
      console.log("      The number of dice to roll.");
      console.log("    NUMSIDES - An integer between 2 and 999 inclusive.");
      console.log("      The number of sides on each dice.");
      console.log("  OPTIONAL -");
      console.log("    MODIFIER - An integer between 0 and 999 inclusive preceded by a '+' or a '-' for positive and negative respectively.");
      console.log("      A fixed ammount to add or subtract from the final roll result.");
      console.log("    ADVANTAGE - ");
      console.log("      -adv : Advantage. Role 2 dice and take the higher of the two results (before modifiers).");
      console.log("      -dis : Disadvantage. Role 2 dice and take the lower of the two results (before modifiers).");
      console.log("      -- Advantage options are mutually exclusive.");
      console.log("      -- CANNOT be used when NUMDICE is more than 1.");
      console.log("    ATTRIBUTE - ");
      console.log("      -str : Strength. Adds strength stat to the roll result.");
      console.log("      -dex : Dexterity. Adds deterity stat to the roll result.");
      console.log("      -con : Constitution. Adds constitution stat to the roll result.");
      console.log("      -int : Intelligence. Adds intelligence stat to the roll result.");
      console.log("      -wis : Wisdom. Adds wisdom stat to the roll result.");
      console.log("      -cha : Charisma. Adds charisma stat to the roll result.");
      console.log("      -- Attribute options are mutually exclusive.");
      console.log("    Bonus - ");
      console.log("      -prf : Proficieny. Adds proficiency bonus to the roll result.");
      console.log("      -exp : expertise. Adds expertise bonus to the roll result.");
      console.log("      -spl : Spell attack. Adds spell attack to the roll result.");
      console.log("      -itv : Initiative. Adds initiative bonus to the roll result.");
      console.log("      -- Bonus options are mutually exclusive.");
      console.log("  EXAMPLE USAGE -");
      console.log("    roll 1 20 +1 -adv -dex -itv");
    } else {
      console.log("ERROR: Improper usage of 'roll' command.\n-- For usage details input 'roll --help'");
    }
  } else {
    if(input.match(/^[^ ]* /) != null) {
      console.log("ERROR: no command '" + input.match(/^[^\s]*\s/)[0].trim() + "' found.");
    }
  }
}