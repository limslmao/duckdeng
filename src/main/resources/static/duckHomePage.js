function myFunction() {
  document.getElementById("demo").innerHTML = "Hello World";
  console.log("success")
}

 function changeContent(page) {
            // Fetch the content for the selected page
            fetch(page)
                .then(response => response.text())
                .then(data => {
                    // Update the content wrapper with the new content
                    document.getElementById('content-wrapper').innerHTML = data;
                });
        }

        // Add event listeners to the side menu items
        document.addEventListener('DOMContentLoaded', function() {
            const sideMenuItems = document.querySelectorAll('.sidebar-menu a');
            sideMenuItems.forEach(item => {
                item.addEventListener('click', function(event) {
                    event.preventDefault();
                    const page = event.target.getAttribute('href');
                    changeContent(page);
                });
            });
        });