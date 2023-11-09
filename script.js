document.getElementById('searchButton').addEventListener('click', function () {
    const searchInput = document.getElementById('searchInput');
    const searchTerms = searchInput.value.toLowerCase().trim();

    if (!searchTerms) {
        alert("Please enter search terms.");
        return;
    }

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';

    // Fetch descriptions from the file_list.txt file
    fetchImageDescriptions()
        .then(descriptions => {
            // Filter and display images based on search terms
            const matchingImages = filterImagesByDescription(descriptions, searchTerms);
            displayImages(matchingImages);
        })
        .catch(error => {
            console.error(error);
        });
});

// Function to fetch image descriptions from file_list.txt
async function fetchImageDescriptions() {
    const response = await fetch('http://127.0.0.1:8080/file_list_00010NELG-FICCALI.txt');

    if (!response.ok) {
        throw new Error('Failed to fetch image descriptions.');
    }

    const descriptions = await response.text();
    return descriptions.split('\n');
}

// Function to filter images based on description
function filterImagesByDescription(descriptions, searchTerms) {
    return descriptions.filter(description => {
        return description.toLowerCase().includes(searchTerms);
    });
}

// Function to display images
function displayImages(imageMatches) {
    const imageContainer = document.getElementById('imageContainer');
    imageMatches.forEach((description, index) => {
        const imageIndex = String(index).padStart(4, '0');
        console.log(imageIndex);
        const imagePath = 'http://127.0.0.1:8080/' + imageIndex + '.png'; // Modify this line
        const imageElement = document.createElement('img');
        imageElement.src = imagePath;
        imageElement.alt = description;
        imageContainer.appendChild(imageElement);
    });
}


