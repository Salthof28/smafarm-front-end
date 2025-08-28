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
export enum StatusFarm {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}
export type Farm = {
  id: number,
  user_id: number,
  name: string,
  status_farm: StatusFarm,
  location: string,
  img_farm: string,
  rating: number,
  created_at: string, 
  updated_at: string,
  shelters: Shelter[],
  livestock: Livestock[], 
};
export interface ImageUrl {
    id: number;
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
    category_id: number
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
    duration_care: number;
    total_livestock: number;
    shelter_id: number;
    start_date: string; 
    finish_date: string;
    one_day_price: number;
    sub_total: number;
    detail_care: DetailCare[];
    shelter?: {
        name: string;
        img_shelter: ImageUrl[]
    };
}

export interface DetailBuy {
    id: number;
    transaction_id: number;
    livestock_id: number;
    total_livestock: number;
    unit_price: number;
    sub_total: number;
    livestock?: {
        name: string;
        img_livestock: ImageUrl[]
    };
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
export interface FarmAllResponse {
    message: string;
    data: Farm[];
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

export interface CleanTransaction {
    id_farm: number
}
export interface CleanCartBuy {
    transaction: CleanTransaction;
    buy: CleanBuy[];
}
export interface CleanCartCare {
    transaction: CleanTransaction;
    care: CleanCare[];
}
export interface CleanCartBuyCare {
    transaction: CleanTransaction;
    care?: CleanCare[];
    buy?: CleanBuy[];
}

export interface FormValues {
    name?: string,
    email?: string,
    phone?: string,
    oldPassword?: string,
    password?: string
}

export interface CreateShelter {
    name: string;
    location: string;
    accomodate: number;
    description: string;
    price_daily: number;
    category_id: number;
}

export interface UpdateShelterDto {
    id?: number;
    name?: string;
    location?: string;
    accomodate?: number;
    description?: string;
    price_daily?: number;
    category_id?: number;
}

export interface CreateCareDto {
  name: string;
  price: number;
  unit: string;
  required: boolean;
}

export interface UpdateCareDto {
  id: number;
  name?: string;
  price?: number;
  unit?: string;
  required?: boolean;
}

export interface AllUpdateShelter {
  shelter_id: number;
  shelter?: UpdateShelterDto;
  uploadImage?: string[];
  deleteImage?: number[];
  newCare?: Partial<CreateCareDto>[];
  updateCare?: UpdateCareDto[];
  deleteCare?: number[];
}

// interface untuk response API
export interface UpdateShelterResponse {
    success: boolean;
    updatedFields?: string[];
    newImages?: number;
    deletedImages?: number;
    newCareCount?: number;
    updatedCareCount?: number;
    deletedCareCount?: number;
}

export interface DeleteUrlDto {
    id: number; //shelter_id or livestock_id
    url: string[];
}

export interface CreateLivestockDto {
    category_id: number;
    name: string;
    age: number;
    price: number;
    stock: number;
    description: string;
    location: string;
}

export interface UpdateLivestockDto {
    id: number;
    category_id?: number;
    name?: string;
    age?: number;
    price?: number;
    stock?: number;
    description?: string;
    location?: string;
}

export interface AllUpdateLivestock {
    livestock_id: number;
    livestock?: UpdateLivestockDto;
    uploadImage?: string[];
    deleteImage?: number[];
}

export interface UpdateCareTransaction {
    duration_care: number,
    start_date: string,
    finish_date: string,
    sub_total: number
}

export interface ReviewTransaction {
    rating: number,
    review?: string,
}

export interface UpdateStatusTransaction {
    status_transaction: string,
}

export interface UpdateStatusFarm {
    status_farm: string,
}

export interface UserOut {
    id: number
    name: string,
    email: string,
    phone: string,
    status: string,
    img_profile: string,
    role: string,
    created_at: Date,
    updated_at: Date,
}

export interface UserResponse {
  message: string;
  data: UserOut[];
}

export interface UpdateUser {
    name?: string,
    email?: string,
    phone?: string,
    status?: string,
    img_profile?: string,
    role?: string,
}