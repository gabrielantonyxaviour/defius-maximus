"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "sen group toast group-[.toaster]:bg-[#1F1F1F] group-[.toaster]:text-white group-[.toaster]:border-border group-[.toaster]:border-black group-[.toaster]:shadow-lg",
          description: "sen group-[.toast]:text-gray-300",
          actionButton:
            "sen group-[.toast]:bg-[#BF4317] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
