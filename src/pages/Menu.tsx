import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, LogOut, Leaf, Drumstick } from "lucide-react";
import { toast } from "sonner";
import heroFood from "@/assets/hero-food.jpg";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "veg" | "non-veg";
  image_url: string | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Menu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchMenuItems();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("name");

      if (error) throw error;
      setMenuItems((data || []) as MenuItem[]);
    } catch (error: any) {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const vegItems = menuItems.filter((item) => item.category === "veg");
  const nonVegItems = menuItems.filter((item) => item.category === "non-veg");

  const MenuCard = ({ item }: { item: MenuItem }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img
          src={item.image_url || heroFood}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            item.category === "veg"
              ? "bg-secondary text-secondary-foreground"
              : "bg-[hsl(var(--non-veg))] text-white"
          }`}
        >
          {item.category === "veg" ? (
            <Leaf className="w-3 h-3 mr-1" />
          ) : (
            <Drumstick className="w-3 h-3 mr-1" />
          )}
          {item.category === "veg" ? "Veg" : "Non-Veg"}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        {item.description && (
          <CardDescription className="line-clamp-2">{item.description}</CardDescription>
        )}
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xl font-bold text-primary">₹{item.price}</span>
        <Button onClick={() => addToCart(item)} size="sm">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MEC Canteen</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cartCount})
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80 overflow-hidden">
        <img
          src={heroFood}
          alt="Delicious food"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-2">
            Delicious Meals Await!
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Choose from our selection of vegetarian and non-vegetarian dishes
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">Loading menu...</div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No menu items available yet.</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="veg">
                <Leaf className="w-4 h-4 mr-2" />
                Veg
              </TabsTrigger>
              <TabsTrigger value="non-veg">
                <Drumstick className="w-4 h-4 mr-2" />
                Non-Veg
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </TabsContent>
            <TabsContent value="veg" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vegItems.length > 0 ? (
                vegItems.map((item) => <MenuCard key={item.id} item={item} />)
              ) : (
                <p className="col-span-full text-center text-muted-foreground">
                  No vegetarian items available
                </p>
              )}
            </TabsContent>
            <TabsContent value="non-veg" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nonVegItems.length > 0 ? (
                nonVegItems.map((item) => <MenuCard key={item.id} item={item} />)
              ) : (
                <p className="col-span-full text-center text-muted-foreground">
                  No non-vegetarian items available
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Floating Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-card border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Cart Total:</span>
            <span className="text-xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
          </div>
          <Button onClick={() => navigate("/checkout", { state: { cart } })} className="w-full">
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Menu;
