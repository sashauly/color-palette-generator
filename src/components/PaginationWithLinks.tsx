import { type ReactNode, useCallback } from "react";

import { useSearchParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
  onPageChange?: (page: number) => void;
}

export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam,
  onPageChange,
}: PaginationWithLinksProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const handlePageChange = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, newPage: number) => {
      e.preventDefault();

      if (onPageChange) {
        onPageChange(newPage);
      }
    },
    [onPageChange]
  );

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || "page";
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, String(newPage));
      return `${location.pathname}?${params.toString()}`;
    },
    [searchParams, location.pathname]
  );

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || "pageSize";
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, String(newPageSize));
      params.delete(pageSearchParam || "page");
      setSearchParams(params.toString());
    },
    [searchParams, location.pathname]
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={buildLink(i)}
              onClick={(e) => handlePageChange(e, page)}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={buildLink(1)}
            onClick={(e) => handlePageChange(e, 1)}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={buildLink(i)}
              onClick={(e) => handlePageChange(e, i)}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink
            href={buildLink(totalPageCount)}
            onClick={(e) => handlePageChange(e, totalPageCount)}
            isActive={page === totalPageCount}
          >
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <PaginationPrevious
              href={buildLink(Math.max(page - 1, 1))}
              onClick={(e) => handlePageChange(e, Math.max(page - 1, 1))}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              href={buildLink(Math.min(page + 1, totalPageCount))}
              onClick={(e) =>
                handlePageChange(e, Math.min(page + 1, totalPageCount))
              }
              aria-disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={
                page === totalPageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Rows per page</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
