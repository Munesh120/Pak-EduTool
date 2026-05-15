import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

const NoResults = ({ searchTerm, onReset, filters = {} }) => {
    return (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any courses matching "{searchTerm}"
                {filters.category && filters.category !== 'All' && ` in ${filters.category}`}
                {filters.level && filters.level !== 'All' && ` at ${filters.level} level`}
                .
            </p>
            <button
                onClick={onReset}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                <RefreshCw className="w-4 h-4" />
                Reset Search
            </button>
        </div>
    );
};

export default NoResults;