import { useState } from "react";
import { ProfileInformation } from "./ProfileInformation";
import { ChangePassword } from "./ChangePassword";
import { AvatarUpload } from "./AvatarUpload";
import { BannerUpload } from "./BannerUpload";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Crown, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const SUBSCRIPTION_TIERS = {
  MONTHLY: { price: 30, label: "Monthly", savings: 0 },
  QUARTERLY: { price: 75, label: "Quarterly", savings: 15 },
  SEMI_ANNUAL: { price: 110, label: "Semi-Annual", savings: 70 },
  ANNUAL: { price: 200, label: "Annual", savings: 160 }
};

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState("MONTHLY");
  const [isProcessingSubscription, setIsProcessingSubscription] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubscribe = () => {
    navigate('/payment', { 
      state: { tier: selectedTier }
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-6">
              <ProfileInformation setError={setError} setSuccess={setSuccess} />
              <BannerUpload />
              <AvatarUpload />
              <ThemeCustomizer />
              <ChangePassword setError={setError} setSuccess={setSuccess} />
            </div>
          )}
        </Card>

        {/* Premium Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Premium Subscription</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Premium Features
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Custom themes and profile customization</li>
                  <li>• Animated avatars and special effects</li>
                  <li>• Premium badges and exclusive emotes</li>
                  <li>• Advanced poem formatting options</li>
                  <li>• Priority support and early access</li>
                </ul>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium">Select Subscription Period</label>
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

                <Button
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isProcessingSubscription}
                >
                  {isProcessingSubscription ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Subscribe Now
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}