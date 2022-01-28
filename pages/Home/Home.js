setPageTitle("Home");

function drawCoinsCards() {
  let cards = "";
  getLS("coinsList").map((coin, index) => {
    cards += `
        <div class="col-md-4 mb-4">
            <div class="card">
            <div class="card-body">
                <h5 class="card-title">${coin.name}</h5>
            </div>
            <div class="card-footer">
                <a href="" target="_blank" class="btn btn-primary">MORE INFO</a>
            </div>
            </div>
        </div>
        `;
  });
  $("#coins-row").html(cards);
}
drawCoinsCards();
