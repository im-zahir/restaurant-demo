export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
