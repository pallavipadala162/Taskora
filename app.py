from flask import Flask, render_template, request, jsonify

from algorithms.greedy import job_sequencing
from algorithms.max_heap import max_heap_jobs
from algorithms.dynamic_programming import job_sequencing_dp

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/schedule", methods=["POST"])
def schedule():

    jobs = request.json

    clean_jobs = [
        {
            "id": job["id"],
            "deadline": int(job["deadline"]),
            "profit": int(job["profit"])
        }
        for job in jobs
    ]

    # Greedy Algorithm
    greedy_slots, greedy_profit = job_sequencing(clean_jobs.copy())

    greedy_schedule = []

    for job in greedy_slots:
        if job is not None:
            greedy_schedule.append(job)

    # Max-Heap
    heap_result = max_heap_jobs(clean_jobs.copy())

    # Dynamic Programming
    dp_profit = job_sequencing_dp(clean_jobs.copy())

    return jsonify({
        "greedy_schedule": greedy_schedule,
        "greedy_profit": greedy_profit,
        "max_heap": heap_result,
        "dp_profit": dp_profit
    })


if __name__ == "__main__":
    app.run(debug=True)