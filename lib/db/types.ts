// Hand-authored Supabase `Database` types, kept in sync with supabase/migrations.
// These let the typed clients compile before a live project exists. Once the DB
// is provisioned, regenerate the authoritative version with:
//   npx supabase gen types typescript --project-id <ref> --schema public > lib/db/types.ts
// (keep the same file path so imports don't change).

type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type StaffRole = "owner" | "manager" | "fulfilment" | "support" | "finance" | "readonly";
export type OrderStatus =
  | "payment_pending" | "processing" | "paid" | "packed"
  | "shipped" | "delivered" | "cancelled" | "returned";
export type CouponType = "pct" | "flat";
export type ProductRange = "ethical" | "nutraceutical";
export type EnquiryTrack = "export" | "distributor" | "doctor" | "general";
export type EnquiryStatus = "new" | "in_progress" | "closed";
export type ReturnStatus = "requested" | "approved" | "rejected" | "received" | "refunded";

// Helper to declare a table with sensible Insert/Update defaults.
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type CategoryRow = { id: string; name: string; slug: string; seo: string | null; sort_order: number; created_at: string };
type ProductRow = {
  id: string; slug: string; name: string; segment: string | null; base_sku: string | null;
  badge: string | null; tax_rate: number; tax_code: string | null; short_desc: string | null;
  features: Json; rating: number; review_count: number; icon: string | null; bg: string | null;
  image: string | null; content: Json; faqs: Json; range: ProductRange | null;
  category_id: string | null; active: boolean; created_at: string; updated_at: string;
};
type ProductVariantRow = { id: string; product_id: string; label: string; sku: string; price: number; mrp: number; stock: number; sort_order: number };
type ProductReviewRow = { id: string; product_id: string; name: string; rating: number; text: string | null; approved: boolean; created_at: string };
type CustomerRow = { id: string; name: string | null; email: string | null; phone: string | null; created_at: string };
type AddressRow = { id: string; customer_id: string; name: string | null; line1: string | null; line2: string | null; city: string | null; state: string | null; pincode: string | null; phone: string | null; is_default: boolean; created_at: string };
type CouponRow = { code: string; type: CouponType; value: number; description: string | null; active: boolean; uses: number; cap: number; min_cart: number; expires_at: string | null };
type OrderRow = {
  id: string; order_number: string; customer_id: string | null; email: string | null; phone: string | null;
  status: OrderStatus; subtotal: number; discount: number; shipping: number; tax: number; total: number;
  coupon_code: string | null; payment_method: string | null; shipping_address: Json; notes: string | null;
  created_at: string; updated_at: string;
};
type OrderItemRow = { id: string; order_id: string; product_id: string | null; variant_sku: string | null; name: string | null; label: string | null; unit_price: number; qty: number; tax_rate: number };
type OrderEventRow = { id: string; order_id: string; label: string; actor: string | null; created_at: string };
type ReturnRow = { id: string; order_id: string | null; customer_id: string | null; reason: string | null; status: ReturnStatus; items: Json; created_at: string; updated_at: string };
type CartRow = { id: string; customer_id: string | null; created_at: string; updated_at: string };
type CartItemRow = { id: string; cart_id: string; product_id: string | null; variant_sku: string | null; qty: number };
type StaffRow = { id: string; user_id: string | null; name: string; email: string; role: StaffRole; active: boolean; created_at: string };
type AuditRow = { id: string; actor: string | null; action: string; entity: string | null; detail: string | null; created_at: string };
type KvRow = { key: string; value: Json; updated_at: string };
type EnquiryRow = {
  id: string; track: EnquiryTrack; name: string; organisation: string | null; email: string | null;
  phone: string | null; message: string; status: EnquiryStatus; source: string; created_at: string;
};

// Insert shapes where required fields matter (used by the wired paths).
type EnquiryInsert = {
  track?: EnquiryTrack; name: string; organisation?: string | null; email?: string | null;
  phone?: string | null; message: string; status?: EnquiryStatus; source?: string;
};

export type Database = {
  public: {
    Tables: {
      categories: Table<CategoryRow>;
      products: Table<ProductRow>;
      product_variants: Table<ProductVariantRow>;
      product_reviews: Table<ProductReviewRow>;
      customers: Table<CustomerRow>;
      addresses: Table<AddressRow>;
      coupons: Table<CouponRow>;
      orders: Table<OrderRow>;
      order_items: Table<OrderItemRow>;
      order_events: Table<OrderEventRow>;
      returns: Table<ReturnRow>;
      carts: Table<CartRow>;
      cart_items: Table<CartItemRow>;
      staff: Table<StaffRow>;
      audit_log: Table<AuditRow>;
      kv_settings: Table<KvRow>;
      enquiries: Table<EnquiryRow, EnquiryInsert>;
    };
    Views: {
      product_list: { Row: ProductRow & { price: number; mrp: number; stock: number }; Relationships: [] };
    };
    Functions: {
      is_staff: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      staff_role: StaffRole;
      order_status: OrderStatus;
      coupon_type: CouponType;
      product_range: ProductRange;
      enquiry_track: EnquiryTrack;
      enquiry_status: EnquiryStatus;
      return_status: ReturnStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
