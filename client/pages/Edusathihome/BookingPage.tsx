import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, GraduationCap, TrendingUp, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function BookingPage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Booking submitted:', { fullName, phoneNumber, email, date, time });
    // You can add API call or navigation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/20"></div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s' }}>
          <GraduationCap className="w-8 h-8 text-blue-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
          <TrendingUp className="w-6 h-6 text-blue-400 opacity-50" />
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce" style={{ animationDelay: '2s' }}>
          <BookOpen className="w-7 h-7 text-indigo-300 opacity-40" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce" style={{ animationDelay: '3s' }}>
          <GraduationCap className="w-5 h-5 text-blue-300 opacity-50" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
              Book Your Investment Slot
            </CardTitle>
            <p className="text-slate-600 text-sm">
              Schedule your personalized investment consultation
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              {/* Investment Date & Time */}
              <div className="space-y-6">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  Investment Date & Time
                </Label>

                {/* Date Picker */}
                <div className="space-y-3">
                  <Label className="text-xs text-slate-500 font-medium">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal px-4 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-white to-blue-50/30 hover:from-blue-50 hover:to-blue-100/50",
                          !date && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                        <span className={cn(
                          "font-medium",
                          date ? "text-slate-900" : "text-slate-500"
                        )}>
                          {date ? format(date, "EEEE, MMMM do, yyyy") : "Pick a date for your investment"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-2xl border-0 rounded-xl overflow-hidden" align="start">
                      <div className="bg-gradient-to-br from-white to-blue-50/50 p-4">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="rounded-lg border-0 shadow-none"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Picker */}
                <div className="space-y-3">
                  <Label className="text-xs text-slate-500 font-medium">Select Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal px-4 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-white to-blue-50/30 hover:from-blue-50 hover:to-blue-100/50",
                          !time && "text-slate-400"
                        )}
                      >
                        <Clock className="mr-3 h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                        <span className={cn(
                          "font-medium",
                          time ? "text-slate-900" : "text-slate-500"
                        )}>
                          {time || "Choose a convenient time slot"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-sm p-6 shadow-2xl border-0 rounded-xl overflow-hidden" align="start">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 text-center">Available Time Slots</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((slot, index) => (
                            <Button
                              key={slot}
                              variant={time === slot ? "default" : "outline"}
                              className={cn(
                                "text-sm font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md border-2",
                                time === slot
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-blue-600 shadow-lg"
                                  : "border-slate-200 hover:border-blue-400 bg-gradient-to-r from-white to-blue-50/30 hover:from-blue-50 hover:to-blue-100/50 text-slate-700 hover:text-blue-700"
                              )}
                              onClick={() => setTime(slot)}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              {slot}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 text-center mt-2">
                          All times are in your local timezone
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={!fullName || !phoneNumber || !email || !date || !time}
              >
                Confirm Investment
              </Button>
            </form>

            {/* Subtext */}
            <p className="text-center text-sm text-slate-500 mt-4">
              We will contact you shortly with confirmation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
