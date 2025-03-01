import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { createClient } from "@supabase/supabase-js";
import { CircleDashedIcon, X } from "lucide-react";
import { Button } from "../ui/button";

interface Log {
  id: number;
  trade_play_id: string;
  created_at: string;
  title: string;
  content: string;
  external_link: string;
  type: 0 | 1 | 2;
}

const FormattedDate = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);
  return (
    <span className="text-xs text-gray-400">
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </span>
  );
};

const ExpandableContent = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = useState(false);
  const preview =
    content.substring(0, 100) + (content.length > 100 ? "..." : "");

  return (
    <div className="mt-1">
      {expanded ? (
        <div className="whitespace-pre-wrap text-sm">{content}</div>
      ) : (
        <div className="whitespace-pre-wrap text-sm">{preview}</div>
      )}
      {content.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-400 hover:text-blue-300 text-xs mt-1"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

const JsonRenderer = ({ jsonString }: { jsonString: string }) => {
  try {
    const jsonData = JSON.parse(jsonString);
    return (
      <div className="bg-[#2A2A2A] p-2 rounded overflow-x-auto">
        <pre className="text-xs">{JSON.stringify(jsonData, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    return <div className="text-red-500">Invalid JSON data</div>;
  }
};

const LogItem = ({ log }: { log: Log }) => {
  return (
    <div className="border-b border-[#3A3A3A] p-3 hover:bg-[#252525]">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-base">{log.title}</h3>
        <FormattedDate dateString={log.created_at} />
      </div>

      {log.type === 0 && (
        <div className="mt-1 text-sm text-gray-300">{log.content}</div>
      )}

      {log.type === 1 && <ExpandableContent content={log.content} />}

      {log.type === 2 && <JsonRenderer jsonString={log.content} />}

      {log.external_link && (
        <a
          href={log.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block"
        >
          View Url
        </a>
      )}
    </div>
  );
};
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <p>No trade analysis logs available</p>
  </div>
);
export default function TradingLogs({
  tradePlayId,
  setTradePlayId,
}: {
  tradePlayId: string;
  setTradePlayId: (id: string) => void;
}) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("trade_analysis_logs")
          .select("*")
          .eq("trade_play_id", tradePlayId)
          .order("created_at", { ascending: false });

        // Filter by trade_play_id if provided
        if (tradePlayId) {
          query = query.eq("trade_play_id", tradePlayId);
        }

        const { data, error } = await query;

        if (error) throw error;

        setLogs(data || []);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to load trade analysis logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [tradePlayId]);

  // Set up real-time listener
  useEffect(() => {
    // Set up subscription to the table
    const channel = supabase
      .channel("trade_analysis_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trade_analysis_logs",
          filter: tradePlayId ? `trade_play_id=eq.${tradePlayId}` : undefined,
        },
        (payload) => {
          // Add the new log to the top of our logs array
          setLogs((currentLogs) => [payload.new as Log, ...currentLogs]);
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tradePlayId]);
  // Loading and error states
  const renderContent = () => {
    if (loading) {
      return (
        <div className=" flex h-64 justify-center items-center space-x-2">
          <CircleDashedIcon className="h-5 w-5 animate-spin text-white" />
          <p className="sen text-white">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 text-red-400">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (logs.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="px-3">
        {logs.map((log) => (
          <LogItem key={log.id} log={log} />
        ))}
      </div>
    );
  };

  return (
    <div className="2xl:relative absolute 2xl:top-[0%] 2xl:left-[0%] right-[2%] xl:w-[38%] w-[60%] 2xl:h-full h-[600px] bg-[#1F1F1F] rounded-sm">
      <div className="absolute w-full h-full flex flex-col -top-[0.5%] -left-[0.5%] space-y-2 sen rounded-sm text-sm border-2 border-[#3A3A3A] py-2 bg-[#1F1F1F] text-white">
        <div className="flex justify-between items-center px-4">
          <div className="flex justify-between items-center w-full">
            {!loading && (
              <span className="text-xs text-gray-400">
                {logs.length} log{logs.length !== 1 ? "s" : ""}
              </span>
            )}
            <h2 className="text-xl font-bold text-center flex-grow">
              Trade Analysis
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setTradePlayId("");
              }}
              className="hover:bg-transparent hover:text-white"
            >
              <X className="h-4 w-4 hover:text-white" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(100vh-100px)] w-full">
          {renderContent()}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}
