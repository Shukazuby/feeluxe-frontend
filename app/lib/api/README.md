# API Integration Guide

This directory contains all API integration utilities for the Feeluxe frontend.

## Setup

1. Create a `.env.local` file in the root of the frontend project:
```env
NEXT_PUBLIC_API=http://localhost:3001
```

2. Update the URL to match your backend server address.

## API Structure

### Configuration (`config.ts`)
- Base URL configuration
- Endpoint constants
- Auth header helpers
- Error handling utilities

### API Modules

#### Auth (`auth.ts`)
- `login(email, password)` - User login
- `signup(userData)` - User registration

#### Products (`products.ts`)
- `getFeatured()` - Get featured products
- `getNewArrivals()` - Get new arrival products
- `getAll(filters?)` - Get all products with optional filters
- `getById(id)` - Get single product by ID

#### Customers (`customers.ts`)
- `getProfile(token)` - Get customer profile
- `updateProfile(token, data)` - Update profile
- `changePassword(token, data)` - Change password
- `getWishlist(token)` - Get wishlist items
- `addToWishlist(token, productId)` - Add to wishlist
- `removeFromWishlist(token, productId)` - Remove from wishlist

#### Cart (`cart.ts`)
- `getCart(token)` - Get cart items
- `addToCart(token, productId, quantity)` - Add item to cart
- `removeFromCart(token, cartItemId)` - Remove item from cart
- `clearCart(token)` - Clear entire cart

#### Orders (`orders.ts`)
- `create(token, cartItemIds)` - Create order from cart items
- `getAll(token, filters?)` - Get user orders
- `getById(token, id)` - Get single order
- `update(token, id, data)` - Update order
- `delete(token, id)` - Delete order
- `initializePayment(token, orderId)` - Initialize Paystack payment

#### Contact (`contact.ts`)
- `create(data)` - Submit contact form
- `getAll(filters?)` - Get contact submissions (admin)

## Usage Examples

### Using the `useApi` Hook (Recommended)

```tsx
'use client';
import { useApi } from '@/app/hooks/useApi';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const api = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products.getFeatured()
      .then(response => {
        if (response.success) {
          setProducts(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  // ... rest of component
}
```

### Direct API Usage

```tsx
import { productsApi } from '@/app/lib/api/products';
import { useAuth } from '@/app/components/AuthProvider';

export default function MyComponent() {
  const { token } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getFeatured();
      if (response.success) {
        console.log('Products:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ... rest of component
}
```

### Error Handling

All API functions throw `ApiError` exceptions:

```tsx
import { ApiError } from '@/app/lib/api/config';

try {
  const response = await api.products.getById('123');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.status, error.message);
  }
}
```

## Authentication

The `AuthProvider` component handles authentication state and provides:
- `token` - Current auth token
- `isAuthenticated` - Boolean auth status
- `requireAuth(action)` - Gate actions behind auth
- `logout()` - Clear auth state

Protected endpoints automatically include the Bearer token in headers.

## Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  code: number;
  message: string;
  data?: T;
  totalCount?: number;
  limit?: number;
  page?: number;
  search?: string;
}
```

