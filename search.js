window.handleSearch = function(query) {
    const dropdown = document.getElementById('searchResultsDropdown');
    const input = query.trim().toLowerCase(); // Small/Capital issue resolved here

    // Agar input khali hai to dropdown hide kar do
    if (input.length === 0) {
        dropdown.classList.add('hidden');
        return;
    }

    // Filter Algorithm (Assuming 'courses' is your data array)
    // Aapke case mein ye wo data hoga jo upload hota hai
    const results = allCourses.filter(course => 
        course.title.toLowerCase().includes(input) || 
        course.description.toLowerCase().includes(input)
    );

    displaySearchResults(results);
};

function displaySearchResults(results) {
    const dropdown = document.getElementById('searchResultsDropdown');
    dropdown.innerHTML = ''; // Pehle wala clear karein

    if (results.length === 0) {
        dropdown.innerHTML = `<div class="p-4 text-sm text-gray-500">No courses found matching your search.</div>`;
    } else {
        results.forEach(course => {
            const item = document.createElement('div');
            item.className = "p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center space-x-3";
            item.innerHTML = `
                <span class="text-lg">📚</span>
                <div>
                    <div class="text-sm font-bold text-gray-800">${course.title}</div>
                    <div class="text-xs text-gray-500">${course.instructor || 'Instructor'}</div>
                </div>
            `;
            // Click karne par course par le jaye
            item.onclick = () => {
                loadCourse(course.id); // Aapka existing function
                document.getElementById('searchResultsDropdown').classList.add('hidden');
                document.getElementById('courseSearchInput').value = '';
            };
            dropdown.appendChild(item);
        });
    }

    dropdown.classList.remove('hidden');
}

// Click bahar ho to dropdown band ho jaye
document.addEventListener('click', (e) => {
    if (!e.target.closest('#courseSearchInput')) {
        document.getElementById('searchResultsDropdown').classList.add('hidden');
    }
});