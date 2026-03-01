import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

console.log("Hello from Webpack + Bootstrap!");

const button = document.getElementById("myButton");
button?.addEventListener("click", () => {
  alert("Button clicked!");
});
