'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setDate(undefined);
      return;
    }
    const oldDate = date || new Date();
    newDate.setHours(oldDate.getHours());
    newDate.setMinutes(oldDate.getMinutes());
    setDate(newDate);
  };

  const handleHourChange = (hour: string) => {
    const newDate = date ? new Date(date.getTime()) : new Date();
    newDate.setHours(parseInt(hour, 10));
    setDate(newDate);
  };

  const handleMinuteChange = (minute: string) => {
    const newDate = date ? new Date(date.getTime()) : new Date();
    newDate.setMinutes(parseInt(minute, 10));
    setDate(newDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            date.toLocaleString()
          ) : (
            <span>Sélectionner une date et une heure</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Select
              onValueChange={handleHourChange}
              value={date ? date.getHours().toString().padStart(2, '0') : undefined}
            >
              <SelectTrigger className="w-[48%]">
                <SelectValue placeholder="Heure" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => i)
                  .map((hour) => hour.toString().padStart(2, '0'))
                  .map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleMinuteChange}
              value={
                date ? date.getMinutes().toString().padStart(2, '0') : undefined
              }
            >
              <SelectTrigger className="w-[48%]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {['00', '15', '30', '45'].map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
