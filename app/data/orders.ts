import { Order } from '../types';
import { products } from './products';

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'FLX12345',
    date: '2024-03-10',
    status: 'delivered',
    product: products[0], // The Adanna Scarf
    quantity: 1,
  },
  {
    id: '2',
    orderNumber: 'FLX12346',
    date: '2024-03-08',
    status: 'shipped',
    product: products[1], // The Ifeoma Scarf
    quantity: 1,
  },
  {
    id: '3',
    orderNumber: 'FLX12347',
    date: '2024-03-05',
    status: 'delivered',
    product: products[2], // The Chidinma Scarf
    quantity: 1,
  },
  {
    id: '4',
    orderNumber: 'FLX12348',
    date: '2024-03-03',
    status: 'delivered',
    product: products[3], // The Nneka Scarf
    quantity: 1,
  },
  {
    id: '5',
    orderNumber: 'FLX12349',
    date: '2024-03-01',
    status: 'pending',
    product: products[12], // The Amara Scarf
    quantity: 1,
  },
];

