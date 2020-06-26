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
import java.util.Arrays;
import java.util.ArrayList;
import java.util.*;
import java.util.Comparator;

public final class FindMeetingQuery {
  public ArrayList<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    ArrayList<TimeRange> availableTimeRanges = new ArrayList<TimeRange>();
    ArrayList<TimeRange> availableOptionalTimeRanges = new ArrayList<TimeRange>();
    ArrayList<TimeRange> possibleTimeRanges = new ArrayList<TimeRange>();

    ArrayList<TimeRange> bookedTimeRanges = new ArrayList<TimeRange>();
    ArrayList<TimeRange> optionalTimeRanges = new   ArrayList<TimeRange>();

    bookedTimeRanges = getBookedTimeRanges(events, request, true);
    optionalTimeRanges = getBookedTimeRanges(events, request, false);

    // Checks if time duration for meeting request is greater than 24 hours.
    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) return availableTimeRanges;

    // Checks to see if there are no events and returns time range as whole day if true.
    if (bookedTimeRanges.size() == 0 & optionalTimeRanges.size() == 0){
        availableTimeRanges.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, TimeRange.END_OF_DAY, true));
        return availableTimeRanges; 
    }

    // Arrange booked time besed upon start time.
    Collections.sort(bookedTimeRanges, TimeRange.ORDER_BY_START);
    Collections.sort(optionalTimeRanges, TimeRange.ORDER_BY_START);

    // Get unavaliable time ranges for optional attendees and mandatory attendees.
    getUnavaliableTimeRanges(optionalTimeRanges);
    getUnavaliableTimeRanges(bookedTimeRanges);

    // Insert time range from the start of the day for optional attendees and mandatory attendees.
    insertStartOfDay(optionalTimeRanges, availableOptionalTimeRanges, request);
    insertStartOfDay(bookedTimeRanges, availableTimeRanges, request);
    
    // Get free time ranges for optional attendees and mandatory attendees.
    getFreeTimeRanges(optionalTimeRanges, availableOptionalTimeRanges, request);
    getFreeTimeRanges(bookedTimeRanges, availableTimeRanges, request);

    // Insert time range from the end of the day for optional attendees and mandatory attendees.
    insertEndOfDay(optionalTimeRanges, availableOptionalTimeRanges, request);
    insertEndOfDay(bookedTimeRanges, availableTimeRanges, request);

    // If no mandatory attendees, return available time ranges for optional attendees.
    if(request.getAttendees().isEmpty()) return availableOptionalTimeRanges;

    int otptionalAttendeePointer = 0;
    int mandatoryAttendeePointer = 0;

    // Gererate Arraylist for avalable time ranges for both optional and mandatory attendees.
    while (otptionalAttendeePointer < availableOptionalTimeRanges.size() & mandatoryAttendeePointer < availableTimeRanges.size()){
        
        TimeRange availableMandatory = availableTimeRanges.get(mandatoryAttendeePointer);
        TimeRange availableOptional = availableOptionalTimeRanges.get(otptionalAttendeePointer);

        if(availableMandatory.start() >= availableOptional.end()){
            otptionalAttendeePointer++;
        } else if (availableOptional.start() >= availableMandatory.end()){
            mandatoryAttendeePointer++;
        } else if (availableOptional.contains(availableMandatory)){
            possibleTimeRanges.add(availableMandatory);
            mandatoryAttendeePointer++;
        } else if (availableMandatory.contains(availableOptional)){
            possibleTimeRanges.add(availableOptional);
            otptionalAttendeePointer++;
        } else if (availableOptional.overlaps(availableMandatory)){

            int mandatoryPossibleTime = availableMandatory.start();
            int optionalPossibleTime = availableOptional.start();

            TimeRange possibleTime = TimeRange.fromStartEnd(optionalPossibleTime, mandatoryPossibleTime, false);
            if(request.getDuration() < possibleTime.duration()) {
                possibleTimeRanges.add(availableMandatory);
                otptionalAttendeePointer++;
                mandatoryAttendeePointer++;

            }
        }
    }

    // Checks to see if there are no common available time arranges for mandatory and optional, and returns time ranges for mandatory if empty.
    if(possibleTimeRanges.isEmpty()) return availableTimeRanges;

    return possibleTimeRanges;
  }
  
    public ArrayList<TimeRange> getBookedTimeRanges(Collection<Event> events, MeetingRequest request, boolean mandatory){
        ArrayList<TimeRange> bookedTimeRanges = new ArrayList<TimeRange>();

        if (!mandatory){
            for(String optionalUser: request.getOptionalAttendees()){
                for(Event event: events){
                    if (event.getAttendees().contains(optionalUser)){
                        bookedTimeRanges.add(event.getWhen());
                    }
                }    
            }
        } else{
            for(String user: request.getAttendees()){
                for(Event event: events){
                    if (event.getAttendees().contains(user)){
                        bookedTimeRanges.add(event.getWhen());
                    }
                }    
            }
        }
        return bookedTimeRanges;
    } 

    // Checks for overlaps in booked time ranges and creates new array list with all unavailable times
    public void getUnavaliableTimeRanges(ArrayList<TimeRange> bookedTimeRanges){
        int k = 0;
        while (k < (bookedTimeRanges.size() - 1)){
            TimeRange first = bookedTimeRanges.get(k);
            TimeRange second = bookedTimeRanges.get(k+1);
            if(first.overlaps(second)){
                if (first.contains(second)){
                    bookedTimeRanges.remove(second);
                } else {
                    int oldStart = first.start();
                    int newEnd = second.end();
                    
                    bookedTimeRanges.set(k, TimeRange.fromStartEnd(oldStart, newEnd, false));
                    bookedTimeRanges.remove(second);
                }
            }
            k++; 
        }
    }

    public void insertStartOfDay(ArrayList<TimeRange> bookedTimeRanges, ArrayList<TimeRange> possibleTimeRanges, MeetingRequest request) {
        if (bookedTimeRanges.size() > 0){
            if(!(bookedTimeRanges.get(0).contains(TimeRange.START_OF_DAY))){
                TimeRange start = TimeRange.fromStartEnd(TimeRange.START_OF_DAY, bookedTimeRanges.get(0).start(), false);
                if(start.duration() >= request.getDuration()){
                    possibleTimeRanges.add(start);
                }
            }
        }
    }

    public void insertEndOfDay(ArrayList<TimeRange> bookedTimeRanges, ArrayList<TimeRange> possibleTimeRanges, MeetingRequest request) {
        int num = bookedTimeRanges.size();
        if (num > 0){
            if(!(bookedTimeRanges.get(num-1).contains(TimeRange.END_OF_DAY))){
                TimeRange end = TimeRange.fromStartEnd(bookedTimeRanges.get(num-1).end(), TimeRange.END_OF_DAY, true);
                if(end.duration() >= request.getDuration()){
                    possibleTimeRanges.add(end);
                }
            }
        }
    }

    public void getFreeTimeRanges(ArrayList<TimeRange> unavaliableTimeRanges, ArrayList<TimeRange> availableTimeRanges, MeetingRequest request) {
        for(int j=0; j < unavaliableTimeRanges.size() - 1; j++){
            TimeRange endOne = unavaliableTimeRanges.get(j);
            TimeRange secondTwo = unavaliableTimeRanges.get(j+1);

            TimeRange freeRange = TimeRange.fromStartEnd(endOne.end(), secondTwo.start(), false);
            if(freeRange.duration() >= request.getDuration()){
                availableTimeRanges.add(freeRange);
            }
        }
    }

}

 