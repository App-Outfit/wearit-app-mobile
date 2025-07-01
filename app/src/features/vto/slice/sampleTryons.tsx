// src/features/tryon/data/sampleTryons.ts

export type TryonData = {
    id: string;
    body_id: string;
    cloth_id: string;
    tryon_url: any;
};

// Base path to the VTO assets
const basePath = '../../../assets/images/exemples/vto/';

export const sampleTryons: TryonData[] = [
    {
        id: 'tryon1',
        body_id: 'body1',
        cloth_id: 'dress1',
        tryon_url: require(basePath + '001_dress1_output.png'),
    },
    {
        id: 'tryon2',
        body_id: 'body1',
        cloth_id: 'dress2',
        tryon_url: require(basePath + '001_dress2_output.png'),
    },
    {
        id: 'tryon3',
        body_id: 'body1',
        cloth_id: 'dress3',
        tryon_url: require(basePath + '001_dress3_output.png'),
    },
    {
        id: 'tryon4',
        body_id: 'body1',
        cloth_id: 'dress4',
        tryon_url: require(basePath + '001_dress4_output.png'),
    },
    {
        id: 'tryon5',
        body_id: 'body1',
        cloth_id: 'dress5',
        tryon_url: require(basePath + '001_dress5_output.png'),
    },
    {
        id: 'tryon6',
        body_id: 'body1',
        cloth_id: 'dress6',
        tryon_url: require(basePath + '001_dress6_output.png'),
    },
    {
        id: 'tryon7',
        body_id: 'body1',
        cloth_id: 'upper2',
        tryon_url: require(basePath + '001_upper2_output.png'),
    },
    {
        id: 'tryon8',
        body_id: 'body1',
        cloth_id: 'upper3',
        tryon_url: require(basePath + '001_upper3_output.png'),
    },
    {
        id: 'tryon9',
        body_id: 'body1',
        cloth_id: 'upper4',
        tryon_url: require(basePath + '001_upper4_output.png'),
    },
];

export type ClothData = {
    cloth_type: 'upper' | 'lower' | 'dress';
    cloth_url: any;
    category: string;
    cloth_id: string;
};

export const sampleCloths: ClothData[] = [
    {
        cloth_type: 'dress',
        cloth_url: require(basePath + 'MiniDressing/dress1.png'),
        category: 'dress',
        cloth_id: 'dress1',
    },
    {
        cloth_type: 'dress',
        cloth_url: require(basePath + 'MiniDressing/dress2.png'),
        category: 'dress',
        cloth_id: 'dress2',
    },
    {
        cloth_type: 'dress',
        cloth_url: require(basePath + 'MiniDressing/dress3.png'),
        category: 'dress',
        cloth_id: 'dress3',
    },
    {
        cloth_type: 'dress',
        cloth_url: require(basePath + 'MiniDressing/dress4.png'),
        category: 'dress',
        cloth_id: 'dress4',
    },
    {
        cloth_type: 'dress',
        cloth_url: require(basePath + 'MiniDressing/dress5.png'),
        category: 'dress',
        cloth_id: 'dress5',
    },
    {
        cloth_type: 'dress',
        cloth_url: require(basePath + 'MiniDressing/dress6.png'),
        category: 'dress',
        cloth_id: 'dress6',
    },
    {
        cloth_type: 'upper',
        cloth_url: require(basePath + 'MiniDressing/upper2.png'),
        category: 'upper',
        cloth_id: 'upper2',
    },
    {
        cloth_type: 'upper',
        cloth_url: require(basePath + 'MiniDressing/upper3.png'),
        category: 'upper',
        cloth_id: 'upper3',
    },
    {
        cloth_type: 'upper',
        cloth_url: require(basePath + 'MiniDressing/upper4.png'),
        category: 'upper',
        cloth_id: 'upper4',
    },
];
