function initTutorial()
{
   displayAll = new Array();
   currentSection = 0;
   currentStep = new Array();
   SectionCount = getSectionCount();
   StepCount = new Array();
   
   switch(currentDocType)
   {
      case TUTORIAL:
      
         for(var i=0;i<SectionCount;i++)
         {
            StepCount[i] = getStepCount(i);
            displayAll[i] = false;
            generateTopReferenceBar(i);
         }
         
         displayCurrentStep();
         break;
         
      case REFERENCE:
      case ARTICLE:
         
         beginSection(0);
         displayCurrentStep();
         break;
   }
}

function refreshTutorial()
{
   SectionCount = getSectionCount();
   StepCount = new Array();
   
   for(var i=0;i<SectionCount;i++)
   {
      StepCount[i] = getStepCount(i);
     
      generateTopReferenceBar(i);
   }
   
   displayCurrentStep();
}

function objectOnClick(object)
{
   if((editMode) && !(skipExtraOnClicks) && !(object.isHidden))
   {
      setEditorSelectedElement(object);
      
      skipExtraOnClicks = true;
      setTimeout("skipExtraOnClicks = false;", 100);
   }
}

function objectOnDoubleClick(object)
{
   if((editMode) && !(skipExtraOnDoubleClicks) && !(object.isHidden))
   {
      var type = getElementType(object);
      
      switch(type)
      {
         case SECTION:
         
            //EditorEditSummary();
            break;
            
         case STEPTEXT:
         case STEP:
         
            EditorEditStep();
            break;
            
         case STEPHEADING:
         
            EditorEditStepHeading();
            break;
            
         case TABLE:
         
            EditorEditTable();
            break;
            
         case TABLEROW:
         
            EditorEditTableRow();
            break;
            
         case TABLECELL:
         
            EditorEditTableCell();
            break;
            
         case IMAGE:
         
            EditorChangeImage();
            break;
            
         case DOCUMENT:
         
            EditorEditHeading();
            break;
      }
      
      skipExtraOnDoubleClicks = true;
      setTimeout("skipExtraOnDoubleClicks = false;", 100);
   }
}



function nextSection(object)
{
   var Section = eval(getSectionNum(object.id));
   var newSection = Section + 1;
   
   if(newSection > SectionCount-1)
      newSection = SectionCount-1;
   else if(newSection < 0)
      newSection = 0;
      
   beginSection(newSection);
}

function beginSectionCallback(object)
{
   var Section = getSectionNum(object.id);
   beginSection(Section);
}

function beginSection(Section)
{
   var beginSectionLink = "";
   var StepBlock = "";
   var SectionWhyBlock = "";

   if(currentDocType == ARTICLE || currentDocType == REFERENCE)
      var showAll = true;
   else
      var showAll = false;

   currentSection = Section;

   for(var i=0;i<SectionCount;i++)
   {
      beginSectionLink = document.getElementById('BeginSectionLink-' + i);
      StepBlock = document.getElementById('StepBlock-' + i);
      SectionWhyBlock = document.getElementById('SectionWhyBlock-' + i);  
      
      beginSectionLink.Section = i;

      if(i == Section || showAll)
      {
         beginSectionLink.removeChild(beginSectionLink.childNodes[0]);
         beginSectionLink.appendChild(document.createTextNode("Close this Section..."));
         beginSectionLink.Section = Section;
         beginSectionLink.onclick = function() { endSection(this.Section); };
         StepBlock.style.display = "block";
         SectionWhyBlock.style.display = "block";  
      } else
      {
         beginSectionLink.removeChild(beginSectionLink.childNodes[0]);
         beginSectionLink.appendChild(document.createTextNode("Begin this Section..."));
         beginSectionLink.onclick = function() { beginSectionCallback(this); };
         StepBlock.style.display = "none";
         SectionWhyBlock.style.display = "none";  
      }
   }
     
   displayCurrentStep();
}

function endSection(Section)
{
   var beginSectionLink = document.getElementById('BeginSectionLink-' + Section);
   var StepBlock = document.getElementById('StepBlock-' + Section);
   var SectionWhyBlock = document.getElementById('SectionWhyBlock-' + Section); 
   
   beginSectionLink.removeChild(beginSectionLink.childNodes[0]);
   beginSectionLink.appendChild(document.createTextNode("Begin this Section..."));
   StepBlock.style.display = "none";
   SectionWhyBlock.style.display = "none";  
   beginSectionLink.onclick = function() { beginSectionCallback(this); };
   
   if(currentSection == Section)
      currentSection = -1;
}

function toggleDisplayAll(object)
{
   var Section = getSectionNum(object.id);

   if(displayAll[Section])
   {
      displayAll[Section] = false;
   } else 
   {
      displayAll[Section] = true;
   }
      
   displayCurrentStep();
}

function getSectionNum(string)
{
   var length = string.length;
   var stringChar = "";
   var endPos = string.length-1;
   
   for(var i=length-1;i>=0;i--)
   {
      stringChar = string.substr(i, 1);
      
      if(stringChar == "-")
         return string.substr(i+1, (endPos-i));
   }
}

function getCurrentStep(step)
{
   var returnStep = currentStep[step];
   
   if(!returnStep)
      returnStep = 0;
      
   return returnStep;   
}

function getSectionCount()
{
   var i = 0;
   var SectionBlock = document.getElementById('SectionBlock-' + i);

   while(SectionBlock)
   {
      i++;
      SectionBlock = document.getElementById('SectionBlock-' + i);
   }
   
   return i;
}

function getStepCount(step)
{
   var i = 0;
   var StepBlock = document.getElementById('StepBlock-' + step + '-' + i);

   while(StepBlock)
   {
      i++;
      StepBlock = document.getElementById('StepBlock-' + step + '-' + i);
   }
   
   return i;
}

