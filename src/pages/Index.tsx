import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, Leaf, Drumstick, ShoppingCart } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <img
          src={heroFood}
          alt="Delicious food"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
          <div className="inline-block p-4 bg-card/90 backdrop-blur-sm rounded-full mb-4">
            <Utensils className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">
            Madras Engineering College
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Canteen Menu
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Order delicious vegetarian and non-vegetarian meals from your campus canteen
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Get Started
              <ShoppingCart className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="inline-block p-4 bg-secondary/10 rounded-full mb-4">
                <Leaf className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Vegetarian Delights</h3>
              <p className="text-muted-foreground">
                Fresh and delicious vegetarian meals prepared daily with quality ingredients
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="inline-block p-4 bg-[hsl(var(--non-veg))]/10 rounded-full mb-4">
                <Drumstick className="w-12 h-12 text-[hsl(var(--non-veg))]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Non-Vegetarian Options</h3>
              <p className="text-muted-foreground">
                Mouth-watering non-vegetarian dishes that satisfy your cravings
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <ShoppingCart className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Easy Ordering</h3>
              <p className="text-muted-foreground">
                Simple and secure payment options including Paytm, GPay, PhonePe, and UPI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join us today and enjoy delicious meals at your convenience
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
