from rank_bm25 import BM25Okapi

def bm25_search(query, docs, k=3):

    tokenized_docs = [
        doc.page_content.split()
        for doc in docs
    ]

    bm25 = BM25Okapi(tokenized_docs)

    tokenized_query = query.split()

    scores = bm25.get_scores(tokenized_query)

    ranked = sorted(
        zip(scores, docs),
        key=lambda x:x[0],
        reverse=True
    )

    return [doc for score, doc in ranked[:k]]