def job_sequencing_dp(jobs):

    max_deadline = max(job["deadline"] for job in jobs)

    # dp[i] = maximum profit using first i time slots
    dp = [0] * (max_deadline + 1)

    # Sort jobs by deadline
    jobs.sort(key=lambda job: job["deadline"])

    for job in jobs:

        deadline = job["deadline"]
        profit = job["profit"]

        for slot in range(deadline, 0, -1):

            dp[slot] = max(
                dp[slot],
                dp[slot - 1] + profit
            )

    return max(dp)