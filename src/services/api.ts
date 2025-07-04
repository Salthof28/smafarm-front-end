import { Animal, Category, Farm } from "@/types/interfaces";
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

export let mockFarm: Farm[] = [
    {
        id: 1,
        userId: 1,
        name: 'Joko Farm',
        categoryShed: mockCategory[0],
        location: 'Jl.Kawaluyaan Indah Raya No.6 Soekarno-Hatta, Buahbatu, Bandung City, West Java 40286',
        images: ['https://www.sapibagus.com/wp-content/uploads/2015/04/Contoh-Kandang-Sapi.jpg', 'https://sapibagus.com/wp-content/uploads/2021/05/Kandang-Sapi-Di-Negara-Argentina.jpg'],
        accommodate: 10,
        shed: 2,
        createdAt: '28/06/2025',
        updatedAt: '28/06/2025'
    },
    {
        id: 2,
        name: 'Widodo Farm',
        userId: 2,
        categoryShed: mockCategory[0],
        location: 'Jl.Kawaluyaan Indah Raya No.6 Soekarno-Hatta, Buahbatu, Bandung City, West Java 40286',
        images: ['https://www.sapibagus.com/wp-content/uploads/2015/04/Contoh-Kandang-Sapi.jpg', 'https://sapibagus.com/wp-content/uploads/2021/05/Kandang-Sapi-Di-Negara-Argentina.jpg'],
        accommodate: 10,
        shed: 2,
        createdAt: '28/06/2025',
        updatedAt: '28/06/2025'
    }
]

export let mockAnimals: Animal[] = [
    {
        id: 1,
        type: 'Kuroge Washu',
        description: 'Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.',
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ5Re5iyDi9WAQfSAixdztS268YFnxg_r6ig&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRUzDTwjHwZmYevQetIygoP31rfU53WxAkmg&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWBJ9efNWjuhv2lJC75iiKkiqAXRDIcOHiRA&s", 'https://i.pinimg.com/736x/e2/be/03/e2be03862c0f05939418b4abf745b9f6.jpg', 'https://cdn.shopify.com/s/files/1/0711/8202/5015/files/03a4d4ec7d33d427c68504eaeb3fa73c_6430d3e7-eb6d-4962-a9d6-231446ff43c9.png?v=1738781836'],
        age: 2,
        price: 130000000,
        stock: 2,
        farm: mockFarm[0],
        category: mockCategory[0],
        userId: 1,
        createdAt: '28/06/2025',
        updatedAt: '28/06/2025'
    },
    {
        id: 2,
        type: 'Brahman',
        description: 'Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.',
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYfSXu6zpf6uaB7x0BVIKBVFSROVmk7xbng&s", "https://image.idntimes.com/post/20230924/screenshot-2023-09-24-181753-578a60e9ae7f99757965d57e96cc46d2.png", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-wKC1_nLUy9aFzEIaIYdjDwv5BoVeCCeY5g&s"],
        age: 2,
        price: 80000000,
        stock: 2,
        farm: mockFarm[0],
        category: mockCategory[0],
        userId: 1,
        createdAt: '28/06/2025',
        updatedAt: '28/06/2025'
    },
]

