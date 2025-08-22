
import { BuyItem } from "@/app/context/Cart-context";

interface BuyListProp {
    item: BuyItem;
    addBuyItem: (item: BuyItem) => void;
    decreaseBuyItem: (livestock_id: number, amount?: number) => void;
    removeBuyItem: (livestock_id: number) => void;
}

export default function BuyList ({item, addBuyItem, decreaseBuyItem, removeBuyItem}: BuyListProp) {

    return (
        <div className="flex flex-col md:flex-row items-center justify-between max-md:gap-[1rem] lg:justify-between border-b py-3">
            <div className="flex flex-col lg:flex-row gap-[2rem] items-center">
                <img src={item.image} className="w-[12rem] 2xl:w-[15rem] rounded-2xl" />
                <div>
                    <h5 className="font-semibold">{item.name}</h5>
                    <p className=" text-gray-600">{item.address}</p>
                    <p className=" text-gray-600 border-b">Rp {item.price.toLocaleString()} × {item.total_livestock} Heads</p>
                    <p className="text-sm text-gray-600">Rp {(item.price * item.total_livestock).toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => decreaseBuyItem(item.livestock_id)}
                >-</button>
                <span>{item.total_livestock}</span>
                <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => addBuyItem({
                        ...item,
                        total_livestock: 1,
                    })}
                >
                    +
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeBuyItem(item.livestock_id)}
                >Remove</button>
            </div>
        </div>
    );
}