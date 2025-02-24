import { useEffect, useState } from "react";

export const CountdownTimer = ({ createdAt, timeframe }: {
    createdAt: string;
    timeframe: number;
}) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const created = new Date(createdAt).getTime();
            const expiryTime = created + (timeframe * 1000); // Convert seconds to milliseconds
            const now = new Date().getTime();
            const difference = expiryTime - now;

            if (difference <= 0) {
                return "Expired";
            }

            // Calculate time units
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Format the string
            const parts = [];
            if (days > 0) parts.push(`${days}d`);
            if (hours > 0) parts.push(`${hours}h`);
            if (minutes > 0) parts.push(`${minutes}m`);
            parts.push(`${seconds}s`);

            return parts.join(" ");
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Cleanup
        return () => clearInterval(timer);
    }, [createdAt, timeframe]);

    return <span>{timeLeft}</span>;
};
