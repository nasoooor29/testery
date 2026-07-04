import { NeededAttrs, Node } from "@/schemas/bh";
import { getMarkdown } from "@/utils/piscine";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@testery/ui/components/badge";
import { Separator } from "@testery/ui/components/separator";
import {
  AlertCircle,
  ClipboardCopy,
  FileText,
  Loader2,
  Star,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

function Markdown({ data }: { data: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (txt: any) => {
    try {
      await navigator.clipboard.writeText(String(txt).replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="mt-6 mb-4 border-b pb-2 text-3xl font-bold"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="mt-6 mb-3 text-2xl font-bold" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="mt-5 mb-2 text-xl font-bold" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="my-4 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="my-4 list-disc space-y-2 pl-6" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="my-4 list-decimal space-y-2 pl-6" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-primary transition-colors hover:underline"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="my-4 border-l-4 border-primary/30 pl-4 text-muted-foreground italic"
            {...props}
          />
        ),
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <div className="my-2 overflow-hidden">
              <div className="flex items-center justify-between bg-muted/30 px-4 py-2 font-mono text-xs">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{match[1]}</span>
                </div>
                <button
                  onClick={() => handleCopy(children)}
                  className="flex items-center gap-1 px-2 py-1 text-muted-foreground hover:bg-muted"
                >
                  <ClipboardCopy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: "0 0 0.2rem 0.2rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className="bg-muted px-1.5 py-0.5 font-mono text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {data}
    </ReactMarkdown>
  );
}

interface MdProps {
  exercies: Node;
}

export function Md({ exercies }: MdProps) {
  const attrs = NeededAttrs.parse(exercies?.attrs);
  const md = useQuery({
    queryKey: ["exercies", exercies.id],
    queryFn: () => getMarkdown(attrs.subject),
  });
  return (
    <>
      <div className="p-6 md:p-8">
        {!md.data && !md.error && (
          // You might not see this during initial load on the server
          // but it's good for potential client-side transitions
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>Loading content...</p>
          </div>
        )}

        {md.error && (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <AlertCircle className="mb-4 h-8 w-8" />
            <p className="font-medium">Failed to load markdown.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {md.error?.message}
            </p>
          </div>
        )}
        {md.data && (
          <div className="prose prose-invert prose-headings:scroll-mt-20 max-w-none">
            <div className="border bg-card p-6 text-card-foreground shadow-sm">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{attrs.category}</Badge>
                  <Badge variant="outline">level: {attrs.level}</Badge>
                  <Badge variant="outline">{attrs.baseXp}xp</Badge>
                  <Badge variant="outline">
                    Difficulty:
                    {Array.from({ length: attrs.difficulty }, (_, index) => (
                      <Star key={index} className="h-4 w-4 text-yellow-500" />
                    ))}
                  </Badge>
                  <Badge variant="outline">{attrs.language}</Badge>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  {attrs.expectedFiles?.map((file) => (
                    <Badge variant="secondary">{file}</Badge>
                  ))}
                </div>
              </div>
            </div>
            {/* Separator for clear visual break */}
            <Separator className="my-8" />

            {/* Markdown content with slightly more padding */}
            <div className="p-4">
              <Markdown data={md.data} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Markdown;
