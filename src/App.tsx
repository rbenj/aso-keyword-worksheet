import { Button } from '@/components/ui/button';
import { SchemaMold } from 'rapidprotokit-schema-mold';
import 'rapidprotokit-schema-mold/style.css';
import './App.css';

function App() {
  return (
    <>
      <h1>Test</h1>
      <SchemaMold label="Test 1" />
      <SchemaMold label="Test 2" />
      <Button>Test</Button>
    </>
  );
}

export default App;
