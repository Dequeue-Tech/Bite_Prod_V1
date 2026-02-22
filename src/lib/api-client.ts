import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  pricePaise: number;
  image?: string;
  categoryId: string;
  available: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  isVeg: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: 'NONE' | 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';
  category: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  active: boolean;
  sortOrder: number;
}

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 25000, // Reduced to 25 seconds to prevent timeouts
    });
  }

  // Get base URL for the API
  getBaseURL(): string {
    return this.api.defaults.baseURL?.replace('/api', '') || 'http://localhost:5000';
  }


  // Menu methods
  async getMenuItems(categoryId?: string): Promise<ApiResponse<MenuItem[]>> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    const response = await this.api.get<ApiResponse<MenuItem[]>>(`/menu${params}`);
    return response.data;
  }

  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    const response = await this.api.get<ApiResponse<MenuItem>>(`/menu/${id}`);
    return response.data;
  }

  // Category methods
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await this.api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
