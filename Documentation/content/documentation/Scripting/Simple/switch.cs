//-----------------------------------------------------------------------------
// Torque 3D
// Copyright (C) GarageGames, LLC 2011 All Rights Reserved
//-----------------------------------------------------------------------------

// Print a message to a console based on
// the amount of ammo a weapon has
// %ammoCount - Ammo count (obviously)
function checkAmmoCount(%ammoCount)
{
   // If the ammo is at 0, we are out of ammo
   // If the ammo is at 1, we are at the end of the clip
   // If the ammo is at 100, we have a full clip
   // If the ammo is anything else, we do not care
   switch(%ammoCount)
   {
      case 0:
         echo("Out of ammo, time to reload");
      case 1:
         echo("Almost out of ammo, warn user");
      case 100:
         echo("Full ammo count");
      default:
         echo("Doing nothing");
   }
}

// Check to see if a person's name is 
// a known user
// %userName - String containing person's name
function matchNames(%userName)
{
   switch$(%userName)
   {
      case "Heather":
         echo("User Found: " @ %userName);
      case "Mich":
         echo("User Found: " @ %userName);
      case "Nikki":
         echo("User Found: " @ %userName);
      default:
         echo("User " @ %userName @ " not found");
   }
}