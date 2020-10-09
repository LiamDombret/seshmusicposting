const apiPublicKey = 'AIzaSyCaUwo1gSghvfFa9h-wd0cUgUCfXa61qSY';
let player;
let logo;

// gets newest record from database
function fetchNewContent() {
  $(".sidebar").animate({scrollTop: 0}, "swing");
  $("#sidebar-content").prepend("<div class='sidebarItem placeholderItem' id=''><a  class='placeholderLink' href=''><h3 class='placeholderTitle'>/</h3></a><h4 class='placeholderDate'>/</h4><a class='placeholderLink' href=''><div class='thumbnail placeholderImg' style='background-color:black;'></div></a>");
  $(".placeholderItem").css("animation", "heightAnimation 1.5s ease forwards");
  $.ajax({
    type: "GET",
    url: "fetchNewContent.php",
    dataType: "html",
    success: function(response){
      loadNewContent(response);
    }
  });
}

// checks authentication cookie
function checkAuth() {
  $.ajax({
    url: "checkAuth.php",
    type: "GET",
    success: function(response) {
      if(response == "true") {
        setTimeout(function(){
          loadPage();}, 3000);
        } else {
          $("#pass-form").css('animation', 'fadeEffectIn 2s ease');
          $('#password').focus();
          setTimeout(function(){
            $("#pass-form").css('opacity', '1');
          }, 2000);
        }
      },
      error: function() {
        $('#message').html('Error');
      }
    });
  }


  // fills placeholder with new record
  function loadNewContent(newData) {
    let objectData = newData.split(/;/);
    let link = objectData[0];
    let id = objectData[1];
    let title = objectData[2];
    let thumbnail = "https://" + objectData[3];
    let date = objectData[4];
    $(".placeholderTitle").html(title);
    $(".placeholderTitle").removeClass('placeholderTitle');
    $(".placeholderImg").css("background-image", "url(" + thumbnail + ")");
    $(".placeholderImg").removeClass('placeholderImg');
    $(".placeholderDate").html(date);
    $(".placeholderDate").removeClass('placeholderDate');
    $(".placeholderLink").attr('href', link);
    $(".placeholderLink").removeClass('placeholderLink');
  }

  // loads sidebar content
  function sidebarContent(sidebarData) {
    let object = sidebarData.split(/\r?\n/);
    for (let i = 0; i < object.length-1; i++) {
      let objectData = object[i].split(/;/);
      let link = objectData[0];
      let id = objectData[1];
      let title = objectData[2];
      let thumbnail = "https://" + objectData[3];
      let date = objectData[4];
      $("#sidebar-content").prepend("<div class='sidebarItem'><a href='"+link+"'><h3>"+title+"</h3></a><h4>"+date+"</h4><a href='"+link+"'><div class='thumbnail' style='background-image:url(" + thumbnail + ");'></div></a>");
    }
  }

  // animates loading screen logo with random glitch animation
  function animateLogo() {
    let random;
    random = Math.floor((Math.random() * 3)+ 1);
    $('#wave').css("animation", "glitch" + random + " 2s ease infinite");
    setTimeout(function(){ random = Math.floor((Math.random() * 3)+ 1); $('#erase').css("animation", "glitch" + random + " 2s ease infinite");
    setTimeout(function(){ random = Math.floor((Math.random() * 3)+ 1); $('#blur').css("animation", "glitch" + random + " 2s ease infinite");
  }, 40);}, 40);
}

// retrieves title from datanase using video ID
function getTitleFromId(id) {
  $.ajax({
    type: "GET",
    url: "getTitle.php",
    dataType: "html",
    data: {
      id: id
    },
    success: function(response){
      $('#songtitle').html(response);
      document.title = "SESH | " + response;
    },
    error: function(response){
      return "error";
    }
  });
}

// retrieves rows from database
function loadSidebar() {
  $.ajax({
    type: "GET",
    url: "loadvideos.php",
    dataType: "html",
    success: function(response){
      sidebarContent(response);
    }
  });
};

