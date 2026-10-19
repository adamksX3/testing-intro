const SAVE10_MIN_SUBTOTAL = 20000;
const FREE_DELIVERY_FROM = 50000;
const DELIVERY_PRICE = 30000;

function assertValidQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество должно быть положительным целым числом');
  }
}

function assertEnoughStock(quantity, stock) {
  if (quantity > stock) {
    throw new RangeError('Нельзя взять больше товара, чем есть на складе');
  }
}

function addToCart(cart, product, quantity) {
  assertValidQuantity(quantity);

  const existingItem = cart.find((item) => item.id === product.id);

  const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;
  assertEnoughStock(newQuantity, product.stock);

  if (existingItem) {
    return cart.map((item) => (
      item.id === product.id ? { ...item, quantity: newQuantity } : item
    ));
  }

  return [...cart, { ...product, quantity }];
}

function changeQuantity(cart, productId, quantity) {
  assertValidQuantity(quantity);

  const existingItem = cart.find((item) => item.id === productId);

  if (!existingItem) {
    return [...cart];
  }

  assertEnoughStock(quantity, existingItem.stock);

  return cart.map((item) => (
    item.id === productId ? { ...item, quantity } : item
  ));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);

  const hasDiscount = promoCode === 'SAVE10' && subtotal >= SAVE10_MIN_SUBTOTAL;
  const discount = hasDiscount ? Math.round(subtotal * 0.1) : 0;

  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;

  return {
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
  };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
