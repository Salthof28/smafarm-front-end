'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CareItem {
    livestock_id?: number; 
    shelter_id: number;
    total_livestock: number;
    start_date: string;
    finish_date: string;
    price_daily: number;
    careGive_id: number[];
    total_days: number
}

export interface BuyItem {
    livestock_id: number;
    price: number, 
    total_livestock: number;
}

export interface Transaction {
    id_farm: number;
}

export interface Cart {
    transaction: Transaction;
    care?: CareItem[];
    buy?: BuyItem[];
}
interface CartContextType {
    cart: Cart;
    setCart: (cart: Cart) => void;
    addBuyItem: (item: BuyItem) => void;
    addCareItem: (item: CareItem) => void;
    checkout: () => void;
    getTotal: () => number;
    setTransaction: (transaction: Transaction) => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart>({
        transaction: { id_farm: 0 },
        buy: [],
        care: []
    });

    // Load dari localStorage pas mount
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) setCart(JSON.parse(stored));
    }, []);

    // Simpan ke localStorage tiap kali cart berubah
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const setTransaction = (transaction: Transaction) => {
        setCart(prev => ({
            ...prev,
            transaction,
        }));
    };

    const addBuyItem = (item: BuyItem) => {
        // setCart(prev => ({
        // ...prev,
        // buy: prev.buy ? [...prev.buy, item] : [item],
        // }));
        setCart(prev => {
            const existingIndex = prev.buy?.findIndex(b => b.livestock_id === item.livestock_id);

            if (existingIndex !== undefined && existingIndex >= 0) {
                const updatedBuy = [...(prev.buy || [])];
                updatedBuy[existingIndex].total_livestock += item.total_livestock;
                return { ...prev, buy: updatedBuy };
            }

            return { ...prev, buy: [...(prev.buy || []), item] };
        });
    };

    const addCareItem = (item: CareItem) => {
        // setCart(prev => ({
        // ...prev,
        // care: prev.care ? [...prev.care, item] : [item],
        // }));

        setCart(prev => {
            const existingIndex = prev.care?.findIndex(c => 
                c.shelter_id === item.shelter_id &&
                (c.livestock_id === item.livestock_id || (c.livestock_id === undefined && item.livestock_id === undefined)) &&
                c.start_date === item.start_date &&
                c.finish_date === item.finish_date
            );

            if (existingIndex !== undefined && existingIndex >= 0) {
                const updatedCare = [...(prev.care || [])];
                updatedCare[existingIndex].total_livestock += item.total_livestock;
                return { ...prev, care: updatedCare };
            }

            return { ...prev, care: [...(prev.care || []), item] };
        });
    };
    const getTotal = () => {
        let total = 0;
        if (cart.buy) {
            total += cart.buy.reduce((sum, item) => sum + item.price * item.total_livestock, 0);
        }
        if (cart.care) {
            total += cart.care.reduce((sum, item) => sum + item.price_daily * item.total_livestock, 0);
        }
        return total;
    };

    const checkout = ():void => {
        // setCart({});
        localStorage.removeItem('cart');
    }

    return (
        <CartContext.Provider value={{ cart, setCart, addBuyItem, addCareItem, checkout, getTotal, setTransaction }}>
        {children}
        </CartContext.Provider>
    );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};