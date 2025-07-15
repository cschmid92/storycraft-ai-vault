
import React, { useState } from 'react';
import { X, User, Mail, Settings, Globe, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCountry, setSelectedCountry] = useState('Switzerland');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 border-r bg-slate-50 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
                  activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
                  activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <Input placeholder="Your name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <Input placeholder="your.email@example.com" defaultValue="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md resize-none h-24"
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-slate-800 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                        <Input placeholder="Bahnhofstrasse 123" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                        <Input placeholder="Zurich" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Canton</label>
                        <Input placeholder="ZH" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code</label>
                        <Input placeholder="8001" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-slate-300">
                            <SelectItem value="Switzerland">Switzerland</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="Austria">Austria</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Italy">Italy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-700">Language</h4>
                      <p className="text-sm text-slate-500">Choose your preferred language</p>
                    </div>
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="English">English</option>
                      <option value="German">Deutsch</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-700">Email Notifications</h4>
                      <p className="text-sm text-slate-500">Receive updates about your collections</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-700">Public Profile</h4>
                      <p className="text-sm text-slate-500">Allow others to find and connect with you</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
