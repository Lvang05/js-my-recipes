const express = require('express');
const router = express.Router();
const fs = require('fs');
const recipesPath = __dirname + '/../../../../data/recipes.json';

router.get('/', (req, res) => {
    const recipes = require(recipesPath);
    res.json(recipes.map(({ id, title, image, prepTime, difficulty }) => ({
        id,
        title,
        image,
        prepTime,
        difficulty
    })));
});

router.get('/recipe/:id', (req, res) => {
    const recipes = require(recipesPath);
    const recipe = recipes.find(r => r.id == req.params.id);
    res.json(recipe);
});

router.post('/recipe/add', (req, res) => {
    const { title, image, prepTime, difficulty, ingredients, instructions } = req.body;
    const recipes = require(recipesPath);
    const found = recipes.find(r =>
        r.title === title &&
        r.image === image &&
        r.prepTime === prepTime &&
        r.difficulty === difficulty
    );
    if (found) {
        res.status(409).send({
            status: '409',
            message: `Recipe ${title} already exists.`
        });
        return;
    }
    const newRecipe = {
        id: recipes.length + 1,
        title,
        image,
        prepTime,
        difficulty,
        ingredients,
        instructions
    };
    recipes.push(newRecipe);
    fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 2));
    res.status(201).send({
        status: '201',
        message: `Recipe ${title} added successfully.`,
        recipe: newRecipe
    });
});

module.exports = router;