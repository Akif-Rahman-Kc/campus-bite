import { LogBox } from 'react-native';
import Navigation from './navigation';

LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
  return (
      <Navigation />
  );
};