function setStepBlockPositioning(step, isRelative)
{
   var StepCount = getStepCount(step);
   
   for(var i=0;i<StepCount;i++)
   {
      var StepBlock = document.getElementById('StepBlock-' + step + '-' + i);
      var StepImages = document.getElementById('StepImageBlock-' + step + '-' + i);
      
      if(isRelative)
      {
         if(StepBlock)
         {
            StepBlock.style.position = "relative";
            StepBlock.style.top = "0px";
         }
         
         if(StepImages)
         {   
            StepImages.style.position = "relative";
         }
      } else
      {
         if(StepBlock)
         {
            StepBlock.style.position = "absolute";
            StepBlock.style.top = "3px";
         }
         
         if(StepImages)
         {
            StepImages.style.position = "absolute";
         }
      }
   }
}

function generateTopReferenceBar(Section)
{
   var topReferenceBar = document.getElementById('StepTopReferenceBar-' + Section);
   
   if(topReferenceBar)
   {
      for(var i=topReferenceBar.childNodes.length-1;i>=0;i--)
      {
         var childNode = topReferenceBar.childNodes[i];
         topReferenceBar.removeChild(childNode);
      }
      
      var currentStepCount = StepCount[Section];
      
      for(var i=0;i<currentStepCount;i++)
      {
         var letterLink = document.createElement('a');
         letterLink.appendChild(document.createTextNode(i+1));
         letterLink.className = "TutorialStepLetterButton";
         letterLink.Section = Section;
         letterLink.Step = i;
         letterLink.onclick = function() { setStep(this.Section, this.Step); };
         letterLink.originalBGColor = letterLink.style.backgroundColor;
      
         topReferenceBar.appendChild(letterLink);
      }
   }
}

function highlightCurrentTopReference(Section)
{
   var topReferenceBar = document.getElementById('StepTopReferenceBar-' + Section);
   var currentStep = getCurrentStep(Section);
   
   if(topReferenceBar)
   {
      for(var i=topReferenceBar.childNodes.length-1;i>=0;i--)
      {
         var childNode = topReferenceBar.childNodes[i];

         if(i == currentStep || displayAll[Section])
         {
            childNode.style.backgroundColor = "Yellow";
         } else
         {
            childNode.style.backgroundColor = childNode.originalBGColor;
         }
      } 
      
      var displayAllButton = document.getElementById('StepDisplayAllButton-' + Section);
      
      if(!displayAll[Section])
      {
         displayAllButton.style.backgroundColor = "";;
         setStepBlockPositioning(Section, false);
      } else 
      {
         displayAllButton.style.backgroundColor = "Yellow";
         setStepBlockPositioning(Section, true);
      }   
   }    
}

function displayCurrentStep()
{
   if(currentSection == -1)
      return;
      
   var currentStep = getCurrentStep(currentSection);
   var StepBlock = "";
   var StepImages = "";

   if(currentDocType == ARTICLE || currentDocType == REFERENCE)
      var showAll = true;
   else
      var showAll = false;

   for(var i=0;i<StepCount[currentSection];i++)
   {
      StepBlock = document.getElementById('StepBlock-' + currentSection + '-' + i);
      StepImages = document.getElementById('StepImageBlock-' + currentSection + '-' + i);

      if(i == currentStep || displayAll[currentSection] || showAll == true)
      {
         if((StepBlock) && (StepBlock.isHidden))
         {
            StepBlock.style.display = "block";
            Effect.Appear(StepBlock.id, {from: 0, to: 1.0, duration: 0.25});
            StepBlock.isHidden = false;
         } else if(StepBlock)
         {
            StepBlock.isHidden = false;
         } 
           
         if((StepImages) && (StepImages.isHidden))
         {
            StepImages.style.display = "block";
            Effect.Appear(StepImages.id, {from: 0, to: 1.0, duration: 0.25});
            StepImages.isHidden = false;
         } else if(StepImages)
         {
            StepImages.isHidden = false;
         } 
      } else
      {
         if((StepBlock) && (!StepBlock.isHidden))
         {
            Effect.Appear(StepBlock.id, {from: 1.0, to: 0, duration: 0.25});
            setTimeout("document.getElementById('" + StepBlock.id + "').style.display = 'none';", 250);
            StepBlock.isHidden = true;
         } else if(StepBlock)
         {
            StepBlock.style.display = "none";
         }
            
         if((StepImages) && (!StepImages.isHidden))
         {
            Effect.Appear(StepImages.id, {from: 1.0, to: 0, duration: 0.25});
            setTimeout("document.getElementById('" + StepImages.id + "').style.display = 'none';", 250);
            StepImages.isHidden = true;
         } else if(StepImages)
         {
            StepImages.style.display = "none";
         }
      }   
   }
   
   if(!showAll)
      highlightCurrentTopReference(currentSection);
}

function setStep(step, newStep)
{
   var currentStepCount = StepCount[step];
   
   if(newStep > currentStepCount-1)
   {
      newStep = currentStepCount-1;
   } else if(newStep < 0)
   {
      newStep = 0;
   }
   
   if(displayAll[step])
      displayAll[step] = false;
   
   currentStep[step] = newStep;
   
   displayCurrentStep();
}

function previousStep(object)
{
   var Section = getSectionNum(object.id);
   changeStep(Section, -1);
}

function nextStep(object)
{
   var Section = getSectionNum(object.id);
   changeStep(Section, 1);
}

function changeStep(step, diff)
{
   var newStep = getCurrentStep(step) + eval(diff);

   setStep(step, newStep);
}