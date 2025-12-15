import { useAppState } from '@/hooks/use-app-state';
import { useKeywordAnalysis } from '@/hooks/use-keyword-analysis';
import { Header } from '@/components/aso/header';
import { Disclaimer } from '@/components/aso/disclaimer';
import { MetaForm } from '@/components/aso/meta-form';
import { SearchQueryForm } from '@/components/aso/search-query-form';
import { SearchQueryList } from '@/components/aso/search-query-list';
import { EditSearchQueryDialog } from '@/components/aso/edit-search-query-dialog';
import { KeywordsDisplay } from '@/components/aso/keywords-display';
import { MetaAnalysisComponent } from '@/components/aso/meta-analysis';
import { RankChart } from '@/components/aso/rank-chart';
import { UnusedQueries } from '@/components/aso/unused-queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function App() {
  const {
    // State
    searchQueries,
    searchQueryText,
    searchQueryPopularity,
    searchQueryCompetitiveness,
    selectedCategory,
    selectedGameCategory,
    metaName,
    metaSubtitle,
    metaKeywords,
    editingSearchQuery,
    isEditDialogOpen,
    // Setters
    setSearchQueryText,
    setSearchQueryPopularity,
    setSearchQueryCompetitiveness,
    setSelectedGameCategory,
    setMetaName,
    setMetaSubtitle,
    setMetaKeywords,
    setIsEditDialogOpen,
    // Handlers
    handleAddSearchQuery,
    handleDragEnd,
    handleCategoryChange,
    handleEditSearchQuery,
    handleSaveSearchQuery,
    handleDeleteSearchQuery,
    handleReset,
    handleUseDemoData,
  } = useAppState();

  const {
    keywords,
    satisfiedKeywords,
    ownedKeywordsOrdered,
    metaAnalysis,
    unusedSearchQueries,
    analyzeTextFn,
    analyzeKeywordsFn,
  } = useKeywordAnalysis({
    searchQueries,
    metaName,
    metaSubtitle,
    metaKeywords,
    selectedCategory,
    selectedGameCategory,
  });

  return (
    <>
      <div className="w-full min-h-screen bg-background">
        <Disclaimer />

        <Header
          onReset={handleReset}
          onUseDemoData={handleUseDemoData}
        />

        {/* Mast */}
        <div className="w-full flex flex-col px-8 pt-16 pb-4 border-b">
          <h1>
            Worksheet
          </h1>

          <div className="w-1/2 mt-4">
            <p>
              This worksheet is intended to be used in conjunction with Appfigures while doing keyword research for the iOS app store. This
              {' '}
              <a href="https://appfigures.com/resources/guides/which-keywords-to-optimize-for" target="_blank">Appfigures blog post</a>
              {' '}
              outlines the general approach.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="w-full flex gap-4 px-8 py-8">
          {/* Left col */}
          <div className="flex-1 flex flex-col gap-10 p-4 rounded-2xl bg-gray-100">
            {/* Meta */}
            <Card>
              <CardHeader>
                <CardTitle>
                  App Meta
                </CardTitle>
                <CardDescription>
                  These fields align with your app's information in App Store Connect. Keywords lose power from top to bottom and left to right. A keyword at the start of your app's name is worth much more than a keyword at the end of your keyword list.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetaForm
                  metaName={metaName}
                  metaSubtitle={metaSubtitle}
                  metaKeywords={metaKeywords}
                  selectedCategory={selectedCategory}
                  selectedGameCategory={selectedGameCategory}
                  onMetaNameChange={setMetaName}
                  onMetaSubtitleChange={setMetaSubtitle}
                  onMetaKeywordsChange={setMetaKeywords}
                  onCategoryChange={handleCategoryChange}
                  onGameCategoryChange={setSelectedGameCategory}
                />
              </CardContent>
            </Card>

            {/* Search Queries */}
            <Card>
              <CardHeader>
                <CardTitle>Search Queries</CardTitle>
                <CardDescription>
                  Enter the search queries you would like to rank for, ordered by priority. Popularity and Competitiveness fields map to values in Appfigures. Find a balance that makes sense for your app and your optimization strategy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchQueryForm
                  searchQueryText={searchQueryText}
                  searchQueryPopularity={searchQueryPopularity}
                  searchQueryCompetitiveness={searchQueryCompetitiveness}
                  onSearchQueryTextChange={setSearchQueryText}
                  onSearchQueryPopularityChange={setSearchQueryPopularity}
                  onSearchQueryCompetitivenessChange={setSearchQueryCompetitiveness}
                  onAdd={handleAddSearchQuery}
                />

                <SearchQueryList
                  searchQueries={searchQueries}
                  onEdit={handleEditSearchQuery}
                  onDelete={handleDeleteSearchQuery}
                  onDragEnd={handleDragEnd}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right col */}
          <div className="flex-1 flex flex-col p-4 rounded-2xl bg-gray-100">
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">Target Keywords</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  These are the keywords that should be included in your app's meta. They are ordered to match the priority of your search queries. Only singular versions are listed (Apple does not differentiate between singular and plural words).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KeywordsDisplay
                  keywords={keywords}
                  satisfiedKeywords={satisfiedKeywords}
                />
                <h3 className="text-lg font-medium mt-6">
                  Keyword Strength
                </h3>

                <RankChart
                  keywords={keywords}
                  ownedKeywordsOrdered={ownedKeywordsOrdered}
                />
              </CardContent>
            </Card>

            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">Potential Issues</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Your meta data may not be fully optimized.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetaAnalysisComponent
                  keywordListValue={metaKeywords}
                  metaAnalysis={metaAnalysis}
                />
              </CardContent>
            </Card>

            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">Unused Search Queries</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  A variation of your search query may have a very different popularity-to-competitiveness ratio. Check variations in word order and pluralization. Here are some possibilities, investigate these and any others that make sense.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UnusedQueries
                  unusedSearchQueries={unusedSearchQueries}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EditSearchQueryDialog
        searchQuery={editingSearchQuery}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveSearchQuery}
      />
    </>
  );
}

export default App;
