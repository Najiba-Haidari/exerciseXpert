// import axios from 'axios'

const url = "https://exercisedb.p.rapidapi.com/exercises/bodyPartList";
const API_KEY = "7e16663340mshbfb2c833d8dcaffp1f960fjsnc96a63bc6c4c";

const bodyPartsContainer = document.getElementById("container-bodyparts")
const exerciseContainer = document.getElementById("container-exercises")
const exerciseTitle = document.getElementById("title");
const viewButton = document.getElementById("view-button")
const icon = document.getElementById("icon")
// const bodyPartsButton = document.querySelectorAll("button");

viewButton.addEventListener("click", loadBodyParts);

async function loadBodyParts() {
    try {

        bodyPartsContainer.innerHTML = "";
        const bodyPartList = await axios.get(url,
            {
                headers: {
                    'X-RapidAPI-Key': API_KEY,
                    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                }
            });
        console.log(bodyPartList.data);
        const bodyPartsData = bodyPartList.data
        bodyPartsData.forEach((item) => {
            const buttonEl = document.createElement("button");
            buttonEl.textContent = capitalizeFirstLetter(item);
            buttonEl.classList.add("btn-bodyParts")
            bodyPartsContainer.appendChild(buttonEl)

        })
        viewButton.style.display = 'none';
    } catch (error) {
        console.log(error)
    }
}

// loadBodyParts();

function capitalizeFirstLetter(word) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

bodyPartsContainer.addEventListener("click", handleClickButtons)

async function handleClickButtons(event) {

    if (event.target.classList.contains("btn-bodyParts")) {
        const bodyPart = event.target.textContent.toLowerCase();
        console.log("Clicked:", bodyPart);
        // You can add further logic here based on the button text

        try {
            const exercises = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=10`,
                {
                    headers: {
                        'X-RapidAPI-Key': API_KEY,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                    }
                });
            console.log(exercises.data)
            const exercisesData = exercises.data;
            exerciseContainer.innerHTML = ""
            exercisesData.forEach((exercise) => {

                exerciseTitle.innerHTML = `<h2 class="text-center">${capitalizeFirstLetter(exercise.bodyPart)} exercises are here!</h2>`
                const exerciseCard = document.createElement("div");
                exerciseCard.classList.add("card");
                exerciseCard.style.width = "18rem";
                exerciseCard.innerHTML = `
                        <img src="${exercise.gifUrl}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${exercise.name}</h5>
                            <p class="card-text">Targeting ${exercise.target} and using equipment ${exercise.equipment}</p>
                        </div>
                    `;
                exerciseContainer.appendChild(exerciseCard);
                exerciseContainer.style.backgroundColor = " rgba(36, 37, 37, 0.6)"
            })

        } catch (error) {
            console.log("error for exercises", error)
        }
    }
}

icon.addEventListener("click", () => {
    window.location.reload()
})