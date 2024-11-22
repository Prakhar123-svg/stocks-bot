"use client"

import { Header } from "@/components/Header";
import { MarketTrendsDisplay } from "@/components/MarketTrendDisplay";
import { StockDetailsCard } from "@/components/StockDetailCard";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import axios from "axios";


const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY

export default function Page() {
  useCopilotAction({
    name: "fetchStockDetails",
    description: "give details of a particular stock",
    parameters: [
      {
        name: "symbol",
        type: "string",
        description: "symbol of a particular stock",
        required: true,
      },
    ],

    handler:  async ({ symbol }) => {
      try {
        const response = await axios.get(`https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=1min&apikey=${apiKey}&source=docs`);
        return response.data
    } catch (error) {
        console.log(error);
        return;
    }
    }, 

    render: ({ status, result }) => {
       if (status === "complete") {
        return (
         
          <div className="w-[600px]">
            <StockDetailsCard stockMeta={result.meta} stocksValue={result.values}/>
            <MarketTrendsDisplay marketData={result.values} />
          </div>
        );
      }
      return <></>; 
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CopilotChat
          labels={{
            title: "Your Assistant",
            initial: "Hii, Just type the symbol of the stock which you want to know about",
          }}
        />
      </main>
    </div>
  );
}