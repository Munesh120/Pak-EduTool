import React from 'react';
import CourseSearch from '../components/CourseSearch/CourseSearch';
import { useRouter } from 'next/router'; // For Next.js
// import { useNavigate } from 'react-router-dom'; // For React Router

const CoursesPage = () => {
    const router = useRouter(); // Next.js
    // const navigate = useNavigate(); // React Router
    
    const handleCourseClick = (courseId) => {
        // Navigate to course detail page
        router.push(`/course/${courseId}`); // Next.js
        // navigate(`/course/${courseId}`); // React Router
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎓</span>
                        <span className="text-xl font-bold text-blue-900">Pak eduToll</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
                        <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Sign Up</a>
                    </div>
                </div>
            </header>
            
            {/* Course Search Component */}
            <CourseSearch onCourseClick={handleCourseClick} />
            
            {/* Footer */}
            <footer className="bg-white border-t mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2024 Pak eduToll. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CoursesPage;