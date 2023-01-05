;(function () {
  alert(1)

  const id = window.advend
  fetch("https://advend.vercel.app/api/v1/domains/" + id)
    .then(async function (response) {
      const json = await response.json()
      console.log(json)

      const banner = document.createElement("div")
      banner.id = "advend-banner"
      banner.style.position = "fixed"
      banner.style.bottom = "0"
      banner.style.right = "0"
      banner.style.width = "300px"
      banner.style.background = "#ffffff"
      banner.style.borderTop = "1px solid #000000"
      banner.style.borderLeft = "1px solid #000000"
      banner.innerText = "Ads"
      document.body.appendChild(banner)
    })
    .catch(function (error) {
      console.error(error)
    })
})()
