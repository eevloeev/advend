;(function () {
  alert(1)

  var id = window.advend
  fetch("http://localhost:3000/api/v1/domains/" + id)
    .then(function (response) {
      console.log(response)

      var banner = document.createElement("div")
      banner.style = {
        position: "fixed",
        bottom: "0",
        right: "0",
        width: "300px",
        background: "#ffffff",
        borderTop: "1px solid #000000",
        borderLeft: "1px solid #000000",
      }
      banner.innerText = "Ads"
      document.body.appendChild(banner)
    })
    .catch(function (error) {
      console.error(error)
    })
})()
