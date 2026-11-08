def job_sequencing(jobs):

    # Sort jobs by profit in descending order
    jobs.sort(key=lambda job: job["profit"], reverse=True)

    max_deadline = max(job["deadline"] for job in jobs)

    slots = [None] * max_deadline
    total_profit = 0

    for job in jobs:

        # Place the job in the latest available slot
        for slot in range(job["deadline"] - 1, -1, -1):

            if slots[slot] is None:
                slots[slot] = job
                total_profit += job["profit"]
                break

    return slots, total_profit