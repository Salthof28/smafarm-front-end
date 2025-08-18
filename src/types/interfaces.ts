export interface Category {
    id: number,
    name: string,
    slug: string,
    image: string
};

export interface Farm {
    id: number,
    userId: number,
    name: string,
    categoryShed: Category,
    location: string,
    images: string[],
    accommodate: number,
    shed: number,
    createdAt: string,
    updatedAt: string
}
export interface Animal {
    id: number,
    userId: number,
    type: string,
    description: string,
    images: string[],
    age: number,
    price: number,
    stock: number,
    farm: Farm,
    category: Category,
    createdAt: string,
    updatedAt: string
}

export interface LivestockImage {
  url: string;
}
export interface Livestock {
    id: number;
    category_id: number;
    farm_id: number;
    age: number;
    price: number;
    stock: number;
    description: string;
    location: string;
    created_at: string; 
    updated_at: string;
    img_livestock: LivestockImage[];
}
export interface LivestockAllResponse {
    message: string;
    data: Livestock[];
}

export interface LivestockDetailResponse {
    message: string;
    data: Livestock;
}

export interface CustomApiError {
  message: string;
  error: string;   
  statusCode: number;
}

