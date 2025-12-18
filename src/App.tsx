import { useState, useMemo } from 'react';

import { Keyword } from '@/models/Keyword';
import { Meta } from '@/models/Meta';
import { Query } from '@/models/Query';

import { cn } from '@/lib/utils';

import { applyDemoData } from '@/services/demo';
import { extractKeywords } from '@/services/aso';

import { useDb } from '@/hooks/useDb';
import { useIssues } from '@/hooks/useIssues';
import { useQueries } from '@/hooks/useQueries';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { ActionBox } from '@/components/ActionBox';
import { Disclaimer } from '@/components/Disclaimer';
import { MockCard } from '@/components/MockCard';
import { Nav } from '@/components/Nav';

import { AlternateQueries } from '@/features/queries/AlternateQueries';
import { Issues } from '@/features/issues/Issues';
import { MetaForm } from '@/features/meta/MetaForm';
import { QueryDialog } from '@/features/queries/QueryDialog';
import { QueryForm } from '@/features/queries/QueryForm';
import { QueryList } from '@/features/queries/QueryList';
import { TargetKeywords } from '@/features/target-keywords/TargetKeywords';
import { TargetKeywordsChart } from '@/features/target-keywords/TargetKeywordsChart';


function App() {
  const [activeQuery, setActiveQuery] = useState<Query | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<Meta>(new Meta({}));
  const [queries, setQueries] = useState<Query[]>([]);

  // Load and save from db
  useDb({
    meta,
    queries,
    setMeta,
    setQueries,
    setIsLoading,
  });

  // Extract keywords from meta
  const metaKeywords: Keyword[] = useMemo(() => {
    return extractKeywords(meta.getAllTextOrdered());
  }, [meta]);

  // Extract target keywords and alternates from queries
  const {
    alternateQueries,
    targetKeywords,
  } = useQueries(queries);

  // Determinepotential issues with meta
  const {
    duplicateMetaKeywords,
    keywordFieldCapitalWords,
    keywordFieldInvalidWords,
    keywordFieldMultiWords,
    keywordFieldPluralWords,
    keywordFieldSpaceCount,
    stopMetaKeywords,
    unhitTargetedKeywords,
  } = useIssues(targetKeywords, metaKeywords, meta.keywords);

  // Handlers
  const handleResetData = () => {
    setQueries([]);
    setMeta(new Meta({}));
  };

  const handleLoadDemoData = () => {
    applyDemoData(setMeta, setQueries);
  };

  const handleAddQuery = (query: Query): void => {
    setQueries([...queries, query]);
  };

  const handleClickEditQuery = (query: Query): void => {
    setActiveQuery(query);
  };

  const handleUpdateQuery = (query: Query): void => {
    setQueries([...queries.map(p => query.id === p.id ? query : p)]);
    setActiveQuery(null);
  };

  const handleClickDeleteQuery = (query: Query): void => {
    setQueries([...queries.filter(p => p.id !== query.id)]);
  };

  const handReorderQueries = (queries: Query[]): void => {
    setQueries([...queries]);
  };

  const handleUpdateMeta = (meta: Meta): void => {
    setMeta(meta);
  };

  return (
    <div className={cn('w-full min-h-screen bg-background pb-16', isLoading && 'animate-pulse')}>
      <header className="w-full flex flex-col">
        <Disclaimer />

        <Nav
          onReset={handleResetData}
          onUseDemoData={handleLoadDemoData}
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
                Enter search queries you want to rank for. Arrange them by descending priority.
                Popularity and competitiveness fields map to values in Appfigures.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <QueryForm
                onSubmit={handleAddQuery}
                submitLabel="Add"
              />

              {queries.length > 0 && (
                <Separator className="mt-4 mb-8" />
              )}

              {queries.length > 0 && (
                <QueryList
                  onClickDelete={handleClickDeleteQuery}
                  onClickEdit={handleClickEditQuery}
                  onReorder={handReorderQueries}
                  queries={queries}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>App Meta</CardTitle>

              <CardDescription>
                These fields align with your app's information in App Store Connect. Keyword
                strength is determined by position. Strength decreases top-to-bottom and
                left-to-right.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <MetaForm
                meta={meta}
                onUpdate={handleUpdateMeta}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-8 px-2 py-8 rounded-2xl bg-secondary">
          <MockCard>
            <CardHeader>
              <h2>Target Keywords</h2>

              <CardDescription>
                These are the keywords that should be included in your app meta. They are ordered
                to match the priority of your search queries.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {targetKeywords.length > 0 ? (
                <>
                  <TargetKeywords
                    targetKeywords={targetKeywords}
                    metaKeywords={metaKeywords}
                  />

                  <h3 className="mt-6">Keyword Strength</h3>

                  <TargetKeywordsChart
                    targetKeywords={targetKeywords}
                    metaKeywords={metaKeywords}
                  />
                </>
              ) : (
                <ActionBox>Add search queries to determine target keywords.</ActionBox>
              )}
            </CardContent>
          </MockCard>

          <MockCard>
            <CardHeader>
              <h2>Potential Issues</h2>

              <CardDescription>Is your app meta fully optimized?</CardDescription>
            </CardHeader>

            <CardContent>
              <Issues
                duplicateMetaKeywords={duplicateMetaKeywords}
                keywordFieldCapitalWords={keywordFieldCapitalWords}
                keywordFieldInvalidWords={keywordFieldInvalidWords}
                keywordFieldMultiWords={keywordFieldMultiWords}
                keywordFieldPluralWords={keywordFieldPluralWords}
                keywordFieldSpaceCount={keywordFieldSpaceCount}
                stopMetaKeywords={stopMetaKeywords}
                unhitTargetedKeywords={unhitTargetedKeywords}
              />
            </CardContent>
          </MockCard>

          <MockCard>
            <CardHeader>
              <h2>Alternate Search Queries</h2>

              <CardDescription>
                A slight variation of a search query may have a very different popularity-to-competitiveness
                ratio. Check variations in word order and pluralization. Here are some possibilities.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {alternateQueries.length > 0 ? (
                <AlternateQueries
                  queries={alternateQueries}
                />
              ) : (
                <ActionBox>
                  {
                    queries.length > 0
                      ? 'No good suggestions at the moment.'
                      : 'Add search queries to see alternatives.'
                  }
                </ActionBox>
              )}
            </CardContent>
          </MockCard>
        </div>
      </div>

      <QueryDialog
        query={activeQuery}
        onUpdate={handleUpdateQuery}
        onClose={() => setActiveQuery(null)}
      />
    </div >
  );
}

export default App;
