function initComponent()
{
   opacArray = new Array();
   toggleChildArray = new Array();

   referenceWindowCount = 0;
   glossaryWindowCount = 0;
   currentReferenceWindows = 0;
   currentGlossaryWindows = 0;
   
   referenceWindows = new Array();
   glossaryWindows = new Array();
   referenceDragSet = new Array();
   glossaryDragSet = new Array();
   
   descriptionWindowOrder = new Array();

   bodySize = document.getElementById('BODYID').innerHTML.length;

   referenceDescriptionArray = new Array();
 
   try 
   {
      initReferenceLookup("");
      initGlossaryLookup();
      initReferenceDescriptionWindow(3);
      initGlossaryDescriptionWindow(3);
   } catch(err) {}
   
   descriptionNum = 0;
   
   var anchor = 1;
   var tagID = "";
   var i = 0;

   var mysheet=document.styleSheets[0];

   if (mysheet.deleteRule) //if Firefox
   {
      mysheet.deleteRule(1);
      mysheet.insertRule('a.componentLink {display: inline;position:static;cursor:pointer;cursor:hand;}',1);
      
      mysheet.deleteRule(2);
      mysheet.insertRule('a.componentNoJSLink {display: none;position:relative;left: 20px;cursor:pointer;cursor:hand;}',2);
   } else if (mysheet.removeRule) //else if IE
   {
      mysheet.addRule("a.componentLink","display:inline");
      mysheet.addRule("a.componentNoJSLink","display:none");
   }

   try 
   {
      initComponentContainer();
   } catch(err) {}

   toggleArray = new Array();
   
   loadingBar = new Image(0, 6);
   loadingBar.src = DocImagePath + "images/red.JPG";
   
   closeIcon = new Image(8, 8);
   closeIcon.src = DocImagePath + "images/closeIcon.JPG";
   
   var searchWords = window.location.search.substring(1);
   
   if(searchWords != "")
   {
      var frameworkCheck = new String("frameworkPreviousLocation=");
      var locationSetCheck = searchWords.indexOf(frameworkCheck);
   
      if(locationSetCheck == -1)
      {
         highLightTagBegin = '<span style="font-weight: bold; background-color: yellow;">';
         highLightTagEnd = '</span>';
   
         highLightWords(searchWords);
      }
   }
   
   // here we check if we are two levels deep, if so that means we are in edit mode
   if(parent.parent)
   {
      var rebuildString = new String("REBUILD");
      var dataPassed = parent.parent.location.search.substring(1);
      var rebuildCheck = dataPassed.indexOf(rebuildString);
      
      // lets check if we need to rebuild the docs
      if(rebuildCheck != -1)
      {
         // since we are set to rebuild, we need to remove the rebuild tag,
         // otherwise we will continually rebuild in an infinite loop
         parent.parent.location.search = parent.parent.location.search.substr(0, 1) + parent.parent.location.search.substr(rebuildString.length+1);

         parent.parent.editFrame.rebuildSelectedDoc();
      }
   }
}

function loadComponent(name, spanNum, linkText)
{  
  var spanID = "componentTag" + spanNum;
  var spanLink = "componentLink" + spanNum;
  var obj = document.getElementById(spanID);
  var linkTextToLink = replaceAllSafe(linkText, "'", "\\'");
  
  if((!obj.expanded) && (!toggleArray[spanNum]))
  {
     var componentPath = getComponentPath(name);
     var componentPage = getComponentPage(name, componentPath);
     var componentCloseImage = 'componentCloseImage' + spanNum;
     var newSpan = document.createElement('span');
     var parentSpan = document.getElementById(spanID);
     
     newSpan.id = 'newSpan' + spanNum;

     document.getElementById(spanLink).onClick = 'loadComponent(\'' + name + '\', \'' + spanID + '\',\'' + linkTextToLink + '\')';
     document.getElementById(spanLink).innerHTML = '<IMG id = "' + componentCloseImage + '" border = "0"> <u><b>close</b></u>';
     document.getElementById(componentCloseImage).src = closeIcon.src;
     document.getElementById(spanLink).style.position = "relative";
     
     var insideCloseLink = document.createElement('span');
     var insideCloseImage = document.createElement('img');
     insideCloseLink.className = 'componentLink';
   
     insideCloseLink.innerHTML = '&nbsp<a onClick = "loadComponent(\'' + name + '\', \'' + spanNum + '\',\'' + linkTextToLink + '\')"><u><b>close</b></u></a>';
     
     var beforeNode = insideCloseLink.childNodes[0];
     insideCloseLink.insertBefore(insideCloseImage, beforeNode);   
     insideCloseImage.src = closeIcon.src;
     insideCloseImage.border = "0";
     insideCloseLink.style.position = "relative";
     
     newSpan.innerHTML = componentPage;
     newSpan.style.display = "block";  
     newSpan.style.overflow = "visible";  
     newSpan.appendChild(document.createElement('br'));
     newSpan.appendChild(insideCloseLink);
     
     parentSpan.style.display = "block";
     
     parentSpan.appendChild(newSpan);
     
     expandTo(spanID);
     toggleArray[spanNum] = true;
  } else if(obj.expanded)
  {
     var newSpan = document.getElementById('newSpan' + spanNum);
     var spanLink = document.getElementById(spanLink);
     var parentSpan = document.getElementById(spanID);
     
     parentSpan.removeChild(newSpan);
     
     spanLink.onClick = 'loadComponent(\'' + name + '\', \'' + spanID + '\',\'' + linkTextToLink + '\')';
     spanLink.innerHTML = "<u>" + linkText + "</u>";
     spanLink.style.position = "static";
     parentSpan.innerHTML = '';
     collapseTo(spanID, "document.getElementById('" + spanID + "').style.display = 'none';");
     toggleArray[spanNum] = false;
  }
}

function getComponentPage(name, componentPath)
{
   var componentPage = "";
   var componentCheck = "";
 
   var componentCount = componentContainerName.length;
   for(var i=0;i<componentCount;i++)
   {
      componentCheck = componentContainerName[i];
      
      if(componentCheck.toUpperCase() == name.toUpperCase())
      {
         componentPage = componentContainer[i];
         break;
      }
   }

   componentPage = replaceAll(componentPage, "<<IMAGE:PATH>>", DocImagePath + "documentation/Component Tutorials/" + componentPath.toString() + "images/");

   return componentPage;
}

