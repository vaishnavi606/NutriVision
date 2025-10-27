"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/context/user-profile-context";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useEffect } from "react";

const profileFormSchema = z.object({
  healthConditions: z.string().min(5, {
    message: "Health conditions must be at least 5 characters.",
  }),
  goals: z.string().min(5, {
    message: "Goals must be at least 5 characters.",
  }),
  allergies: z.preprocess(
    (val) => (typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val),
    z.array(z.string())
  ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { profile, setProfile } = useUserProfile();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      healthConditions: '',
      goals: '',
      allergies: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        healthConditions: profile.healthConditions,
        goals: profile.goals,
        allergies: profile.allergies,
      });
    }
  }, [profile, form]);


  function onSubmit(data: ProfileFormValues) {
    setProfile(data);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="healthConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Conditions</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Diabetes, High Blood Pressure" {...field} />
              </FormControl>
              <FormDescription>
                List any health conditions you have.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Weight loss, muscle gain"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What are you trying to achieve with your diet?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => {
            const value = Array.isArray(field.value) ? field.value.join(', ') : field.value;
            return (
              <FormItem>
                <FormLabel>Allergies</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Peanuts, Gluten, Shellfish" 
                    {...field} 
                    value={value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  List any food allergies you have, separated by commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
        </Button>
      </form>
    </Form>
  );
}
