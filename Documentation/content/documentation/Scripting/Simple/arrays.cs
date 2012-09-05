//-----------------------------------------------------------------------------
// Torque 3D
// Copyright (C) GarageGames, LLC 2011 All Rights Reserved
//-----------------------------------------------------------------------------

// Set up all of the arrays 
// with default values
function initArrays()
{
   // Initialize single dimensional array
   // containing a list of names
   $names[0] = "Heather";
   $names[1] = "Nikki";
   $names[2] = "Mich";
   
   // Initialize two dimensional array
   // containing symbols for a 
   // tic-tac-toe game
   
   // Row one values   
   $board[0,0] = "_";
   $board[0,1] = "_";
   $board[0,2] = "_";
   
   // Row two values
   $board[1,0] = "_";
   $board[1,1] = "_";
   $board[1,2] = "_";
   
   // Row three values
   $board[2,0] = "_";
   $board[2,1] = "_";
   $board[2,2] = "_";
}

// Print out all the values 
// in the $names array
function printNames()
{   
   // Iterate through the names
   // array and print the values
   for(%i = 0; %i < 3; %i++)
      echo(%i @ ": " @ $names[%i]);
}

// Change the value of an array item
// %id = index to change
// %name = the new value
function setNames(%id, %name)
{
   // Our array only contains three elements:
   // [0] [1] [2]
   // If anything other than 0, 1, or 2 is
   // passed in, inform the user of an error
   if(%id > 2 || %id < 0)
   {
      error("Index " @ %id @ " out of range");
      error("Please use 0 - 2 as the %id");
   }
   else
      $names[%id] = %name;
}

// Print out the the values
// in the $board array
function printBoardValues()
{
   // %i loops through rows
   for(%i = 0; %i < 3; %i++)
   {
      // %j loops through columns
      for(%j = 0; %j < 3; %j++)
      {
         // Print the value of the [%i,%j]
         echo("[" @ %i @ "," @ %j @ "]: " @ $board[%i, %j]);
      }
   }
}

// Print tic-tac-toe board
// in a relative format
function printBoard()
{
   // Print out an entre row in 1 echo
   echo($board[0,0] @" "@ $board[0,1] @" "@ $board[0,2]);
   echo($board[1,0] @" "@ $board[1,1] @" "@ $board[1,2]);
   echo($board[2,0] @" "@ $board[2,1] @" "@ $board[2,2]);
}

// Set a specific value in the array
// to an X or O
function setBoardValue(%row, %column, %value)
{
   // Make sure "X" or "O" was passed in
   if(%value !$= "X" && %value !$= "O")
   {
      echo("Invalid entry:\nPlease use \'X\' or \'O\'");
      return;
   }
   
   // Set the board value
   $board[%row, %column] = %value;
   
   // Check to see if we have the same
   // three values in a row
   if(checkForWin())
   {
      // Entire row matched
      // Print a victory message
      echo("\n**********************");
      echo("*    Win Condition!  *");
      echo("**********************\n");
      
      // Print the board
      printBoard();
      
      // Reset the game
      echo("\nResetting board");
      resetBoard();
   }
}

// Set all values of $board
// array back to "nothing"
// In this case, nothing is _
function resetBoard()
{
   // %i loops through rows
   for(%i = 0; %i < 3; %i++)
   {
      // %j loops through columns
      for(%j = 0; %j < 3; %j++)
      {
         // Set value to _
         $board[%i, %j] = "_";
      }
   }
}

// Compare the values of each array
// item in a row
// If row contains the same values
// Return true for a victory
// Return false if values are different
function checkForWin()
{
   // Make sure at least the first symbol is X or O
   // Then compare the three values of a row
   //if($board[0,0] !$= "_" && $board[0,0] $= $board[0,1] && $board[0,1] $= $board[0,2])
      //return true;
      //
   //if($board[1,0] !$= "_" && $board[1,0] $= $board[1,1] && $board[1,1] $= $board[1,2])
      //return true;
      //
   //if($board[2,0] !$= "_" && $board[2,0] $= $board[2,1] && $board[2,1] $= $board[2,2])
      //return true;
   
   if($board[0,0] !$= "_" && !strcmp($board[0,0], $board[0,1]) && !strcmp($board[0,1], $board[0,2]))
      return true;
   
   if($board[0,0] !$= "_" && !strcmp($board[1,0], $board[1,1]) && !strcmp($board[1,1], $board[1,2]))
      return true;
      
   if($board[0,0] !$= "_" && !strcmp($board[2,0], $board[2,1]) && !strcmp($board[2,1], $board[2,2]))
      return true;
      
   return false;
}