const Item = require("../models/item");

// Function to fetch all items and render the appropriate page
exports.getItems = (req, res) => {
    const isManager = req.session.user && req.session.user.role === 'manager';
    const isVolunteerOrManager = req.session.user && (req.session.user.role === 'volunteer' || req.session.user.role === 'manager');

    Item.findAll((err, items) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).send('Error fetching items');
        }

        // Check if the route is /manage and render the manage items view
        if (req.path === '/manage') {
            res.render('manage-items', { 
                title: 'Manage Items', 
                items: items,
                isVolunteerOrManager: isVolunteerOrManager,
                user: req.session.user
            }, (err, html) => {
                if (err) {
                    console.error('Error rendering the manage-items page:', err);
                    return res.status(500).send('Error rendering the page');
                }
                res.render('layouts/main', {
                    title: 'Manage Items',
                    user: req.session.user,
                    body: html
                });
            });
        } else {
            // Otherwise, render the general items list view
            res.render('items', { 
                title: 'Items List', 
                items: items,
                user: req.session.user
            }, (err, html) => {
                if (err) {
                    console.error('Error rendering the items page:', err);
                    return res.status(500).send('Error rendering the page');
                }
                res.render('layouts/main', {
                    title: 'Items List',
                    user: req.session.user,
                    body: html
                });
            });
        }
    });
};


// Handle adding a new item
exports.addItem = (req, res) => {
  const { name, description, price, store } = req.body;
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.render("add-item", {
      error: "Price must be a positive number.",
    });
  }
  Item.create({ name, description, price: parsedPrice, store }, (err) => {
    if (err) return res.render("add-item", { error: "Error adding item." });
    res.redirect("/items/manage");
  });
};

// Function to fetch an item and render the edit page
exports.editItem = (req, res) => {
  const itemId = req.params.id;
  Item.findById(itemId, (err, item) => {
    if (err || !item) {
      console.error("Error fetching item for editing:", err);
      return res.redirect("/items/manage");
    }

    res.render(
      "edit-item",
      {
        title: "Edit Item",
        item: item,
        user: req.session.user,
      },
      (err, html) => {
        if (err) {
          console.error("Error rendering the edit-item page:", err);
          return res.status(500).send("Error rendering the page");
        }
        res.render("layouts/main", {
          title: "Edit Item",
          user: req.session.user,
          body: html,
        });
      }
    );
  });
};

// Function to handle the form submission for editing an item
exports.updateItem = (req, res) => {
  const itemId = req.params.id;
  const { name, description, price, store } = req.body;

  const updatedItemData = {
    name: name,
    description: description,
    price: parseFloat(price),
    store: store,
  };

  Item.update(itemId, updatedItemData, (err) => {
    if (err) {
      console.error("Error updating item:", err);
      return res.render("edit-item", {
        title: "Edit Item",
        error: "Failed to update item.",
        item: req.body,
        user: req.session.user,
      });
    }
    res.redirect("/items/manage");
  });
};

// Handle deleting an item
exports.deleteItem = (req, res) => {
  Item.delete(req.params.id, (err) => {
    if (err) return res.redirect("/items/manage?error=Failed to delete item.");
    res.redirect("/items/manage");
  });
};
