export interface InptRegister {
    name: string,
    email: string,
    password: string,
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
export type Farm = {
  id: number;
  user_id: number;
  name: string;
  location: string;
  img_farm: string;
  rating: number;
  created_at: string; 
  updated_at: string;
  shelters: Shelter[]; 
};
export interface ImageUrl {
  url: string;
}

export interface Category {
    id: number,
    name: string,
    img_category: string,
    created_at: string; 
    updated_at: string;
}
export interface Livestock {
    id: number;
    farm_id: number;
    name: string
    age: number;
    price: number;
    stock: number;
    description: string;
    location: string;
    created_at: string; 
    updated_at: string;
    farm: Farm;
    category: Category;
    img_livestock: ImageUrl[];
}
export interface CareGive {
    id: number;
    shelter_id: number;
    name: string;
    price: number;
    unit: string;
    required: boolean;
}
export interface Shelter {
    id: number;
    farm_id: number;
    name: string;
    location: string;
    accomodate: number;
    description: string;
    price_daily: number;
    created_at: string;
    updated_at: string;
    farm: Farm;
    category: Category;
    img_shelter: ImageUrl[];
    care_give: CareGive[];
}

export interface CategoryDetailResponse {
    message: string;
    data: Category[];
}

export interface LivestockAllResponse {
    message: string;
    data: Livestock[];
}
export interface LivestockDetailResponse {
    message: string;
    data: Livestock;
}

export interface ShelterAllResponse {
    message: string;
    data: Shelter[];
}
export interface ShelterDetailResponse {
    message: string;
    data: Shelter;
}
export interface FarmDetailResponse {
    message: string;
    data: Farm;
}
export interface CustomApiError {
  message: string;
  error: string;   
  statusCode: number;
}

