// Add this inside CourseSearch component
const PopularTags = () => {
    const popularTags = ['Python', 'React', 'JavaScript', 'Data Science', 'AI', 'Web Development'];
    
    return (
        <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Popular Searches:</label>
            <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};
// Add sorting functionality
const [sortBy, setSortBy] = useState('popularity');

const sortedCourses = useMemo(() => {
    let sorted = [...filteredCourses];
    
    switch(sortBy) {
        case 'popularity':
            return sorted.sort((a, b) => b.students - a.students);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        default:
            return sorted;
    }
}, [filteredCourses, sortBy]);