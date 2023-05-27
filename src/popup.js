document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "https://frozen-dusk-26658.herokuapp.com/"

    fetch(API_URL + "read/test")
        .then(response => {
            return (response.json())
        })
        .then((data) => {
            console.log(data)
        })
})