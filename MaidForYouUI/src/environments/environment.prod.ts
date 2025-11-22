import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  apiBaseUrl: 'https://localhost:5001/api',
  production: true
};
