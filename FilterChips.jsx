import React from 'react';

const FilterChips = ({ categories, activeFilter, onFilterChange, label = "Category" }) => {
    return (
        <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onFilterChange(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeFilter === category
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterChips;