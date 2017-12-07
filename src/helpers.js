/**
 * @desc load image
 * @param {Function} onload on load image callback
 */
export const loadImage = (src, onload) => {
    var image = new Image();
    image.src = src;
    image.onload = onload.bind(null, image);
};

/**
 * @desc Get coordinates by position
 * @param {Number} size 
 */
export const getCoordinatesByPosition = size => position => ({
    x: position % size,
    y: Math.floor(position / size)
});

/**
 * @desc swap the given items in the given array
 * @return {Function} takes two elements to swap
 * @param {Array} array of items
 */
export const swapItemsInArray = array => (firstElemnt, secondElement) => {
    const firstElemntIndex = array.indexOf(firstElemnt);
    const secondElementIndex = array.indexOf(secondElement);

    // return the same array if one of the item is not in teh given array.
    if (firstElemntIndex === -1 || firstElemntIndex === -1) return array;

    // let's not mutate the array directly!
    const newArray = [...array];

    newArray[firstElemntIndex] = secondElement;
    newArray[secondElementIndex] = firstElemnt;

    return newArray;
}

/**
 * @desc create DOM element of the given type and props.
 * @returns {DOMElement}
 */
export const createDOMElement = type => props => {
    const element = document.createElement(type);
    return Object.assign(element, props)
}