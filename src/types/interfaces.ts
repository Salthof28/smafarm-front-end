// export interface Category {
//     id: number,
//     name: string,
//     slug: string,
//     image: string
// };

// export interface Farm {
//     id: number,
//     userId: number,
//     name: string,
//     categoryShed: Category,
//     location: string,
//     images: string[],
//     accommodate: number,
//     shed: number,
//     createdAt: string,
//     updatedAt: string
// }
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
  created_at: string; // bisa Date kalau kamu parse
  updated_at: string; // bisa Date juga
};
export interface LivestockImage {
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
export interface CategoryDetailResponse {
    message: string;
    data: Category[];
}

export interface CustomApiError {
  message: string;
  error: string;   
  statusCode: number;
}