function getComponentPath(name)
{
   for(var i=name.length;i>=0;i--)
   {
      var checkChar = name.substr(i, 1);
      
      if(checkChar == "/")
      {
         return name.substr(0, i+1);
      }
   }
   
   return name;
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

function replaceAllSafe(strText, strTarget, strSubString)
{
   var newString = "";
   var checkChar = "";

   for(var i=0;i<strText.length;i++)
   {
      checkChar = strText.substr(i, strTarget.length);
      
      if(checkChar == strTarget)
      {
         newString += strSubString;
         i += strTarget.length - 1;
      } else
      {
         newString += checkChar;
      }
   }
   
   return newString
}

function displayUndoButton()
{
   //alert('Display Undo Button');
   var highLightHUD = document.getElementById('highLightHUD');
   var buttonHTML = '<a id = "highLightLinkID">';
   
   buttonHTML += 'Remove Highlighting';
   buttonHTML += '</a>';
   
   highLightHUD.innerHTML = buttonHTML;
   
   highLightHUD.style.display = "block";
   
   opacity('highLightHUD', 0, 100, 1000, "", "setUndoFunc();");
}

function setUndoFunc()
{
   document.getElementById('highLightHUD').innerHTML = '<a id = "highLightLinkID" onClick = "undoHighLight()" style="background-color:Yellow;">Remove Highlighting</a>';
}

function setRedoFunc()
{
   document.getElementById('highLightHUD').innerHTML = '<a id = "highLightLinkID" onClick = "redoHighLight()" style="background-color:white;">Add Highlighting</a>';
}

function displayRedoButton()
{
   var highLightHUD = document.getElementById('highLightHUD');
   var buttonHTML = '<a id = "highLightLinkID" style="background-color:white;">';
   
   buttonHTML += 'Add Highlighting';
   buttonHTML += '</a>';
   
   highLightHUD.innerHTML = buttonHTML;
   
   opacity('highLightHUD', 0, 100, 1000, "", "setRedoFunc();");
}

function undoHighLight()
{
   document.getElementById("BODYID").innerHTML = originalHTML;
   var highLightHUD = document.getElementById('highLightHUD');
   var buttonHTML = '<a id = "highLightLinkID" onClick = "undoHighLight()">';
   
   buttonHTML += 'Remove Highlighting';
   buttonHTML += '</a>';
   
   highLightHUD.innerHTML = buttonHTML;
   highLightHUD.style.display = "block";
   opacity('highLightHUD', 100, 0, 1000, "", 'displayRedoButton();');
}

function redoHighLight()
{
   document.getElementById("BODYID").innerHTML = newBodyHTML;
   var highLightHUD = document.getElementById('highLightHUD');
   var buttonHTML = '<a id = "highLightLinkID" onClick = "redoHighLight()" style="background-color:white;">';
   
   buttonHTML += 'Add Highlighting';
   buttonHTML += '</a>';
   
   highLightHUD.innerHTML = buttonHTML;
   highLightHUD.style.display = "block";
   opacity('highLightHUD', 100, 0, 1000, "", 'displayUndoButton();');
}

function highLightWords(searchWords)
{
   bodyHTML = document.getElementById("BODYID").innerHTML; 
   
   // first we check to make sure the document isn't ridiculously long, otherwise the user will
   // be sitting there for 15-20 minutes while it tries to highlight it,
   // if it is too long then let them know and return out
   if(bodySize > 400000)
   {
      newBodyHTML = "<b><font color = 'red'>Document too big to highlight, use 'browser page search' for further document searching.</font></b>" + bodyHTML;
      document.getElementById("BODYID").innerHTML = newBodyHTML;
      return;
   }
   //bodyHTML = replaceAll(bodyHTML, "\n", " ");
   //bodyHTML = replaceAll(bodyHTML, "\r", " ");
 
   bodyArray = bodyHTML.split(" ");
   newBodyHTML = "<span id = 'highLightHUD' class = 'highLightBox'></span>";
   originalHTML = newBodyHTML + bodyHTML;  
   checkWord = "";
   checkChar = "";
   word = "";
   found = false;
   ignoreChar = false;
   searchArray = searchWords.split("-");
   searchWordCount = searchArray.length;
   iter = 0;  
   faded = false;
   TimeObject = new Date();
   startTime = (TimeObject.getMinutes() * 60) + TimeObject.getSeconds();

   document.getElementById("BODYID").innerHTML = newBodyHTML;
   changeOpac(0, 'highLightHUD')
   opacity('highLightHUD', 0, 100, 500, "");

   window.setTimeout("highLightWordsLoop()", 10);
}

function highLightWordsLoop()
{
   var i = 0;

   for(var i=0;i<(bodyArray.length/50);i++)
   {      
      found = false; 
      checkWord = bodyArray[iter];
      
      for(var j=0;j<searchWordCount;j++)
      {
         word = searchArray[j];
       
         if((!ignoreChar) && (word.toUpperCase() == checkWord.toUpperCase()))
         {
            newBodyHTML += highLightTagBegin + checkWord + highLightTagEnd + " ";
            found = true;
            break;
         }  
      }
         
      if(!found) 
      {
        newBodyHTML += checkWord + " ";
      }
   
      iter++;
   
      if(iter >= bodyArray.length)
      {
         reschedule = false;
         
         if(!faded)
         {
            faded = true;
            opacity('highLightHUD', 100, 0, 1000, "", 'displayUndoButton();');
            TimeObject = new Date();
            endTime = ((TimeObject.getMinutes() * 60) + TimeObject.getSeconds()) - startTime;
         }
         
         break;
      } else
      {
         reschedule = true;
      }
   }
  
   document.getElementById("BODYID").innerHTML = newBodyHTML;
   
   var percent = (iter / bodyArray.length) * 100;
   
   updateHighLightHUD(percent);
   
   if(reschedule)
      window.setTimeout("highLightWordsLoop()", 1);
   else if(isTutorial)
      initTutorial();
}

function updateHighLightHUD(percent)
{
   percent = Math.round(percent);

   var highLightHUD = document.getElementById('highLightHUD');
   var highlightHTML = "";
   var topVal = 0;
   var spaces = "";
   var spaceMult = 0;
   
   highLightHUD.style.display = "block";
   
   if(highLightHUD)
   {
      if(document.styleSheets[0].deleteRule)
      {
         percentWidth = Math.round((percent * 1.25) + 2);
      } else
      {
         percentWidth = Math.round(percent * 1.25);
      }
      
      highlightHTML = "<img style = 'position:relative; top: 4px; left: 4px;' id = 'progressBar' width = '" + percentWidth + "' height = '20'>" + spaces 
                    + "<div style = 'position:relative; width = 125px; top:-16px; z-index:1000;'>Highlighting " + percent + "%</div>";
      
      highLightHUD.innerHTML = highlightHTML;
      document.getElementById('progressBar').src = loadingBar.src;
   }
}

function expandTo(id)
{
   var obj = document.getElementById(id);
   var object = document.getElementById(id).style;
   var height = object.height;
   
   object.overflow = "hidden";
   
   if(!height)
      height = 0;
   else
      height = height.substr(0, height.length-2);
   
   if(height < 500)
   {
      object.height = eval(height) + 30;
      setTimeout("expandTo('" + id + "')", 10);
   } else
   {
      object.overflow = "scroll";
      obj.expanded = true;
   }
}

function collapseTo(id, callback)
{
   var obj = document.getElementById(id);
   var object = document.getElementById(id).style;
   var height = object.height;
   
   object.overflow = "hidden";
   
   if(!height)
      height = 0;
   else
      height = height.substr(0, height.length-2);
   
   if(height > 5)
   {
      object.height = eval(height) - 30;
      setTimeout('collapseTo("' + id + '", "' + callback + '")', 10);
   } else
   {
      eval(callback);
      obj.expanded = false;
   }
}

function opacity(id, opacStart, opacEnd, millisec, trackID, callback, callbackTwo, callbackThree) 
{
    //speed for each frame
    var speed = Math.round(millisec / 100);
    var timer = 0;
  
    //determine the direction for the blending, if start and end are the same nothing happens
    if(opacStart > opacEnd) {
        for(i = opacStart; i >= opacEnd; i--) {
            setTimeout("changeOpac(" + i + ",'" + id + "','" + trackID + "')",(timer * speed));
            timer++;
        }
    } else if(opacStart < opacEnd) {
        for(i = opacStart; i <= opacEnd; i++)
            {
            setTimeout("changeOpac(" + i + ",'" + id + "','" + trackID + "')",(timer * speed));
            timer++;
        }
    }
    
    if(callback)
       setTimeout(callback, millisec);
       
    if(callbackTwo)
       setTimeout(callbackTwo, millisec);
       
    if(callbackThree)
       setTimeout(callbackThree, millisec);
}

//change the opacity for different browsers
function changeOpac(opacity, id, trackID) 
{
    var object = document.getElementById(id).style;
    
    if(object)
    {
       object.opacity = (opacity / 101);
       object.MozOpacity = (opacity / 101);
       object.KhtmlOpacity = (opacity / 101);
       object.filter = "alpha(opacity=" + opacity + ")";
    }
} 

function getOpacity(id)
{
   var opac = opacArray[id];

   if(!opac)
      opac = 0;

   return opac; 
}

function methodTagOnLoad(methodTag, method)
{
}

function getMethodName(method)
{
   var returnName = "";
   var checkChar = "";
   
   for(var i=0;i<method.length;i++)
   {
      checkChar = method.substr(i, 1);
      
      if(checkChar != "(")
      {
         returnName += checkChar;
      } else
      {
         break;
      }
   }
   
   return returnName;
}

function moveWindowToFront(windowType, windowNum)
{
   var windowID = windowType + "-" + windowNum;

   for(var i=0;i<descriptionWindowOrder.length;i++)
   {
      var val = descriptionWindowOrder[i];
      
      if(i == windowID)
      {
         descriptionWindowOrder.splice(i, 1);
      }
   }
   
   descriptionWindowOrder.push(windowID);
   
   reorderDescriptionWindows();
}

function reorderDescriptionWindows()
{
   var window = 0;
   var windowIndex = -1;

   for(var i=0;i<descriptionWindowOrder.length;i++)
   {
      window = descriptionWindowOrder[i].split("-");
      
      if(window[0] == "glossary")
         windowIndex = "GlossaryWindow" + window[1];
      else
         windowIndex = "Window" + window[1];
      
      window = document.getElementById('description' + windowIndex);
      
      window.style.zIndex = i+1;
   }
}

function initReferenceDescriptionWindow(windowCount)
{
   if(!windowCount)
      windowCount = 1;
      
   maxReferenceWindows = windowCount;

   for(var i=0;i<windowCount;i++)
   {
      var descriptionSpan = document.createElement('span'); 
      var descriptionHeader = descriptionSpan.appendChild(document.createElement('span')); 
      var descriptionSpanBack = descriptionSpan.appendChild(document.createElement('span')); 
      var descriptionSpanText = descriptionSpan.appendChild(document.createElement('span'));
   
      descriptionSpan.num = i;
   
      descriptionSpan.id = 'descriptionWindow' + i;
      descriptionHeader.id = 'descriptionHeader' + i;
      descriptionSpanBack.id = 'descriptionSpanBack' + i;
      descriptionSpanText.id = 'descriptionSpanText' + i;
      descriptionSpanText.className = 'descriptionSpanText';
   
      descriptionSpan.className = 'descriptionWindow';
      descriptionHeader.className = 'descriptionHeader';
      descriptionSpanBack.className = 'descriptionSpanBack';
    
      var boldLink = descriptionHeader.appendChild(document.createElement('b'));   
      var closeLink = boldLink.appendChild(document.createElement('a'));
      closeLink.appendChild(document.createTextNode("  ")); // "CLOSE"
      closeLink.id = 'descriptionCloseLink' + i;
      closeLink.className = 'descriptionCloseLink';

      closeLink.onmouseover = function() { if(closeLink.style.color != "red") { this.style.color = "black"; } };
      closeLink.onmouseout = function() { this.style.color = "white"; };
   
      var descriptionTitle = descriptionHeader.appendChild(document.createElement('span'));  
      descriptionTitle.id = 'descriptionTitle' + i; 
      descriptionTitle.className = 'descriptionTitle';
      descriptionTitle.appendChild(document.createTextNode("Reference Definition"));
      descriptionTitle.num = i;
      
      descriptionTitle.onmousedown = function(e) { dragReferenceWindow(e, this.num) };
      //descriptionTitle.onmouseup = function() { stopDragReferenceWindow(this.num) };
      
      descriptionSpan.appendChild(document.createElement('br'));
   
      var bodyElement = document.getElementById('BODYID');
      var beforeNode = bodyElement.childNodes[0];
      bodyElement.insertBefore(descriptionSpan, beforeNode);   
   
      changeOpac(100, 'descriptionSpanText' + i);
      changeOpac(100, 'descriptionHeader' + i);
      changeOpac(100, 'descriptionSpanBack' + i);
      changeOpac(1, 'descriptionWindow' + i);
   
      descriptionSpan.style.display = "none";
      
      referenceWindowCount++;
      referenceWindows[i] = false;
      referenceDragSet[i] = false;
   }
}

function initGlossaryDescriptionWindow(windowCount)
{
   if(!windowCount)
      windowCount = 1;
   
   maxGlossaryWindows = windowCount;
   
   for(var i=0;i<windowCount;i++)
   {   
      var descriptionSpan = document.createElement('span'); 
      var descriptionHeader = descriptionSpan.appendChild(document.createElement('span')); 
      var descriptionSpanBack = descriptionSpan.appendChild(document.createElement('span')); 
      var descriptionSpanText = descriptionSpan.appendChild(document.createElement('span'));
   
      descriptionSpan.num = i;
   
      descriptionSpan.id = 'descriptionGlossaryWindow' + i;
      descriptionHeader.id = 'descriptionGlossaryHeader' + i;
      descriptionSpanBack.id = 'descriptionGlossarySpanBack' + i;
      descriptionSpanText.id = 'descriptionGlossarySpanText' + i;
      descriptionSpanText.className = 'descriptionSpanText';
   
      descriptionSpan.className = 'descriptionWindow';
      descriptionHeader.className = 'descriptionHeader';
      descriptionSpanBack.className = 'descriptionSpanBack';
    
      var boldLink = descriptionHeader.appendChild(document.createElement('b'));   
      var closeLink = boldLink.appendChild(document.createElement('a'));
      //var closeIcon = closeLink.appendChild(document.createElement('img'));
      
      closeLink.appendChild(document.createTextNode("  ")); // "CLOSE" 
      closeLink.id = 'descriptionGlossaryCloseLink' + i;
      closeLink.className = 'descriptionCloseLink';

      closeLink.onmouseover = function() { if(closeLink.style.color != "blue") { this.style.color = "blue"; } };
      closeLink.onmouseout = function() { this.style.color = "white"; };
   
      //closeIcon.src = DocImagePath + "images/closeIcon.JPG";
      //closeIcon.width = "8";
   
      var descriptionTitle = descriptionHeader.appendChild(document.createElement('span'));  
      descriptionTitle.id = 'descriptionGlossaryTitle' + i; 
      descriptionTitle.className = 'descriptionTitle';
      descriptionTitle.appendChild(document.createTextNode("Term Definition"));
      descriptionTitle.num = i;
      
      descriptionTitle.onmousedown = function(e) { dragGlossaryWindow(e, this.num) };
      //descriptionTitle.onmouseup = function() { stopDragGlossaryWindow(this.num) };
   
      descriptionSpan.appendChild(document.createElement('br'));
   
      descriptionSpanBack.style.backgroundColor = "#000033";
   
      var bodyElement = document.getElementById('BODYID');
      var beforeNode = bodyElement.childNodes[0];
      bodyElement.insertBefore(descriptionSpan, beforeNode);   
   
      changeOpac(100, 'descriptionGlossarySpanText' + i);
      changeOpac(100, 'descriptionGlossaryHeader' + i);
      changeOpac(0, 'descriptionGlossarySpanBack' + i);
      changeOpac(1, 'descriptionGlossaryWindow' + i);
   
      descriptionSpan.style.display = "none";
   
      glossaryWindowCount++;
      glossaryWindows[i] = false;
      glossaryDragSet[i] = false;
   }
}

function bodyMouseMove(e)
{
   var mousePosition = getMousePosition(e);
   var mousePosSplit = mousePosition.split("-");
   var mouseX = mousePosSplit[0];
   var mouseY = mousePosSplit[1];
      
   var posX = (mouseX) - 50;
   var posY = eval(mouseY) + 15;
   
   for(var i=0;i<maxReferenceWindows;i++)
   {
      if(referenceDragSet[i])
      {
         var windowObj = document.getElementById('descriptionWindow' + i);
         var offsetX = windowObj.offsetX;
         var offsetY = windowObj.offsetY;
         var newPosX = posX - offsetX;
         var newPosY = posY - offsetY;
         
         if((newPosX) && (newPosY))
         {
            windowObj.style.left = newPosX;
            windowObj.style.top = newPosY;
         }
      }   
   }
         
   for(var i=0;i<maxGlossaryWindows;i++)
   {
      if(glossaryDragSet[i])
      {
         var windowObj = document.getElementById('descriptionGlossaryWindow' + i);
         var offsetX = windowObj.offsetX;
         var offsetY = windowObj.offsetY;
         var newPosX = posX - offsetX;
         var newPosY = posY - offsetY;
         
         if((newPosX) && (newPosY))
         {
            windowObj.style.left = newPosX;
            windowObj.style.top = newPosY;
         }
      }   
   }
}

function bodyMouseUp()
{
   for(var i=0;i<maxReferenceWindows;i++)
   {
      if(referenceDragSet[i])
         stopDragReferenceWindow(i);
   }

   for(var i=0;i<maxGlossaryWindows;i++)
   {
      if(glossaryDragSet[i])
         stopDragGlossaryWindow(i);
   }
}

function dragGlossaryWindow(e, windowNum)
{
   var bodyObj = document.getElementById('BODYID');
   var windowObj = document.getElementById('descriptionGlossaryWindow' + windowNum);
   
   var mousePosition = getMousePosition(e);
   var mousePosSplit = mousePosition.split("-");
   var mouseX = mousePosSplit[0];
   var mouseY = mousePosSplit[1];
   
   var windowX = windowObj.style.left;
   var windowY = windowObj.style.top;
   
   windowX = (windowX.substr(0, windowX.length-2));
   windowY = (windowY.substr(0, windowY.length-2));
   
   var offsetX = mouseX - windowX;
   var offsetY = mouseY - windowY;
   
   offsetX -= 50;
   offsetY += 15;
   
   windowObj.offsetX = offsetX;
   windowObj.offsetY = offsetY;
   
   bodyObj.onmousemove = function(e) { bodyMouseMove(e) };
   bodyObj.onmouseup = function() { bodyMouseUp() };
   
   glossaryDragSet[windowNum] = true;
   
   moveWindowToFront("glossary", windowNum);
}

function stopDragGlossaryWindow(windowNum)
{
   var bodyObj = document.getElementById('BODYID');
   
   clearBodyMouseMove();
   
   glossaryDragSet[windowNum] = false;
}

function dragReferenceWindow(e, windowNum)
{
   var bodyObj = document.getElementById('BODYID');
   var windowObj = document.getElementById('descriptionWindow' + windowNum);
   
   var mousePosition = getMousePosition(e);
   var mousePosSplit = mousePosition.split("-");
   var mouseX = mousePosSplit[0];
   var mouseY = mousePosSplit[1];
   
   var windowX = windowObj.style.left;
   var windowY = windowObj.style.top;
   
   windowX = (windowX.substr(0, windowX.length-2));
   windowY = (windowY.substr(0, windowY.length-2));
   
   var offsetX = mouseX - windowX;
   var offsetY = mouseY - windowY;
   
   offsetX -= 50;
   offsetY += 15;
   
   windowObj.offsetX = offsetX;
   windowObj.offsetY = offsetY;
   
   bodyObj.onmousemove = function(e) { bodyMouseMove(e) };
   bodyObj.onmouseup = function() { bodyMouseUp() };
   
   referenceDragSet[windowNum] = true;
   moveWindowToFront("reference", windowNum);
}

function stopDragReferenceWindow(windowNum)
{
   var bodyObj = document.getElementById('BODYID');
   
   clearBodyMouseMove();
   
   referenceDragSet[windowNum] = false;
}

function clearBodyMouseMove()
{
   for(var i=0;i<maxGlossaryWindows;i++)
   {
      if(glossaryDragSet[i])
         return;
   }
   
   for(var i=0;i<maxReferenceWindows;i++)
   {
      if(referenceDragSet[i])
         return;
   }
   
   var bodyObj = document.getElementById('BODYID');
   
   bodyObj.onmousemove = null;
}

function getReferenceWindow()
{
   if(currentReferenceWindows >= referenceWindowCount)
      return -1;
      
   currentReferenceWindows++;
   
   var usableWindow = 0;
   
   for(var i=0;i<referenceWindowCount;i++)
   {
      if(!referenceWindows[i])
      {
         usableWindow = i;
         referenceWindows[i] = true;
         break;
      }
   }
   
   return usableWindow;
}

function getGlossaryWindow()
{
   if(currentGlossaryWindows >= glossaryWindowCount)
      return -1;
      
   currentGlossaryWindows++;

   var usableWindow = 0;
   
   for(var i=0;i<glossaryWindowCount;i++)
   {
      if(!glossaryWindows[i])
      {
         usableWindow = i;
         glossaryWindows[i] = true;
         break;
      }
   }
   
   return usableWindow;
}

function clearReferenceWindow(windowNum)
{
   currentReferenceWindows--;
   
   referenceWindows[windowNum] = false;
}

function clearGlossaryWindow(windowNum)
{
   currentGlossaryWindows--;
   
   glossaryWindows[windowNum] = false;
}

function processReferenceDescription(e, methodTag, methodClass, methodName, methodString, isLink)
{
   var windowNum = getReferenceWindow();
   
   if(windowNum == -1)
      return;

   var reference = false;

   if(bodySize > 150000)
      reference = true;
      
   var spanElement = document.getElementById(methodTag + 'span');

   methodNameUpper = methodName.toUpperCase();
   
   var description = referenceDescriptionArray[methodNameUpper];

   if(isLink)
   {
      var linkTag = "<<LINK>>";
      var linkMethodName = description.substr(linkTag.length, description.length - linkTag.length);
      var linkMethodNameUpper = linkMethodName.toUpperCase();
      
      description = referenceDescriptionArray[linkMethodNameUpper];
   }
   
   var descriptionSpan = document.getElementById('descriptionWindow' + windowNum);
   var descriptionSpanBack = document.getElementById('descriptionSpanBack' + windowNum);
   var closeLink = document.getElementById('descriptionCloseLink' + windowNum);
   var descriptionSpanText = document.getElementById('descriptionSpanText' + windowNum);

   var mousePosition = getMousePosition(e);
   var mousePositionRelative = getMousePositionRelative(e);
   
   var mousePosSplit = mousePosition.split("-");
   var mouseX = mousePosSplit[0];
   var mouseY = mousePosSplit[1];
   
   var mouseRPosSplit = mousePositionRelative.split("-");
   var mouseRX = mouseRPosSplit[0];
   var mouseRY = mouseRPosSplit[1];
      
   var posX = (mouseX) - 50;
   var posY = eval(mouseY) + 15;
   
   if(posX < 0)
      posX = 0;      
        
   if(descriptionSpan)
   {  
      description = replaceIDTag(description);
      description = replaceAll(description, "<span class = \"methodBox\">", "");
      description = "<span class = \"methodBox\">" + description + "<br><br><a href = \"" + DocImagePath + "documentation/Reference/TGB Reference/" + methodClass + ".html\">Go to the Reference Page</a>";
      
      var newLineCount = 0;
      
      newLineCount = getNewLineCount(description);
      
      var height = newLineCount * 20;
      descriptionSpanText.style.height = height + "px";
      
      var windowAdd = 56;
      if(document.styleSheets[0].deleteRule)
      {
         windowAdd = 56;
         //descriptionSpanBack.style.width = "517px";
      }
      
      descriptionSpan.style.height = (height + windowAdd) + "px";
      descriptionSpanBack.style.height = (height + windowAdd) + "px";
      descriptionSpan.style.top = posY + "px";
      descriptionSpan.style.left = posX + "px";

      closeLink.onclick = function() { hideDescriptionTag(methodTag, methodName, windowNum) };
      
      descriptionSpanText.innerHTML = "<b>" + methodString + "</b><br><br>" + description;
       
      descriptionSpan.style.display = "block";
      
      if(!reference)
         opacity('descriptionWindow' + windowNum, 0, 100, 200);
      else
         changeOpac(100, 'descriptionWindow' + windowNum);
       
      moveWindowToFront("reference", windowNum);
   }
}

function processGlossaryDescription(e, methodTag, word)
{
   var windowNum = getGlossaryWindow();
   
   if(windowNum == -1)
      return;

   var reference = false;

   if(bodySize > 150000)
      reference = true;

   var isReference = isReferenceArray[word.toUpperCase()];

   var spanElement = document.getElementById(methodTag + 'span');
 
   wordUpper = word.toUpperCase();
   
   var description = glossaryDescriptionArray[wordUpper];   
   
   if(isReference)
      description = referenceDescriptionArray[wordUpper];
   
   var descriptionSpan = document.getElementById('descriptionGlossaryWindow' + windowNum);
   var descriptionSpanBack = document.getElementById('descriptionGlossarySpanBack' + windowNum);
   var closeLink = document.getElementById('descriptionGlossaryCloseLink' + windowNum);
   var descriptionSpanText = document.getElementById('descriptionGlossarySpanText' + windowNum);
      
   //var viewportSize = getViewportSize();
   var mousePosition = getMousePosition(e);
   var mousePositionRelative = getMousePositionRelative(e);
   
   var mousePosSplit = mousePosition.split("-");
   var mouseX = mousePosSplit[0];
   var mouseY = mousePosSplit[1];
   
   var mouseRPosSplit = mousePositionRelative.split("-");
   var mouseRX = mouseRPosSplit[0];
   var mouseRY = mouseRPosSplit[1];
      
   var posX = (mouseX) - 50;
   var posY = eval(mouseY) + 15;
   
   if(posX < 0)
      posX = 0;      
        
   if((descriptionSpan) && (description))
   {  
      description = replaceIDTag(description);
      
      var newLineCount = 0;
      
      description = trimDescription(description);
      
      newLineCount = getNewLineCount(description);
          
      var height = newLineCount * 20;
      descriptionSpanText.style.height = height + "px";
      
      var windowAdd = 56;
      if(document.styleSheets[0].deleteRule)
      {
         windowAdd = 56;
         //descriptionSpanBack.style.width = "517px";
      }
      
      descriptionSpan.style.height = (height + windowAdd) + "px";
      descriptionSpanBack.style.height = (height + windowAdd) + "px";
      descriptionSpan.style.top = posY + "px";
      descriptionSpan.style.left = posX + "px";

      closeLink.onclick = function() { hideGlossaryDescriptionTag(methodTag, wordUpper, windowNum) };
      
      descriptionSpanText.innerHTML = "<b>" + replaceAll(word, "-", " ") + "</b><br><br>" + description;
       
      descriptionSpan.style.display = "block";
      
      if(!reference)
         opacity('descriptionGlossaryWindow' + windowNum, 0, 100, 200);
      else
         changeOpac(100, 'descriptionGlossaryWindow' + windowNum);
         
      moveWindowToFront("glossary", windowNum);
   }
}

function getNewLineCount(description)
{
   var newLineCount = 0;
   var checkThree = "";
   var checkTwo = "";

   for(var i=0;i<description.length;i++)
   {
      checkThree = description.substr(i, 3);
      checkTwo = description.substr(i, 2);
         
      if((checkThree.toUpperCase() == "<BR") || (checkTwo.toUpperCase() == "<P") || (checkThree.toUpperCase() == "<LI"))
         newLineCount++;
   }
   
   if(newLineCount < 8)
      newLineCount = 8;
   
   return newLineCount;
}

function test()
{
   var string = new String();
   
   var idPos = string.indexOf('blah');
   
   alert(idPos);
}

function replaceIDTag(string)
{
   if(!string)
      return string;

   var idPos = 0;
   var idEndPos = 0;

   var idArray = new Array();
   var lastIndex = 0;

   while(idPos != -1)
   {
      idPos = string.indexOf('id = "methodTag', lastIndex);
      idEndPos = string.indexOf('" class = "methodTag"', lastIndex);
   
      if(idPos != -1)
      {
         startNumPos = idPos + 15;    
         idNum = string.substr(startNumPos, idEndPos - startNumPos);
         idTag = "methodTag" + idNum;
      
         if(idTag != "methodTag")
            idArray.push(idTag);
         
         lastIndex = idPos + 1;
      }
   }
   
   if(idArray.length <= 0)
      return string;
  
   var startNumPos = 0;
   var idNum = 0;
   var idTag = 0;
   
   var returnString = string;
   var count = 0;
   
   for(var i=0;i<idArray.length;i++)
   {    
      idTag = idArray[i];

      returnString = replaceAll(returnString, idTag, "methodTagDesc" + descriptionNum);
      descriptionNum++;
      count++;
      
      if(count > 30) 
         return string;
   } 
   
   return returnString;
}

function hideDescriptionTag(methodTag, methodName, windowNum)
{
   var descriptionElement = document.getElementById('descriptionWindow' + windowNum);
   
   if(descriptionElement)
   {
      if(document.title == "TGB Reference")
      {
         changeOpac(0, 'descriptionWindow' + windowNum);
         invisDescriptionWindow(windowNum);
      } else
      {
         opacity('descriptionWindow' + windowNum, 100, 0, 200, "", "invisDescriptionWindow(" + windowNum + ");");
      }
   }
}

function hideGlossaryDescriptionTag(methodTag, methodName, windowNum)
{
   var descriptionElement = document.getElementById('descriptionGlossaryWindow' + windowNum);
   
   if(descriptionElement)
   {
      if(document.title == "TGB Reference")
      {
         changeOpac(0, 'descriptionGlossaryWindow' + windowNum);
         invisGlossaryDescriptionWindow(windowNum);
      } else
      {
         opacity('descriptionGlossaryWindow' + windowNum, 100, 0, 200, "", "invisGlossaryDescriptionWindow(" + windowNum + ");");
      }
   }
}

function invisDescriptionWindow(windowNum)
{
   var descriptionElement = document.getElementById('descriptionWindow' + windowNum);
   descriptionElement.style.display = "none";
   
   clearReferenceWindow(windowNum);
}

function invisGlossaryDescriptionWindow(windowNum)
{
   var descriptionElement = document.getElementById('descriptionGlossaryWindow' + windowNum);
   descriptionElement.style.display = "none";
   
   clearGlossaryWindow(windowNum);
}

function processMethodTag(methodTag, method)
{   
   var spanElement = document.getElementById(methodTag + 'span');
   var tag = document.getElementById(methodTag);

   if(!spanElement.results)
   {   
      var results = referenceLookUpArray[method.toUpperCase()];
   
      if(!results)
         return;
   
      var display = "";
      var displayResults = "";
      var displayLen = 0;
      var resultsSplit = results.split("-");
      var newLink = "";
      var methodName = "";	
      
      
      spanElement.onmouseout = function() { this.out = true; };
      spanElement.onmouseover = function() { this.out = false; };
      spanElement.out = true;
      
      spanElement.results = results;
   } else
   {
      var displayLen = 0;
      var methodName = "";	
      var newLink = "";
      var results = spanElement.results;
      var resultsSplit = results.split("-");
      var isReference = spanElement.isReference;
   }
   
         
   if(spanElement.hideTimeout)
      clearTimeout(spanElement.hideTimeout);
         
   spanElement.hideTimeout = null;
   
   if(!spanElement.hasChildNodes())
   {    
      for(var i=0;i<resultsSplit.length;i++)
      {
         displayResults = resultsSplit[i];
         methodName = getMethodName(displayResults);
         var methodClass = methodName.substr(0, methodName.indexOf("::"));

         var suffixLink = "";
         
         newLink = spanElement.appendChild(document.createElement('a'));
         newLink.className = "referenceHeaderLink";
         
         newLink.onmouseover = function() { if(newLink.style.color != "#CC0000") { this.style.color = "#CC0000"; } };
         newLink.onmouseout = function() { this.style.color = "#000066"; };
         
         initReferenceLookup(methodName.toUpperCase());
         var description = referenceDescriptionArray[methodName.toUpperCase()];
         
         if(description)
         {
            var linkWord = "<<LINK>>";
            var linkCheck = description.toUpperCase().substr(0, linkWord.length);
         
            if(linkCheck == linkWord)
               newLink.isLink = true;
            else
               newLink.isLink = false;
         }
         
         if((newLink.isLink) || (description))
         {
            newLink.methodTag = methodTag;
            newLink.methodName = methodName;
            newLink.methodClass = methodClass;
            newLink.methodString = getNameAfterNamespace(displayResults);
            newLink.onclick = function(e) { processReferenceDescription(e, this.methodTag, this.methodClass, this.methodName, this.methodString, this.isLink) };
         } else if(results)
         {
            newLink.href = DocImagePath + "documentation/Reference/TGB Reference.html#" + methodName;
            suffixLink = " *links to new page*";
         }
         
         var linkText = displayResults + suffixLink;
         
         newLink.appendChild(document.createTextNode(linkText));

         if(i<resultsSplit.length-1)
            spanElement.appendChild(document.createElement('br'));

         if(linkText.length > displayLen)
            displayLen = linkText.length; 
      } 

      spanElement.style.color = "black";
      spanElement.style.position = "absolute";
      spanElement.style.top = ((-1 * i) - 2) + "em";
      spanElement.style.left = "0em";
      spanElement.style.width = (displayLen*0.60) + "em";
      spanElement.style.textAlign = "left";
   }
   
   spanElement.style.display = "block";
}


function hideMethodTag(methodTag, method)
{
   var spanElement = document.getElementById(methodTag + 'span');
   
   spanElement.hideTimeout = setTimeout("makeMethodTagHide('" + methodTag + "', '" + method + "')", 200);
}

function makeMethodTagHide(methodTag, method)
{
   var spanElement = document.getElementById(methodTag + 'span');
   
   if(!spanElement.out)
      return;
      
   for(var i=spanElement.childNodes.length-1;i>=0;i--)
   {
      var childNode = spanElement.childNodes[i];
      spanElement.removeChild(childNode);
   }
   
   spanElement.style.display = "none";
}

/*function killTagDisplay(methodTag)
{

return;
   var spanElement = document.getElementById(methodTag + 'span');
}*/

function inChildOpac(methodTag)
{
   /*alert("in " + methodTag);

   var opac = getOpacity(methodTag);

   opacity(methodTag + 'span', opac, 100, 300, methodTag);

   toggleChildArray[methodTag] = true;*/
}

function outChildOpac(methodTag)
{
   //toggleChildArray[methodTag] = false;
}

function getNameAfterNamespace(string)
{
   var pos = string.indexOf("::");
   var returnString = string.substr(pos+2, string.length - (pos+2));
   
   return returnString;
}

function processGlossaryTag(methodTag, method)
{   
   var documentTitle = document.title;

   var spanElement = document.getElementById(methodTag + 'span');
   var tag = document.getElementById(methodTag);

   if(!spanElement.results)
   {   
      var results = glossaryLookUpArray[method.toUpperCase()];
      var isReference = isReferenceArray[method.toUpperCase()];
   
      if(!results)
         results = referenceLookUpArray[method.toUpperCase()];
   
      if(!results)
         return;
   
      var displayLen = 0;
      var word = "";
      var newLink = "";
      var resultsSplit = results.split("<br>");
   
      var borderColor = "#990000";
      var borderColorTwo = "#CC0000";
   
      spanElement.onmouseout = function() { this.out = true; };
      spanElement.onmouseover = function() { this.out = false; };
      spanElement.out = true;
      
      spanElement.results = results;
      spanElement.isReference = isReference;
      
   } else
   {
      var displayLen = 0;
      var word = "";
      var newLink = "";
      var results = spanElement.results;
      var resultsSplit = results.split("<br>");
      var isReference = spanElement.isReference;
   }
      
   if(spanElement.hideTimeout)
      clearTimeout(spanElement.hideTimeout);
         
   spanElement.hideTimeout = null;
   
   if(!spanElement.hasChildNodes())   
   {
      for(var i=0;i<resultsSplit.length;i++)
      {
         results = resultsSplit[i];
         word = replaceAll(results, "-", " ");
         var suffixLink = "";
     
         newLink = spanElement.appendChild(document.createElement('a'));
         newLink.className = "referenceHeaderLink";
         
         var description = glossaryDescriptionArray[results.toUpperCase()];
         
         if(isReference)
            description = referenceDescriptionArray[results.toUpperCase()];
         
         if((description) && (stripExtraHTML(description)))
         {
            newLink.methodTag = methodTag;
            newLink.word = results;
         
            newLink.onclick = function(e) { processGlossaryDescription(e, this.methodTag, this.word) };
         } else if(results)
         {
            if(!isReference)
               newLink.href = DocImagePath + "documentation/Reference/TGB Glossary.html#" + results;
            else
               newLink.href = DocImagePath + "documentation/Reference/TGB Reference/" + results + ".html";
               
            suffixLink = " *links to new page*";
         }
         
         newLink.onmouseover = function() { if(newLink.style.color != "#CC0000") { this.style.color = "#CC0000"; } };
         newLink.onmouseout = function() { this.style.color = "#000066"; };
         
         var linkText = word + suffixLink;
         
         newLink.appendChild(document.createTextNode(linkText));
      
         if(linkText.length > displayLen)
            displayLen = linkText.length;
            
         if(i<resultsSplit.length-1)
            spanElement.appendChild(document.createElement('br'));
      }
      
      spanElement.style.color = "black";
      spanElement.style.position = "absolute";
      spanElement.style.top = ((-1 * i) - 2) + "em";
      spanElement.style.left = "0em";
      spanElement.style.width = (displayLen*0.60) + "em";
      spanElement.style.textAlign = "left";
   
      spanElement.style.display = "block";
   }
}

function hideGlossaryTag(methodTag, method)
{
   var spanElement = document.getElementById(methodTag + 'span');
   
   spanElement.hideTimeout = setTimeout("makeGlossaryTagHide('" + methodTag + "', '" + method + "')", 200);
}

function makeGlossaryTagHide(methodTag, method)
{
   var spanElement = document.getElementById(methodTag + 'span');
   
   if(!spanElement.out)
      return;
      
   for(var i=spanElement.childNodes.length-1;i>=0;i--)
   {
      var childNode = spanElement.childNodes[i];
      spanElement.removeChild(childNode);
   }
   
   spanElement.style.display = "none";
}

function getMousePosition(e) 
{
   var posx = 0;
   var posy = 0;
   
   if(!e)
      var e = window.event;
	
   if (e.pageX || e.pageY)
   {
      posx = e.pageX;
      posy = e.pageY;
   } else if (e.clientX || e.clientY)
   {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop+ document.documentElement.scrollTop;
	}
	// posx and posy contain the mouse position relative to the document
	
	return posx + "-" + posy;
}

function getMousePositionRelative(e) 
{
   var posx = 0;
   var posy = 0;
   
   if (!e) 
      var e = window.event;
	
   if (e.clientX || e.clientY)
   {
      posx = e.clientX;
      posy = e.clientY;
	} else if (e.x || e.t)
   {
      posx = e.x;
      posy = e.y;
	}
	// posx and posy contain the mouse position relative to the window
	
	return posx + "-" + posy;
}

function getViewportSize()
{
   var size = [0, 0];

   if(typeof window.innerWidth != 'undefined')
   {
      size = [window.innerWidth, window.innerHeight];
   } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0)
   {
      size = [document.documentElement.clientWidth, document.documentElement.clientHeight];
   } else
   {
      size = [document.getElementsByTagName('body')[0].clientWidth, document.getElementsByTagName('body')[0].clientHeight];
   }

   return size;
}