// stops logo animation :)
function stopLogo() {
  clearInterval(logo);
  $('#wave').css("display", "none");
  $('#blur').css("display", "none");
  $('#erase').css("display", "none");
  $('#glitch1').css("display", "block");
}

// loads the full page content
function loadPage() {
  getRandomVideo(false);
  setTimeout(function() {
    loadSidebar();
    stopLogo();
    loadScreen();
  }, 500);
}

// fades in main screen
function loadScreen() {
  if(window.matchMedia('(max-width: 768px)').matches) {
    $('#borgar').css('display', 'block');
    $('#cancel').css('display', 'block');
  } else {
    $('#text-toggle').css('display', 'block');
  }
  $('.main').css("animation", "changeBg 1s ease");
  $('#main-title').css("animation", "fadeEffectIn 1s ease");
  $('#password').css("animation", "fadeEffectOut 1s ease");
  $('#link-form').css("animation", "fadeEffectIn 1s ease");
  $('#glitch1').css("animation", "fadeEffectOut 1s ease");
  $('#videoPlayer').show();
  $('#videoPlayer').css("animation", "fadeEffectIn 1s ease");
  $('#videoPlayer').animate({maxHeight: "800px"}, 1000);
  $('#link-form').css("animation", "fadeEffectIn 1s ease");
  $('#link-form').animate({maxHeight: "800px"}, 1000);
  $('#link-form').css('display', 'flex');
  setTimeout(function(){
    $('.main').css("background-color", "rgba(0,0,0,0)");
    $('#main-title').css("opacity", "1");
    $('#main-title').css("animation", "");
    $('#password').css("display", "none");
    $('#link-form').css("opacity", "1");
    $('#link-form').css("animation", "");
    $('#link').focus();
    $('#glitch1').css("opacity", "0");
    $('#videoPlayer').css("animation", "");
    $('#videoPlayer').css("opacity", "1");
    $('#glitch1').css("animation", "");
  }, 1000);
}


// checks everything needed before posting data (input validation, extracting data from API)
function postData(videoLink) {
  let id;
  let title;
  let link;
  let thumb;
  if (checkLink(videoLink)) {
    if ((id = getID(videoLink)) != false) {
      $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id,
        data: {
          key: apiPublicKey,
          type: 'video',
          videoEmbeddable: true,
        },
        success: function(response){
          if(response.items.length > 0) {
            thumb = getThumbnail(id);
            link = "https://www.youtube.com/watch?v=" + id;
            title = response.items[0].snippet.title;
            insertData(link, id, thumb, title);
          } else {
            $('#message').html('Video does not exist.');
          }
        },
        error: function(response){
          return "error";
        }
      });
    } else {
      $('#message').html('Error in link ID.');
    }
  } else {
    $('#message').html('Please enter a YouTube link.');
  }
  $('#message').css('animation', 'message 3s ease forwards');
  $('#link').val('');
  setTimeout(function() {
    $('#message').css("animation", "");
    $('#message').css("opacity", "0");
  }, 3000);
}

// inserts new link into database
function insertData(videoLink, videoId, videoThumb, videoTitle) {
  $.ajax({
    url: "checkId.php",
    type: "GET",
    data: {
      id: videoId,
    },
    cache: false,
    success: function(data) {
      if (!data) {
        $.ajax({
          url: "insertData.php",
          type: "POST",
          data: {
            link: videoLink,
            id: videoId,
            thumbnail: videoThumb,
            title: videoTitle,
          },
          cache: false,
          success: function(response)
          {
            //fetchNewContent();
            $('#message').html('Schefke!');
          }, error: function() {
            $('#message').html('');
          }
        });
      } else {
        $('#message').html('Duplicate content.');
      }
    }, error: function() {
      $('#message').html('Error');
    }
  });
}

let left;
let margin;
let left2;

