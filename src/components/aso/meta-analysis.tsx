import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { HighlightedText } from './highlighted-text';
import type { MetaAnalysis } from '@/types/aso';
import type { WordAnalysis } from '@/types/aso';

interface MetaAnalysisProps {
  metaName: string;
  metaSubtitle: string;
  metaKeywords: string;
  metaAnalysis: MetaAnalysis;
  analyzeText: (text: string) => WordAnalysis[];
  analyzeKeywords: (text: string) => WordAnalysis[];
}

export function MetaAnalysisComponent({
  metaName,
  metaSubtitle,
  metaKeywords,
  metaAnalysis,
  analyzeText,
  analyzeKeywords,
}: MetaAnalysisProps) {
  const hasAnalysis = metaName || metaSubtitle || metaKeywords ||
    metaAnalysis.stopWords.size > 0 || metaAnalysis.wastedWords.size > 0 ||
    metaAnalysis.duplicateKeywords.size > 0 || metaAnalysis.multiWordKeywords.size > 0 ||
    metaAnalysis.pluralKeywords.size > 0 || metaAnalysis.wastedCharCount > 0 ||
    /[A-Z]/.test(metaKeywords);

  if (!hasAnalysis) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2>Analysis</h2>

      <p>Use these signals to optimize your app's meta.</p>

      {/* Preview Section */}
      {(metaName || metaSubtitle || metaKeywords) && (
        <div className="mb-4 space-y-2 mt-4">
          <h4 className="text-sm font-medium mb-2">Preview:</h4>
          {metaName && (
            <div className="text-sm">
              <HighlightedText text={metaName} words={analyzeText(metaName)} />
            </div>
          )}
          {metaSubtitle && (
            <div className="text-sm">
              <HighlightedText text={metaSubtitle} words={analyzeText(metaSubtitle)} />
            </div>
          )}
          {metaKeywords && (
            <div className="text-sm">
              <HighlightedText text={metaKeywords} words={analyzeKeywords(metaKeywords)} />
            </div>
          )}
        </div>
      )}

      {/* Analysis Section */}
      {(metaAnalysis.stopWords.size > 0 || metaAnalysis.wastedWords.size > 0 ||
        metaAnalysis.duplicateKeywords.size > 0 || metaAnalysis.multiWordKeywords.size > 0 ||
        metaAnalysis.pluralKeywords.size > 0 || metaAnalysis.wastedCharCount > 0 ||
        /[A-Z]/.test(metaKeywords)) && (
          <div className="space-y-3 mt-4">
            {/[A-Z]/.test(metaKeywords) && (
              <div className="flex items-center gap-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800">Keywords field contains uppercase characters. Apple keywords should be lowercase.</p>
              </div>
            )}
            {metaAnalysis.pluralKeywords.size > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Plural Keywords (Apple treats plurals and non-plurals the same):</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(metaAnalysis.pluralKeywords).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {metaAnalysis.multiWordKeywords.size > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Multi-Word Keywords (should be single words):</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(metaAnalysis.multiWordKeywords).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-red-800 text-white">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {metaAnalysis.duplicateKeywords.size > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Duplicate Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(metaAnalysis.duplicateKeywords).map((word, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-200">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {metaAnalysis.stopWords.size > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Stop Words Found:</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(metaAnalysis.stopWords).map((word, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-200">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {metaAnalysis.wastedWords.size > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Wasted Words (not in needed keywords):</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(metaAnalysis.wastedWords).map((word, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-400">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {metaAnalysis.wastedCharCount > 0 && (
              <div>
                <p className="text-sm font-medium">
                  Wasted Character Count:
                  <span className="font-bold">{metaAnalysis.wastedCharCount}</span>
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