function stripExtraHTML(stringToCheck)
{
   stringToCheck = replaceAll(stringToCheck, "<P>", " ");
   stringToCheck = replaceAll(stringToCheck, "</P>", "");
   stringToCheck = replaceAll(stringToCheck, "<p>", "");
   stringToCheck = replaceAll(stringToCheck, "</p>", "");
   stringToCheck = replaceAll(stringToCheck, "<br>", "");
   stringToCheck = replaceAll(stringToCheck, "<BR>", "");
   stringToCheck = replaceAll(stringToCheck, "<LI>", "");
   stringToCheck = replaceAll(stringToCheck, "<li>", "");
   stringToCheck = replaceAll(stringToCheck, "</LI>", "");
   stringToCheck = replaceAll(stringToCheck, "</li>", "");
   stringToCheck = replaceAll(stringToCheck, "<UL>", "");
   stringToCheck = replaceAll(stringToCheck, "<ul>", "");
   stringToCheck = replaceAll(stringToCheck, "</UL>", "");
   stringToCheck = replaceAll(stringToCheck, "</ul>", "");
   stringToCheck = replaceAll(stringToCheck, '<LI VALUE="1">', "");
   stringToCheck = replaceAll(stringToCheck, '<P LANG="" STYLE="margin-bottom: 0in">', "");
   stringToCheck = replaceAll(stringToCheck, '<P STYLE="margin-bottom: 0in">', "");
   stringToCheck = replaceAll(stringToCheck, '<FONT FACE="Arial, sans-serif">', "");
   stringToCheck = replaceAll(stringToCheck, '<FONT SIZE="3">', "");
   stringToCheck = replaceAll(stringToCheck, '</FONT>', "");
   stringToCheck = replaceAll(stringToCheck, " ", "");

   return stringToCheck;
}

