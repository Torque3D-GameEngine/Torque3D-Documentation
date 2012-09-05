function expandElement(elementID)
{
   var descriptionBox = document.getElementById("descriptionBox" + elementID);
   
   if(!descriptionBox.collapsed)
   {
      descriptionBox.formerDisplay = descriptionBox.style.display;
      descriptionBox.style.display = "none";
      
      descriptionBox.collapsed = true;
   } else
   {
      descriptionBox.style.display = descriptionBox.formerDisplay;
      
      descriptionBox.collapsed = false;
   }
}