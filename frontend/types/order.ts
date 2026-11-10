export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: string;
  product?: {id: number; name:string };
};

export type Order = {
  id: number;
  total: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  payment?: { stripe_payment_id: string; status: string } | null;
};