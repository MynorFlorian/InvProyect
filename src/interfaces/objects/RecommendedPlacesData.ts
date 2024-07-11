
export type IRecommendedPlaces = {
    id: string;
    title: string;
    image: string;
    biofriendly: boolean;
    favorite: boolean;
};

export const mockRecommendedPlaces: IRecommendedPlaces[] = [
    {
        id: '1',
        title: 'Neapolitan pizza, Spaghetti',
        image: 'https://spoonacular.com/recipeImages/579248-556x370.jpg',
        biofriendly: true,
        favorite: true,
    },
    {
        id: '2',
        title: 'Drink',
        image: 'https://spoonacular.com/recipeImages/579244-556x370.jpg',
        favorite: false,
        biofriendly: true,
    },
    {
        id: '3',
        title: 'Salad',
        image: 'https://spoonacular.com/recipeImages/579243-556x370.jpg',
        biofriendly: false,
        favorite: false,
    },
    {
        id: '4',
        title: 'Hamburger',
        image: 'https://spoonacular.com/recipeImages/579242-556x370.jpg',
        biofriendly: false,
        favorite: false,
    },
    {
        id: '5',
        title: 'Pizza',
        image: 'https://spoonacular.com/recipeImages/579243-556x370.jpg',
        biofriendly: true,
        favorite: true,
    },
    {
        id: '6',
        title: 'Sushi',
        image: 'https://spoonacular.com/recipeImages/579248-556x370.jpg',
        biofriendly: false,
        favorite: false,
    },
    {
        id: '7',
        title: 'Icecream',
        image: 'https://spoonacular.com/recipeImages/579248-556x370.jpg',
        biofriendly: true,
        favorite: true,
    },
    {
        id: '8',
        title: 'Donuts',
        image: 'https://spoonacular.com/recipeImages/579248-556x370.jpg',
        biofriendly: false,
        favorite: false,
    },
];
