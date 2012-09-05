//-----------------------------------------------------------------------------
// Torque 3D
// Copyright (C) GarageGames, LLC 2011 All Rights Reserved
//-----------------------------------------------------------------------------

// Print the sum of %a and %b
function addValues(%a, %b)
{ 
   %sum = %a + %b;
   
   echo("Sum of " @ %a @ " + " @ %b @ ": ", %sum);
}

// Print the difference between %a and %b
function subtractValues(%a, %b)
{
   %difference = %a - %b;
   
   echo("Difference between " @ %a @ " - " @ %b @ ": ", %difference);
}

// Print the product of %a and %b
function multiplyValues(%a, %b)
{
   %product = %a * %b;
   
   echo("Product of " @ %a @ " * " @ %b @ ": ", %product);
}

// Print the quotient of %a and %b
function divideValues(%a, %b)
{
   %quotient = %a / %b;
   
   echo("Quotient of " @ %a @ " / " @ %b @ ": ", %quotient);
}

// Print remainder of %a divided by %b
function moduloValue(%a, %b)
{
   %remainder = %a % %b;
   
   echo("Remainder of " @ %a @ " % " @ %b @ ": ", %remainder);
}

// Print the increment of %a
function incrementValue(%a)
{
   %original = %a;
   %a++;
   
   echo("Single increment of " @ %original @ ": ", %a);
}

// Print the decrement of %a
function decrementValue(%a)
{
   %original = %a;
   %a--;
   
   echo("Single decrement of " @ %original @ ": ", %a);
}

// Print the result of a+=b
function addToValue(%a, %b)
{
   %original = %a;
   %a += %b;
   
   echo("Sum of " @ %original @ " += " @ %b @ ": ", %a);
}

// Compare %a to %b, then print the relation
function compareValues(%a, %b)
{
   // Printing symbols just as a decorator
   // Makes it easier to isolate the print out
   echo("\n====================================");
   
   // Print out the value of %a and %b
   echo("\nValue of A: ", %a);
   echo("Value of B: ", %b);
   
   if(!%a)
      echo("\nA is a zero value\n");
   else
      echo("\nA is a non-zero value\n");
      
   if(!%b)
      echo("B is a zero value\n");
   else
      echo("B is a non-zero value\n");
   
   if(%a && %b)
      echo("Both A and B are non-zero values\n");
   
   if(%a || %b)
      echo("Either A or B is a non-zero value\n");
      
   if(%a == %b)
      echo("A is exactly equal to B\n");
   
   if(%a != %b)
      echo("A is not equal to B\n");
   
   if(%a < %b)
      echo("A is less than B");
   else if(%a <= %b)
      echo("A is less than or equal to B");
   
   if(%a > %b)
      echo("A is greater than B");
   else if(%a >= %b)
      echo("A is greater than or equal to B");
 
   // Printing symbols just as a decorator
   // Makes it easier to isolate the print out  
   echo("\n====================================");
}


function compareStrings(%string1, %string2)
{
   // Print out the values of %string1 and %string2
   echo("\nValue of String 1: ", %string1);
   echo("Value of String 2: ", %string2);
   
   if(%string1 $= %string2)
   {
      echo("\nString 1 and String 2 contain identical text");   
   }
   
   if(%string1 !$= %string2)
   {
      echo("\nString 1 and String 2 contain different text");   
   }
}