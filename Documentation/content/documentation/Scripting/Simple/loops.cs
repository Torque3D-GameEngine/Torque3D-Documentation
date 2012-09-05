//-----------------------------------------------------------------------------
// Torque 3D
// Copyright (C) GarageGames, LLC 2011 All Rights Reserved
//-----------------------------------------------------------------------------

// Print 0 -> %count in the console
function printNumbers(%count)
{  
   for(%i = 0; %i <= %count; %i++)
   {
      echo(%i);
   }
}

// Print %startCount -> 0 in the console
function countdown(%startCount)
{
   for(%i = %startCount; %i >= 0; %i--)
   {
      echo(%i);
   }
}

// Print 0 -> %count, except %skipNumber, in the console
function skipCount(%count, %skipNumber)
{
   for(%i = 0; %i <= %count; %i++)
   {
      if(%i == %skipNumber)
         continue;
      
      echo(%i);
   }
}

// Increase %count incrementally until it is no
// longer less than %breakNumber
function whileExample(%count, %breakNumber)
{
   // While the count is less than the breaknumber
   while(%count < %breakNumber)
   {
      // Print the count
      echo(%count);
      
      // Increase the count
      %count++;
   }
}

// Increase %iterator until it is equal to
// %conditional. When it is, break out of
// the infinite loop
function breakOut(%iterator, %conditional)
{
   // If iterator is less than conditional
   // we will be stuck in an infinite loop
   // Error out and exit function.
   if(%iterator > %conditional)
   {
      error("Iterator is greater than conditional, try again");
      return;
   }
   
   // Loop infinitely until a condition is met   
   while(true)
   {
      // Condition has been met, break out.
      if(%iterator == %conditional)
         break;
         
      echo(%iterator);   
      
      %iterator++;
   }
}

// Run a nested loop
// Print messages, color based on level
function nestedLoops()
{
   // Max iteration for first loop
   %firstCount = 10;
   
   // Max iteration for nested loop
   %secondCount = 2;
   
   // Execute first loop %firstCount times
   for(%i = 0; %i < %firstCount; %i++)
   {
      // Execute nested loop %secondCount times
      for(%j = 0; %j < %secondCount; %j++)
      {
         // Print in red
         error("Running nested loop: " @ %j);
      }
      
      // Print in teal
      warn("Running main loop: " @ %i);
   }
}