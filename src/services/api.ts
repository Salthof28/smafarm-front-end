import { FormCreateFarm } from "@/components/myfarm/form-create-farm";
import { AllUpdateLivestock, AllUpdateShelter, CareTransactionResponse, CategoryDetailResponse, CleanCartBuy, CleanCartBuyCare, CleanCartCare, CreateLivestockDto, CreateShelter, CustomApiError, DeleteUrlDto, FarmDetailResponse, FormValues, InptRegister, LivestockAllResponse, LivestockDetailResponse, ShelterAllResponse, ShelterDetailResponse, TransactionResponse } from "@/types/interfaces";


const API_SMAFARM = 'http://localhost:4000';

export async function fetchAllCategory (): Promise<CategoryDetailResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/category`);
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchAllLivestock (category_id?: number[], name?: string, farm_id?: number): Promise<LivestockAllResponse | CustomApiError> {
    try {
        const params: string[] = []
        if (category_id && category_id.length > 0) {
            category_id.forEach(id => params.push(`category_id=${encodeURIComponent(id)}`));
        }
        if(name) params.push(`name=${encodeURIComponent(name)}`);
        if (farm_id) params.push(`farm_id=${encodeURIComponent(farm_id)}`);
        const queryString = params.length > 0 ? `?${params.join("&")}` : "";
        const response: Response = await fetch(`${API_SMAFARM}/livestocks${queryString}`);
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchDetailLivestock(id: number): Promise<LivestockDetailResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/livestocks/${id}`);
        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchAllShelter(category_id?: number[], name?: string, farm_id?: number): Promise<ShelterAllResponse | CustomApiError> {
    try {
        const params: string[] = []
        if (category_id && category_id.length > 0) {
            category_id.forEach(id => params.push(`category_id=${encodeURIComponent(id)}`));
        }
        if(name) params.push(`name=${encodeURIComponent(name)}`);
        if (farm_id) params.push(`farm_id=${encodeURIComponent(farm_id)}`);
        const queryString = params.length > 0 ? `?${params.join("&")}` : "";
        const response: Response = await fetch(`${API_SMAFARM}/shelters${queryString}`);
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchDetailShelter(id: number): Promise<ShelterDetailResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/shelters/${id}`);
        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchSheltersFarm(id: number): Promise<FarmDetailResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/farms/shelter/${id}`);
        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchRegisterUser(input: InptRegister) {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/auth/register`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input)
        });
        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchAllCareTransaction(shelter_id: number): Promise<CareTransactionResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/transactions/care?shelter_id=${shelter_id}`);
        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}


export async function fetchTransactionBuy (transactionBuy: CleanCartBuy, token: string): Promise<TransactionResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/transactions/transactionbuy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(transactionBuy)
        });

        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchTransactionCare (transactionCare: CleanCartCare, token: string): Promise<TransactionResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/transactions/transactioncare`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(transactionCare)
        });

        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchTransactionBuyCare (transaction: CleanCartBuyCare, token: string): Promise<TransactionResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/transactions/transactionbuycare`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(transaction)
        });
        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchUploadProfile (photo: FormData, token: string) {
    try {
        const responseUrl: Response = await fetch(`${API_SMAFARM}/uploads/profile`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}` 
            },
            body: photo
        });
        const urlJson = await responseUrl.json();
        if(!responseUrl.ok){
            const errorData: CustomApiError = await responseUrl.json();
            return errorData;
        }
        const url: string = urlJson.data.url;

        const responseSave = await fetch(`${API_SMAFARM}/users/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ img_profile: url }),
        });

        const saveJson = await responseSave.json();
        if (!responseSave.ok) {
            const errorData: CustomApiError = await responseUrl.json();
            return errorData;
        };
        return saveJson;
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchEditProfile(editData: FormValues, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/users/profile`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // kalau backend butuh auth
            },
            body: JSON.stringify(editData),
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchHistoryTransaction(token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/transactions/history`, {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${token}`, // kalau backend butuh auth
            }
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchCreatefarm(data: FormCreateFarm, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/farms`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }    
}

export async function fetchUploadImageShelter(files: File[], shelterId: number, token: string) {
    try {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file)); // key 'files' should same interceptor
        formData.append('id', shelterId.toString());

        const res = await fetch(`${API_SMAFARM}/uploads/shelter`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData);
            return errorData;
        }

        return res.json(); // { url: string[] }
    } catch (error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchDeleteImageShelter(photoDelete: DeleteUrlDto, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/uploads/shelter/deleted`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photoDelete)
        });

        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData);
            return errorData;
        }

        return res.json(); // { url: string[] }
    } catch (error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchCreateShelter(data: CreateShelter, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/shelters`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData)
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }  
}

export async function fetchUpdateShelter(dataUpdate: AllUpdateShelter, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/shelters/${dataUpdate.shelter_id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataUpdate)
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData)
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }  
}

export async function fetchDeleteShelter(id: number, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/shelters/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData)
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }  
}

export async function fetchUploadImageLivestock(files: File[], livestockId: number, token: string) {
    try {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file)); // key 'files' should same interceptor
        formData.append('id', livestockId.toString());

        const res = await fetch(`${API_SMAFARM}/uploads/livestock`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData);
            return errorData;
        }

        return res.json(); // { url: string[] }
    } catch (error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchDeleteImageLivestock(photoDelete: DeleteUrlDto, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/uploads/livestock/deleted`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photoDelete)
        });

        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData);
            return errorData;
        }

        return res.json(); // { url: string[] }
    } catch (error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchCreateLivestock(data: CreateLivestockDto, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/livestocks`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData)
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }  
}

export async function fetchUpdateLivestock(dataUpdate: AllUpdateLivestock, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/livestocks/${dataUpdate.livestock_id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataUpdate)
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData)
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }  
}

export async function fetchDeleteLivestock(id: number, token: string) {
    try {
        const res = await fetch(`${API_SMAFARM}/livestocks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            const errorData: CustomApiError = await res.json();
            console.log(errorData)
            return errorData;
        }        
        return res.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }  
}

export async function fetchLogout(access_token: string) {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/auth/logout`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            }
        });
        if(!response.ok){
            const errorData: CustomApiError = await response.json();
            return errorData;
        }
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

function errorNetworking(error: unknown): CustomApiError {
    return {
        message: (error as Error).message,
        error: "NetworkError",  
        statusCode: 500,
    };
}

