// src/lib/formatPrice.ts

export const formatPrice = (amount: number | string): string => {
  const price = Number(amount);
  
  if (isNaN(price)) {
    return '0 đ';
  }

  // Format sang định dạng tiền tệ Việt Nam (ví dụ: 10.000.000 đ)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0, // Không lấy số lẻ
  }).format(price);
};