import { useEffect, useState } from "react"

const MenuItemCard = ({menuItem, onAddToCart, cartItems}) => {

    const [isInCart, setIsInCart] = useState(false);
    useEffect(() => {
        console.log(cartItems)
        const itemFound = cartItems?.find(item=>item.foodItemId === menuItem.id)
        if(itemFound && itemFound!==undefined){
            setIsInCart(true);
        }
    },[cartItems])
    return (
       <div key={menuItem.id} className="menu-item-card">
                        <img src={`data:image/jpeg;base64,${menuItem.imageUrl}`} alt={menuItem.foodName} className="menu-item-image"/>
                        <div className="menu-item-details">
                            <h2 className="menu-item-name">{menuItem.foodName}</h2>
                            <p className="menu-item-category">{menuItem.categoryName}</p>
                            <p className="menu-item-description">{menuItem.description}</p>
                            {/* <p className="menu-item-price">{menuItem.price}</p> */}
                           
                            {/* <span className={`menu-item-status ${menuItem.isAvailable ? 'available' : 'not-available'}`}>
                                {menuItem.isAvailable ? 'Available' : 'Not Available'}
                            </span> */}
                            {menuItem.isAvailable && !isInCart &&
                                <button 
                                className="add-to-cart-button" 
                                onClick={() => onAddToCart(menuItem.id)}
                                >
                                    Add to cart
                                </button>
                            }
                            {menuItem.isAvailable && isInCart &&
                                <button 
                                className="add-to-cart-button danger" 
                                disabled
                                >
                                    Added to cart
                                </button>
                            }
                            {
                                !menuItem.isAvailable &&
                                <button 
                                className="add-to-cart-button disabled danger" 
                                disabled
                                >
                                    Not Available
                                </button>
                            }
                        </div>
                    </div>
    )

}


export default MenuItemCard;