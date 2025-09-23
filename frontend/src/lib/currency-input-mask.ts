const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  const amount = parseFloat(numbers) / 100;
  
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const parseCurrency = (value: string): number => {
  const numbers = value.replace(/\D/g, '');
  return parseFloat(numbers) / 100;
};

const numberToCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const isValidCurrency = (value: string): boolean => {
  if (!value || value.trim() === '') return false;
  const numericValue = parseCurrency(value);
  return numericValue > 0;
};

const getOnlyNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const currencyMask = {
  formatCurrency,
  parseCurrency,
  numberToCurrency,
  isValidCurrency,
  getOnlyNumbers,
}