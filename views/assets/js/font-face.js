var linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "https://fonts.googleapis.com/css?family=Trirong";
document.head.appendChild(linkElement);

// חיכי לטעינת הגופן ואז הגדרת הגופן ב-CSS
linkElement.onload = function() {
  var style = document.createElement("style");
  style.type = "text/css";
  style.textContent = `
    body {
      font-family: 'Trirong', sans-serif;
    }
  `;
  document.head.appendChild(style);
};