function trimDescription(description)
{
   //alert(description);
   
   var ulPos = 0;
   var liPos = 0;
   
   // find the last /UL pos
   while(ulPos != -1)
   {
      ulPos = description.indexOf("</UL>", ulPos);
      
      if(ulPos != -1)
      {
         liPos = ulPos;
         ulPos++;
      }
   }
   
   var returnString = "";;

   liPos = description.indexOf("<LI", liPos);
      
   if(liPos != -1)
   {
      returnString = description.substr(0, liPos);
      liPos++;
   } else
   {
      returnString = description
   }

   /*alert(liPos);
   alert(description);
   alert(returnString);*/

   return returnString;
}


//----------------------------------------------------
// Functions for Code Block copy to clipboard functionality
//----------------------------------------------------
function getNodeIndex(node)
{
   var parent = node.parentNode;

   for(var i=0;i<parent.childNodes.length;i++)
   {
      var child = parent.childNodes[i];

      if(child == node) 
         return i;
   }

   return -1;
}

function copyToClipboard(node)
{
   var mod = 2;

   if(window.clipboardData)
      mod = 3;

   var index = getNodeIndex(node);
   index = eval(index);
   var element = node.parentNode.childNodes[(index+mod)];
   var data = element.innerHTML;
   
   data = cleanForClipboard(data, "<", ">");
   storeInClipboard(data);
   alert('code block stored in clipboard');
}

function cleanForClipboard(string, startChar, endChar)
{
   var startPos = string.indexOf(startChar);
   var endPos = string.indexOf(endChar);
   
   if(startPos != -1)
   {
      if(endPos != -1)
         var returnString = string.substring(0, (startPos)) + string.substring(endPos+1, string.length);
      else
         var returnString = string.substring(0, (startPos)); 

      if(returnString.indexOf(startChar) != -1)   
         returnString = cleanForClipboard(returnString, startChar, endChar);
   }

   return returnString;
}

function storeInClipboard(data)
{
   if(window.clipboardData)
   {
      window.clipboardData.setData('Text',data);
   } else
   {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect UniversalPreferencesRead UniversalPreferencesWrite");

      var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
      gClipboardHelper.copyString(data);
   }
}
