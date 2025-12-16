import { getAllArticles } from "../get-data"
import { BlogFilterWrapper } from "@/components/blog-filter-wrapper"

export async function BlogContent() {
    const { data: articles } = await getAllArticles()

    return <BlogFilterWrapper initialArticles={articles || []} />
}