function sidebarAnim() {
  if (!$('.sidebar-toggle').hasClass('on')) {
    $('.sidebar-toggle').addClass('on');
    $('.sidebar').css("animation", "slideIn .5s ease-out forwards");
    $('.sidebar-overlay').show();
    $('.sidebar-overlay').css("animation", "slideIn .5s ease-out forwards");
    $('.top').css("animation", "slideIn .5s ease-out forwards");
    margin = ($('.top').css("margin-left"));
    left = $('.sidebar-toggle-wrapper').css("left");
    $('#sidebar-toggle-wrapper').css("animation", "toggleAnim .5s ease-out forwards");
    $('#text-toggle').html("Hide History")
    $('.bottom').css("opacity", "1");
    setTimeout(function() {
      left2 = $('#sidebar-toggle-wrapper').css("left");
      $('.sidebar').css("margin-left", "0px");
      $('.sidebar').css("animation", "");
      $('.sidebar-overlay').css("margin-left", "0px");
      $('.sidebar-overlay').css("animation", "");
      $('.top').css("animation", "");
      $('.top').css("margin-left", "0px");
      $('#sidebar-toggle-wrapper').css("left", left2);
      $('#sidebar-toggle-wrapper').css("animation", "");
    }, 500);
  } else {
    $('.sidebar-toggle').removeClass('on');
    $('.sidebar').css("animation", "slideOut .5s ease-out forwards");
    $('.sidebar-overlay').css("animation", "slideOut .5s ease-out forwards");
    $('.top').css("animation", "slideOut .5s ease-out forwards");
    $('#sidebar-toggle-wrapper').css("animation", "toggleAnimOff .5s ease-out forwards");
    $('#text-toggle').html("Show History")
    $('.sidebar-overlay').css("opacity", "inherit");
    $('.top').css("opacity", "inherit");
    setTimeout(function() {
      left2 = $('#sidebar-toggle-wrapper').css("left");
      $('.sidebar').css("animation", "");
      $('.sidebar').css("margin-left", margin);
      $('.sidebar-overlay').css("animation", "");
      $('.sidebar-overlay').css("margin-left", margin);

      $('.top').css("animation", "");
      $('.top').css("margin-left", margin);

      $('#sidebar-toggle-wrapper').css("animation", "");
      $('#sidebar-toggle-wrapper').css("left", left2);
    }, 500);
  }
}

function checkPass(pass) {
  let passReg = /^[A-Z]+$/i;
  if(passReg.test(pass)) {
    $.ajax({
      url: "checkPass.php",
      type: "GET",
      data: {
        pass: pass,
      },
      cache: false,
      success: function(response) {
        if(response) {
          loadPage();
          $('#password').val('');
        } else {
        }
      },
      error: function() {
        $('#message').html('Error');
      }
    });
  }
}

// checks whether input is a youtube link
function checkLink(videoLink) {
  if(videoLink.indexOf("youtube.com/watch?v=") >= 0 || videoLink.indexOf("youtu.be/") >= 0) {
    return true;
  } else {
    return false;
  }
}

// animates toggling the featured video
function toggleVideo() {
  if($('#featured').hasClass('toggled')) {
    $('#form-overlay-wrapper').animate({maxHeight: 0}, 500);
    $('#link-form').animate({opacity: 0}, 200);
    $('#featured').css('animation', 'toggleFeaturedOn 1s ease forwards');
    $('#main-title-wrapper').animate({maxHeight: 0}, 500);
    $('#main-title').animate({opacity: 0}, 200);
    setTimeout(function() {
      $('#featured').css('max-height', 'inherit');
      $('#featured').css('opacity', '1');
      $('#featured').css('margin-bottom', '20px');
      setTimeout(function() {
        $('#featured').css("animation", "none");
      }, 50);
    }, 1000);
    $('#featured').removeClass('toggled');
  } else {
    $('#form-overlay-wrapper').animate({maxHeight: 200}, 500);
    $('#link-form').animate({opacity: 1}, 500);
    $('#featured').css('animation', 'toggleFeaturedOff 1s ease forwards');
    $('#main-title-wrapper').animate({maxHeight: "200px"}, 500);
    setTimeout(function() {
      $('#main-title').animate({opacity: 1}, 500);
    }, 300);
    setTimeout(function() {
      $('#featured').css("animation", "none");
      $('#featured').css('max-height', '0');
      $('#featured').css('opacity', '0');
      $('#featured').css('margin-bottom', '0');

    }, 1000);
    $('#featured').addClass('toggled');
  }
}

