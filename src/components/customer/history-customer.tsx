'use client'

import { Transaction } from "@/types/interfaces"
import { Session } from "next-auth"

interface HistoryCustomerProp {
    history: Transaction[]
}
export default function HistoryCustomerChild({history}: HistoryCustomerProp) {
    return (
        <div className='flex flex-col gap-[1rem] px-[2rem] items-center'>
            {history.map(h => (
            <div className="border min-w-[15rem]"> 
                <p>{new Date(h.date_transaction).toLocaleDateString('id-ID')}</p>
                {h.detail_buy.length > 0 && (
                    <p>Buy</p>
                )}
                {h.detail_buy.map(buy => (
                    <div>
                        <p>{buy.livestock?.name}</p>
                        <p>{buy.livestock?.img_livestock[0].url}</p>
                    </div>
                ))}
                {h.care_transaction.length > 0 && (
                    <p>Care</p>
                )}
                {h.care_transaction.map(care => (
                    <p>{care.shelter?.name}</p>
                ))}
            </div>
            ))}
        </div>
    )
}