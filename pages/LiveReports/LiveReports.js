(() => {
  let chartObj = null;

  const CHART_COLORS = (alpha = 1) => [
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 206, 86, ${alpha})`,
    `rgba(75, 192, 192, ${alpha})`,
    `rgba(153, 102, 255, ${alpha})`,
    `rgba(255, 159, 64, ${alpha})`,
  ];

  function render() {
    let ctx = document.getElementById("cryptoChart").getContext("2d");
    chartObj = new Chart(ctx, {
      type: "line",
      data: generateChartData(),
      options: {
        aspectRatio: !isMobile ? 16 / 9 : 1 / 1,
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: `${CryptoManager.toggledCoins.length} Selected Coins`,
            color: "black",
          },
          subtitle: {
            color: "lightgrey",
          },

          legend: {
            align: "start",
            color: "black",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            ticks: {
              callback: (value) => {
                return `${value}$`;
              },
            },
          },
        },
      },
    });
    setInterval(autoFetch, 2000);
  }

  async function autoFetch() {
    // prettier-ignore
    const coinsInString = CryptoManager.toggledCoins.map((coin) => coin.id).join(",");
    const coinPrices = await CryptoManager.fetchToggledCoinsPrices(
      coinsInString
    );
    updateChart(coinPrices);
  }

  function updateChart(priceObj) {
    chartObj.data.labels.push(dayjs().format("hh:mm:ss"));
    chartObj.data.datasets.forEach((dataset) => {
      const id = CryptoManager.findByName(dataset.label).id;
      const price = priceObj[id]?.usd;
      dataset.data.push(price);
    });
    chartObj.update();
  }

  function generateChartData() {
    const labels = CryptoManager.toggledCoins.map(() =>
      dayjs().format("hh:mm:ss")
    );

    const datasets = CryptoManager.toggledCoins.map((coin, index) => {
      return {
        label: coin.name,
        data: [0], // Starts at 0 and pushes PRICE to the data array after 2 seconds
        borderColor: CHART_COLORS()[index],
        backgroundColor: CHART_COLORS(0.5)[index],
      };
    });

    return {
      labels,
      datasets,
    };
  }

  render();
})();
