@echo off
setlocal

SET COMPILER=%1
IF NOT DEFINED COMPILER SET COMPILER=VS2008

REM --- Clean up the junk in the root of the scriptDocs folder ---
del /Q scriptDocs\*.*

REM --- Generate the project files ---
cd scriptDocs\project
call generateProjects.bat noPause
if %ERRORLEVEL% neq 0 (

   echo.
   echo Failed to generate the script documentation projects!
   echo.

   endlocal
   exit /b 1
)

REM --- Build the engine EXE ---
cd buildFiles
call compile.bat %COMPILER% Debug
if %ERRORLEVEL% neq 0 (

   echo.
   echo Failed to build the script documentation project!
   echo.

   endlocal
   exit /b 1
)
cd ..\..\..\

REM --- Dump the engine docs ---
if not exist "scriptDocs\project\game\ScriptDoc_DEBUG.exe" (

   echo.
   echo The script documentation executable was not found!
   echo.

   endlocal
   exit /b 1
)
if exist "scriptDocs\project\game\scriptDocs.txt" del /Q "scriptDocs\project\game\scriptDocs.txt"
scriptDocs\project\game\ScriptDoc_DEBUG.exe
if not exist "scriptDocs\project\game\scriptDocs.txt" (

   echo.
   echo The script documentation was not dumped!
   echo.

   endlocal
   exit /b 1
)

REM --- Build the doxygen docs ---
cd ..\Engine\bin\doxygen
doxygen.exe scriptReference.cfg
cd ..\..\..\Documentation

REM --- Build the CHM ---
..\Engine\bin\doxygen\hhc.exe scriptDocs\index.hhp
move /Y "scriptDocs\Torque 3D - Script Manual.chm" .\

endlocal
