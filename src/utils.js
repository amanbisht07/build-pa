import Cookies from "js-cookie";
import moment from "moment";

// For optimized api call for onChange
export const debounce = (func, delay = 500) => {
  let timer;
  return function () {
    const context = this;
    let args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, delay);
  };
};

// To clear cookies from browser
export const clearCookie = () => {
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    if (cookieName !== "i18next" && cookieName !== "theme") {
      Cookies.remove(cookieName);
    }
  });
};

// To handle error which is not understandable to user like proxy , kafkar , minio error and so on..
export const handleError = (err) => {
  let type = typeof err == "string";
  if (type) {
    if (err.includes("Proxy")) {
      if(!navigator.onLine){
        return "CAN NOT MAKE REQUEST PLEASE CONNECT TO INTERNET";
      }
      else{
        return "CAN NOT MAKE REQUEST SERVER IS NOT AVAILABLE";
      }
    } else {
      return err;
    }
  } else {
    return "Internal Server Error";
  }
};

export function isMobile() {
  if (window) {
    return window.matchMedia(`(max-width: 767px)`).matches;
  }
  return false;
}

export function isTablet() {
  if (window) {
    return window.matchMedia(`(max-width: 1000px)`).matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia(`(max-width: 1199px)`).matches;
  }
  return false;
}

function currentYPosition() {
  if (!window) {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  var elm = document.getElementById(elmID);
  if (!elmID || !elm) {
    return;
  }
  var startY = currentYPosition();
  var stopY = elmYPosition(elm);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  let difference =
    moment(new Date(), "DD/MM/YYYY HH:mm:ss").diff(
      moment(date, "DD/MM/YYYY HH:mm:ss")
    ) / 1000;

  if (difference < 60) return `${Math.floor(difference)} seconds`;
  else if (difference < 3600) return `${Math.floor(difference / 60)} minutes`;
  else if (difference < 86400) return `${Math.floor(difference / 3660)} hours`;
  else if (difference < 86400 * 30)
    return `${Math.floor(difference / 86400)} days`;
  else if (difference < 86400 * 30 * 12)
    return `${Math.floor(difference / 86400 / 30)} months`;
  else return `${(difference / 86400 / 30 / 12).toFixed(1)} years`;
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  var params = {};
  var search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf("?") + 1)
  );
  var definitions = search.split("&");
  definitions.forEach(function (val, key) {
    var parts = val.split("=", 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(" ");
}
