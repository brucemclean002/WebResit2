// Simple form validation (example)
function validateForm() {
  const emailField = document.querySelector('input[type="email"]');
  const passwordField = document.querySelector('input[type="password"]');

  if (!emailField.value || !passwordField.value) {
    alert("Please fill out all required fields.");
    return false;
  }

  return true;
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle deletion of items
    const deleteForms = document.querySelectorAll('form[action^="/items/delete"]');

    deleteForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.dataset.confirmed) {
                const confirmed = confirm('Are you sure you want to delete this item?');
                if (!confirmed) {
                    event.preventDefault();
                } else {
                    form.dataset.confirmed = true; // Prevent multiple confirmations
                }
            }
        });
    });

    // Handle deletion of users
    const deleteUserForms = document.querySelectorAll('form[action^="/admin/delete"]');

    deleteUserForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.dataset.confirmed) {
                const confirmed = confirm('Are you sure you want to delete this user?');
                if (!confirmed) {
                    event.preventDefault();
                } else {
                    form.dataset.confirmed = true; // Prevent multiple confirmations
                }
            }
        });
    });
});




