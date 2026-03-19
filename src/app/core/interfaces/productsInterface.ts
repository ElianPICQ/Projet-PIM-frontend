export interface Product {
  id: number;
  name: string;
  category: number;
  price: number;
  unit: string;
  availability: boolean;
  sale: boolean;
  discount: number;
  comments: string;
  owner: string;
}

export interface StockProduct {
  original_product_id: number;
  name: string;
  category: number;
  quantity: number;
  price: number;
  discount: number;
  comments: string;
  supplier: string;
}