//-----------------------------------------------------------------------------
// Torque 3D
// Copyright (C) GarageGames, LLC 2011 All Rights Reserved
//-----------------------------------------------------------------------------

$PlayerName = "Player";
$GameName = "Default";
$BattleCry = "Hello World";

// Print player name string
function printPlayerName()
{
   // Concatenate "Player's Name" with the variable
   // Containing the name
   echo("Player's Name: " @ $PlayerName);
}

// Print game name string
function printGameName()
{
   // Concatenate "Game Name" with the variable
   // Containing the name
   echo("Game Name: " @ $GameName);
}

// Print battle cry string
function printBattleCry()
{
   // Concatenate the string in $PlayerName
   // with the static string yelled: "
   %message = $PlayerName @ " yelled: \"";

   // Concatenate the value of %message with
   // the string in $BattleCry and the " symbol
   // Store the results in the %message variable
   %message = %message @ $BattleCry @ "\"";
   
   // Print the new string after it
   // has been manipulated
   echo(%message);
}

// Print all the game strings using a single function
function printGameStrings()
{
   echo("\n***********************************");
   echo("*         GAME STATS              *");
   echo("***********************************\n");
   
   echo("Game Name: " @ $GameName);
   echo("Player's Name: " @ $PlayerName);
   echo($PlayerName @ " battle cry: \"" @ $BattleCry @ "\"");
}

// Set game strings with other strings
// %playerName will be assigned to $PlayerName
// %gameName will be assigned to $GameName
// %battleCry will be assigned to $BattleCry
function setGameStrings(%playerName, %gameName, %battleCry)
{
   // Check to see if the two strings are identical
   // If so, do nothing and print a message.
   // Otherwise, assign the new string
   if($PlayerName $= %playerName)
      echo("New player name is identical. Doing nothing");
   else
      $PlayerName = %playerName;
   
   // Check to see if the two strings are different
   // If so, assign the new string
   // Otherwise, do nothing and print a message.
   if($GameName !$= %gameName)
      $GameName = %gameName;
   else   
      echo("Game name is identical. Doing nothing");
   
   // Check to see if the two strings are identical
   // If so, do nothing and print a message.
   // Otherwise, assign the new string   
   if($BattleCry $= %battleCry)
      echo("Battle cry is identical. Doing nothing");
   else
      $BattleCry = %battleCry;
}