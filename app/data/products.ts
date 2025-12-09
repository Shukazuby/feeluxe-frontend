import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'adanna',
    name: 'The Adanna Scarf',
    price: 15000,
    image: '/products/adanna.jpg',
    isNew: true,
  },
  {
    id: 'ifeoma',
    name: 'The Ifeoma Scarf',
    price: 15000,
    image: '/products/ifeoma.jpg',
    isNew: true,
  },
  {
    id: 'chidinma',
    name: 'The Chidinma Scarf',
    price: 15000,
    image: '/products/chidinma.jpg',
    isNew: true,
  },
  {
    id: 'nneka',
    name: 'The Nneka Scarf',
    price: 15000,
    image: '/products/nneka.jpg',
    isNew: true,
  },
  {
    id: 'zara',
    name: 'The Zara Scarf',
    price: 16500,
    image: '/products/zara.jpg',
  },
  {
    id: 'amina',
    name: 'The Amina Scarf',
    price: 18000,
    image: '/products/amina.jpg',
  },
  {
    id: 'ngozi',
    name: 'The Ngozi Scarf',
    price: 14000,
    image: '/products/ngozi.jpg',
  },
  {
    id: 'tunde',
    name: 'The Tunde Scarf',
    price: 15500,
    image: '/products/tunde.jpg',
  },
  {
    id: 'dara',
    name: 'The Dara Scarf',
    price: 13000,
    image: '/products/dara.jpg',
  },
  {
    id: 'kemi',
    name: 'The Kemi Scarf',
    price: 17500,
    image: '/products/kemi.jpg',
  },
  {
    id: 'sade',
    name: 'The Sade Scarf',
    price: 14500,
    image: '/products/sade.jpg',
  },
  {
    id: 'obi',
    name: 'The Obi Scarf',
    price: 19000,
    image: '/products/obi.jpg',
  },
  {
    id: 'amara',
    name: 'The Amara Scarf',
    price: 14000,
    image: '/products/amara.jpg',
    isNew: true,
  },
  {
    id: 'obioma',
    name: 'The Obioma Scarf',
    price: 16000,
    image: '/products/obioma.jpg',
    isNew: true,
  },
  {
    id: 'ada',
    name: 'The Ada Scarf',
    price: 17500,
    image: '/products/ada.jpg',
    isNew: true,
  },
  {
    id: 'nkechi',
    name: 'The Nkechi Scarf',
    price: 15000,
    image: '/products/nkechi.jpg',
    isNew: true,
  },
  {
    id: 'ifunanya',
    name: 'The Ifunanya Scarf',
    price: 16000,
    image: '/products/ifunanya.jpg',
    isNew: true,
  },
];

export const featuredProducts = products.slice(0, 4);
export const newArrivals = products.filter((p) => p.isNew);

