//-----------------------------------------------------------------------------
// Torque 3D
// Copyright (C) GarageGames.com 2000 - 2009 All Rights Reserved
//-----------------------------------------------------------------------------

// Print a message to the console
// Kind of repititiously redundant
// %message - The message to print
function printMessage(%message)
{
   echo(%message);
}

// Print two separate strings to the console
// Equally redundant in equality
// %part1 - First part of message
// %part2 - Second part of message
function printAdvancedMessage(%part1, %part2)
{
   echo(%part1, %part2);
}

// Change global game variables to default values
function resetGameVariables()
{
   // Game's name
   $GameName = "Blank";
   
   // Player's name
   $PlayerName = "Player";
   
   // Game play type
   $GameType = "Default";
}

// Set the global game variables
// %gameName - Game's name
// %playerName - Player's name
// %gameType - Game play type
function setGameVariables(%gameName, %playerName, %gameType)
{
   $GameName = %gameName;
   $PlayerName = %playerName;
   $GameType = %gameType;
}

// Print our game's information to the console
function printGameInformation()
{
   echo("Game Name: ", $GameName);
   echo("Player's Name: ", $PlayerName);
   echo("Game Type: ", $GameType);
}