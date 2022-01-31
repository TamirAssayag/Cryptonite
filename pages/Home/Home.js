const { coins, toggledCoins } = CryptoManager;

function render() {
  let cards = "";
  coins.map((coin, index) => {
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
                <button type="button" class="btn btn-dark">More Info</button>
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
  toggledCoins.forEach((coin, index) => {
    $(`input#${coin.id}`).prop("checked", true);
  });
}

$("document").ready(() => {
  getAllCheckedCoins();
});
