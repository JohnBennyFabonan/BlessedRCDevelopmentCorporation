document.addEventListener("DOMContentLoaded", () => {
  fetch("/assets/components/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;
    })
    .catch(err => console.error("Navbar load error:", err));
});
