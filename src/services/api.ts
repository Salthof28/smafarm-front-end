import { Animal, Category } from "@/types/interfaces";

export let mockAnimals: Animal[] = [
    {
        id: 1,
        type: 'Kuroge Washu',
        description: 'Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.',
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ5Re5iyDi9WAQfSAixdztS268YFnxg_r6ig&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRUzDTwjHwZmYevQetIygoP31rfU53WxAkmg&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWBJ9efNWjuhv2lJC75iiKkiqAXRDIcOHiRA&s"],
        age: 2,
        price: 130000000,
        category: {
            id: 1,
            name: 'Cow',
            slug: 'cow',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkvy5wCD2kMlWbP7f-wdMVYVgB8L45FerDsSJfrnc9m_dFGLRbGg6324U2MgyaqNeCaho&usqp=CAU'
        },
        userId: 1
    },
    {
        id: 2,
        type: 'Brahman',
        description: 'Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.',
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYfSXu6zpf6uaB7x0BVIKBVFSROVmk7xbng&s", "https://image.idntimes.com/post/20230924/screenshot-2023-09-24-181753-578a60e9ae7f99757965d57e96cc46d2.png", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-wKC1_nLUy9aFzEIaIYdjDwv5BoVeCCeY5g&s"],
        age: 2,
        price: 80000000,
        category: {
            id: 1,
            name: 'Cow',
            slug: 'cow',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkvy5wCD2kMlWbP7f-wdMVYVgB8L45FerDsSJfrnc9m_dFGLRbGg6324U2MgyaqNeCaho&usqp=CAU'
        },
        userId: 1
    },
]

export const mockCategory: Category[] = [
    {
        id: 1,
        name: 'Cow',
        slug: 'cow',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkvy5wCD2kMlWbP7f-wdMVYVgB8L45FerDsSJfrnc9m_dFGLRbGg6324U2MgyaqNeCaho&usqp=CAU'
    },
    {
        id: 2,
        name: 'Sheep',
        slug: 'sheep',
        image: 'https://a-z-animals.com/media/2021/12/sheep.jpg'
    }
];