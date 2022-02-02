const CryptoManager = {
  coins: [],
  toggledCoins: [],
  infoCoins: [],

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

  fetchCoinFromCache(coinID) {
    return this.infoCoins.find((coin) => coin.id === coinID);
  },

  findCoin(id) {
    return this.coins.find((coin) => id === coin.id);
  },

  findCoinIndex(id) {
    return this.coins.findIndex((coin) => id === coin.id);
  },

  findToggledCoin(id) {
    return this.toggledCoins.find((coin) => id === coin.id);
  },

  findCachedCoin(id) {
    return this.infoCoins.find((coin) => id === coin.id);
  },

  async addCoin(id) {
    const exist = this.findToggledCoin(id);
    if (exist) return;
    const toggledCoin = this.findCoin(id);
    this.toggledCoins.push(toggledCoin);
    const res = await this.fetchCoinByID(toggledCoin.id);
    this.toggledCoins[this.toggledCoins.length - 1] = res;
    this.saveLSToggledCoins();
  },

  removeCoin(id) {
    const exist = this.findToggledCoin(id);
    if (!exist) return;
    const toggledCoin = this.findCoin(id);
    this.toggledCoins = this.toggledCoins.filter(
      (coin) => coin.id !== toggledCoin.id
    );
    this.coinToggled();
  },

  saveLSToggledCoins() {
    saveLS("toggled-coins", this.toggledCoins);
    this.$coins.next();
  },
  coinToggled() {
    this.saveLSToggledCoins();
  },

  addCoinToCache(coin) {
    this.infoCoins.push(coin);
    saveLS("info-coins", this.infoCoins);
  },

  $coins: new rxjs.Subject(),
};

$("document").ready(() => {
  if (!getLS("coins")) CryptoManager.fetchCoins();
  else {
    CryptoManager.coins = getLS("coins");
  }

  if (getLS("toggled-coins"))
    CryptoManager.toggledCoins = getLS("toggled-coins");

  if (getLS("info-coins")) CryptoManager.infoCoins = getLS("info-coins");
});
