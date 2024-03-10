import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'task-organiser',
  webDir: 'dist/task_organiser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
