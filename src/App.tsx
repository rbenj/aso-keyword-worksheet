import { useAppState } from '@/hooks/use-app-state';
import { useKeywordAnalysis } from '@/hooks/use-keyword-analysis';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Nav } from '@/components/aso/nav';
import { Disclaimer } from '@/components/aso/disclaimer';
import { MetaForm } from '@/components/aso/meta-form';
import { SearchQueryForm } from '@/components/aso/search-query-form';
import { SearchQueryList } from '@/components/aso/search-query-list';
import { EditSearchQueryDialog } from '@/components/aso/edit-search-query-dialog';
import { KeywordsDisplay } from '@/components/aso/keywords-display';
import { MetaAnalysisComponent } from '@/components/aso/meta-analysis';
import { RankChart } from '@/components/aso/rank-chart';
import { UnusedQueries } from '@/components/aso/unused-queries';
import { DetailBox } from '@/components/aso/detail-box';
import { MockCard } from '@/components/aso/mock-card';

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
  } = useKeywordAnalysis({
    searchQueries,
    metaName,
    metaSubtitle,
    metaKeywords,
    selectedCategory,
    selectedGameCategory,
  });

  return (
    <div className="w-full min-h-screen bg-background pb-16">
      <header className="w-full flex flex-col">
        <Disclaimer />

        <Nav
          onReset={handleReset}
          onUseDemoData={handleUseDemoData}
        />

        <div className="px-8 pt-16 pb-6 border-b">
          <h1>Worksheet</h1>

          <div className="max-w-3xl mt-4">
            <p>
              This worksheet is intended to be used in conjunction with Appfigures to conduct iOS app store keyword research. This
              {' '}
              <a href="https://appfigures.com/resources/guides/which-keywords-to-optimize-for" target="_blank" rel="noopener noreferrer">Appfigures blog post</a>
              {' '}
              outlines the general approach.
            </p>
          </div>
        </div>
      </header>

      <div className="w-full flex flex-col gap-6 px-4 mt-8 md:flex-row md:px-8">
        <div className="flex-1 flex flex-col gap-6 p-4 rounded-2xl bg-secondary">
          <Card>
            <CardHeader>
              <CardTitle>Search Queries</CardTitle>

              <CardDescription>
                Enter search queries you want to rank for. Arrange them by descending priority. Popularity and competitiveness fields map to values in Appfigures.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SearchQueryForm
                onAdd={handleAddSearchQuery}
                onSearchQueryCompetitivenessChange={setSearchQueryCompetitiveness}
                onSearchQueryPopularityChange={setSearchQueryPopularity}
                onSearchQueryTextChange={setSearchQueryText}
                searchQueryCompetitiveness={searchQueryCompetitiveness}
                searchQueryPopularity={searchQueryPopularity}
                searchQueryText={searchQueryText}
              />

              {searchQueries.length > 0 && (
                <Separator className="mt-4 mb-8" />
              )}

              {searchQueries.length > 0 && (
                <SearchQueryList
                  onDelete={handleDeleteSearchQuery}
                  onDragEnd={handleDragEnd}
                  onEdit={handleEditSearchQuery}
                  searchQueries={searchQueries}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>App Meta</CardTitle>

              <CardDescription>
                These fields align with your app's information in App Store Connect. Keyword strength is determined by position. Strength decreases top-to-bottom and left-to-right.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <MetaForm
                metaKeywords={metaKeywords}
                metaName={metaName}
                metaSubtitle={metaSubtitle}
                onCategoryChange={handleCategoryChange}
                onGameCategoryChange={setSelectedGameCategory}
                onMetaKeywordsChange={setMetaKeywords}
                onMetaNameChange={setMetaName}
                onMetaSubtitleChange={setMetaSubtitle}
                selectedCategory={selectedCategory}
                selectedGameCategory={selectedGameCategory}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-8 px-2 py-8 rounded-2xl bg-secondary">
          <MockCard>
            <CardHeader>
              <h2>Target Keywords</h2>

              <CardDescription>
                These are the keywords that should be included in your app's meta. They are ordered to match the priority of your search queries. Only singular versions are listed (Apple does not differentiate between singular and plural words).
              </CardDescription>
            </CardHeader>

            <CardContent>
              {keywords.length > 0 ? (
                <>
                  <KeywordsDisplay
                    keywords={keywords}
                    satisfiedKeywords={satisfiedKeywords}
                  />

                  {satisfiedKeywords.size > 0 && (
                    <>
                      <h3 className="mt-6">Keyword Strength</h3>

                      <RankChart
                        keywords={keywords}
                        ownedKeywordsOrdered={ownedKeywordsOrdered}
                      />
                    </>
                  )}
                </>
              ) : (
                <DetailBox>
                  Add search queries to determine target keywords.
                </DetailBox>
              )}
            </CardContent>
          </MockCard>

          <MockCard>
            <CardHeader>
              <h2>Potential Issues</h2>

              <CardDescription>
                Investigate app meta optimization issues listed here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetaAnalysisComponent
                keywordListValue={metaKeywords}
                metaAnalysis={metaAnalysis}
              />
            </CardContent>
          </MockCard>

          <MockCard>
            <CardHeader>
              <h2>Alternate Search Queries</h2>

              <CardDescription>
                A slight variation of a search query may have a very different popularity-to-competitiveness ratio. Check variations in word order and pluralization. Some possibilities are listed here.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {searchQueries.length > 0 ? (
                <UnusedQueries
                  unusedSearchQueries={unusedSearchQueries}
                />
              ) : (
                <DetailBox>
                  Add search queries to see alternatives.
                </DetailBox>
              )}
            </CardContent>
          </MockCard>
        </div>
      </div>

      <EditSearchQueryDialog
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveSearchQuery}
        open={isEditDialogOpen}
        searchQuery={editingSearchQuery}
      />
    </div >
  );
}

export default App;
