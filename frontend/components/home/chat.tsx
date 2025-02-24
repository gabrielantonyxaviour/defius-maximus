import { CircleDashedIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useEnvironmentStore } from "../context";
import { ExecutedTrade } from "@/types";
import { CountdownTimer } from "../countdown-timer";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chat({
  close,
  selectedTradeId,
}: {
  selectedTradeId: string;
  close: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { actions } = useEnvironmentStore((store) => store);
  const [selectedTrade, setSelectedTrade] = useState<
    ExecutedTrade | undefined
  >();

  useEffect(() => {
    if (actions.length > 0) {
      console.log(actions);
      console.log(selectedTradeId);
      const trade = actions.find((trade) => trade.id === selectedTradeId);
      console.log(trade);
      setSelectedTrade(trade);
    }
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Hello! I'm your AI assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-[700px] h-[700px] absolute top-[16%] left-[32%] bg-[#1F1F1F] rounded-sm">
      <div
        onClick={() => {}}
        className={`absolute flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#1F1F1F] text-white`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 font-bold text-lg">Chick Chat</p>
          <X className="cursor-pointer" onClick={close} />
        </div>
        {selectedTrade && (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b-2 border-black sticky top-0 bg-[#1F1F1F]">
                <th className="py-3 font-bold text-center">Asset</th>
                <th className="py-3 font-bold text-center">Amount (USDT)</th>
                <th className="py-3 font-bold text-center">Chef</th>
                <th className="py-3 font-bold text-center">Timeframe</th>
                <th className="py-3 font-bold text-center">Status</th>
                <th className="py-3 font-bold text-center">PNL (USDT)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                key={selectedTrade.id}
                className="border-b border-black/20 hover:bg-[#1F1F1F]/5"
              >
                <td
                  className="py-4 text-center font-mono cursor-pointer"
                  onClick={() => {
                    window.open("https://arbiscan.io/" + "", "_blank");
                  }}
                >
                  {selectedTrade.trade_play.asset}
                </td>
                <td className="py-4 text-center">{selectedTrade.amount}</td>
                <td className="py-4 text-center">
                  {selectedTrade.trade_play.chef?.user_id}
                </td>
                <td className="py-4 text-center">
                  {" "}
                  <CountdownTimer
                    createdAt={
                      selectedTrade.created_at
                        ? selectedTrade.created_at
                        : new Date().toISOString()
                    }
                    timeframe={
                      selectedTrade.trade_play.timeframe
                        ? parseInt(selectedTrade.trade_play.timeframe)
                        : 0
                    }
                  />
                </td>
                <td className="py-4 text-center">{selectedTrade.status}</td>
                <td className="py-4 text-center">
                  {selectedTrade.pnl_usdt ? selectedTrade.pnl_usdt : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {!selectedTrade ? (
          <div className="w-full flex justify-center pt-12">
            <CircleDashedIcon className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col h-[540px] w-full px-6">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 text-white rounded-lg ${
                        message.sender === "user"
                          ? "bg-[#BF4317] "
                          : "bg-[#BF4317] "
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-300">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-[#BF4317] hover:bg-[#BF4317]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
