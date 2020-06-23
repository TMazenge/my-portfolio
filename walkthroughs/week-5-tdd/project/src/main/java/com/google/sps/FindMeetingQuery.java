// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.ArrayList;
import java.util.*;
import java.util.Comparator;

public final class FindMeetingQuery {
  public ArrayList<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    ArrayList<TimeRange> availableTimeRanges = new ArrayList<TimeRange>();
    ArrayList<TimeRange> bookedTimeRanges = new ArrayList<TimeRange>();
    bookedTimeRanges = getBookedTimeRanges(events, request);
    
    // Checks to see if there are no events and returns time range as whole day if true.
    if (bookedTimeRanges.size() == 0){
        TimeRange available = TimeRange.fromStartEnd(TimeRange.START_OF_DAY, TimeRange.END_OF_DAY, true);
        if(available.duration() >= request.getDuration()){
            availableTimeRanges.add(available);
        }
        return availableTimeRanges; 
    }

    // Arrange booked time besed upon start time.
    Collections.sort(bookedTimeRanges, TimeRange.ORDER_BY_START);

    int i = 0;
    // Checks for overlaps in booked time ranges and creates new array list with all unavailable times.
    while (i < (bookedTimeRanges.size() - 1)){
        TimeRange first = bookedTimeRanges.get(i);
        TimeRange second = bookedTimeRanges.get(i+1);
        if(first.overlaps(second)){
            if (first.contains(second)){
                bookedTimeRanges.remove(second);
            } else {
                int oldStart = first.start();
                int newEnd = second.end();
                
                bookedTimeRanges.set(i, TimeRange.fromStartEnd(oldStart, newEnd, false));
                bookedTimeRanges.remove(second);
            }

        }
        i+=1; 
    }

    // Add time available to the available time ranges at the beginning of the day.
    if (bookedTimeRanges.size() > 0){
        if(!(bookedTimeRanges.get(0).contains(TimeRange.START_OF_DAY))){
            TimeRange start = TimeRange.fromStartEnd(TimeRange.START_OF_DAY, bookedTimeRanges.get(0).start(), false);
            if(start.duration() >= request.getDuration()){
                availableTimeRanges.add(start);
            }
        }
    }

    // Check avaialability in the booked time ranges and add to available timer ranges arraylist.
    for(int j=0; j < bookedTimeRanges.size() - 1; j++){
        TimeRange endOne = bookedTimeRanges.get(j);
        TimeRange secondTwo = bookedTimeRanges.get(j+1);

        TimeRange freeRange = TimeRange.fromStartEnd(endOne.end(), secondTwo.start(), false);
        if(freeRange.duration() >= request.getDuration()){
            availableTimeRanges.add(freeRange);
        }
    }

    // Add available time at the end of the day to the available time ranges.
    int number = bookedTimeRanges.size();
    if (number > 0){
        if(!(bookedTimeRanges.get(number-1).contains(TimeRange.END_OF_DAY))){
            TimeRange end = TimeRange.fromStartEnd(bookedTimeRanges.get(number-1).end(), TimeRange.END_OF_DAY, true);
            if(end.duration() >= request.getDuration()){
                availableTimeRanges.add(end);
            }
        }
    }
    return availableTimeRanges;
  }
    // Get an ArrayList of all the booked times in the events.    
    public ArrayList<TimeRange> getBookedTimeRanges(Collection<Event> events, MeetingRequest request){ 
        ArrayList<TimeRange> timeRanges = new ArrayList<TimeRange>();
        for(String user: request.getAttendees()){
            for(Event event: events){
                if (event.getAttendees().contains(user)){
                    timeRanges.add(event.getWhen());
                }
             }    
        }
        return timeRanges;
    }
}
