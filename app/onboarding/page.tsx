"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const categories = [
  'entertainment',
  'education',
  'gaming',
  'music',
  'dance',
  'sports',
  'food',
  'lifestyle',
  'technology',
  'travel',
  'comedy',
  'fashion',
  'art',
  'fitness',
  'beauty',
  'pets',
] as const;

const interests = [
  'cooking',
  'programming',
  'photography',
  'reading',
  'writing',
  'drawing',
  'painting',
  'singing',
  'dancing',
  'gaming',
  'traveling',
  'fitness',
  'meditation',
  'yoga',
  'hiking',
  'camping',
  'swimming',
  'running',
  'cycling',
  'skateboarding',
  'surfing',
  'skiing',
  'snowboarding',
] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { userId } = useAuth();

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedCategories.length === 0) {
      toast({
        title: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      return;
    }

    if (selectedInterests.length === 0) {
      toast({
        title: "Please select at least one interest",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First, sync the user with Supabase
      const syncResponse = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!syncResponse.ok) {
        throw new Error('Failed to sync user');
      }

      // Get the Supabase token
      const tokenResponse = await fetch('/api/auth/token');
      if (!tokenResponse.ok) {
        throw new Error('Failed to get auth token');
      }
      
      const { token } = await tokenResponse.json();
      
      // Set the auth token for Supabase
      supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });

      console.log('User synced with Supabase');
      console.log('Saving preferences for user:', userId);

      // Now save the preferences
      const { error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferred_categories: selectedCategories,
          interests: selectedInterests,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        throw upsertError;
      }

      console.log('Preferences saved successfully');
      
      // Verify the preferences were saved
      const { data: savedPreferences, error: verifyError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (verifyError || !savedPreferences) {
        console.error('Verification error:', verifyError);
        throw new Error("Failed to verify saved preferences");
      }

      console.log('Preferences verified:', savedPreferences);

      toast({
        title: "Preferences saved!",
        description: "Your recommendations are ready.",
      });

      // Wait a moment for the toast to be visible
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force a hard redirect to ensure the middleware picks up the new state
      window.location.href = "/";
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error saving preferences",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to TikTok Clone</h1>
          <p className="text-muted-foreground">
            Let's personalize your experience
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-colors ${
                s === step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  What type of content do you enjoy?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer text-sm capitalize"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  What are your interests?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer text-sm capitalize"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Finish"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
} 