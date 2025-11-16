// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const randomBtn = document.getElementById("random-btn");
const resultsDiv = document.getElementById("results");
const funMsg = document.getElementById("fun-msg");

// Fun messages for storytelling
const messages = [
    "Chef’s tip: Cook with love",
    "Warning: May cause extreme hunger!",
    "Bake it till you make it! ",
    "Try something new today! ",
    "Deliciousness awaits!"
];

// Show random fun message
function showRandomMessage() {
    funMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// Fetch recipes by search term
function fetchRecipes(query) {
    resultsDiv.innerHTML = "<p>Loading recipes...</p>";
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            resultsDiv.innerHTML = "";
            if (!data.meals) {
                resultsDiv.innerHTML = "<p>No recipes found. Try a different search!</p>";
                return;
            }

            data.meals.forEach(meal => {
                const mealDiv = document.createElement("div");
                mealDiv.classList.add("meal-card");
                mealDiv.innerHTML = `
                    <h3>${meal.strMeal}</h3>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p>${meal.strInstructions.substring(0, 150)}...</p>
                `;
                resultsDiv.appendChild(mealDiv);
                setTimeout(() => mealDiv.classList.add("show"), 50);

                // Bonus: Nutrition API (Edamam) - using meal name as ingredient
                const edamamId = "YOUR_EDAMAM_ID";
                const edamamKey = "YOUR_EDAMAM_KEY";
                fetch(`https://api.edamam.com/api/nutrition-data?app_id=${edamamId}&app_key=${edamamKey}&ingr=${meal.strMeal}`)
                    .then(res => res.json())
                    .then(nutrition => {
                        const nutritionPara = document.createElement("p");
                        nutritionPara.style.fontStyle = "italic";
                        nutritionPara.style.color = "#888";
                        nutritionPara.textContent = `Calories: ${Math.round(nutrition.calories)}, Protein: ${nutrition.totalNutrients?.PROCNT?.quantity?.toFixed(1) || 0}g`;
                        mealDiv.appendChild(nutritionPara);
                    })
                    .catch(err => console.log("Nutrition API error:", err));
            });
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p>Oops! Something went wrong: ${error.message}</p>`;
        });
}

// Fetch random recipe
function fetchRandomRecipe() {
    resultsDiv.innerHTML = "<p>Loading random recipe...</p>";
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            resultsDiv.innerHTML = "";
            const meal = data.meals[0];
            const mealDiv = document.createElement("div");
            mealDiv.classList.add("meal-card");
            mealDiv.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>${meal.strInstructions.substring(0, 150)}...</p>
            `;
            resultsDiv.appendChild(mealDiv);
            setTimeout(() => mealDiv.classList.add("show"), 50);

            // Nutrition API
            const edamamId = "YOUR_EDAMAM_ID";
            const edamamKey = "YOUR_EDAMAM_KEY";
            fetch(`https://api.edamam.com/api/nutrition-data?app_id=${edamamId}&app_key=${edamamKey}&ingr=${meal.strMeal}`)
                .then(res => res.json())
                .then(nutrition => {
                    const nutritionPara = document.createElement("p");
                    nutritionPara.style.fontStyle = "italic";
                    nutritionPara.style.color = "#888";
                    nutritionPara.textContent = `Calories: ${Math.round(nutrition.calories)}, Protein: ${nutrition.totalNutrients?.PROCNT?.quantity?.toFixed(1) || 0}g`;
                    mealDiv.appendChild(nutritionPara);
                })
                .catch(err => console.log("Nutrition API error:", err));
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p>Oops! Something went wrong: ${error.message}</p>`;
        });
}

// Event listeners
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return alert("Please type a search term!");
    showRandomMessage();
    fetchRecipes(query);
});

randomBtn.addEventListener("click", () => {
    showRandomMessage();
    fetchRandomRecipe();
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (!query) return alert("Please type a search term!");
        showRandomMessage();
        fetchRecipes(query);
    }
});
