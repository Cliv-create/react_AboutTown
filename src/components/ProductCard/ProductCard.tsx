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
 * Returns a "product card" with given parameters. To efficiently utilize the component, place the ProductCard object/s inside a container with className "product-grid". The cards will be placed in this container as a grid. Container will be edited with the CSS from ProductCard.css
 * @param idName String. Set's "id" attribute for the component.
 * @param title String. Displays product title.
 * @param text String. Displays product description.
 * @param price Number. Displays price.
 * @param attributes Array of HTMLAttribute. Converts into Record[] and is used in parent div with "product-card" class.
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
        <div
             className="product-card"
             id={idName}
             {...productCardAttributes}
        >
            <div className="product-card-content">
                <div className="product-card-grid">
                    <div>
                        <h2 className="product-title">{title}</h2>
                        <p className="product-text">{text}</p>
                    </div>
                    <div className="product-price-container">
                        <p>
                            <span className="product-price">${price}</span>
                            <span className="product-price-suffix"> /usd </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="product-card-footer">
                <a
                    href="#"
                    className="product-card-button"
                    aria-describedby="product-card-select-button"
                >
                    Get started
                </a>
            </div>
        </div>
    )
}