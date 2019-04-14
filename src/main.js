// Main funcion - Render View
render();

// DOM Elements
var mainContent = document.getElementById("main_content");
var searchInput = document.getElementById("search_input");
var filterButtons = document.getElementsByClassName("filter_button");
var notFoundBox = document.getElementById("not_found_links");
var allLinks = document.getElementsByClassName("link");

//Events
for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", filterRender, false);
}
searchInput.addEventListener("keyup",filterBySearch, false);


// Functions
function render(){
  getLinksFromApi();
}

function filterBySearch(){
  notFoundBox.style.display = "none";
  var val = this.value;
  var contResults = 0;
  for (var i = 0; i < allLinks.length; i++) {
    allLinks[i].style.display = "none";
    let textBlock = allLinks[i].textContent;
    if(textBlock.toLowerCase().indexOf(val.toLowerCase()) != -1){
      allLinks[i].style.display = "flex";
      contResults+=1;
    }
  }
  if(contResults==0){
    notFoundBox.style.display = "flex";
  }
}

function filterRender() {
  var type = this.getAttribute("data-filter-type");
  var order = this.getAttribute("data-filter-order");
  //Add Active class in current filter
  for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].classList.remove("active");
  }
  this.classList.add("active");
  if(order == "up-down"){
    this.setAttribute("data-filter-order","down-up");
    this.querySelector(".fas").classList.remove("fa-caret-up");
    this.querySelector(".fas").classList.add("fa-caret-down");
  }else if(order == "down-up"){
    this.setAttribute("data-filter-order","up-down");
    this.querySelector(".fas").classList.add("fa-caret-up");
    this.querySelector(".fas").classList.remove("fa-caret-down");
  }
  mainContent.innerHTML = "";
  getLinksFromApi(order,type);
}

function getLinksFromApi(order="up-down",filter="p"){
  fetch("https://www.mocky.io/v2/5a6bc16631000078341b8b77",{
    method:"GET",
  }).then(function(response){
    if (response.status !== 200) {
      alert("Looks like there was a problem. Status Code: " + response.status);
      return;
    }
    return response.json();
  }).then(function (data){
    let links = data.links.sort(function(a, b){
      switch(filter){
        case "p":
          if(order == "up-down"){
            return b.upvotes - a.upvotes ;
          }else{
            return a.upvotes - b.upvotes;
          }
        case "c":
          if(order == "up-down"){
            return b.comments - a.comments ;
          }else{
            return a.comments - b.comments;
          }
        case "d":
          if(order == "up-down"){
            return b.created_at - a.created_at ;
          }else{
            return a.created_at - b.created_at;
          }
      }
    });
    links.map(function(link){
      createLinkTemplate(link);
    });
  }).catch(function(error) {
    alert("Ops. Error: "+error);
  });
}


function createLinkTemplate(data){
  function convertMS( milliseconds ) {
    var day = 0, hour = 0, minute = 0, seconds = 0;
    seconds = Math.floor(milliseconds / 100000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;

    var text_seconds = "second";
    var text_minute = "minute";
    var text_hour = "hour";
    var text_day = "day";
    text_seconds += (seconds>1)?"s":"";
    text_minute += (minute>1)?"s":"";
    text_hour += (hour>1)?"s":"";
    text_day += (day>1)?"s":"";

    if(minute == 0 && hour == 0 && day == 0){
      return `${seconds} ${text_seconds}`;
    }else if(hour == 0 && day == 0){
      return `${minute} ${text_minute}`;
    }else if(day == 0){
      return `${hour} ${text_hour}`;
    }else{
      return `${day} ${text_day}`;
    }
  }

  var refactoredTime = "No time";
  if(data.created_at != "" && data.created_at != null){
    refactoredTime = convertMS(data.created_at);
    refactoredTime+=" ago";
  }
  var content = (`<div class="link">
  <div class="upvote_box">
  <button type="button" name="button"><i class="fas fa-chevron-up"></i></button>
  <div class="upvote_val">${data.upvotes}</div>
  </div>
  <div class="content_box">
  <div class="meta_box">
  <a href="http://${data.meta.url}">${data.meta.url}</a>
  <h2>${data.meta.title}</h2>
  </div>
  <div class="info_box">
  <span class="category bg_${data.category}">${data.category}</span>
  <span class="user">
  <i class="fas fa-user"></i><span class="user_name">${data.meta.author}</span>
  </span>
  <span class="time">${refactoredTime}</span>
  <span class="comment">
  <i class="fas fa-comment"></i><span class="commnet_text">${data.comments} Comments</span>
  </span>
  </div>
  </div>
  </div>`);
  mainContent.innerHTML += content;
}
