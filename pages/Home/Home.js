(() => {
  const searchResultEl = $(".search-results");
  const searchInput = $("#search-input");
  const errorMessageDiv = $("#error-message");

  function renderCard() {
    // prettier-ignore
    const cards = CryptoManager.coins.reduce((oldCards, { name, symbol, id }) => {
        const cardEl = $(`
      <div class="col-md-4">
          <div class="card card-coin p-3 mb-2">
              <div class="card-body">
                  <div class="d-flex justify-content-between">
                      <div class="d-flex flex-row align-items-center">
                      <div class="ms-2 c-details">
                          <h6 class="coin-name mb-0 line-clamp">${symbol.toUpperCase()}</h6>
                      </div>
                      </div>
                      <div class="badge">
                      <i class="fas fa-coins"></i>
                      </div>
                  </div>
                  <div class="mt-3">
                      <h4 class="heading">${name}</h4>
                  </div>
              </div>
              <div class="card-footer d-flex align-items-center">
                  <button type="button" class="btn btn-dark info-btn" data-toggle="modal" data-target="#modal-${id}" data-id="${id}">More Info</button>

                  <div class="switch-placeholder"></div>
              </div>
          </div>
      </div>
    `);

        SwitchComponent(id, cardEl);

        oldCards.push(cardEl);

        return oldCards;
      },
      []
    );

    $("#coins-row").html(cards);
  }

  renderCard();

  $(".info-btn").each((index, el) => {
    $(el).click((e) => {
      const { id } = e.target.dataset;
      try {
        const cachedCoinedExist = CryptoManager.findCachedCoin(id);

        if (!cachedCoinedExist) {
          const coinData = CryptoManager.fetchCoinByID(id);

          coinData.then((res) => {
            if (id) {
              CryptoManager.addCoinToCache(res);
              progressBar(coinData.readyState);
              renderModal(id, res);
            } else {
              showSnackBar("This coin currently have no information.", "red");
            }
          });
        } else {
          const coin = CryptoManager.fetchCoinFromCache(id);
          renderModal(id, coin);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  function SwitchComponent(id, parent) {
    let switchEl = null,
      foundToggledCoin = CryptoManager.findToggledCoin(id);

    const setAttrs = () => {
      // prettier-ignore
      switchEl.attr("class", classNames("switch", { toggled: !!foundToggledCoin }));

      switchEl.find("input").prop("checked", !!foundToggledCoin);
    };

    const setListeners = () => {
      if (!foundToggledCoin && CryptoManager.reachedMax) {
        switchEl.find("input").prop("disabled", true);
        switchEl.addClass("disabled");
        switchEl.each((i, el) => {
          $(el).click((e) => {
            if ($(e.target.parentElement).hasClass("disabled")) {
              reachedMaxToggledModal();
            }
          });
        });
      } else {
        switchEl.removeClass("disabled");
        switchEl.find("input").prop("disabled", false);
        switchEl.find("input").change((e) => {
          const checked = e.target.checked;
          if (checked) {
            CryptoManager.addCoin(id);
          } else {
            CryptoManager.removeCoin(id);
          }
        });
      }
    };

    const render = () => {
      switchEl = $(`
      <label>
        <input type="checkbox" data-id="${id}" />
        <span class="slider round"></span>
      </label>
    `);

      setAttrs();
      setListeners();

      if (switchEl.find("input").data("id")) {
        // if has no data - id we won't render it.
        parent.find(".switch-placeholder").replaceWith(switchEl);
      }
    };

    render();

    const sub = CryptoManager.$coins.subscribe(() => {
      foundToggledCoin = CryptoManager.findToggledCoin(id);
      switchEl.find("input").prop("disabled", false);
      if (switchEl) {
        setAttrs();
        setListeners();
      }
    });

    $subscribers.push(sub);
  }

  function renderModal(id, res) {
    $(".modal").attr("id", `modal-${id}`); // Settings modal id to modal in the DOM
    const modalTitle = $(`.modal-header`);
    const modalBody = $(`#modal-${id} .modal-body`);
    $(`#modal-${id}`).modal("show");

    const modalTitleHtml = $(`
      <div class="w-100 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-1 w-75">
          <img src="${res.image?.thumb}"></img>
          <div class="d-flex flex-column">
          <h5 class="mb-0">${res.symbol.toUpperCase()}</h5>
          <span class="mb-0 line-clamp">${id}</span>
          </div>
        </div>
        <div class="switch-placeholder"></div>
      </div>
  `);

    SwitchComponent(id, modalTitleHtml);
    modalTitle.html(modalTitleHtml);

    // prettier-ignore
    modalBody.html(`
     <h1>
      $${res.market_data.current_price.usd?.toLocaleString()}
    </h1>
    <span>
      <u>Current Market Prices:</u>
    </span>
    <ul>
      <li>
        <strong>USD</strong> $${res.market_data.current_price.usd?.toLocaleString()}
      </li>
      <li>
        <strong>EURO</strong> €${res.market_data.current_price.eur?.toLocaleString()}
      </li>
      <li>
        <strong>ILS</strong> ₪${res.market_data.current_price.ils?.toLocaleString()}
      </li>
    </ul>
    <hr/>
    <h5>Description:</h5>
    <p>${res.description.en.length? res.description.en: "No description available"}</p>
  `);
  }

  function searchCryptoCurrency() {
    const searchResultListEl = $(".search-results__list");
    if (errorMessageDiv.length) errorMessageDiv.empty();
    if (searchInput !== "" && searchInput.val().length) {
      searchResultListEl.empty();
      displaySearchResults(searchInput.val());
    } else {
      searchResultListEl.empty();
      searchResultEl.fadeOut(300);
    }
  }
  searchInput.on("keyup", _.debounce(searchCryptoCurrency, 300));

  function displaySearchResults(searchValue) {
    const res = CryptoManager.fetchSearchCoinResult(searchValue);
    try {
      res.then(({ coins }) => {
        if (coins.length) {
          coins.forEach((coin, index) => {
            const ulEl = $("<ul class='search-results__list'></ul>");
            const liEl = $("<li class='search-results__list-item'></li>");
            liEl.attr("data-id", coin.id);
            liEl.append(`${index + 1}. ${coin.name}`);
            ulEl.append(liEl);
            searchResultEl.append(ulEl).fadeIn(300);
            openSearchResultModal(coin.id);
          });
        } else {
          searchResultEl.hide();
          const errorEl = $(`<p class='text-danger'></p>`);
          // prettier-ignore
          const errorIcon = $(`<i class='fas fa-exclamation-triangle'></i>`);
          const errorMessage = $(`<span class='text-danger'></span>`);
          errorMessage.html(" No results found");
          errorEl.append(errorIcon, errorMessage);
          errorMessageDiv.append(errorEl);
        }
      });
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      progressBar(res.readyState);
    }
  }

  function openSearchResultModal(id) {
    $(`.search-results__list-item[data-id=${id}]`).click((e) => {
      const dataId = e.target.dataset.id;
      CryptoManager.fetchCoinByID(dataId).then((res) => {
        progressBar(res.readyState);
        CryptoManager.addCoinToList(res);
        renderModal(id, res);
        searchResultEl.fadeOut(300);
      });
    });
  }

  function reachedMaxToggledModal() {
    // prettier-ignore
    $(".modal").attr("id", `modal-toggled_coins`); // Settings modal id to modal in the DOM
    const modalTitle = $(`.modal-header`);
    const modalBody = $(`.modal-body`);
    const modalTitleHtml = $(`
            <h3>Max Amount of Coins Reached (${CryptoManager.maxToggled})</h3>
          `);
    const toggledCoins = CryptoManager.toggledCoins.reduce((oldCards, res) => {
      const modalBodyHtml = $(`
            <div class="w-100 d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-1 w-75 py-2">
                  <img src="${res.image?.thumb}" class="me-1"></img>
                  <div class="d-flex flex-column">
                  <h5 class="mb-0">${res.symbol?.toUpperCase()}</h5>
                  <span class="mb-0 line-clamp">${res?.id}</span>
                </div>
              </div>
              <div class="switch-placeholder"></div>
            </div>`);

      modalTitle.html(modalTitleHtml);
      SwitchComponent(res.id, modalBodyHtml);
      oldCards.push(modalBodyHtml);

      return oldCards;
    }, []);
    $(`#modal-toggled_coins`).modal("show");
    modalBody.html(toggledCoins);
  }

  $(document).ready(() => {
    searchResultEl.hide();
  });
})();
