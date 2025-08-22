'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CareItem {
    livestock_id?: number,
    name: string 
    shelter_id: number,
    total_livestock: number,
    start_date: string,
    finish_date: string,
    price_daily: number,
    careGive_id: number[],
    total_days: number,
    address?: string
    image?: string
}

export interface BuyItem {
    name: string,
    livestock_id: number,
    price: number, 
    total_livestock: number,
    address: string,
    image?: string
}

export interface Transaction {
    id_farm: number;
}

export interface Cart {
    transaction: Transaction;
    care: CareItem[];
    buy: BuyItem[];
}
interface CartContextType {
    cart: Cart;
    setCart: (cart: Cart) => void;
    addBuyItem: (item: BuyItem) => void;
    addCareItem: (item: CareItem) => void;
    decreaseBuyItem: (livestock_id: number, amount?: number) => void;
    decreaseCareItem: (careItem: CareItem, amount?: number) => void;
    removeBuyItem: (livestock_id: number) => void;
    removeCareItem: (careItem: CareItem) => void;
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

    // Load from localStorage when mount
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) setCart(JSON.parse(stored));
    }, []);

    // save to localStorage each cart change
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
        setCart(prev => {
            const existingIndex = prev.buy?.findIndex(b => b.livestock_id === item.livestock_id);

            if (existingIndex !== undefined && existingIndex >= 0) {
                const updatedBuy = [...(prev.buy || [])];
                const prevQty = updatedBuy[existingIndex].total_livestock;
                const incoming = item.total_livestock;

                updatedBuy[existingIndex] = {
                    ...updatedBuy[existingIndex],
                    total_livestock: prevQty + incoming
                };
                return { ...prev, buy: updatedBuy };
            }

            return { ...prev, buy: [...(prev.buy || []), item] };
        });
    };

    const decreaseBuyItem = (livestock_id: number) => {
        setCart(prev => {
            const updatedBuy = (prev.buy || []).map(item =>
                item.livestock_id === livestock_id
                    ? { ...item, total_livestock: item.total_livestock - 1 }
                    : item
            ).filter(item => item.total_livestock > 0);

            return { ...prev, buy: updatedBuy };
        });
    };

    const removeBuyItem = (livestock_id: number) => {
        setCart((prev) => ({
        ...prev,
        buy: prev.buy?.filter((item) => item.livestock_id !== livestock_id) || [],
        }));
    };

    const addCareItem = (item: CareItem) => {
        setCart(prev => {
            const existingIndex = prev.care?.findIndex(c =>
            c.shelter_id === item.shelter_id &&
            (c.livestock_id === item.livestock_id || (c.livestock_id === undefined && item.livestock_id === undefined)) &&
            c.start_date === item.start_date &&
            c.finish_date === item.finish_date
            );

            if (existingIndex !== undefined && existingIndex >= 0) {
                const updatedCare = [...(prev.care || [])];
                const prevQty = updatedCare[existingIndex].total_livestock;
                const incoming = item.total_livestock;

                updatedCare[existingIndex] = {
                    ...updatedCare[existingIndex],
                    total_livestock: prevQty + incoming,
                };

                return { ...prev, care: updatedCare };
            }
                return { ...prev, care: [...(prev.care || []), item] };
        });
    };

    const decreaseCareItem = (item: CareItem) => {
        setCart(prev => {
            const updatedCare = (prev.care || []).map(c =>
                c.shelter_id === item.shelter_id &&
                (c.livestock_id === item.livestock_id || (c.livestock_id === undefined && item.livestock_id === undefined)) &&
                c.start_date === item.start_date &&
                c.finish_date === item.finish_date
                    ? { ...c, total_livestock: c.total_livestock - 1 }
                    : c
            ).filter(c => c.total_livestock > 0);

            return { ...prev, care: updatedCare };
        });
    };

    const removeCareItem = (careItem: CareItem) => {
        setCart((prev) => ({
        ...prev,
        care:
            prev.care?.filter(
            (item) =>
                !(
                item.shelter_id === careItem.shelter_id &&
                item.start_date === careItem.start_date &&
                item.finish_date === careItem.finish_date &&
                item.livestock_id === careItem.livestock_id
                )
            ) || [],
        }));
    };

    const getTotal = () => {
        let total = 0;
        if (cart.buy) {
            total += cart.buy.reduce((sum, item) => sum + item.price * item.total_livestock, 0);
        }
        if (cart.care) {
            total += cart.care.reduce((sum, item) => sum + item.price_daily * item.total_livestock * item.total_days, 0);
        }
        return total;
    };

    const checkout = ():void => {
        setCart({
            transaction: { id_farm: 0 },
            buy: [],
            care: []
        });
        localStorage.removeItem('cart');
    }

    return (
        <CartContext.Provider value={{ cart, setCart, addBuyItem, addCareItem, checkout, getTotal, setTransaction, decreaseBuyItem, decreaseCareItem, removeBuyItem, removeCareItem }}>
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