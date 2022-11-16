const LIMIT = 140;
const DELIMITER = ' ';

const FIXTURES = [
  'The map above is very easy to use By default the location of all existing objects in the game is immediately marked on if it information is constantly updated If you need a specific item then click on the funnel icon in the upper right corner to open the legend',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscipit velit efficitur eget Sed sit amet posuere risus',
  // if it information => ifit it information
  'BROKEN The map above is very easy to use By default the location of all existing objects in the game is immediately marked on ifif it it information is constantly updated If you need a specific item then click on the funnel icon in the upper right corner to open the legend',
];

main(FIXTURES);

function main(inputs = []) {
  const results = inputs.map(inp => work(inp));

  results.forEach((result, idx) => {
    const inp = inputs[idx];
    const resLen = result.map(r => r.length);
    const resVal = result;
    console.log(`[${(idx + 1)}]`, { inp, resLen, resVal });
    console.log('=================================');
  });  
}

function work(input = '') {
  if (input.length <= LIMIT) {
    return [input];
  }

  let words = input.split(DELIMITER);
      words = words.map((word, idx) => ({ cu: word, prev: words[idx - 1], next: words[idx + 1] }));

  const sms = [[]];

  let word,
      p = 0;

  const getSmslength = () => 
    // every word 
    sms[p].reduce((acc, cu) => acc + cu.length, 0) + 
    // and spaces between them
    (sms[p].length >= 1 ? sms[p].length - 1 : 0);

  while((word = words.shift())) {
    const {prev, cu, next} = word;
    
    // story's beginning and ending
    if (!prev) sms[p].push(cu); else if (!next) {
      // sms + ' ' + word + ' ' + ord + '/' + sms.length
      if ((getSmslength() + 1 + cu.length + 1 + (p + 1) + 1 + sms.length) >= LIMIT) {        
        sms[p].push(`${(p + 1)}`);
        p++;
        sms.push([cu, `${(p + 1)}`]); 
      } else sms[p].push(`${cu} ${(p + 1)}`);
    } else {
      // middle-earth
      if ((getSmslength() + 1 + cu.length) > LIMIT) {
        const last =  sms[p].pop();
        sms[p].push(`${(p + 1)}`);
        sms.push([last]); 
        p++;
      }

      sms[p].push(cu);
    }    
  }

  return sms.map(item => item.join(' ')).map(s => `${s}/${sms.length}`);
}


