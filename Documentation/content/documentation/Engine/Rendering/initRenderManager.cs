// In game/core/scripts/client/renderManager.cs:
function initRenderManager()
{
   // If we already have a script version of
   // RenderPassManager (DiffuseRenderPassManager)
   // do not proceed with this function
   assert( !isObject( DiffuseRenderPassManager ), "initRenderManager() - DiffuseRenderPassManager already initialized!" );
   
   // Create a new RenderPassManager
   new RenderPassManager( DiffuseRenderPassManager );

   // Begin adding sub-managers
   DiffuseRenderPassManager.addManager( new RenderPassStateBin() { renderOrder = 0.001; stateToken = AL_FormatToken; } );
     
   // We really need to fix the sky to render after all the 
   // meshes... but that causes issues in reflections.
   DiffuseRenderPassManager.addManager( new RenderObjectMgr() { bintype = "Sky"; renderOrder = 0.1; processAddOrder = 0.1; } );
   
   DiffuseRenderPassManager.addManager( new RenderObjectMgr()              { bintype = "Begin"; renderOrder = 0.2; processAddOrder = 0.2; } );
   // Normal mesh rendering.
   DiffuseRenderPassManager.addManager( new RenderMeshMgr()                { bintype = "Interior"; renderOrder = 0.3; processAddOrder = 0.3; } );
   DiffuseRenderPassManager.addManager( new RenderTerrainMgr()             { renderOrder = 0.4; processAddOrder = 0.4; } );
   DiffuseRenderPassManager.addManager( new RenderMeshMgr()                { bintype = "Mesh"; renderOrder = 0.5; processAddOrder = 0.5; } );
   DiffuseRenderPassManager.addManager( new RenderImposterMgr()            { renderOrder = 0.56; processAddOrder = 0.56; } );
   DiffuseRenderPassManager.addManager( new RenderObjectMgr()              { bintype = "Object"; renderOrder = 0.6; processAddOrder = 0.6; } );
     
   DiffuseRenderPassManager.addManager( new RenderObjectMgr()              { bintype = "Shadow"; renderOrder = 0.7; processAddOrder = 0.7; } );
   DiffuseRenderPassManager.addManager( new RenderMeshMgr()                { bintype = "Decal"; renderOrder = 0.8; processAddOrder = 0.8; } );
   DiffuseRenderPassManager.addManager( new RenderOcclusionMgr()           { bintype = "Occluder"; renderOrder = 0.9; processAddOrder = 0.9; } );
     
   // We now render translucent objects that should handle
   // their own fogging and lighting.
   
   // Note that the fog effect is triggered before this bin.
   DiffuseRenderPassManager.addManager( new RenderObjectMgr(ObjTranslucentBin) { bintype = "ObjectTranslucent"; renderOrder = 1.0; processAddOrder = 1.0; } );
         
   DiffuseRenderPassManager.addManager( new RenderObjectMgr()              { bintype = "Water"; renderOrder = 1.2; processAddOrder = 1.2; } );
   DiffuseRenderPassManager.addManager( new RenderObjectMgr()              { bintype = "Foliage"; renderOrder = 1.3; processAddOrder = 1.3; } );
	DiffuseRenderPassManager.addManager( new RenderParticleMgr()            { renderOrder = 1.35; processAddOrder = 1.35; } );
   DiffuseRenderPassManager.addManager( new RenderTranslucentMgr()         { renderOrder = 1.4; processAddOrder = 1.4; } );
   
   // Note that the GlowPostFx is triggered after this bin.
   DiffuseRenderPassManager.addManager( new RenderGlowMgr(GlowBin) { renderOrder = 1.5; processAddOrder = 1.5; } );    
   
   // Resolve format change token
   DiffuseRenderPassManager.addManager( new RenderPassStateBin(AL_FormatToken_Pop) { renderOrder = 1.6; stateToken = AL_FormatToken; } );
}
