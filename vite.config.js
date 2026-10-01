import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'');
  const mediaOrigin=process.env.VITE_PREVIEW_MEDIA_ORIGIN||env.VITE_PREVIEW_MEDIA_ORIGIN;
  return {plugins:[react()],server:{proxy:mediaOrigin?{'/__preview-media':{target:mediaOrigin,changeOrigin:true,rewrite:path=>path.replace(/^\/__preview-media/,'')}}:{}}};
});
