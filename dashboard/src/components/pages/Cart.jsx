import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import apiClient from "@/lib/apiClient";
import { cartPaths } from "@/lib/productApi";

const Cart = () => {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    apiClient
      .get(cartPaths.all)
      .then((res) => setCart(res.data.data[0].items));
  }, []);
  return (
    <div>
        <Helmet>
            <title>Cart Items</title>
        </Helmet>
      <Card className="max-w-5xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cart Items */}
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Your cart is empty 🛒
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 border rounded-lg p-4">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">${item.price}</p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className={"cursor-pointer"}
                    >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <Button
                    size="icon"
                    variant="outline"
                    className={"cursor-pointer"}
                    >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Subtotal */}
                <div className="w-20 text-right font-medium">
                  ${item.price * item.quantity}
                </div>

                {/* Remove */}
                <Button
                  size="icon"
                  variant="destructive"
                  className={"cursor-pointer dark:bg-red-600"}
                  >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}

          {/* Footer */}
          {cart.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t">
              <h2 className="text-lg font-semibold">
                Total: 
              </h2>

              <Button size="lg" className="w-full md:w-auto">
                Checkout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
