function renderCard() {
  const cards = CryptoManager.coins.reduce((oldCards, { name, symbol, id }) => {
    const cardEl = $(`
      <div class="col-md-4">
          <div class="card p-3 mb-2">
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
              <div class="card-footer">
                  <button type="button" class="btn btn-dark info-btn" data-toggle="modal" data-target="#modal-${id}" data-id="${id}">More Info</button>

                  <div class="switch-placeholder"></div>
              </div>
          </div>
      </div>
    `);

    SwitchComponent(id, cardEl);

    oldCards.push(cardEl);

    return oldCards;
  }, []);

  $("#coins-row").html(cards);
}

renderCard();

$(".info-btn").each((index, el) => {
  // add click event to el
  $(el).click((e) => {
    const { id } = e.target.dataset;
    try {
      const cachedCoinedExist = CryptoManager.findCachedCoin(id);

      if (!cachedCoinedExist) {
        const coinData = CryptoManager.fetchCoinByID(id);

        coinData.then((res) => {
          CryptoManager.addCoinToCache(res);
          progressBar(coinData.readyState);
          renderModal(id, res);
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
    switchEl.attr(
      "class",
      classNames("switch", { toggled: !!foundToggledCoin })
    );

    switchEl.find("input").prop("checked", !!foundToggledCoin);
  };

  const setListeners = () => {
    switchEl.find("input").change((e) => {
      const checked = e.target.checked;
      if (checked) CryptoManager.addCoin(id);
      else CryptoManager.removeCoin(id);
    });
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

    parent.find(".switch-placeholder").replaceWith(switchEl);
  };

  render();

  const sub = CryptoManager.$coins.subscribe((res) => {
    foundToggledCoin = CryptoManager.findToggledCoin(id);

    if (switchEl) {
      setAttrs();
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

        <div class="switch-placeholder">  </div>

      </div>
  `);

  SwitchComponent(id, modalTitleHtml);
  modalTitle.html(modalTitleHtml);

  modalBody.html(`
     <h1>
      $${res.market_data.current_price.usd?.toLocaleString()}
    </h1>
    <span>
      <u>
        Current Market Prices:
      </u>
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
    <h5>
      Description:
    </h5>
    <p>
      ${
        res.description.en.length
          ? res.description.en
          : "No description available"
      }
    </p>
    
  `);
}
