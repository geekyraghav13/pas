// src/pages/SignUpPage.tsx

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// IMPORTANT: Replace this with your actual Supabase project URL
const SUPABASE_FUNCTION_URL = 'https://fqillsrszasalfhunilr.supabase.co/functions/v1/submit-operator-form';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin_profile: '',
    acquisition_budget: '',
    git_profile: '',
    interest_description: '',
    terms: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // Assert the target is an HTMLInputElement for checkbox handling
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.terms) {
        setMessage('You must agree to the terms and privacy policy.');
        setStatus('error');
        return;
    }
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            linkedin_profile: formData.linkedin_profile,
            acquisition_budget: formData.acquisition_budget,
            git_profile: formData.git_profile,
            interest_description: formData.interest_description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred.');
      }

      setStatus('success');
      setMessage('Thank you! Your information has been submitted successfully.');
      // Optionally reset form
      // setFormData({ name: '', email: '', ...etc, terms: false });

    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to submit the form. Please try again.');
    }
  };

  return (
    <div className="bg-dark-bg text-white">
      <Header />
      <main className="py-20 lg:py-24" style={{ background: 'linear-gradient(135deg, #4f0093 0%, #1f004d 100%)' }}>
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Want to Acquire a Business?
              <br />
              We'll Fund You!
            </h1>
            <p className="text-lg text-slate-200 max-w-lg">
              At Passet, We back experienced operators with the capital, playbooks, and expert support needed to acquire and grow subscription-based Internet Businesses.
            </p>
          </div>
          <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inputs now use state */}
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number (include country code)" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <input name="linkedin_profile" value={formData.linkedin_profile} onChange={handleChange} placeholder="LinkedIn profile" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <input name="acquisition_budget" value={formData.acquisition_budget} onChange={handleChange} placeholder="Your Acquisition Budget" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <input name="git_profile" value={formData.git_profile} onChange={handleChange} placeholder="Git Profile (if any)" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <textarea name="interest_description" value={formData.interest_description} onChange={handleChange} rows={4} placeholder="Briefly describe why you are interested" className="w-full px-4 py-2 border border-gray-300 rounded-md"></textarea>
              <div className="flex items-center">
                <input id="terms" name="terms" checked={formData.terms} onChange={handleChange} type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="font-medium text-purple-600 hover:underline">Terms</a> , <a href="#" className="font-medium text-purple-600 hover:underline">Privacy policy & Recieving E-Mail updates </a>
                </label>
              </div>
              <button type="submit" disabled={status === 'submitting'} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg disabled:bg-purple-400">
                {status === 'submitting' ? 'Submitting...' : 'Get in Touch'}
              </button>
              {/* Status Messages */}
              {message && (
                <p className={`text-sm mt-4 ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;