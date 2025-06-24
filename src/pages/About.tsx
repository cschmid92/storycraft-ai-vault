
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Bacondo</h1>
                  <p className="text-xs text-slate-600 hidden sm:block">Your Digital Library</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 md:p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">About Bacondo</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Welcome to Bacondo, your personal digital library where you can organize, track, and share your book collection with ease.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">What is Bacondo?</h2>
            <p className="text-slate-700 mb-6">
              Bacondo is a comprehensive book management platform designed for book lovers who want to keep track of their reading journey. Whether you're an avid reader with hundreds of books or just starting your collection, Bacondo helps you organize, discover, and connect with other readers in your community.
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
              <li><strong>Personal Library:</strong> Catalog your entire book collection with detailed information including ratings, reviews, and reading status.</li>
              <li><strong>Custom Collections:</strong> Organize your books into personalized collections like "Favorites," "To Read," or any category you create.</li>
              <li><strong>Book Marketplace:</strong> Buy and sell used books within your local community.</li>
              <li><strong>Reading Tracking:</strong> Keep track of books you've read and rate them to remember your favorites.</li>
              <li><strong>Discovery:</strong> Find new books through our recommendation system and popular reads section.</li>
              <li><strong>Social Features:</strong> Connect with other readers and share your book recommendations.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Getting Started</h2>
            <p className="text-slate-700 mb-4">
              Getting started with Bacondo is simple:
            </p>
            <ol className="list-decimal list-inside text-slate-700 mb-6 space-y-2">
              <li>Browse our collection of books or search for specific titles</li>
              <li>Add books to your personal library and organize them into collections</li>
              <li>Rate and review books you've read</li>
              <li>Explore the marketplace to buy or sell used books</li>
              <li>Discover new reads through our recommendation engine</li>
            </ol>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Community</h2>
            <p className="text-slate-700 mb-6">
              Bacondo is more than just a personal library—it's a community of book lovers. Share your reading experiences, discover what others are reading, and participate in our local book marketplace to give your books a new home while finding new treasures for your collection.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                <strong>Have questions or feedback?</strong> We'd love to hear from you! Connect with us through our social media channels or reach out to our support team.
              </p>
            </div>

            <div className="text-center mt-8">
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Start Building Your Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
