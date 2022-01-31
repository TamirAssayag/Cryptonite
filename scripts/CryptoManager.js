const CryptoManager = {
  coins: [],
  toggledCoins: [],
  toggle: false,

  async fetchCoins() {
    try {
      const response = await $.ajax(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      response.map((res, i) => {
        if (i <= 100) {
          this.coins.push(res);
        }
      });
      saveLS("coins", this.coins);
    } catch (error) {
      console.log(error);
    }
  },

  fetchCoinByID(coinID) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinID}`;
    return $.ajax(url);
  },

  findCoin(id) {
    return this.coins.find((coin) => id === coin.id);
  },

  findCoinIndex(id) {
    return this.coins.findIndex((coin) => id === coin.id);
  },

  findSelectedCrypto(id) {
    return this.toggledCoins.find((coin) => id === coin.id);
  },

  toggleCoin() {
    this.toggle = !this.toggle;
  },

  async addCoin(id) {
    const exist = this.findSelectedCrypto(id);
    if (exist) return;
    const toggledCoin = this.findCoin(id);
    this.toggledCoins.push(toggledCoin);
    const res = await this.fetchCoinByID(toggledCoin.id);
    this.toggledCoins[this.toggledCoins.length - 1] = res;
    saveLS("toggled-coins", this.toggledCoins);
  },

  removeCoin(id) {
    const exist = this.findSelectedCrypto(id);
    if (!exist) return;
    const toggledCoin = this.findCoin(id);
    this.toggledCoins = this.toggledCoins.filter(
      (coin) => coin.id !== toggledCoin.id
    );
    this.coinToggled();
  },

  coinToggled() {
    saveLS("toggled-coins", this.toggledCoins);
  },
};

$("document").ready(() => {
  if (getLS("coins")) {
    CryptoManager.coins = getLS("coins");
  } else {
    CryptoManager.fetchCoins();
  }

  if (getLS("toggled-coins")) {
    CryptoManager.toggledCoins = getLS("toggled-coins");
  } else {
    CryptoManager.toggledCoins = [];
  }
});
