export interface Category {
    id: number,
    name: string,
    slug: string,
    image: string
};

export interface Animal {
    id: number,
    type: string,
    description: string,
    images: string[],
    age: number,
    category: Category,
    userId: number
}