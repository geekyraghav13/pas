import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Input validation constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_PHONE_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 2000;
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required field validation
    if (!formData.name.trim()) {
      errors.push("Name is required");
    } else if (formData.name.length > MAX_NAME_LENGTH) {
      errors.push(`Name must be ${MAX_NAME_LENGTH} characters or less`);
    }
    
    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!validateEmail(formData.email)) {
      errors.push("Please provide a valid email address");
    } else if (formData.email.length > MAX_EMAIL_LENGTH) {
      errors.push(`Email must be ${MAX_EMAIL_LENGTH} characters or less`);
    }
    
    // Optional field validation
    if (formData.phone && formData.phone.length > MAX_PHONE_LENGTH) {
      errors.push(`Phone number must be ${MAX_PHONE_LENGTH} characters or less`);
    }
    
    if (formData.message && formData.message.length > MAX_MESSAGE_LENGTH) {
      errors.push(`Message must be ${MAX_MESSAGE_LENGTH} characters or less`);
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    const validation = validateForm();
    if (!validation.isValid) {
      toast({
        title: "Please fix the following errors:",
        description: validation.errors.join(", "),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use secure edge function instead of direct database access
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          message: formData.message.trim() || undefined,
        }
      });

      if (error) {
        throw error;
      }

      // Check for application-level errors
      if (data?.error) {
        throw new Error(data.error);
      }

      // Navigate to thank you page on success
      navigate('/thank-you');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message?.includes('Too many requests')) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (error.message?.includes('Validation failed')) {
        errorMessage = "Please check your input and try again.";
      }
      
      toast({
        title: "Error submitting form",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Mobile and Desktop Layout */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content (Hidden on mobile, shown on desktop) */}
            <div className="hidden lg:block text-white space-y-6">
              <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                Want to Acquire a Business?{" "}
                <span className="block">We'll Fund You!</span>
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                At Passet, We back experienced operators with the capital, playbooks, and expert support needed to acquire and grow subscription-based mobile apps.
              </p>
            </div>
            
            {/* Right side - Form */}
            <div className="w-full">
              {/* Mobile header (shown only on mobile) */}
              <div className="lg:hidden text-center text-white space-y-6 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Want to Acquire a Business?{" "}
                  <span className="block">We'll Fund You!</span>
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  At Passet, We back experienced operators with the capital, playbooks, and expert support needed to acquire and grow subscription-based mobile apps.
                </p>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Input 
                    name="name" 
                    placeholder="Name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    maxLength={MAX_NAME_LENGTH}
                    className="h-14 rounded-full bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 text-lg" 
                    required 
                  />
                  <div className="text-right text-sm text-white/70">
                    {formData.name.length}/{MAX_NAME_LENGTH}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="Email Id" 
                    value={formData.email} 
                    onChange={handleChange} 
                    maxLength={MAX_EMAIL_LENGTH}
                    className="h-14 rounded-full bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 text-lg" 
                    required 
                  />
                  <div className="text-right text-sm text-white/70">
                    {formData.email.length}/{MAX_EMAIL_LENGTH}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Input 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    maxLength={MAX_PHONE_LENGTH}
                    className="h-14 rounded-full bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 text-lg" 
                  />
                  <div className="text-right text-sm text-white/70">
                    {formData.phone.length}/{MAX_PHONE_LENGTH}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Textarea 
                    name="message" 
                    placeholder="Anything you want to add!" 
                    value={formData.message} 
                    onChange={handleChange} 
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="min-h-32 rounded-3xl bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 text-lg resize-none" 
                  />
                  <div className="text-right text-sm text-white/70">
                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                  </div>
                </div>
                
                <Button type="submit" variant="cta" size="lg" className="w-full h-14 text-lg font-semibold group" disabled={isSubmitting}>
                  {isSubmitting ? "SUBMITTING..." : "SET UP A MEETING NOW"}
                  {!isSubmitting && <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactForm;