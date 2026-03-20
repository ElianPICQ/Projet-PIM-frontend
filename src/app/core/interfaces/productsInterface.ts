// Fetched products from the supplier
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

// Product selected by the user to be added to the stock
export interface ProductPageProduct {
  original_product_id: number;
  name: string;
  category: number;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  comments: string;
  owner: string;
}

// Product in the stock
export interface StockPageProduct {
  id: number;
  original_product_id: number;
  name: string;
  category: number;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  comments: string;
  owner: string;
}

export interface StockProductToUpdate {
  id?: number;
  original_product_id: number;
  name: string;
  category: number;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  comments: string;
  owner: string;
  operation: 'Achat' | 'Vente' | 'Invendu';
}