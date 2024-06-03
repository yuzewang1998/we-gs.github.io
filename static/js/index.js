window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + "/" + String(i).padStart(9, "0") + ".jpg";
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function () {
    return false;
  };
  image.oncontextmenu = function () {
    return false;
  };
  $("#interpolation-image-wrapper").empty().append(image);
}

function loadGifs() {
  // 创建 BeforeAfter 实例并在 GIF 图片加载完成后开始播放
  function createBeforeAfterWithGifs(id, gifAId, gifBId) {
    console.log(id);
    const exampleDOM = document.querySelector(id);
    const gifIds = [gifAId, gifBId];

    const promises = gifIds.map((id) => {
      return new Promise((resolve, reject) => {
        const gifDOM = document.getElementById(id);
        const src = gifDOM.getAttribute("data-src");
        const img = document.createElement("img");
        img.src = src;
        img.onload = () => {
          resolve({
            dom: gifDOM,
            src: src,
          });
        };
        img.onerror = reject;
      });
    });

    Promise.all(promises).then(async (results) => {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            const isLoaded = entry.target.dataset["loaded"];
            if (entry.isIntersecting) {
              entry.target.style.visibility = "visible";
              if (isLoaded) {
                return;
              }
              entry.target.dataset["loaded"] = true;
              results.forEach((result) => {
                // result.dom.src = result.src;
                result.dom.setAttribute("src", result.src);
              });
              new BeforeAfter({ id: id });
              // observer.unobserve(entry.target);
            } else {
              entry.target.style.visibility = "hidden";
            }
          });
        },
        {
          root: null, // 使用浏览器视窗作为视窗的根
          rootMargin: "0px",
          threshold: 0.3, // 至少1%的元素可见时触发回调
        }
      );

      observer.observe(exampleDOM);
    });
  }

  Array(12)
    .fill(null)
    .forEach((_, index) => {
      const id = index + 1;
      createBeforeAfterWithGifs(`#example${id}`, `${id}-a`, `${id}-b`);
    });
}

$(function () {
  loadGifs();

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  var options = {
    slidesToScroll: 1,
    slidesToShow: 2,
    centerMode: true, // Enable center mode
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach(".carousel", options);

  // Loop on each carousel initialized
  for (var i = 0; i < carousels.length; i++) {
    // Add listener to  event
    carousels[i].on("before:show", (state) => {
      console.log(state);
    });
  }

  // Access to bulmaCarousel instance of an element
  var element = document.querySelector("#my-element");
  if (element && element.bulmaCarousel) {
    // bulmaCarousel instance is available as element.bulmaCarousel
    element.bulmaCarousel.on("before-show", function (state) {
      console.log(state);
    });
  }

  /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
  // preloadInterpolationImages();

  $("#interpolation-slider").on("input", function (event) {
    setInterpolationImage(this.value);
  });
  setInterpolationImage(0);
  $("#interpolation-slider").prop("max", NUM_INTERP_FRAMES - 1);

  bulmaSlider.attach();
});
