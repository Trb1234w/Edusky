'use client'

import { Suspense } from 'react'
import SearchPageContent from './search-page-content'

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <SearchPageContent />
        </Suspense>
    )
}
