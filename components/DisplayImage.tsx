import './DisplayImage.css';

interface DisplayImageProps {
    idName? : string;
    src: string;
    alt: string;
    attributes?: HTMLAttribute[];
}

interface HTMLAttribute {
    name: string;
    value: string | number | boolean;
}

/**
 * Returns <img> HTML tag with id, src, alt and provided attribute list set.
 * @param idName sets "id" for <img>
 * @param src sets "src" for <img> with provided string
 * @param alt sets "alt" for <img> with provided string
 * @param attributes accepts HTMLAttribute array (see HTMLAttribute interface), converts it into Record
 * @constructor
 */
export function DisplayImage({ idName, src, alt, attributes = [] } : DisplayImageProps) {
    const imgAttributes = attributes.reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
    }, {} as Record<string, string | number | boolean>);

    return (
        <>
            <img
                id={idName}
                className='display-image'
                src={src}
                alt={alt}
                {...imgAttributes}
            />
        </>
    )
}