'use client'

import { Transaction } from "@/types/interfaces"
import { Button, Flex } from "antd"
import dayjs from "dayjs"

interface HistoryCustomerProp {
    history: Transaction[],
    handleAccept: (id_transaction: number, stat: string) => void,
    handleDecline: (id_transaction: number) => void
}


export default function HistoryBreederChild({ history, handleAccept, handleDecline }: HistoryCustomerProp) {
    return (
        <div className='flex flex-col gap-[1rem] px-[2rem] items-center py-[2rem]'>
            {history.map(h => (
            <div key={h.id} className="shadow-lg min-w-[16rem] md:min-w-[28rem] lg:min-w-[35rem] 2xl:min-w-[55rem] p-[1rem] rounded-[1rem]"> 
                <div className="flex flex-col"> 
                    <p className="text-center font-bold">{new Date(h.date_transaction).toLocaleDateString('id-ID')}</p>
                    <p className={`font-bold text-center pt-[1rem] ${h.status_transaction === 'WAITING' ? 'text-gray-600' : 'text-emerald-500'} ${h.status_transaction === 'DECLINE' && 'text-red-600'}`}>STATUS: {h.status_transaction}</p>
                    {h.detail_buy.length > 0 && (
                        <p className="font-bold">Buy</p>
                    )}
                    {h.detail_buy.map((buy, index) => (
                        <div key={index} className={`${index === 0 ? 'border-t' : ''} border-b border-gray-400 flex flex-row justify-between items-center`} >
                            <div className="flex flex-row gap-[1rem] p-[1rem] items-center">
                                <img src={buy.livestock?.img_livestock[0].url} className="w-[3rem] h-[2rem] md:w-[8rem] md:h-[5rem] 2xl:w-[12rem] 2xl:h-[9rem]" />
                                <div>
                                    <p>{buy.livestock?.name}</p>
                                    <p>{buy.total_livestock} Heads</p>
                                </div>
                            </div>
                            <p></p>
                            <p>Rp {buy.sub_total}</p>
                        </div>
                    ))}
                    
                    {h.care_transaction.length > 0 && (
                        <p className="font-bold">Care</p>
                    )}
                    {h.care_transaction.map((care, index) => (
                        <div key={care.id} className={`${index === 0 ? 'border-t' : ''} border-b flex flex-col`}>
                            <div key={index} className={`flex flex-row justify-between items-center border-gray-400`} >
                                <div className="flex flex-row gap-[1rem] p-[1rem] items-center">
                                    <img src={care.shelter?.img_shelter[0].url} className="w-[3rem] h-[2rem] md:w-[8rem] md:h-[5rem] 2xl:w-[12rem] 2xl:h-[9rem]" />
                                    <div>
                                        <p>{care.shelter?.name}</p>
                                        <p>{dayjs(care.start_date).format("DD/MM/YYYY")} - {dayjs(care.finish_date).format("DD/MM/YYYY")}</p>
                                        <p>{care.duration_care} Days</p>
                                        <p>{care.total_livestock} Heads</p>
                                    </div>
                                </div>
                                <p>Rp {care.sub_total}</p>
                            </div>
                            <div className="flex flex-col justify-center items-center mb-[1rem]">
                            </div>
                        </div>
                    ))}
                </div>
                <Flex justify="center">
                    {h.status_transaction === "WAITING" && (
                        <div className="flex flex-col">
                            <Button className="w-[12rem] mt-[1rem]" color="cyan" variant="solid" onClick={() => handleAccept(h.id, `${h.care_transaction.length > 0 ? "CARE" : "SENDING"}`)} >Accept Order</Button>
                            <Button className="w-[12rem] mt-[1rem]" color="danger" variant="solid" onClick={() => handleDecline(h.id)} >Decline Order</Button>
                        </div>
                    )}
                </Flex>
            </div>
            ))}
            {history.length < 1 && (
                <div className="flex flex-col items-center justify-center">
                    <img src='/cow-not-found.png' className=" w-[6rem] h-[6rem] " />
                    <h4>Transaction Not Found</h4>
                </div>
            )}
        </div>
    )
}