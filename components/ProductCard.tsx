import './ProductCard.css';
import { useEffect } from "react";

interface ProductCardProps {
    idName? : string;
    title: string;
    text: string;
    price: number;
    attributes?: HTMLAttribute[];
}

interface HTMLAttribute {
    name: string;
    value: string | number | boolean;
}
// TODO: Add a "Add to card" button. Add a shopping_cart_id parameter if shopping carts will be implemented to link button.
/**
 *
 * @param idName
 * @param title
 * @param text
 * @param price
 * @param attributes
 * @constructor
 */
export function ProductCard({ idName, title, text, price, attributes = [] } : ProductCardProps) {

    // Unnecessary (debug purposes)
    useEffect(() => {
        console.debug(
            'Product card event (created or updated)', '\n',
            'id: ', idName, '\n',
            'title: ', title, '\n',
            'text: ', text, '\n',
            'price: ', price, '\n',
            'attributes: ', attributes
        );
        return () => { // cleanup-функция
            console.debug('Product card with id: ', idName, ' was removed');
        };
    }, [idName, title, text, price, attributes]);

    const productCardAttributes = attributes.reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
    }, {} as Record<string, string | number | boolean>);

    return (
        <>
            <div
                className="product-card"
                id={idName}
                {...productCardAttributes}
            >
                <div className='product-card-top-box'></div>
                <div
                    className="product-card-main-box"
                >
                    <p>{title}</p>
                    <p>{text}</p>
                </div>
                <div className='product-card-bottom-box'>
                    <p>{price}</p>
                </div>
            </div>
        </>
    )
}