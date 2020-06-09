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

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.io.IOException;
import java.util.ArrayList;
import com.google.gson.Gson;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService(); 
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

    
    PreparedQuery comments = datastore.prepare(query);

    int maxLimit = userChoice(request, "max-comments");
    int count = 0;
    ArrayList<String> userComments = new ArrayList<String>();
    for (Entity entity : comments.asIterable()) {

        String userComment = (String) entity.getProperty("comment");
        if (count < maxLimit) {
            userComments.add(userComment);
            count++;
        }
    }

    String json = convertToJsonUsingGson(userComments);
    response.setContentType("text/html;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    
    // Get the input from the form.
    String userComment = request.getParameter("text-input");
    long timestamp = System.currentTimeMillis();
    
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("comment", userComment);
    commentEntity.setProperty("timestamp", timestamp);
   
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    // Redirect back to the HTML page.
    response.sendRedirect("/activities.html");
  }
  
  @Override 
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
      Query query = new Query("Comment").setKeysOnly();
      PreparedQuery results = datastore.prepare(query);

      for (Entity entity : results.asIterable()) {
             datastore.delete(entity.getKey());
        }
  }

    private String convertToJsonUsingGson(ArrayList<String> comments) {
        Gson gson = new Gson();
        String json = gson.toJson(comments);
        return json;
    }

  private int userChoice(HttpServletRequest request, String param) {
    // Get the input from the form.
    String userChoice = request.getParameter(param);

    // Convert the input to an int.
    int limit;
    try {
      limit = Integer.parseInt(userChoice);
    } catch (NumberFormatException e) {
      limit = Integer.MAX_VALUE;
    }
    return limit;
  }
}


   




