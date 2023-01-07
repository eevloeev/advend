;(function () {
  const API_BASE_URL = "https://advend.vercel.app/api/v1"
  function advendLog(data, level) {
    if (!data) return
    if (!level) level = "info"
    if (typeof data === "string") {
      console[level]("ADVEND_" + level.toUpperCase() + ": " + data)
    } else {
      console[level]("ADVEND_" + level.toUpperCase() + ": ", data)
    }
  }

  if (!window.advend || !window.advend.id || window.advend.inited) return

  window.advend.inited = true
  fetch(`${API_BASE_URL}/domains/${window.advend.id}`)
    .then(async function (response) {
      const { trafficOutgoing } = await response.json()

      if (trafficOutgoing) {
        // Реализовать эндпоинт для получения списка рекламирующихся сайтов
        fetch(`${API_BASE_URL}/banners?id=${window.advend.id}`)
          .then(async function (response) {
            const data = await response.json()

            if (data.length === 0) {
              advendLog("There are currently no ads to show")
            } else if (data.length > 0) {
              makeBanner(data)
            }
          })
          .catch(function (error) {
            advendLog(error, "error")
          })
      }
    })
    .catch(function (error) {
      advendLog(error, "error")
    })

  function makeBanner(data) {
    document.body.innerHTML += `
        <div
          class="advend-banner"
          style="
            position: fixed;
            bottom: 0;
            right: 0;
            width: 480px;
            max-width: 100%;
            height: 120px;
            background: linear-gradient(to top, #ccc, #888);
            box-sizing: border-box;
            color: #ffffff;
          "
        >
          <div
            style="
              position: relative;
              padding-left: 16px;
              padding-right: 16px;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: left;
              justify-content: center;
              color: inherit;
            "
          >
            <div
              class="advend-banner__toggler"
              style="
                position: absolute;
                bottom: 100%;
                right: 20px;
                background: #f4f4f4;
                cursor: pointer;
                width: 50px;
                border: 1px solid #e0e0e0;
                border-bottom: none;
                display: flex;
                align-items: center;
                justify-content: center;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
              "
            >
              <svg
                class="advend-banner__arrow"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="m7 10 5 5 5-5z"></path>
              </svg>
            </div>
            <div
              style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: inherit;
              "
            >
              <a
                class="advend-banner__title"
                href="#"
                rel="noopener noreferrer nofollow"
                target="_blank"
                style="
                  text-decoration: none;
                  color: #ffffff;
                  font-family: Arial, sans-serif;
                  font-weight: 400;
                  font-size: 24px;
                  line-height: 1.334;
                  letter-spacing: 0;
                "
                ></a
              >
            </div>
            <div style="max-height: 48px; overflow: hidden">
              <a
                class="advend-banner__description"
                href="#"
                rel="noopener noreferrer nofollow"
                target="_blank"
                style="
                  text-decoration: none;
                  color: #ffffff;
                  font-family: Arial, sans-serif;
                  font-weight: 400;
                  font-size: 16px;
                  line-height: 1.5;
                  letter-spacing: 0;
                "
                ></a
              >
            </div>
          </div>
        </div>
      `

    const banner = getRootEl()
    const toggler = getEl("toggler")
    const arrow = getEl("arrow")
    const title = getEl("title")
    const description = getEl("description")

    toggler.addEventListener("click", function () {
      const isBannerHidden = banner.style.height === "0px"
      if (isBannerHidden) {
        banner.style.height = "120px"
        arrow.style.transform = "none"
      } else {
        banner.style.height = "0px"
        arrow.style.transform = "rotate(180deg)"
      }
    })

    setData(data[0])
    ;(function () {
      if (data.length > 1) {
        let nextIndex = 1
        setInterval(function () {
          setData(data[nextIndex++])
          if (nextIndex > data.length - 1) nextIndex = 0
        }, 5000)
      }
    })()

    function getRootEl() {
      return document.querySelector(".advend-banner")
    }

    function getEl(name) {
      return document.querySelector(".advend-banner__" + name)
    }

    function setData(data) {
      title.innerText = data.title
      title.href = data.link
      description.innerText = data.description
      description.href = data.link
      banner.style.background = data.background
      banner.style.color = data.color
      title.style.color = data.color
      description.style.color = data.color
    }
  }
})()
