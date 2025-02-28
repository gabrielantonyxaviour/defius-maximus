"use client";

import { useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import { useRouter } from "next/navigation";
import { CircleDashedIcon } from "lucide-react";
import CreateChefForm from "./create-chef-form";
import ChefHome from "./home";

export default function Chef() {
  const { user, chef, setChef } = useEnvironmentStore((store) => store);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user == undefined) {
      console.log("User is undefined, redirecting to home page");
      router.push("/");
      return;
    }

    console.log(`Fetching chef data for user: ${user.id}`);

    if (!chef) {
      (async () => {
        try {
          const response = await fetch(
            `/api/supabase/get-chef?username=${user.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const { chef } = await response.json();
          console.log("Data fetched successfully:", chef);

          if (chef) setChef(chef);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      })();
    }
  }, []);
  return loading ? (
    <div className="h-screen w-screen flex justify-center items-center space-x-2">
      <CircleDashedIcon className="h-6 w-6 animate-spin text-white" />
      <p className="sen text-white">Loading</p>
    </div>
  ) : chef ? (
    <ChefHome />
  ) : (
    <CreateChefForm />
  );
}
