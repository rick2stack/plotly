d3.selectAll("body").on("change", updatePage);

//why #? 
function updatePage() {
  var dropdownMenu = d3.selectAll("#selectOption").node();
  var dropdownMenuID = dropdownMenu.id;
  var selectedOption = dropdownMenu.value;
  console.log(dropdownMenu);
  console.log(dropdownMenuID);
  console.log(selectedOption);
  console.log(d3.selectAll("#menu").node());
};
