import './DisplayImage.css';

interface DisplayImageProps {
    idName? : string;
    src: string;
    alt: string;
}

/**
 * Returns img tag with src and alt parameters set.
 * @param props array of properties, accepts "src", "alt", "idName" as strings
 * @constructor
 */
export function DisplayImage({ idName, src, alt } : DisplayImageProps) {
    return (
        <>
            <img id={idName} className='display-image' src={src} alt={alt} />
        </>
    )
}