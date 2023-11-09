window.addEventListener('load', () => {
    // Fetch descriptions from the file_list.txt file
    fetchImageDescriptions()
        .then(descriptions => {
            const commonWords = analyzeCommonWords(descriptions);
            displayCommonWords(commonWords);
        })
        .catch(error => {
            console.error(error);
        });
});

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
            const matchingImages = findImagesWithSimilarWords(descriptions, searchTerms);
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
    return descriptions;
}

// Function to analyze common words using nlp-compromise
function analyzeCommonWords(text) {
    const nlp = window.nlp;

    // Parse the text with nlp-compromise
    const doc = nlp(text);

    // Get the most common terms
    const terms = doc.terms().out('array');

    // Count term occurrences
    const termCount = terms.reduce((count, term) => {
        count[term] = (count[term] || 0) + 1;
        return count;
    }, {});

    // Sort terms by frequency
    const sortedTerms = Object.entries(termCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Display the top 10 terms

    return sortedTerms;
}

// Function to display common words
function displayCommonWords(commonWords) {
    const commonWordsContainer = document.getElementById('commonWordsContainer');
    commonWordsContainer.innerHTML = '<h3>Most Common Words:</h3>';
    
    const ul = document.createElement('ul');
    commonWords.forEach(([term, count]) => {
        const li = document.createElement('li');
        li.textContent = `${term} (${count} occurrences)`;
        ul.appendChild(li);
    });

    commonWordsContainer.appendChild(ul);
}

// Function to find images with similar descriptions using Jaccard similarity
//
// Function to find images with similar words
function findImagesWithSimilarWords(descriptions, searchTerms) {
    const images = descriptions.split('\n');
    const similarityThreshold = 0.5; // Adjust as needed

    const similarImages = [];

    images.forEach((description, index) => {
        const descriptionWords = description.split(' ');
        const searchWords = searchTerms.split(' ');

        for (const descWord of descriptionWords) {
            for (const searchWord of searchWords) {
                const similarity = calculateJaccardSimilarity(descWord, searchWord);

                if (similarity >= similarityThreshold) {
                    similarImages.push(index);
                    break; // If any word is similar, add the image and break the inner loop
                }
            }
        }
    });

    return similarImages;
}

// Function to calculate Jaccard similarity
function calculateJaccardSimilarity(text1, text2) {
    const set1 = new Set(text1.split(','));
    const set2 = new Set(text2.split(' '));
    const intersectionSize = [...set1].filter(word => set2.has(word)).length;
    const unionSize = set1.size + set2.size - intersectionSize;
    console.log(intersectionSize,unionSize);
    return intersectionSize / unionSize;
}

// Function to display images
function displayImages(imageIndexes) {
    const imageContainer = document.getElementById('imageContainer');
    imageIndexes.forEach(index => {
        const imageIndex = String(index).padStart(4, '0');
        const imagePath = "http://127.0.0.1:8080/" +`${imageIndex}.png`;
        const imageElement = document.createElement('img');
        imageElement.src = imagePath;
        imageElement.alt = `Image ${imageIndex}`;
        imageContainer.appendChild(imageElement);
    });
}

