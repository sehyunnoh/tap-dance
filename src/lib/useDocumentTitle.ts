import { useEffect } from 'react'

/** Keeps the tab title in step with client-side navigation; the first title comes prerendered. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title
  }, [title])
}
