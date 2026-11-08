import heapq


def max_heap_jobs(jobs):

    # Python provides a Min-Heap.
    # Negative profit gives Max-Heap behavior.
    heap = []

    for job in jobs:
        heapq.heappush(
            heap,
            (-job["profit"], job["deadline"], job["id"])
        )

    result = []

    while heap:
        profit, deadline, job_id = heapq.heappop(heap)

        result.append({
            "id": job_id,
            "deadline": deadline,
            "profit": -profit
        })

    return result