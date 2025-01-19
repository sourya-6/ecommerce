// utils/calculateDiscount.js
const calculateDiscountedPrice = (price, discountPercentage) => {
    if (!discountPercentage) return price;
    const discount = (price * discountPercentage) / 100;
    return price - discount;
  };
  
  export { calculateDiscountedPrice };
  