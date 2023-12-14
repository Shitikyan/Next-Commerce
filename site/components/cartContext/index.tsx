import React, { createContext, useContext, useEffect, useState } from 'react'

type cartInfo = {
  total: number
}

interface CartState {
  cartInfo: cartInfo
  setCartInfo(cartInfo: cartInfo): void
}

const defaultCartState: CartState = {
  cartInfo: { total: 0 },
  setCartInfo: () => {},
}

const CartContext = createContext(defaultCartState)

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider = ({ children }: CartProviderProps): JSX.Element => {
  const [cartInfo, setCartInfo] = useState(defaultCartState.cartInfo)
  return (
    <CartContext.Provider value={{ cartInfo, setCartInfo }}>
      {' '}
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
