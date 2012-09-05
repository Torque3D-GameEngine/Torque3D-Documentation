@echo off

IF EXIST "EngineReference" rmdir /S /Q "EngineReference"

cd "..\Engine\bin\doxygen"
doxygen.exe engineReference.cfg
cd "..\..\..\Documentation"

xcopy "..\Engine\bin\doxygen\images\*.*" "EngineReference\images\" /E /Y /F

del /Q doxygen.log

del /Q "EngineReference\*.map"
del /Q "EngineReference\*.md5"
del /Q "EngineReference\*.dot"

cd EngineReference
"..\..\Engine\bin\doxygen\hhc.exe" index.hhp
cd ..

move /Y "EngineReference\Torque 3D - Engine Reference.chm" .\
