
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library, Heart, TrendingUp, DollarSign, Users, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SharedLayout from '../components/SharedLayout';
import PageHeader from '../components/PageHeader';

const About = () => {
  return (
    <SharedLayout>
      <div className="flex flex-col h-full">
        <PageHeader 
          title="About Bacondo"
          subtitle="Learn more about your digital library"
          icon={BookOpen}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6 md:p-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Welcome to Bacondo
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Your personal digital library where stories come alive and reading becomes an adventure.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl w-fit mx-auto mb-4">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Digital Library</h3>
                <p className="text-slate-600">
                  Organize your books digitally with our intuitive library management system.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl w-fit mx-auto mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Collections</h3>
                <p className="text-slate-600">
                  Create custom collections and organize your favorite books by genre, mood, or theme.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Reading Tracking</h3>
                <p className="text-slate-600">
                  Track your reading progress and discover new books based on your preferences.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl w-fit mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Buy & Sell</h3>
                <p className="text-slate-600">
                  Trade books with other readers in our community marketplace.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Community</h3>
                <p className="text-slate-600">
                  Connect with fellow book lovers and share your reading journey.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl w-fit mx-auto mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Search</h3>
                <p className="text-slate-600">
                  Find books quickly with our advanced search and filtering options.
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-8 mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
              <p className="text-lg text-slate-700 max-w-4xl mx-auto">
                At Bacondo, we believe that every book has the power to transform lives. Our mission is to create a seamless digital reading experience that brings together book lovers from around the world, making it easier to discover, organize, and share the stories that matter most to you.
              </p>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Ready to Start Your Reading Journey?
              </h2>
              <p className="text-slate-600 mb-6">
                Join thousands of readers who have already made Bacondo their digital home.
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3">
                  Start Building Your Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
};

export default About;
