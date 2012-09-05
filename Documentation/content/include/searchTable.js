function initSearch() 
{
   //first, tell the browsers to react to the event
   if( document.captureEvents && Event.KEYUP ) 
   {
     //remove this part if you do not need Netscape 4 to work
     document.captureEvents( Event.KEYUP );
   }
   /* this next line tells the browser to detect a keyup
   event over the whole document and when it detects it,
   it should run the event handler function 'alertkey' */
   document.onkeyup = alertkey;

   var searchText = "";

   highlightWords = true;

   initDocTable();   
   initSearchTable();
   initSearchTableTwo();
   initSearchTableThree();
   initSearchTableFour();
   initDisplayArray();
   
   var searchWords = window.location.search.substring(1);

   if((searchWords) && (searchWords != ""))
   {   
      var wordChunk = searchWords.split("&");
      var firstChunk = wordChunk[0].split("=");
      var secondChunk = wordChunk[1];
      
      if(secondChunk)
      {
         secondChunk = secondChunk.split("=");
         secondChunk = secondChunk[1];
         
         if(secondChunk == "off")
         {
            secondChunk = false;
         } else
         {
            secondChunk = true;
         }
           
      } else
      {
         secondChunk = false;
      }
      
      document.getElementById('highlightbox').checked = secondChunk;
      
      searchWords = firstChunk[1];
        
      var newString = searchWords.replace("searchText=", "");
      newString = replaceAll(newString, "+", " ");
      searchText = newString;
   } else
   {
      searchText = parent.topFrame.document.getElementById('textfield').value;
   }
   
   if(searchText != "")
   {
      var searchString = "";
       
      searchArray = searchText.split(" ");
      
      for(var i=0;i<searchArray.length;i++)
      {
         searchString += searchArray[i];
         
         if(i<searchArray.length-1)
            searchString += " ";
      }
      
      document.getElementById('searchText').value = searchString;
      parent.topFrame.document.getElementById('textfield').value = "";
      startSearch();
   }
   
   searchText = document.getElementById('searchText').value;
   
   if((searchText) && (searchText != ""))
      startSearch();
}

function arrayInsert(array, index, value)
{
    if((index) && index >- 1)
    {
       array.splice(index, 0, value);
    } else
    {
       array.push(value);
    }
}

function getDocName(doc)
{
   var longDocName = docTable[doc];

   return longDocName;   
}

function getShortDocName(longDocName)
{
   var stringLen = longDocName.length;
   var stringChar = "";
   
   for(var i=stringLen-1;i>=0;i--)
   {
      stringChar = longDocName.substr(i,1);
      
      if(stringChar == "/")
      {
         docName = longDocName.substr(i+1,stringLen);    
         break;   
      }
   }
   
   return docName;
}

function getParentFolder(longDocName)
{
   var stringLen = longDocName.length;
   var stringChar = "";
   var firstFound = false;
   var firstLoc = "";
   
   for(var i=stringLen-1;i>=0;i--)
   {
      stringChar = longDocName.substr(i,1);
      
      if((firstFound) && (stringChar == "/"))
      {
         docName = longDocName.substr(i+1,firstLoc-i-1);
         break;
      } else if(stringChar == "/")
      {
         firstFound = true;
         firstLoc = i;
      }
   }
   
   return docName;
}

function isInArray(val, array)
{
   for(var i=0;i<array.length;i++)
   {
      line = array[i];
      
      if(val.toUpperCase() == line.toUpperCase())
         return i;
   }
   
   return -1;
}

