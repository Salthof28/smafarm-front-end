
import { BuyItem, CareItem } from "@/app/context/Cart-context";

interface CareListProp {
    item: CareItem;
    addCareItem: (item: CareItem) => void;
    decreaseCareItem: (careItem: CareItem, amount?: number) => void;
    removeCareItem: (careItem: CareItem) => void;
}

export default function CareList ({item, addCareItem, decreaseCareItem, removeCareItem}: CareListProp) {

    return (
        <div className="flex flex-col md:flex-row items-center justify-between max-md:gap-[1rem] lg:justify-between border-b py-3">
            <div className="flex flex-col lg:flex-row gap-[2rem] items-center">
                <img src={item.image} className="w-[12rem] 2xl:w-[15rem] rounded-2xl" />
                <div>
                    <h5 className="font-semibold">{item.name} (Shelter #{item.shelter_id})</h5>
                    <p className=" text-gray-600">{item.start_date} - {item.finish_date}  </p>
                    <p className=" text-gray-600 border-b">Rp {item.price_daily.toLocaleString()} × {item.total_days} days x {item.total_livestock} Heads</p>
                    <p className="text-gray-600">Rp {(item.price_daily * item.total_days * item.total_livestock).toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => decreaseCareItem(item)}>-</button>
                <span>{item.total_livestock}</span>
                <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => addCareItem({
                        ...item,
                        total_livestock: 1,
                    })}
                >
                    +
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeCareItem(item)}>Remove</button>
            </div>
        </div>
    );
}