// gets video ID from link
function getID(videoLink) {
  let id;
  if(videoLink.indexOf("youtube.com/watch?v=") >= 0) {
    id = videoLink.substr(videoLink.indexOf("=")+1, 11);
  } else {
    id = videoLink.substr(videoLink.indexOf("be/")+3, 11);
  }
  if (id.length != 11 || !id.match(/^[a-z0-9\-_]+$/i))
  {
    id = false;
  }
  return id;
}

function switchBg(id) {
  $(".underlay-change").css('background', 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 1)), url("https://'+ getThumbnail(id) +'") no-repeat');
  $(".underlay-change").css('background-size', 'cover');
  $(".underlay-change").css('animation', 'switchBg2 1s ease forwards');
  $(".underlay-change").css('background-position', 'center');
  $(".underlay").css('animation', 'switchBg1 1s ease forwards');
  setTimeout(function() {
    $(".underlay").css('background', 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 1)), url("https://'+ getThumbnail(id) +'") no-repeat');
    $(".underlay").css("animation", "");
    $(".underlay-change").css("animation", "");
    $(".underlay").css('background-size', 'cover');
    $(".underlay").css('background-position', 'center');
  }, 1000);
}


function animateControls(imgId) {
  if($('#'+imgId).hasClass('toggle')) {
    if($('#'+imgId).hasClass('off')) {
      $('#'+imgId+"Glitched").css('animation', 'glitchIcon .5s ease');
      setTimeout(function() {
        $('#'+imgId+"Glitched").css('background-image', 'url("img/' + imgId + '2glitch.png")');
        $('#'+imgId).css('background-image', 'url("img/' + imgId + '2.png")');
        $('#'+imgId+"Glitched").css("animation", "");
        $('#'+imgId).css("animation", "");
        $('#'+imgId).removeClass('off');
        $('#'+imgId).addClass('on');
      }, 500);
    } else {
      $('#'+imgId+"Glitched").css('animation', 'glitchIcon2 .5s ease');
      setTimeout(function() {
        $('#'+imgId+"Glitched").css('background-image', 'url("img/' + imgId + 'glitch.png")');
        $('#'+imgId).css('background-image', 'url("img/' + imgId + '.png")');
        $('#'+imgId+"Glitched").css("animation", "");
        $('#'+imgId).css("animation", "");
        $('#'+imgId).removeClass('on');
        $('#'+imgId).addClass('off');
      }, 500);
    }
  } else {
    $('#'+imgId+"Glitched").css('animation', 'glitchIcon .5s ease');
    setTimeout(function() {
      $('#'+imgId+"Glitched").css("animation", "");
    }, 500);
  }
}

// converts id into thumbnail link
function getThumbnail(videoId) {
  let thumbnail = "i3.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
  return thumbnail;
}