function startSearch()
{
   // grab the text from the search   
   var searchText = parent.topFrame.document.getElementById('textfield').value;

   if(!searchText || (searchText == "") || (searchText == '') || (searchText == " "))
   {
      searchText = document.getElementById('searchText').value;
   } else
   {
      document.getElementById('searchText').value = searchText;
      parent.topFrame.document.getElementById('textfield').value = "";
   } 
    
      
   var resultsArray = new Array();
   var valueArray = new Array();
   
   var matchArray = new Array();
 
   var resultCount = 0;
   var wordCount = 0;
   
   var found = false;
   var searchResult = "";
   var result = "";
  
   var docPage = "";
   var docName = "";
   var wordChunkedArray = "";
   var wordArray = "";
   var word = "";
   var searchWord = "";
   var inArray = "";
   var resultValue = "";
   var prevVal = "";
   var entryText = "";
   var searchPhrases = new Array();
        
   var searchTextString = "";
   
   if(searchText == "")
      return;
   
   highlightWords = document.getElementById('highlightbox').checked;
   
   searchArray = searchText.split(" ");
   searchWordCount = searchArray.length;
   
   // first lets search with up to 2 word combinations
   // we then will increase the result value depending
   // on how many sets are found
   if(searchWordCount > 1)
   {
      for(var i=1;i<searchWordCount;i++)
      {
         searchPhrases[i-1] = searchArray[i-1] + "-" + searchArray[i];
      }
      
      for(var i=searchPhrases.length-1;i>=0;i--)
      {
         searchWord = searchPhrases[i].toUpperCase();
      
         if(typeof(lookUpTable[searchWord]) != "undefined")
         {
            wordChunkedArray = lookUpTable[searchWord].split(" ");   
            resultCount = (wordChunkedArray.length) / 2;
            
            for(var k=0;k<resultCount;k++)
            {
               page = wordChunkedArray[k*2];
               val = wordChunkedArray[k*2+1]
            
               if(!matchArray[page])
                  matchArray[page] = 0;
            
               val *= (matchArray[page] + 4);
            
               matchArray[page]++;
               
               inArray = isInArray(page, resultsArray);
            
               if(inArray == -1)
               {
                  resultsArray[resultsArray.length] = page;
                  valueArray[valueArray.length] = val;    
               } else
               {
                  prevVal = valueArray[inArray];
                  valueArray[inArray] = eval(prevVal) + eval(val); 
               }
            
               found = true;
            }
         }
      }
   }

   // now lets search for single words
   for(var i=0;i<searchWordCount;i++)
   {
      searchWord = searchArray[i].toUpperCase();
      
      if(i < searchWordCount-1)
         searchTextString += searchWord + "-";
      else
         searchTextString += searchWord;
      
      if(typeof(lookUpTable[searchWord]) != "undefined")
      {
         wordChunkedArray = lookUpTable[searchWord].split(" ");
      
         resultCount = (wordChunkedArray.length) / 2;
            
         for(var k=0;k<resultCount;k++)
         {
            page = wordChunkedArray[k*2];
            val = wordChunkedArray[k*2+1];
               
            inArray = isInArray(page, resultsArray);
            
            if(inArray == -1)
            {
               resultsArray[resultsArray.length] = page;
               valueArray[valueArray.length] = val;    
            } else
            {
               prevVal = valueArray[inArray];
               valueArray[inArray] = eval(prevVal) + eval(val); 
            }
         }
            
         found = true;
      }   
   }

   if(found)
   {     
      result += "<br><br>" + resultsArray.length + " results found. <br>";
      result += "The following are the results found for <b>";
      
      for(var i=0;i<searchWordCount;i++)
      {
         searchWord = searchArray[i];
         result += "&quot;" + searchWord + "&quot;";
         
         if(i<searchWordCount-1)
            result += ", ";
      }
      
      result += ".</b><br><hr><br>";

      for(var i=0;i<resultsArray.length;i++)
      {
         docPage = resultsArray[i];
         resultValue = valueArray[i];
         longDocName = getDocName(docPage);
         shortDocName = getShortDocName(longDocName);
         parentName = getParentFolder(longDocName);
         indent = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
         
         if(resultValue > 1)
            matchWord = "Matches";
         else
            matchWord = "Match";
         
         entryText = '<a href = "' + longDocName;
         
         if(highlightWords)
            entryText += '?' + searchTextString;
         
         entryText += '">' + parentName + " - " + shortDocName + "</a><br><font size = '2'><i>" + indent + "<b>" + resultValue + "</b> - Total Word " + matchWord + " Value</i></font><br><br>";
         
         addToDisplayArray(entryText, resultValue);
      }
      
      result += getDisplayArray();
      
      document.getElementById('output').innerHTML = result;
   } else
   {      
      result += "<br><br>No Matches Found";
      result += "<br><hr>";
      
      document.getElementById('output').innerHTML = result;
   }
}

function initDisplayArray()
{
   displayValueArray = new Array();
   displayEntryArray = new Array();
}

function clearDisplayArray()
{
   displayValueArray.length = 0;
   displayEntryArray.length = 0;
}

function addToDisplayArray(entry, val)
{
   var inserted = false;
   var i = 0;
   var checkValue = "";

   while(!inserted)
   {
      if(i == displayValueArray.length)
      {
         displayValueArray[i] = val;
         displayEntryArray[i] = entry;
         break;
      }
      
      checkValue = displayValueArray[i];
      
      if(eval(val) > eval(checkValue))
      {
         displayValueArray.splice(i,0, val); 
         displayEntryArray.splice(i,0, entry);
         break;
      }
      
      i++;
   }      
}

function getDisplayArray()
{
   var displayString = "";
   
   for(var i=0;i<displayValueArray.length;i++)
   {
      displayString += "<b>" + (i+1) + ". - </b>" + displayEntryArray[i];
   }
   
   clearDisplayArray();
   
   return displayString;
}

function replaceAll(strText, strTarget, strSubString)
{
   var intIndexOfMatch = strText.indexOf(strTarget);
   
   while(intIndexOfMatch != -1)
   {
      strText = strText.replace(strTarget, strSubString);
      intIndexOfMatch = strText.indexOf(strTarget);
   }
   
   return strText;
}

//--------------------------------------------
// Key Events
//--------------------------------------------

//now create the event handler function to process the event
function alertkey(e) {
  if( !e ) {
    //if the browser did not pass the event information to the
    //function, we will have to obtain it from the event register
    if( window.event ) {
      //Internet Explorer
      e = window.event;
    } else {
      //total failure, we have no way of referencing the event
      return;
    }
  }
  if( typeof( e.keyCode ) == 'number'  ) {
    //DOM
    e = e.keyCode;
  } else if( typeof( e.which ) == 'number' ) {
    //NS 4 compatible
    e = e.which;
  } else if( typeof( e.charCode ) == 'number'  ) {
    //also NS 6+, Mozilla 0.9+
    e = e.charCode;
  } else {
    //total failure, we have no way of obtaining the key code
    return;
  }
  //window.alert('The key pressed has keycode ' + e +
  //  ' and is key ' + String.fromCharCode( e ) );
  
  if(e == 13)
     startSearch();
}