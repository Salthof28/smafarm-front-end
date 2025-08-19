import { Animal, Category, CategoryDetailResponse, CustomApiError, Farm, LivestockAllResponse, LivestockDetailResponse } from "@/types/interfaces";


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

export async function fetchAllShelter(category_id?: number[], name?: string) {
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

export async function fetchDetailShelter(id: number) {
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

function errorNetworking(error: unknown): CustomApiError {
    return {
        message: (error as Error).message,
        error: "NetworkError",  
        statusCode: 500,
    };
}

export const mockCategory: Category[] = [
    {
        id: 1,
        name: 'Cow',
        img_category: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkvy5wCD2kMlWbP7f-wdMVYVgB8L45FerDsSJfrnc9m_dFGLRbGg6324U2MgyaqNeCaho&usqp=CAU',
        created_at: 'ss',
        updated_at: 'ss'
    },
    {
        id: 2,
        name: 'Sheep',
        img_category: 'https://a-z-animals.com/media/2021/12/sheep.jpg',
        created_at: 'ss',
        updated_at: 'ss'
    }
];
