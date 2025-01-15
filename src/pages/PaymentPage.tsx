import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { Crown, CreditCard, Shield, ArrowLeft } from "lucide-react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const selectedTier = location.state?.tier || "MONTHLY";
  const tierDetails = {
    MONTHLY: { price: 30, label: "Monthly" },
    QUARTERLY: { price: 75, label: "Quarterly", savings: 15 },
    SEMI_ANNUAL: { price: 110, label: "Semi-Annual", savings: 70 },
    ANNUAL: { price: 200, label: "Annual", savings: 160 }
  }[selectedTier];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!cardNumber.match(/^\d{16}$/)) {
      setError("Invalid card number. Please enter 16 digits.");
      return false;
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError("Invalid expiry date. Use MM/YY format.");
      return false;
    }
    if (!cvv.match(/^\d{3}$/)) {
      setError("Invalid CVV. Please enter 3 digits.");
      return false;
    }
    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("http://localhost:3001/api/subscribe/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tier: selectedTier,
          paymentDetails: {
            cardNumber,
            expiryDate,
            cvv
          }
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Payment failed");
      }

      const data = await response.json();
      navigate("/settings", { 
        state: { 
          success: "Premium subscription activated successfully!" 
        }
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (input: string) => {
    const numbers = input.replace(/\D/g, '').slice(0, 16);
    setCardNumber(numbers);
  };

  const formatExpiryDate = (input: string) => {
    const numbers = input.replace(/\D/g, '').slice(0, 4);
    if (numbers.length >= 2) {
      setExpiryDate(`${numbers.slice(0, 2)}/${numbers.slice(2)}`);
    } else {
      setExpiryDate(numbers);
    }
  };

  const formatCVV = (input: string) => {
    const numbers = input.replace(/\D/g, '').slice(0, 3);
    setCvv(numbers);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">Premium Subscription</h1>
          </div>

          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h2 className="font-semibold mb-2">{tierDetails.label} Plan</h2>
            <p className="text-2xl font-bold mb-1">${tierDetails.price}</p>
            {tierDetails.savings && (
              <p className="text-sm text-green-600">Save ${tierDetails.savings}</p>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => formatCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
                maxLength={16}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <Input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => formatExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  required
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <Input
                  type="text"
                  value={cvv}
                  onChange={(e) => formatCVV(e.target.value)}
                  placeholder="123"
                  required
                  maxLength={3}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <Shield className="w-4 h-4" />
              <span>Your payment info is secure and encrypted</span>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pay ${tierDetails.price}
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}