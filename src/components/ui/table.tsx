"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Table( { className, ...props }: React.ComponentProps<"table"> ) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-auto flex-1"
    >
      <table
        data-slot="table"
        className={cn( "w-full caption-bottom text-sm", className )}
        {...props}
      />
    </div>
  )
}

function TableWithFixedScroll( { className, ...props }: React.ComponentProps<"table"> ) {
  const tableRef = React.useRef<HTMLTableElement>( null )
  const containerRef = React.useRef<HTMLDivElement>( null )
  const scrollBarRef = React.useRef<HTMLDivElement>( null )

  React.useEffect( () => {
    const table = tableRef.current
    const container = containerRef.current
    const scrollBar = scrollBarRef.current

    if ( !table || !container || !scrollBar ) return

    const syncScroll = () => {
      if ( container.scrollLeft !== scrollBar.scrollLeft ) {
        container.scrollLeft = scrollBar.scrollLeft
      }
    }

    const syncScrollBack = () => {
      if ( scrollBar.scrollLeft !== container.scrollLeft ) {
        scrollBar.scrollLeft = container.scrollLeft
      }
    }

    scrollBar.addEventListener( 'scroll', syncScroll )
    container.addEventListener( 'scroll', syncScrollBack )

    // Configurar a largura do conteúdo da barra de scroll
    const updateScrollBarContent = () => {
      const scrollContent = scrollBar.querySelector( '[data-scroll-content]' ) as HTMLDivElement
      if ( scrollContent && table ) {
        scrollContent.style.width = `${ table.offsetWidth }px`
      }
    }

    updateScrollBarContent()

    // Observer para mudanças na largura da tabela
    const resizeObserver = new ResizeObserver( updateScrollBarContent )
    resizeObserver.observe( table )

    return () => {
      scrollBar.removeEventListener( 'scroll', syncScroll )
      container.removeEventListener( 'scroll', syncScrollBack )
      resizeObserver.disconnect()
    }
  }, [] )

  return (
    <div className="relative w-full">
      {/* Container da tabela com scroll vertical */}
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-auto max-h-[400px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <table
          ref={tableRef}
          data-slot="table"
          className={cn( "w-full caption-bottom text-sm", className )}
          {...props}
        />
      </div>

      {/* Barra de scroll horizontal fixa */}
      <div
        ref={scrollBarRef}
        className="overflow-x-auto overflow-y-hidden h-4 bg-muted/30 border-t"
      >
        <div data-scroll-content className="h-px"></div>
      </div>
    </div>
  )
}

function TableHeader( { className, ...props }: React.ComponentProps<"thead"> ) {
  return (
    <thead
      data-slot="table-header"
      className={cn( "[&_tr]:border-b sticky top-0 z-50", className )}
      {...props}
    />
  )
}

function TableBody( { className, ...props }: React.ComponentProps<"tbody"> ) {
  return (
    <tbody
      data-slot="table-body"
      className={cn( "[&_tr:last-child]:border-0", className )}
      {...props}
    />
  )
}

function TableFooter( { className, ...props }: React.ComponentProps<"tfoot"> ) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow( { className, ...props }: React.ComponentProps<"tr"> ) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead( { className, ...props }: React.ComponentProps<"th"> ) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] bg-background sticky top-0 z-40",
        className
      )}
      {...props}
    />
  )
}

function TableCell( { className, ...props }: React.ComponentProps<"td"> ) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption( {
  className,
  ...props
}: React.ComponentProps<"caption"> ) {
  return (
    <caption
      data-slot="table-caption"
      className={cn( "text-muted-foreground mt-4 text-sm", className )}
      {...props}
    />
  )
}

export {
  Table,
  TableWithFixedScroll,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}