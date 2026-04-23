export const EXCHANGE_RATE = 1500; // 1 USD = 1500 NGN

export const formatPrice = (priceInNgn: number) => {
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const ngnFormatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  });

  return {
    ngn: ngnFormatter.format(priceInNgn),
    usd: usdFormatter.format(priceInNgn / EXCHANGE_RATE)
  };
};
