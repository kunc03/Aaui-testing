function pad(number, size) {
  var s = String(number)
  while(s.length < (size || 2)) { s = "0" + s }
  return s
}

module.exports = {
  pad
}