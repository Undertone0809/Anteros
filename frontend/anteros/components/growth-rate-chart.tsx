"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, useCallback } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { PredictionMarketState, getHistoricalDataForTimeframe } from "@/app/mocks/prediction-market-data"
import { getSpotPrice } from "@/app/services/contractService"
import dynamic from 'next/dynamic'
import { Chart as ChartJS, ChartData, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { TooltipItem } from 'chart.js'
import { motion } from "framer-motion"

const LineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
)

// Dynamically import Chart.js components
const initChartJS = async () => {
  const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } = await import('chart.js')
  const zoomPlugin = (await import('chartjs-plugin-zoom')).default

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
  )
}

interface GrowthRateChartProps {
  marketState: PredictionMarketState
}

// Calculate growth rate between two points
const calculateGrowthRate = (current: number, previous: number): number => {
  return ((current - previous) / previous) * 100;
};

// Calculate growth rates for a series of values
const calculateGrowthRates = (data: { timestamp: string; odds: number }[]): { timestamp: string; rate: number }[] => {
  const rates: { timestamp: string; rate: number }[] = [];

  for (let i = 1; i < data.length; i++) {
    const rate = calculateGrowthRate(data[i].odds, data[i - 1].odds);
    rates.push({
      timestamp: data[i].timestamp,
      rate: rate,
    });
  }

  return rates;
};

const LoadingAnimation = () => {
  return (
    <div className="h-[400px] flex flex-col items-center justify-center gap-4">
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-primary"
            animate={{
              y: ["0%", "-50%", "0%"],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Loading market data...
      </motion.div>
    </div>
  )
}

export default function GrowthRateChart({ marketState }: GrowthRateChartProps) {
  const [isClient, setIsClient] = useState(false)
  const [timeframe, setTimeframe] = useState<PredictionMarketState["timeframe"]>(marketState.timeframe)
  const [chartType, setChartType] = useState<"growth" | "odds">("growth")
  const [chartInstance, setChartInstance] = useState<ChartJS | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liveSpotPrices, setLiveSpotPrices] = useState<{ [key: string]: number }>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Initialize chart.js
  useEffect(() => {
    const init = async () => {
      await initChartJS()
      setIsClient(true)
    }
    init()
  }, [])

  // Fetch live spot prices
  const fetchSpotPrices = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const prices: { [key: string]: number } = {}

      // Fetch prices for each option
      for (const option of Object.keys(marketState.options)) {
        prices[option] = await getSpotPrice(option)
      }

      setLiveSpotPrices(prices)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch spot prices:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [marketState.options])

  // Initial price fetch
  useEffect(() => {
    fetchSpotPrices()

    // Refresh prices every 10 seconds
    const interval = setInterval(fetchSpotPrices, 10000)
    return () => clearInterval(interval)
  }, [fetchSpotPrices])

  // Get historical data for the selected timeframe
  const historicalData = {
    altman: getHistoricalDataForTimeframe(timeframe, marketState.options.altman.historicalOdds || []),
    musk: getHistoricalDataForTimeframe(timeframe, marketState.options.musk.historicalOdds || []),
    trump: getHistoricalDataForTimeframe(timeframe, marketState.options.trump.historicalOdds || []),
  }

  // Update latest data point with real-time spot price if available
  useEffect(() => {
    if (Object.keys(liveSpotPrices).length > 0 && historicalData.altman.length > 0) {
      // Deep clone to avoid modifying the original data
      const updatedData = { ...historicalData }

      // Update the last data point for each option with live price
      Object.keys(updatedData).forEach(key => {
        if (liveSpotPrices[key] && updatedData[key as keyof typeof updatedData].length > 0) {
          const dataArray = [...updatedData[key as keyof typeof updatedData]]
          dataArray[dataArray.length - 1] = {
            ...dataArray[dataArray.length - 1],
            odds: liveSpotPrices[key]
          }
          updatedData[key as keyof typeof updatedData] = dataArray
        }
      })
    }
  }, [liveSpotPrices, historicalData])

  // Calculate growth rates
  const growthRates = {
    altman: calculateGrowthRates(historicalData.altman),
    musk: calculateGrowthRates(historicalData.musk),
    trump: calculateGrowthRates(historicalData.trump),
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const pad = (n: number) => n.toString().padStart(2, '0')

    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const day = pad(date.getDate())
    const month = pad(date.getMonth() + 1)
    const year = date.getFullYear()

    switch (timeframe) {
      case "24h":
        return `${hours}:${minutes}`
      case "7d":
        return `${year}/${month}/${day} ${hours}:${minutes}`
      default:
        return `${year}/${month}/${day}`
    }
  }

  const handleResetZoom = () => {
    if (chartInstance) {
      chartInstance.resetZoom?.()
    }
  }

  const data = {
    labels: chartType === "growth"
      ? growthRates.altman.map(point => formatTimestamp(point.timestamp))
      : historicalData.altman.map(point => formatTimestamp(point.timestamp)),
    datasets: [
      {
        label: "Altman",
        data: chartType === "growth"
          ? growthRates.altman.map(point => point.rate)
          : historicalData.altman.map(point => point.odds),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
        pointRadius: 1,
        borderWidth: 2,
      },
      {
        label: "Musk",
        data: chartType === "growth"
          ? growthRates.musk.map(point => point.rate)
          : historicalData.musk.map(point => point.odds),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.4,
        pointRadius: 1,
        borderWidth: 2,
      },
      {
        label: "Trump",
        data: chartType === "growth"
          ? growthRates.trump.map(point => point.rate)
          : historicalData.trump.map(point => point.odds),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
        pointRadius: 1,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: chartType === "growth" ? "Growth Rate Comparison (%)" : "Historical Odds",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x' as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            const value = tooltipItem.parsed.y;
            if (chartType === "growth") {
              return `${tooltipItem.dataset.label || ''}: ${value.toFixed(2)}%`;
            }
            return `${tooltipItem.dataset.label || ''}: ${value.toFixed(3)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category' as const,
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: chartType === "growth" ? "Growth Rate (%)" : "Odds",
        },
        min: chartType === "growth" ? -5 : 1.0,
        max: chartType === "growth" ? 5 : 5.0,
      },
    },
  }

  // Manual refresh function
  const handleRefresh = () => {
    fetchSpotPrices()
  }

  if (!isClient || isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as PredictionMarketState["timeframe"])}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={(value) => setChartType(value as "growth" | "odds")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="growth">Growth Rate</SelectItem>
              <SelectItem value="odds">Absolute Odds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleResetZoom}>
            Reset Zoom
          </Button>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-2">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {Object.entries(marketState.options).map(([name, data]) => (
            <Card key={name} className={`border-l-4 ${name === 'altman' ? 'border-l-[rgb(75,192,192)]' :
              name === 'musk' ? 'border-l-[rgb(53,162,235)]' :
                'border-l-[rgb(255,99,132)]'
              }`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{name}</p>
                  <p className="text-2xl font-bold">
                    {liveSpotPrices[name] ? liveSpotPrices[name].toFixed(2) : data.odds.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <p className={data.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                    {(data.priceChange24h * 100).toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="h-[400px] relative">
        <LineChart
          options={options}
          data={data}
          plugins={[{
            afterInit: (chart) => {
              setChartInstance(chart)
            }
          }]}
        />
      </div>
    </div>
  )
}
