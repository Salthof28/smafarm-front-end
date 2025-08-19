'use client'
import { Animal, Livestock } from "@/types/interfaces";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

interface FormBuyAnimalProp {
    animal: Livestock;
    hiddenForm: () => void;
}
interface Treatment {
    name: string,
    price: number,
}
interface FormAnimal {
    wantCare: string,
    moreTreatment: string,
    rent: string,
    address: string
}
export default function FormBuyAnimal ({ animal, hiddenForm }: FormBuyAnimalProp) {
    const [hidden, setHidden] = useState<boolean>(false)
    const [requiredTreatment, setRequiredTreatment] = useState<Treatment[]> ([
        {
            name: 'Feeder',
            price: 18000
        },
        {
            name: 'Care',
            price: 15000
        },
    ]);
    const optionalTreatment: Treatment = {
        name: 'Nutrition',
        price: 90000,
    }
    
    const [formData, setFormData] = useState<FormAnimal>({
        wantCare: '0',
        moreTreatment: '0',
        rent: '',
        address: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        // const index = e.target.dataset.index;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    const handleAddTreatment = () => {
        console.log(formData.moreTreatment)
        if(formData.moreTreatment === 'nutrition') {
            setRequiredTreatment(prev => ([...prev, optionalTreatment]))
        }
    }
    useEffect(() => {
        setHidden(formData.wantCare === 'yes' ? true : false)
    }, [formData.wantCare]);
    const handleSubmit = (data: FormAnimal) => {
        console.log(data)
    }
    return(
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {e.preventDefault(); handleSubmit(formData)}} className="flex flex-col w-[95vw] 2xl:w-[75vw] bg-amber-50 shadow-lg/30 ring-[0.1rem] ring-black/5 rounded-[1rem] p-[1rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={hiddenForm}><ArrowLeft /></button>
            <h3 className="text-center font-bold mb-[1rem]">Buy {animal?.name}</h3>
            <label className="tds">Do you want care animal:</label>
            <select name="wantCare" onChange={handleChange} className="bg-amber-100 rounded-[0.5rem] border border-gray-300/20 p-[0.3rem] tds">
                <option value ='0'>Select yes or no</option>
                <option value='yes'>Yes</option>
                <option value='no'>No</option>
            </select>
            <div className={`${hidden === true ? 'flex': 'hidden'} flex-col my-[0.5rem] bg-amber-100 p-[1rem]`}>
                <h5>Treatment</h5>
                <table className="min-w-full mb-[1rem]">
                    <tbody className="bg-white/30">
                        {/* w-[88%] 2xl: */}
                        {requiredTreatment.map(treatment => (
                            <tr className="tds border-t border-gray-500/15">
                                <td className="w-[70%] md:w-[85%] lg:w-[90%] 2xl:w-[93%]">{treatment.name}</td>
                                <td>Rp {treatment.price} /day</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <label className="tds">More Treatment:</label>
                <div className="flex flex-row gap-[1rem]">
                    <select onChange={handleChange} name="moreTreatment" className="bg-amber-50 rounded-[0.5rem] border border-gray-300/20 p-[0.3rem] tds">
                        <option value='0'>Select More Treatment</option>
                        <option value='nutrition'>Nutrition</option>
                    </select>
                    <button onClick={handleAddTreatment} type="button" className="flex font-bold w-[2rem] bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem text-[1.5rem] transition-opacity delay-200 active:scale-90 justify-center items-center rounded-[0.5rem]"><CirclePlus /></button>
                </div>
            </div>
            <label className="tds">Rent Period:</label>
            <input onChange={handleChange} name="rent" type="date" className="bg-amber-100 rounded-[0.5rem] border border-gray-300/20 p-[0.3rem] tds" />
            <label className="tds">Address Delivery:</label>
            <input onChange={handleChange} name="address" className="bg-amber-100 rounded-[0.5rem] border border-gray-300/20 p-[0.3rem] tds" />
            <div className="flex flex-col items-center mt-[1rem] gap-[1rem]">
                <button className="font-bold btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem text-[1.5rem] transition-opacity delay-200 active:scale-90">Coming Soon</button>
                <button type="submit" className="font-bold btn bg-emerald-500 hover:bg-emerald-700 hover:text-white xl:1rem text-[1.5rem] transition-opacity delay-200 active:scale-90">Buy</button>
            </div>
            {/* <label className="tds">Note:</label>
            <input className="bg-amber-100 rounded-[0.5rem] border border-gray-300/20 p-[0.3rem] tds" /> */}
        </form>
    )
}