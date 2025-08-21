import { CategoryDetailResponse, CustomApiError, FarmDetailResponse, InptRegister, LivestockAllResponse, LivestockDetailResponse, ShelterAllResponse, ShelterDetailResponse } from "@/types/interfaces";


const API_SMAFARM = 'http://localhost:4000';

export async function fetchAllCategory (): Promise<CategoryDetailResponse | CustomApiError> {
    try {
        const response: Response = await fetch(`${API_SMAFARM}/category`);
        return response.json();
    } catch(error: unknown) {
        return errorNetworking(error);
    }
}

export async function fetchAllLivestock (category_id?: number[], name?: string): Promise<LivestockAllResponse | CustomApiError> {
    try {
        const params: string[] = []
        if (category_id && category_id.length > 0) {
            category_id.forEach(id => params.push(`category_id=${encodeURIComponent(id)}`));
        }
        if(name) params.push(`name=${encodeURIComponent(name)}`);
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

export async function fetchAllShelter(category_id?: number[], name?: string): Promise<ShelterAllResponse | CustomApiError> {
    try {
        const params: string[] = []
        if (category_id && category_id.length > 0) {
            category_id.forEach(id => params.push(`category_id=${encodeURIComponent(id)}`));
        }
        if(name) params.push(`name=${encodeURIComponent(name)}`);
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

