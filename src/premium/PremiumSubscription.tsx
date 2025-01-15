import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUBSCRIPTION_TIERS = {
  MONTHLY: { price: 30, label: "Monthly", savings: 0 },
  QUARTERLY: { price: 75, label: "Quarterly", savings: 15 },
  SEMI_ANNUAL: { price: 110, label: "Semi-Annual", savings: 70 },
  ANNUAL: { price: 200, label: "Annual", savings: 160 }
};

export function PremiumSubscription() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState("MONTHLY");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          billingPeriod: selectedTier,
        }),
      });

      if (!response.ok) throw new Error("Failed to initiate subscription");

      const data = await response.json();
      // Handle successful subscription (redirect to payment, etc.)
      window.location.href = data.url;
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          Premium Subscription
        </h2>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <Select
            value={selectedTier}
            onValueChange={setSelectedTier}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subscription period" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUBSCRIPTION_TIERS).map(([key, { price, label, savings }]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center justify-between w-full">
                    <span>{label}</span>
                    <span className="text-muted-foreground">
                      ${price} {savings > 0 && `(Save $${savings})`}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Premium Features:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Custom themes and layouts
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Animated avatars
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Premium badges and emotes
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Special post effects
            </li>
          </ul>
        </div>

        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Subscribe for $${SUBSCRIPTION_TIERS[selectedTier].price}`}
        </Button>
      </div>
    </Card>
  );
}