import { useEffect, useState } from "react"
import './MenuItemCard.css';

const MenuItemCard = ({menuItem, onAddToCart, cartItems, onUpdateCart}) => {
    const [isInCart, setIsInCart] = useState(false);
    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        const itemFound = cartItems?.find(item => item.foodItemId === menuItem.id);
        if (itemFound) {
            setIsInCart(true);
            setCartItem(itemFound);
        } else {
            setIsInCart(false);
            setCartItem(null);
        }
    }, [cartItems]);

    // Increase Quantity
    const handleIncreaseQuantity = async (cartId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;
        try {
            await onUpdateCart(cartId, newQuantity); // API call passed via props
        } catch (error) {
            console.error('Error increasing quantity', error);
        }
    };

    // Decrease Quantity or Remove Item if Quantity is 1
    const handleDecreaseQuantity = async (cartId, currentQuantity) => {
        if (currentQuantity === 1) {
            handleDeleteItem(cartId);
        } else {
            const newQuantity = currentQuantity - 1;
            try {
                await onUpdateCart(cartId, newQuantity); // API call passed via props
            } catch (error) {
                console.error('Error decreasing quantity', error);
            }
        }
    };

    // Delete item (remove from cart)
    const handleDeleteItem = async (cartId) => {
        try {
            await onUpdateCart(cartId, 0); // Quantity 0 removes item from cart
        } catch (error) {
            console.error('Error removing item from cart', error);
        }
    };

    return (
        <div key={menuItem.id} className="menu-item-card">
            <img src={`data:image/jpeg;base64,${menuItem.imageUrl}`} alt={menuItem.foodName} className="menu-item-image"/>
            <div className="menu-item-details">
                <div className="menu-item-info">
                <h2 className="menu-item-name">{menuItem.foodName}</h2>
                <p className="menu-item-category">{menuItem.categoryName}</p>
                <p className="menu-item-description">{menuItem.description}</p>
                </div>
                <div className="menu-item-price-container">
                <div className="menu-item-price">
                    <span className="menu-item-price-prefix">₹</span>
                    <span className="menu-item-price-value">{menuItem.price}</span>
                </div>
                {menuItem.isAvailable && !isInCart &&
                    <button 
                    className="add-to-cart-button" 
                    onClick={() => onAddToCart(menuItem.id)}
                    >
                        Add to cart
                    </button>
                }

                {menuItem.isAvailable && isInCart && (
                    <div className="quantity-controls">
                        <button 
                            className="decrease-quantity-button" 
                            onClick={() => handleDecreaseQuantity(cartItem.cartId, cartItem.quantity)}
                            >
                            -
                        </button>
                        <span className="quantity-display">{cartItem.quantity}</span>
                        <button 
                            className="increase-quantity-button" 
                            onClick={() => handleIncreaseQuantity(cartItem.cartId, cartItem.quantity)}
                            >
                            +
                        </button>
                    </div>
                )}

                {!menuItem.isAvailable &&
                    <button 
                    className="add-to-cart-button disabled danger" 
                    disabled
                    >
                        Not Available
                    </button>
                }
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;