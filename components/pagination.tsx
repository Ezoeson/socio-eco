import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PagePagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  
  const getVisiblePages = () => {
    const range = 2; 
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <Pagination>
      <PaginationContent>
      
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""}
          />
        </PaginationItem>

        {/* Première page */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Points de suspension si nécessaire */}
        {currentPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Pages visibles */}
        {getVisiblePages().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Points de suspension si nécessaire */}
        {currentPage < totalPages - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Dernière page */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Bouton Suivant */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
