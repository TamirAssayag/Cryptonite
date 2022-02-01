function render() {
  let cards = "";
  CryptoManager.coins.map((coin, index) => {
    const { name, symbol, id } = coin;
    cards += `
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
                <label class="switch">
                    <input type="checkbox" id="${id}" />
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
    </div>
    `;
  });
  $("#coins-row").html(cards);
}

render();

$("input[type=checkbox]").map((index, el) => {
  const switchElement = $(`#${el.id}`);
  switchElement.click((e) => {
    const { checked } = e.target;
    if (checked) {
      CryptoManager.addCoin(el.id);
    } else {
      CryptoManager.removeCoin(el.id);
    }
  });
  return el;
});

function getAllCheckedCoins() {
  CryptoManager.toggledCoins.forEach((coin, index) => {
    $(`input#${coin.id}`).prop("checked", true);
  });
}

$(".info-btn").each((index, el) => {
  // add click event to el
  $(el).click((e) => {
    const { id } = e.target.dataset;
    const coinData = CryptoManager.fetchCoinByID(id);
    try {
      coinData.then((res) => {
        renderModal(id, res);
      });
    } catch (error) {
      console.log(error);
    }
  });
});

const renderModal = (id, res) => {
  $(".modal").attr("id", `modal-${id}`); // Settings modal id to modal in the DOM
  const modalTitle = $(`.modal-header`);
  const modalBody = $(`#modal-${id} .modal-body`);
  const modalFooter = $(`#modal-${id} .modal-footer`);
  $(`#modal-${id}`).modal("show");
  modalTitle.html(`
      <div class="d-flex align-items-center gap-1">
          <img src="${res.image.thumb}"></img>
          <h4 class="mb-0">${id} (${res.symbol.toUpperCase()})</h4>
      </div>
  `);
  modalBody.html(`
     <h1>
      $${res.market_data.current_price.usd.toLocaleString()}
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
};

$("document").ready(() => {
  getAllCheckedCoins();
});
