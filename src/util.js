export function capitalizeFirstLetter(word) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

export function reloadPage(){
    window.location.reload()
}