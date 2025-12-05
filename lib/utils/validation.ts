/**
 * @file lib/utils/validation.ts
 * @description 데이터 유효성 검사 유틸리티
 *
 * API 응답 및 사용자 입력 데이터의 유효성을 검사하는 함수들
 */

// API 응답 타입 가드
export function isValidApiResponse<T>(
  data: unknown,
  validator: (data: unknown) => data is T
): data is T {
  try {
    return validator(data);
  } catch {
    return false;
  }
}

// 상품 데이터 유효성 검사
export function isValidProduct(product: unknown): product is {
  id: string;
  name: string;
  price: number;
  category?: string;
  stock_quantity: number;
  is_active: boolean;
} {
  if (!product || typeof product !== "object") return false;

  const p = product as any;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.price === "number" &&
    p.price >= 0 &&
    (p.category === undefined || typeof p.category === "string") &&
    typeof p.stock_quantity === "number" &&
    p.stock_quantity >= 0 &&
    typeof p.is_active === "boolean"
  );
}

// 장바구니 아이템 유효성 검사
export function isValidCartItem(item: unknown): item is {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    category?: string;
  };
} {
  if (!item || typeof item !== "object") return false;

  const i = item as any;
  return (
    typeof i.id === "string" &&
    typeof i.product_id === "string" &&
    typeof i.quantity === "number" &&
    i.quantity > 0 &&
    (i.product === undefined || isValidProduct(i.product))
  );
}

// 주문 데이터 유효성 검사
export function isValidOrder(order: unknown): order is {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: string;
  shipping_address?: {
    name: string;
    phone: string;
    postalCode: string;
    address: string;
    detailAddress: string;
  };
  created_at: string;
} {
  if (!order || typeof order !== "object") return false;

  const o = order as any;
  return (
    typeof o.id === "string" &&
    typeof o.clerk_id === "string" &&
    typeof o.total_amount === "number" &&
    o.total_amount >= 0 &&
    typeof o.status === "string" &&
    typeof o.created_at === "string" &&
    (o.shipping_address === undefined ||
      (typeof o.shipping_address === "object" &&
        o.shipping_address &&
        typeof o.shipping_address.name === "string" &&
        typeof o.shipping_address.phone === "string" &&
        typeof o.shipping_address.postalCode === "string" &&
        typeof o.shipping_address.address === "string" &&
        typeof o.shipping_address.detailAddress === "string"))
  );
}

// 결제 데이터 유효성 검사
export function isValidPayment(payment: unknown): payment is {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: string;
} {
  if (!payment || typeof payment !== "object") return false;

  const p = payment as any;
  return (
    typeof p.paymentKey === "string" &&
    typeof p.orderId === "string" &&
    typeof p.amount === "number" &&
    p.amount > 0 &&
    typeof p.status === "string"
  );
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 전화번호 유효성 검사 (한국)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+82|0)[0-9]{8,11}$/;
  const cleanPhone = phone.replace(/[-\s]/g, "");
  return phoneRegex.test(cleanPhone);
}

// 우편번호 유효성 검사 (한국)
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
}

// 가격 유효성 검사
export function isValidPrice(price: number): boolean {
  return typeof price === "number" && price >= 0 && isFinite(price);
}

// 수량 유효성 검사
export function isValidQuantity(quantity: number): boolean {
  return typeof quantity === "number" && quantity > 0 && Number.isInteger(quantity);
}

// 문자열 길이 제한 검사
export function isValidLength(
  str: string,
  minLength: number = 0,
  maxLength: number = Infinity
): boolean {
  if (typeof str !== "string") return false;
  return str.length >= minLength && str.length <= maxLength;
}

// 안전한 숫자 변환
export function safeParseInt(value: unknown, defaultValue: number = 0): number {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
}

// 안전한 실수 변환
export function safeParseFloat(value: unknown, defaultValue: number = 0): number {
  if (typeof value === "number" && isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
}

// 객체 안전 접근
export function safeGet<T>(obj: unknown, path: string[], defaultValue: T): T {
  try {
    let current = obj;
    for (const key of path) {
      if (current && typeof current === "object" && key in current) {
        current = (current as any)[key];
      } else {
        return defaultValue;
      }
    }
    return current as T;
  } catch {
    return defaultValue;
  }
}
