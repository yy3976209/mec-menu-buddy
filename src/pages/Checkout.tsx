import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const paymentMethods = [
  { id: "paytm", name: "Paytm", icon: "💳" },
  { id: "gpay", name: "Google Pay", icon: "📱" },
  { id: "phonepe", name: "PhonePe", icon: "💰" },
  { id: "upi", name: "UPI", icon: "🔗" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cart: CartItem[] = location.state?.cart || [];
  const [selectedPayment, setSelectedPayment] = useState("");
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Randomly simulate payment success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (!isSuccess) {
        toast.error("Payment failed. Please try again with a different payment method.");
        setProcessing(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          payment_method: selectedPayment,
          payment_status: "completed",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Navigate to success page
      navigate("/order-success", {
        state: {
          orderId: order.id,
          cart,
          total,
          paymentMethod: selectedPayment,
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Payment processing failed");
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Empty Cart</CardTitle>
            <CardDescription>Your cart is empty. Add items to proceed.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/menu")} className="w-full">
              Go to Menu
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/menu")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePayment}
                disabled={!selectedPayment || processing}
                className="w-full"
                size="lg"
              >
                {processing ? "Processing Payment..." : `Pay ₹${total.toFixed(2)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
