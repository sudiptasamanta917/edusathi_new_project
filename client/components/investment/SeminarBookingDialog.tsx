import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function SeminarBookingDialog() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!fullName || !email || !phoneNumber || !city || !country || !date || !time) {
      alert('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone number validation - more flexible format
    const phoneRegex = /^[\+]?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      alert('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        city: city.trim(),
        country: country.trim(),
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: time
      };

      console.log('Submitting booking:', bookingData);

      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
      const response = await fetch(`${serverUrl}/api/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit booking');
      }

      if (result.success) {
        alert('🎉 Registration successful! You will receive a WhatsApp confirmation shortly. We look forward to seeing you at the seminar!');
        setOpen(false);
        
        // Reset form
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setCity('');
        setCountry('');
        setDate(undefined);
        setTime('');
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      let errorMessage = 'Failed to submit registration. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('duplicate') || error.message.includes('already registered')) {
          errorMessage = 'You have already registered for this seminar. Please check your WhatsApp for confirmation.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Join Our Online Investment Seminar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Register for Investment Seminar
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Fill out the form below to secure your spot in our exclusive investment seminar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter your country"
                className="dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-700",
                    !date && "text-muted-foreground",
                    date && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 hover:from-blue-100 hover:to-indigo-100"
                  )}
                >
                  <CalendarIcon className={cn("mr-2 h-4 w-4", date ? "text-blue-600" : "text-gray-400")} />
                  {date ? (
                    <span className="text-blue-700 font-semibold">
                      📅 {format(date, "EEEE, MMMM do, yyyy")}
                    </span>
                  ) : (
                    <span className="text-gray-500">📅 Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => {
                      // Disable past dates
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="rounded-md border-0"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium text-gray-900 dark:text-white",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem] text-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 m-0.5",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-100 dark:[&:has([aria-selected])]:bg-blue-900 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 m-0.5",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors",
                      day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white border-blue-600",
                      day_today: "bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold",
                      day_outside: "text-gray-400 dark:text-gray-600 opacity-50",
                      day_disabled: "text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed",
                      day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900 dark:aria-selected:bg-blue-800 dark:aria-selected:text-blue-100",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Select Time Slot</Label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={time === slot ? "default" : "outline"}
                  onClick={() => setTime(slot)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Confirm Registration'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
