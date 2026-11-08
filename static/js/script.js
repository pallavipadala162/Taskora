function addJob() {

    let jobId = document.getElementById("jobId").value.trim();
    let deadline = document.getElementById("deadline").value;
    let profit = document.getElementById("profit").value;

    if (jobId === "" || deadline === "" || profit === "") {
        alert("Please enter Job ID, Deadline and Profit.");
        return;
    }

    if (Number(deadline) < 1 || Number(profit) < 0) {
        alert("Please enter valid deadline and profit.");
        return;
    }

    let tableBody = document.getElementById("jobTableBody");

    let row = tableBody.insertRow();

    row.insertCell(0).innerText = jobId.toUpperCase();
    row.insertCell(1).innerText = deadline;
    row.insertCell(2).innerText = profit;

    row.insertCell(3).innerHTML =
        '<span class="status">Ready</span>';

    document.getElementById("jobId").value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("profit").value = "";

    updateJobCount();
    updateEmptyState();
}


function updateJobCount() {

    let count =
        document.querySelectorAll("#jobTableBody tr").length;

    document.getElementById("jobCount").innerText =
        count + (count === 1 ? " Job" : " Jobs");
}


function updateEmptyState() {

    let rows =
        document.querySelectorAll("#jobTableBody tr").length;

    document.getElementById("emptyState").style.display =
        rows === 0 ? "block" : "none";
}


function loadSampleJobs() {

    document.getElementById("jobTableBody").innerHTML = "";

    let sampleJobs = [
        ["A", 2, 100],
        ["B", 1, 50],
        ["C", 2, 80],
        ["D", 3, 70]
    ];

    sampleJobs.forEach(function(job) {

        let row =
            document.getElementById("jobTableBody").insertRow();

        row.insertCell(0).innerText = job[0];
        row.insertCell(1).innerText = job[1];
        row.insertCell(2).innerText = job[2];

        row.insertCell(3).innerHTML =
            '<span class="status">Ready</span>';
    });

    updateJobCount();
    updateEmptyState();
}


async function runScheduler() {

    let rows =
        document.querySelectorAll("#jobTableBody tr");

    let jobs = [];

    rows.forEach(function(row) {

        let cells = row.querySelectorAll("td");

        jobs.push({
            id: cells[0].innerText,
            deadline: cells[1].innerText,
            profit: cells[2].innerText
        });

    });

    if (jobs.length === 0) {

        alert("Please add at least one job.");

        return;
    }

    try {

        let response = await fetch("/schedule", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(jobs)

        });

        let result = await response.json();


        /* GREEDY */

        document.getElementById("greedyProfit").innerText =
            result.greedy_profit;

        document.getElementById("greedyResult").innerHTML =
            result.greedy_schedule.map(function(job) {

                return "<b>" + job.id + "</b>";

            }).join(" → ");


        /* MAX HEAP */

        document.getElementById("heapResult").innerHTML = "";

        result.max_heap.forEach(function(job) {

            let item =
                document.createElement("div");

            item.className = "heap-job";

            item.innerHTML =
                "<span>" +
                job.id +
                " · Deadline " +
                job.deadline +
                "</span>" +

                "<span>₹" +
                job.profit +
                "</span>";

            document
                .getElementById("heapResult")
                .appendChild(item);

        });


        /* DP */

        document.getElementById("dpProfit").innerText =
            result.dp_profit;


        /* FINAL SCHEDULE */

        let schedule =
            document.getElementById("finalSchedule");

        schedule.innerHTML = "";

        result.greedy_schedule.forEach(function(job, index) {

            let slot =
                document.createElement("div");

            slot.className = "slot";

            slot.innerHTML =
                "<small>TIME SLOT " +
                (index + 1) +
                "</small>" +

                "<strong>" +
                job.id +
                "</strong>" +

                "<p>Profit ₹" +
                job.profit +
                "</p>";

            schedule.appendChild(slot);

        });

    }

    catch (error) {

        alert(
            "Unable to connect to Taskora server."
        );

        console.error(error);

    }
}


updateJobCount();
updateEmptyState();