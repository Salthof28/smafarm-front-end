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

export interface CareTransaction {
    id: number;
    transaction_id: number;
    livestock_id: number | null;
    total_livestock: number;
    shelter_id: number;
    start_date: string;
    finish_date: string; 
    one_day_price: number;
    sub_total: number;
}

export interface DetailCare {
  id: number;
  careTransaction_id: number;
  careGive_id: number;
  careGive: CareGive;
}

export interface CareTransaction {
  id: number;
  transaction_id: number;
  livestock_id: number | null;
  total_livestock: number;
  shelter_id: number;
  start_date: string; 
  finish_date: string;
  one_day_price: number;
  sub_total: number;
  detail_care: DetailCare[];
}

export interface DetailBuy {
  id: number;
  transaction_id: number;
  livestock_id: number;
  total_livestock: number;
  unit_price: number;
  sub_total: number;
}

export interface Transaction {
  id: number;
  customer_id: number;
  farm_id: number;
  date_transaction: string; 
  total_amount: number;
  status_transaction: string;
  rating: number | null;
  review: string | null;
  updated_at: string;
  detail_buy: DetailBuy[];
  care_transaction: CareTransaction[];
}

export interface TransactionResponse {
  message: string;
  data: Transaction[];
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

export interface CareTransactionResponse {
    message: string;
    data: CareTransaction[];
}
export interface CustomApiError {
  message: string;
  error: string;   
  statusCode: number;
}
export interface CleanCare {
    livestock_id?: number,
    shelter_id: number,
    total_livestock: number,
    start_date: string,
    finish_date: string,
    careGive_id: number[],
    address?: string
}

export interface CleanBuy {
    livestock_id: number,
    total_livestock: number,
    address: string,
}
export interface CleanCartBuy {
    transaction: Transaction;
    buy: CleanBuy[];
}

export interface CleanCartCare {
    transaction: Transaction;
    care: CleanCare[];
}
export interface CleanCartBuyCare {
    transaction: Transaction;
    care: CleanCare[];
    buy: CleanBuy[];
}