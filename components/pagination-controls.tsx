import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type BuildHref = (page: number) => string;

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  buildHref: BuildHref;
}

export function PaginationControls({
  currentPage,
  totalPages,
  buildHref,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pagesToShow = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).filter((p) => {
    return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
  });

  return (
    <div className="flex justify-center items-center py-8">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={buildHref(currentPage - 1)} />
            </PaginationItem>
          )}

          {pagesToShow.map((p, index, arr) => {
            const showEllipsis = index > 0 && p - arr[index - 1] > 1;
            return (
              <div key={p} className="flex items-center">
                {showEllipsis && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink
                    href={buildHref(p)}
                    isActive={p === currentPage}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              </div>
            );
          })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={buildHref(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
