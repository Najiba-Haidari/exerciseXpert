// import axios from 'axios'

const url = "https://exercisedb.p.rapidapi.com/exercises/bodyPartList";
const API_KEY = "7e16663340mshbfb2c833d8dcaffp1f960fjsnc96a63bc6c4c";

const bodyPartsContainer = document.getElementById("container-bodyparts")
const exerciseContainer = document.getElementById("container-exercises")
const exerciseTitle = document.getElementById("title");
const viewButton = document.getElementById("view-button")
const icon = document.getElementById("icon")
const savedContainer = document.getElementById("container-saved")
const getSavedButton = document.getElementById("get-saved")
// const saveBtn = document.getElementById("save-btn")
// const bodyPartsButton = document.querySelectorAll("button");

viewButton.addEventListener("click", loadBodyParts);
// getSavedButton.style.display = "none"
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
        console.log("Body Parts:", bodyPartList.data);
        const bodyPartsData = bodyPartList.data
        bodyPartsData.forEach((item) => {
            const buttonEl = document.createElement("button");
            buttonEl.textContent = capitalizeFirstLetter(item);
            buttonEl.classList.add("btn-bodyParts")
            bodyPartsContainer.appendChild(buttonEl)
            getSavedButton.classList.remove("hidden")
        })
        viewButton.style.display = 'none';
        savedContainer.innerHTML = ""
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
            console.log("Body Part Exercise", exercises.data)
            const exercisesData = exercises.data;
            exerciseContainer.innerHTML = "";
            savedContainer.innerHTML = "";
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
                            <button id="save-btn" class="save btn btn-primary w-50">Save</button>
                        </div>
                    `;
                exerciseContainer.appendChild(exerciseCard);
                exerciseContainer.style.backgroundColor = " rgba(36, 37, 37, 0.6)"

                const saveBtn = exerciseCard.querySelector("#save-btn");

                saveBtn.addEventListener("click", async () => {
                    try {

                        console.log(exercise.id)
                        const getAll = await axios.get("https://json-store.p.rapidapi.com/",
                            {
                                headers: {
                                    'X-RapidAPI-Key': 'cee23baa0amshab7b2d353f6de30p134a0ajsnc54ace73156b',
                                    'X-RapidAPI-Host': 'json-store.p.rapidapi.com'
                                }
                            }
                        )
                        // console.log(getAll.data)

                        const savedData = await axios.put('https://json-store.p.rapidapi.com/', {
                            id: exercise.id,
                            bodyPart: exercise.bodyPart,
                            name: exercise.name,
                            target: exercise.target,
                            gifUrl: exercise.gifUrl
                        }, {
                            headers: {
                                'content-type': 'application/json',
                                'X-RapidAPI-Key': 'cee23baa0amshab7b2d353f6de30p134a0ajsnc54ace73156b',
                                'X-RapidAPI-Host': 'json-store.p.rapidapi.com'
                            }
                        });
                        console.log("Exercise saved successfully:", savedData.data);
                        saveBtn.textContent = "Saved"
                    } catch (error) {
                        console.log("Error saving exercise:", error);
                    }
                });
            }
            );

        } catch (error) {
            console.log("error for exercises", error)
        }
    }
}

icon.addEventListener("click", () => {
    window.location.reload()
})

getSavedButton.addEventListener("click", getSavedExercises);

async function getSavedExercises() {
    try {
        const getAll = await axios.get("https://json-store.p.rapidapi.com/",
            {
                headers: {
                    'X-RapidAPI-Key': 'cee23baa0amshab7b2d353f6de30p134a0ajsnc54ace73156b',
                    'X-RapidAPI-Host': 'json-store.p.rapidapi.com'
                }
            }
        )
        console.log(getAll.data);

        getAll.data.forEach((item) => {
            const exerciseCard = document.createElement("div");
            exerciseCard.classList.add("card");
            exerciseCard.style.width = "18rem";
            exerciseCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">Body Part: ${item.bodyPart}</p>
                </div>
            `;
            savedContainer.appendChild(exerciseCard);
            savedContainer.style.backgroundColor = " rgba(36, 37, 37, 0.6)"
            exerciseContainer.innerHTML = "";
            exerciseTitle.innerHTML = "";
        })

    } catch (error) {
        console.log("error getting saved exercises", error)
    }
}

// saveBtn.addEventListener("click", handleSaveExercise)

// async function handleSaveExercise(event){
//     if (event.target.classList.contains("save")){
//         console.log("save button clicked")
//     } 
//     // console.log("not selected")
// }




