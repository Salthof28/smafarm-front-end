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