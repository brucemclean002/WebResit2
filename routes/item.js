const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const auth = require("../middlewares/auth");

// Item routes
router.get("/", itemController.getItems);

// Route to manage items
router.get('/manage', auth.ensureVolunteerOrManager, itemController.getItems);

router.post("/add", auth.ensureVolunteerOrManager, itemController.addItem);

// Route to display the edit form
router.get('/edit/:id', auth.ensureVolunteerOrManager, (req, res) => {
    itemController.editItem(req, res);
});

// Route to process the edit form submission
router.post('/edit/:id', auth.ensureVolunteerOrManager, (req, res) => {
    itemController.updateItem(req, res);
});

router.post(
  "/delete/:id",
  auth.ensureVolunteerOrManager,
  itemController.deleteItem
);

module.exports = router;
