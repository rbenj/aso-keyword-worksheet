import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function App() {
  return (
    <>
      <div className="w-full min-h-screen bg-background">
        <header className="w-full h-16">
          ASO Keyword Worksheet
        </header>

        <div className="w-full h-20 flex items-center px-4">
          <h1>
            Page Title
          </h1>
        </div>

        <div className="w-full flex gap-4 px-4">
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Title</Label>
                <Input id="metaTitle" defaultValue="---" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaSubTitle">Sub title</Label>
                <Input id="metaSubTitle" defaultValue="---" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Keywords</Label>
                <Input id="metaKeywords" defaultValue="---" />
              </div>
            </div>

            <div>
              Items
            </div>
          </div>

          <div className="flex-1">
            <div>
              Keywords
            </div>

            <div>
              Unused Phrases
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
