  
/**
 * 
 * @param {Number} num number that needs commas inserted 
 * @returns {String} the string to display into a document
 */
function numberWithCommas(num) {
  let parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //console.log(parts);
  //if only a tens place fill in hundredths place with zero and splice off the extra if its not a zero
  if (parts.length === 2) {
    parts.splice(1, 0, parts[1] + "0");
    parts.splice(2);
    if (parts[1].length > 2) {
      //pop last number and manipulate it to take out the stuff after hundreds place
      let decimals = parts.pop().split('');
      //console.log(decimals);
      //splice out anything past second index
      decimals.splice(2);
      //console.log(decimals);
      let joinedDec = decimals.join('');
      //console.log(joinedDec);
      //push joined dec into parts array
      parts.push(joinedDec);
    }
  }
  //console.log(parts);
  return parts.join('.');
}