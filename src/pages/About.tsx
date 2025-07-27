import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Menu, ArrowLeft, Library, Heart, TrendingUp, DollarSign, Users, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AppLayout from '../components/layout/AppLayout';

const About = () => {
  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        {/* Back button and title */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Welcome to Bacondo
          </h2>
        </div>

        <div className="text-center mb-12">
          <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl inline-block mb-6">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Your Digital Library
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover, organize, and share your favorite books with our comprehensive reading platform. 
              From tracking your reading progress to buying and selling books, we've got everything covered.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
            <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
              <Library className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Personal Library</h3>
            <p className="text-slate-600">
              Organize your books into custom collections, track your reading progress, and discover new favorites.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
            <div className="p-3 bg-red-100 rounded-lg inline-block mb-4">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Favorites & Ratings</h3>
            <p className="text-slate-600">
              Mark your favorite books, rate them, and get personalized recommendations based on your preferences.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
            <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Reading Analytics</h3>
            <p className="text-slate-600">
              Track your reading habits, set goals, and see your progress with detailed analytics and insights.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
            <div className="p-3 bg-yellow-100 rounded-lg inline-block mb-4">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Buy & Sell Books</h3>
            <p className="text-slate-600">
              Find great deals on used books or sell your own copies to fellow book lovers in our marketplace.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
            <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Community</h3>
            <p className="text-slate-600">
              Connect with other readers, share reviews, and discover books through our vibrant community.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
            <div className="p-3 bg-indigo-100 rounded-lg inline-block mb-4">
              <Search className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Advanced Search</h3>
            <p className="text-slate-600">
              Find exactly what you're looking for with our powerful search filters and recommendation engine.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of book lovers who have already discovered the joy of organized reading with Bacondo.
            </p>
            <Link to="/">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-slate-100 font-semibold px-8 py-3"
              >
                Explore Your Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;