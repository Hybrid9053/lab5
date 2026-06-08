
//Q1 - Currency Converter  (Frankfurter API)
// Fetch & display on button click 
document.getElementById('convertBtn').addEventListener('click', function () {

  //  TO Read the user's inputs
  var amount = parseFloat(document.getElementById('amount').value);
  var base   = document.getElementById('baseCurrency').value.trim().toUpperCase();
  var target = document.getElementById('targetCurrency').value.trim().toUpperCase();

  // Clear previous messages
  document.getElementById('result').textContent   = '';
  document.getElementById('rateDate').textContent = '';
  document.getElementById('errorMsg').textContent = '';

  // Basic input check
  if (!amount || !base || !target) {
    document.getElementById('errorMsg').textContent = 'Please fill in all fields.';
    return;
  }

  var url = 'https://api.frankfurter.dev/v1/latest?base=' + base + '&symbols=' + target;

  fetch(url)
    .then(function (response) {
      return response.json();  // Turn raw response body into a JavaScript object
    })
    .then(function (data) {

      console.log(data);

      
      var rate = data.rates[target];

      if (rate === undefined) {
        // "Invalid currency" shown when rate is not found
        document.getElementById('errorMsg').textContent =
          'Invalid currency: "' + target + '". Please enter a valid 3-letter code.';
        return;
      }

      // Calculate the converted amount
      var converted = (amount * rate).toFixed(2);

      // Show the result
      document.getElementById('result').textContent =
        amount + ' ' + base + ' = ' + converted + ' ' + target;

      
      // data.date holds the date these rates were published
      document.getElementById('rateDate').textContent = 'Rates as of ' + data.date;
    })
    .catch(function (error) {
      // .catch only runs when there is a network failure (no internet, server down, etc.)
      document.getElementById('errorMsg').textContent =
        'Network error. Please check your connection. (' + error.message + ')';
    });
});


// --- TASK 5: Rates table ---
document.getElementById('tableBtn').addEventListener('click', function () {

  var base = document.getElementById('tableBase').value.trim().toUpperCase();
  var container = document.getElementById('tableContainer');
  container.innerHTML = '<p>Loading...</p>';

  var url = 'https://api.frankfurter.dev/v1/latest?base=' + base;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // Check that we got valid rates back
      if (!data.rates) {
        container.innerHTML = '<p class="error">Could not load rates for "' + base + '".</p>';
        return;
      }

      // Build an HTML table using Object.entries to loop over each [code, rate] pair
      var html = '<table>';
      html += '<tr><th>Currency Code</th><th>Rate (1 ' + base + ')</th></tr>';

      Object.entries(data.rates).forEach(function (entry) {
        var code = entry[0];  // e.g. "EUR"
        var rate = entry[1];  // e.g. 0.92
        html += '<tr><td>' + code + '</td><td>' + rate + '</td></tr>';
      });

      html += '</table>';
      html += '<p style="font-size:0.85em;color:#666;">Rates as of ' + data.date + '</p>';

      container.innerHTML = html;
    })
    .catch(function (error) {
      container.innerHTML = '<p class="error">Network error: ' + error.message + '</p>';
    });
});
