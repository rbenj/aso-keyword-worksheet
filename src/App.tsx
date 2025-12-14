import { useAppState } from '@/hooks/use-app-state';
import { useKeywordAnalysis } from '@/hooks/use-keyword-analysis';
import { Header } from '@/components/aso/header';
import { MetaForm } from '@/components/aso/meta-form';
import { SearchQueryForm } from '@/components/aso/search-query-form';
import { SearchQueryList } from '@/components/aso/search-query-list';
import { EditSearchQueryDialog } from '@/components/aso/edit-search-query-dialog';
import { KeywordsDisplay } from '@/components/aso/keywords-display';
import { MetaAnalysisComponent } from '@/components/aso/meta-analysis';
import { RankChart } from '@/components/aso/rank-chart';
import { UnusedQueries } from '@/components/aso/unused-queries';

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
    rankChartData,
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
        <Header
          onReset={handleReset}
          onUseDemoData={handleUseDemoData}
        />

        <div className="w-full h-20 flex items-center px-4">
          <h1>
            Worksheet
          </h1>

          <p>
            This worksheet is intended to be used in conjunction with Appfigures while doing keyword research for the iOS app store. This
            {' '}
            <a href="https://appfigures.com/resources/guides/which-keywords-to-optimize-for" target="_blank">Appfigures blog post</a>
            {' '}
            outlines the general approach.
          </p>

          <p>
            All data is stored locally in your browser. This app is not affiliated with, endorsed by, or associated with Appfigures or Apple. This tool is provided for informational and academic purposes only and does not constitute advice of any kind. The functionality and algorithms are based on assumptions that may be inaccurate.
          </p>
        </div>

        <div className="w-full flex gap-4 px-4">
          {/* Left col */}
          <div className="flex-1 flex flex-col gap-10">
            {/* Meta */}
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

            {/* Search Queries */}
            <div>
              <h2>
                Search Queries
              </h2>

              <p>
                Enter the search queries you would like to rank for, ordered by priority. Popularity and Competitiveness fields map to values in Appfigures. Find a balance that makes sense for your app and your optimization strategy.
              </p>

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
            </div>
          </div>

          {/* Right col */}
          <div className="flex-1 flex flex-col gap-10">
            <KeywordsDisplay
              keywords={keywords}
              satisfiedKeywords={satisfiedKeywords}
            />

            <MetaAnalysisComponent
              metaName={metaName}
              metaSubtitle={metaSubtitle}
              metaKeywords={metaKeywords}
              metaAnalysis={metaAnalysis}
              analyzeText={analyzeTextFn}
              analyzeKeywords={analyzeKeywordsFn}
            />

            <RankChart
              rankChartData={rankChartData}
              keywords={keywords}
            />

            <UnusedQueries
              unusedSearchQueries={unusedSearchQueries}
            />
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
