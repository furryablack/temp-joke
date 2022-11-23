/**
 * Tor, LTor, RTor - all that is sms terminators like k/N, 
 * where (k) is ordinal number of a sms
 * and (N) is all sms items count. 
 */

// HEAD

// a better case will be moving of it in the fixtures
const LIMIT = 140;
const DELIMITER = ' ';
const PRINT_RESULTS = true;

// MAIN

main();

function main() {
  const fixtures = getFixtures(); 
  const results = fixtures.map(fixture => work(fixture));
  printResults(results, fixtures);  
}

// EXTERNAL

function work(input = '') {
  if (input.length <= LIMIT) return [input];

  const words = input.split(DELIMITER);
  
  let cursor = 0,
      smsMap = [[]],
      torSet = [1];
  
  let rTorExpected = Math.floor(input.length / LIMIT);
      rTorExpected = (input.length % LIMIT) ? rTorExpected + 1 : rTorExpected;

  const getSms = (p = cursor) => smsMap[p];
  const getLTor = (p = cursor) => torSet[p];
  const getLTorLen = (p = cursor) => getLTor(p).toString().length;
  const getRTor = () => Math.max(rTorExpected, smsMap.length);  
  const getRTorLen = () => getRTor().toString().length;

  const getSmsSpacesCount = (p = cursor) => {
    const wordsCount = getSms(p).length;
    return wordsCount >= 1 ? wordsCount - 1 : 0;
  };

  const getSmsLen = (p = cursor) => getSms(p).reduce((acc, cu) => acc + cu.length, 0) + getSmsSpacesCount(p);
  const pushToSms = (word, p = cursor) => getSms(p).push(word);  
  const moveCursor = () => ++cursor;
  const allocateTor = () => torSet.push(torSet.length + 1);
  const allocateSms = () => smsMap.push([]);
  const allocate = () => (allocateTor(), allocateSms());
  const nextSpark = () => (allocate(), moveCursor());
  
  const getIfHasFreeSpace = (word, p = cursor) => {
    const smsLen = getSmsLen(p);
    const wordlen = word.length;
    const lTorLen = getLTorLen(p);
    const rTorLen = getRTorLen(p);
    const expectedLen = smsLen + 1 + wordlen + 1 + lTorLen + 1 + rTorLen;
    return expectedLen <= LIMIT;
  };

  const doSms = () => {
    for (let i = 0; i < words.length; i++) {
      const current = words[i];
  
      if (!getIfHasFreeSpace(current)) {
        nextSpark();  
      } 

      pushToSms(current);
    }
  };

  const prepareResult = () => {
    return smsMap.map((sms, idx) => [
      sms.join(' '), 

      [
        getLTor(idx),
        getRTor(),
      ].join('/'),
    ].join(' '));
  };

  return [doSms(), prepareResult()][1];
}

function printResults(results = [], fixtures = []) {
  if (PRINT_RESULTS) results.forEach((result, idx) => {
    const inp = [fixtures[idx].length, fixtures[idx]];
    const res = result.map(r => [r.length, r]);
    console.log(`[${(idx + 1)}]`, { inp, LIMIT, res });
    console.log('=================================');
  });  
}

// FIXTURES

function getFixtures() {
  const useOnly = [1];
  const skipAt = [];

  const fixtures = [
    '1234567890qwerty 1234567890qwerty 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 12345 123456789 1234 1234 123456789 123456789 123456789 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 12345 123456789 1234 1234 123456789 123456789 123456789 1234567890qwerty 1234567890qwerty 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678 1234567890qwerty',

    'The map above is very easy to use By default the location of all existing objects in the game is immediately marked on if it information is constantly updated If you need a specific item then click on the funnel icon in the upper right corner to open the legend',
    
    'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    
    'Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscipit velit efficitur eget Sed sit amet posuere risus',
    
    // if it information => ifit it information
    'BROKEN The map above is very easy to use By default the location of all existing objects in the game is immediately marked on ifif it it information is constantly updated If you need a specific item then click on the funnel icon in the upper right corner to open the legend',
  ];

  if (useOnly.length) {
    return fixtures.filter((_, idx) => useOnly.includes(idx + 1));
  } else if (!skipAt.length) return fixtures; else {
    return fixtures.filter((_, idx) => !skipAt.includes(idx + 1));   
  }
}