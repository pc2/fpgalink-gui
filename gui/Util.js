
const ColorEnum = Object.freeze({
  "red": "f3546a",
  "yellow": "FFFF99",
  "green": "b9dd69",
  "blue": "00A8F0"
});

function pad_node_name(num) {
  var s = "0" + num;
  return "n" + s.substr(s.length - 2);
}
