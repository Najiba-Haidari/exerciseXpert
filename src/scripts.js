import { capitalizeFirstLetter, reloadPage } from "./util.js";
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
let bodyPartsLoaded = false;

viewButton.addEventListener("click", loadBodyParts);
// getSavedButton.style.display = "none"
async function loadBodyParts() {
    try {
        if (!bodyPartsLoaded){
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
        bodyPartsLoaded = true
    }
        viewButton.style.display = 'none';
        savedContainer.innerHTML = ""
    } catch (error) {
        console.log(error)
    }
}
// loadBodyParts();

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

                saveBtn.addEventListener("click", async (name) => {
                    try {

                        console.log(exercise.id)
                        const getAll = await axios.get("https://json-store.p.rapidapi.com/",
                            {
                                headers: {
                                    'X-RapidAPI-Key': 'a3882e0d78msh0ee7afc0a7eb84fp140078jsn97b32d56c79a',
                                    'X-RapidAPI-Host': 'json-store.p.rapidapi.com'
                                }
                            }
                        )
                        console.log(getAll.data)
                        const savedExercises = getAll.data;
                        const exerciseName = exercise.name;

        // Check if the exercise name is already saved
        const exerciseAlreadySaved = savedExercises.find(savedExercise => savedExercise.name === exerciseName);

                        if (exerciseAlreadySaved) {
                            console.log("already saved!")
                            alert("already saved!")
                            
                        } else {
                            const savedData = await axios.put('https://json-store.p.rapidapi.com/', {
                                id: exercise.id,
                                bodyPart: exercise.bodyPart,
                                name: exercise.name,
                                target: exercise.target,
                                gifUrl: exercise.gifUrl
                            }, {
                                headers: {
                                    'content-type': 'application/json',
                                    'X-RapidAPI-Key': 'a3882e0d78msh0ee7afc0a7eb84fp140078jsn97b32d56c79a',
                                    'X-RapidAPI-Host': 'json-store.p.rapidapi.com'
                                }
                            });
                            console.log("Exercise saved successfully:", savedData.data);
                            saveBtn.textContent = "Saved";
                            saveBtn.style.backgroundColor = "lightgreen"
                        }

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

icon.addEventListener("click", reloadPage)

getSavedButton.addEventListener("click", getSavedExercises);

async function getSavedExercises() {
    try {
        const getAll = await axios.get("https://json-store.p.rapidapi.com/",
            {
                headers: {
                    'X-RapidAPI-Key': 'a3882e0d78msh0ee7afc0a7eb84fp140078jsn97b32d56c79a',
                    'X-RapidAPI-Host': 'json-store.p.rapidapi.com'
                }
            }
        )
        console.log("list of exercises saved:",getAll.data);

        getAll.data.forEach((item) => {
            const exerciseCard = document.createElement("div");
            exerciseCard.classList.add("card");
            exerciseCard.style.width = "18rem";
            exerciseCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                   
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




