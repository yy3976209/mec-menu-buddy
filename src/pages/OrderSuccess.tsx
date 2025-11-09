import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Home } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, cart, total, paymentMethod } = location.state || {};

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Access</CardTitle>
            <CardDescription>No order information found.</CardDescription>
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

  const paymentMethodNames: Record<string, string> = {
    paytm: "Paytm",
    gpay: "Google Pay",
    phonepe: "PhonePe",
    upi: "UPI",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-secondary rounded-full">
              <CheckCircle2 className="w-16 h-16 text-secondary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-secondary">Order Successful!</CardTitle>
          <CardDescription className="text-lg">
            Your payment was processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order ID */}
          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
            <p className="font-mono font-bold">{orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          {/* Payment Receipt */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Payment Receipt</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{paymentMethodNames[paymentMethod]}</span>
              </div>
              <Separator />
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-secondary/10 border border-secondary p-4 rounded-lg">
            <p className="text-sm text-center">
              Thank you for your order! Your food will be prepared shortly.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={() => navigate("/menu")} className="flex-1" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderSuccess;