// play or loads a new random video from database
function getRandomVideo(isAutoplay) {
  let id;
  $.ajax({
    type: "GET",
    url: "loadrandom.php",
    dataType: "html",
    success: function(response){
      let objectData = response.split(/;/);
      let link = objectData[0];
      id = objectData[1];
      let title = objectData[2];
      let thumbnail = "https://" + objectData[3];
      let date = objectData[4];
      if (isAutoplay) {
        player.loadVideoById(id);
        switchBg(id);
      } else {
        player.cueVideoByUrl("http://www.youtube.com/v/"+id+"?version=3", 0);
        $(".underlay").css('background', 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 1)), url("https://'+ getThumbnail(id) +'") no-repeat');
        $(".underlay").css('background-size', 'cover');
        $(".underlay").css('background-position', 'center');
        $(".underlay").css('background-repeat', 'no-repeat');
      }
      getTitleFromId(id);
    },
    error: function(response){
      return "error";
    }
  });
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('featured', {
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};


function onPlayerReady(e) {
  checkAuth();
}


function onPlayerStateChange(e) {
  switch (e.data) {
    case 0:
    getRandomVideo(true);
    break;
    case 1:
    if($('#playPause').hasClass('off')) {
      animateControls("playPause");
    }
    break;
    case 2:
    animateControls("playPause");
    break;
    default:
    break;
  }
}


$(document).ready(function() {
  Pusher.logToConsole = true;

  var pusher = new Pusher('2fc153e44bf8f29c4735', {
    cluster: 'eu'
  });

  var channel = pusher.subscribe('my-channel');
  channel.bind('my-event', function() {
    fetchNewContent();
  });
  animateLogo();

  logo = setInterval(function(){
    animateLogo();
  }, 2080);

  // loads clicked thumbnail as video
  $('.sidebar').on('click', '.thumbnail', function(e) {
    e.preventDefault();
    link = $(this).parent('a').attr('href');
    id=getID(link);
    switchBg(id);
    if(!$("#playPause").hasClass('off')) {
      $("#playPause").addClass('off');
    }
    getTitleFromId(id);
    player.loadVideoById(id);
  });

  $('.sidebar-toggle').click(function() {
    sidebarAnim();
  });

  // tries to authenticate when password field reaches matching length
  $('#password').keyup(function() {
    let input = $('#password').val();
    if($('#password').val().length == 11) {
      checkPass(input);
    }
  });

  // fires when something is submitted, calls post function
  $('#link-form').on('submit', function(e) {
    e.preventDefault();
    let link = $('#link').val();
    postData(link);
  });


  $('#pass-form').on('submit', function(e) {
    e.preventDefault();
    checkPass($('#password').val());
  });

  // animate top and bottom scrollbar overlay
  $('.sidebar').scroll(function() {
    let y = $('.sidebar').scrollTop();
    if (y > 120) {
      $('.top').show();
      $('.top').css("animation", "fadeEffectIn 0.5s ease forwards");
    } else if(y < 150){
      $('.top').css("animation", "fadeEffectOut 0.5s ease forwards");
      if(y < 10) {
        $('.top').hide();
      }
    }
    if(y >= ($('.sidebar')[0].scrollHeight - $('.sidebar').height()) - 150) {
      $('.bottom').css("animation", "fadeEffectOut 0.5s ease forwards");
      setTimeout(function(){
        $('.bottom').css("opacity", "0");
      }, 500);
    } else if (y < ($('.sidebar')[0].scrollHeight - $('.sidebar').height()) - 150){
      if($('.bottom').css("opacity") == 0) {
        $('.bottom').css("animation", "fadeEffectIn 0.5s ease forwards");
      }
    }
  });

  // controls hover animation
  $('.controls-image').hover(function(){
    let id = $(this).attr('id');
    if($(this).hasClass('on')) {
      $(this).css('background-image', 'url("img/' + id + '2glitch.png")');
    } else {
      $(this).css('background-image', 'url("img/' + id + 'glitch.png")');
    }
  }, function() {
    let id = $(this).attr('id');
    if($(this).hasClass('on')) {
      $(this).css('background-image', 'url("img/' + id + '2.png")');
    } else {
      $(this).css('background-image', 'url("img/' + id + '.png")');
    }
  });

  // controls switch case
  $('.controls-image').click(function() {
    let id = $(this).attr('id');
    switch (id.toString()) {
      case "playPause":
      if($("#"+id).hasClass('off')) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
      break;
      case "next":
      getRandomVideo(true);
      if($("#playPause").hasClass('on')) {
        animateControls("playPause");
      }
      break;
      case "screen":
      toggleVideo();
      break;
      case "cancel":
      sidebarAnim();
      break;
      default:
    }
    animateControls(id);
  });
});
