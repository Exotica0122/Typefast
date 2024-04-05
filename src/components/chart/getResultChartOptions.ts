export const getResultChartOptions = (max: number) => ({
  responsive: true,
  maintainAspectRatio: false,
  bezierCurve: true,
  scales: {
    x: {
      axis: "x",
      ticks: {
        autoSkip: true,
        autoSkipPadding: 20,
      },
      display: true,
      title: {
        display: false,
        text: "Seconds",
      },
    },
    y: {
      axis: "y",
      display: true,
      title: {
        display: true,
        text: "Words per Minute",
      },
      beginAtZero: true,
      min: 0,
      max: max,
      ticks: {
        autoSkip: true,
        autoSkipPadding: 20,
      },
      grid: {
        display: true,
      },
    },
  },
  plugins: {
    annotation: {
      annotations: [],
    },
    tooltip: {
      animation: { duration: 250 },
      mode: "index",
      intersect: false,
    },
    legend: {
      display: false,
    },
  },
});
