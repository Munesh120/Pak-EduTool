import React, { useState, useEffect, useMemo } from 'react';
import { coursesData, categories, levels, priceTypes } from '../../data/coursesData';
import { useDebounce } from '../../hooks/useDebounce';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import CourseCard from './CourseCard';
import NoResults from './NoResults';

const CourseSearch = ({ onCourseClick, initialFilters = {} }) => {
    // State Management
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'All');
    const [selectedLevel, setSelectedLevel] = useState(initialFilters.level || 'All');
    const [selectedPriceType, setSelectedPriceType] = useState(initialFilters.priceType || 'All');
    const [isLoading, setIsLoading] = useState(false);
    
    // Debounce search term for better performance
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    // Search and Filter Function - Multi-field search
    const filteredCourses = useMemo(() => {
        let results = [...coursesData];
        
        // 1. Search Term Filter (Multi-field: title, instructor, description, category, tags, skills)
        if (debouncedSearchTerm) {
            const searchLower = debouncedSearchTerm.toLowerCase().trim();
            results = results.filter(course => {
                return (
                    course.title.toLowerCase().includes(searchLower) ||
                    course.shortTitle.toLowerCase().includes(searchLower) ||
                    course.instructor.toLowerCase().includes(searchLower) ||
                    course.description.toLowerCase().includes(searchLower) ||
                    course.category.toLowerCase().includes(searchLower) ||
                    (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
                    (course.skills && course.skills.some(skill => skill.toLowerCase().includes(searchLower)))
                );
            });
        }
        
        // 2. Category Filter
        if (selectedCategory !== 'All') {
            results = results.filter(course => course.category === selectedCategory);
        }
        
        // 3. Level Filter
        if (selectedLevel !== 'All') {
            results = results.filter(course => course.level === selectedLevel);
        }
        
        // 4. Price Type Filter
        if (selectedPriceType !== 'All') {
            if (selectedPriceType === 'Free') {
                results = results.filter(course => course.isFree === true);
            } else if (selectedPriceType === 'Paid') {
                results = results.filter(course => course.isFree === false);
            }
        }
        
        return results;
    }, [debouncedSearchTerm, selectedCategory, selectedLevel, selectedPriceType]);
    
    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSelectedLevel('All');
        setSelectedPriceType('All');
    };
    
    // Check if any filters are active
    const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedPriceType !== 'All';
    
    // Simulate loading state
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [debouncedSearchTerm, selectedCategory, selectedLevel, selectedPriceType]);
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Find the Perfect Course for You
                </h1>
                <p className="text-gray-500">Search from 1000+ courses taught by top instructors</p>
            </div>
            
            {/* Search Bar */}
            <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search by course title, instructor, category, or skills..."
                className="mb-6"
            />
            
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
                <div className="grid md:grid-cols-3 gap-6">
                    <FilterChips
                        categories={categories}
                        activeFilter={selectedCategory}
                        onFilterChange={setSelectedCategory}
                        label="Category"
                    />
                    <FilterChips
                        categories={levels}
                        activeFilter={selectedLevel}
                        onFilterChange={setSelectedLevel}
                        label="Level"
                    />
                    <FilterChips
                        categories={priceTypes}
                        activeFilter={selectedPriceType}
                        onFilterChange={setSelectedPriceType}
                        label="Price"
                    />
                </div>
                
                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-500">Active filters:</span>
                            {searchTerm && (
                                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Search: {searchTerm}
                                </span>
                            )}
                            {selectedCategory !== 'All' && (
                                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Category: {selectedCategory}
                                </span>
                            )}
                            {selectedLevel !== 'All' && (
                                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Level: {selectedLevel}
                                </span>
                            )}
                            {selectedPriceType !== 'All' && (
                                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Price: {selectedPriceType}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={resetFilters}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
            
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-gray-600">
                        Showing <span className="font-bold text-gray-800">{filteredCourses.length}</span> results
                        {searchTerm && <span> for "<span className="font-medium">{searchTerm}</span>"</span>}
                    </span>
                </div>
                <div className="text-sm text-gray-400">
                    {!isLoading && `${filteredCourses.length} courses available`}
                </div>
            </div>
            
            {/* Loading State */}
            {isLoading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Results Grid */}
            {!isLoading && (
                <>
                    {filteredCourses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onClick={onCourseClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <NoResults
                            searchTerm={debouncedSearchTerm}
                            filters={{ category: selectedCategory, level: selectedLevel, priceType: selectedPriceType }}
                            onReset={resetFilters}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CourseSearch;