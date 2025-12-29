

export const formatPrice = (amount: number | string): string => {
  const price = Number(amount);
  
  if (isNaN(price)) {
    return '0 đ';
  }

  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0, 
  }).format(price);
};