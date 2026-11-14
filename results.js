const resultsBox = document.getElementById("results");
const totalText = document.getElementById("total");

if (SCRIPT_URL === "") {
  totalText.textContent = "Не указана ссылка SCRIPT_URL в файле data.js";
} else {
  fetch(SCRIPT_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (rows) {
      showResults(rows);
    })
    .catch(function () {
      totalText.textContent = "Не получилось загрузить данные";
    });
}

function showResults(rows) {
  resultsBox.innerHTML = "";
  let total = 0;

  for (let q = 0; q < questions.length; q++) {
    const options = questions[q].options;
    const counts = [];
    for (let i = 0; i < options.length; i++) {
      counts.push(0);
    }

    // считаем по тексту варианта, поэтому строки не по теме (например заголовки) не мешают
    let sum = 0;
    for (let r = 0; r < rows.length; r++) {
      const index = options.indexOf(rows[r][q]);
      if (index !== -1) {
        counts[index]++;
        sum++;
      }
    }

    // сколько всего прошло опрос берём по первому вопросу
    if (q === 0) {
      total = sum;
    }

    const block = document.createElement("section");
    block.className = "card result-block";

    const title = document.createElement("h2");
    title.textContent = (q + 1) + ". " + questions[q].text;
    block.appendChild(title);

    for (let i = 0; i < options.length; i++) {
      let percent = 0;
      if (sum > 0) {
        percent = Math.round(counts[i] / sum * 100);
      }

      const row = document.createElement("div");
      row.className = "bar-row";

      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = options[i];

      const track = document.createElement("div");
      track.className = "bar-track";
      const fill = document.createElement("div");
      fill.className = "bar-fill";
      fill.style.width = percent + "%";
      track.appendChild(fill);

      const value = document.createElement("div");
      value.className = "bar-value";
      value.textContent = counts[i] + " (" + percent + "%)";

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      block.appendChild(row);
    }

    resultsBox.appendChild(block);
  }

  totalText.textContent = "Всего прошли опрос: " + total;
}
