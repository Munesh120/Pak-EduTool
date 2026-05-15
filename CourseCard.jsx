import React from 'react';
import { Star, Clock, Users, BookOpen } from 'lucide-react';

const CourseCard = ({ course, onClick }) => {
    return (
        <div 
            onClick={() => onClick(course.id)}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
        >
            {/* Course Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="absolute inset-0 flex items-center justify-center text-7xl">
                    {course.thumbnail}
                </div>
                {course.isFree && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Free
                    </span>
                )}
                {course.bestseller && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Bestseller
                    </span>
                )}
            </div>
            
            {/* Course Info */}
            <div className="p-5">
                {/* Title & Instructor */}
                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition">
                    {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 fill-current ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 ml-2">{course.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({course.reviews.toLocaleString()} reviews)</span>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lectures} lectures</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{(course.students / 1000).toFixed(0)}k students</span>
                    </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                        {course.isFree ? (
                            <span className="text-lg font-bold text-green-600">Free</span>
                        ) : (
                            <div>
                                <span className="text-lg font-bold text-gray-800">₹{course.price.toLocaleString()}</span>
                                <span className="text-sm text-gray-400 line-through ml-2">₹{(course.price * 1.5).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                        {course.isFree ? 'Enroll Now' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;